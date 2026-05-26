import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/account.orders.$id';
import {Money, Image} from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({params, request, context}: Route.LoaderArgs) {
  const {customerAccount, session} = context;
  const url = new URL(request.url);
  const debugParam = url.searchParams.get('debug');

  let isDebug = false;
  if (debugParam === 'true') {
    isDebug = true;
    session.set('debug', 'true');
  } else if (debugParam === 'false') {
    isDebug = false;
    session.unset('debug');
  } else {
    isDebug = session.get('debug') === 'true';
  }

  if (!params.id) {
    return redirect('/account/orders');
  }

  if (isDebug) {
    const id = atob(params.id);
    let orderNum = 1084;
    let totalAmt = '280.00';
    let confirmationNum = 'CONF-9821-X';
    let dateStr = '2026-05-20T10:30:00Z';
    
    if (id === 'ord_mock_2') {
      orderNum = 1052;
      totalAmt = '450.00';
      confirmationNum = 'CONF-7712-Y';
      dateStr = '2026-04-15T14:45:00Z';
    } else if (id === 'ord_mock_3') {
      orderNum = 1011;
      totalAmt = '120.00';
      confirmationNum = 'CONF-1104-Z';
      dateStr = '2026-02-10T09:15:00Z';
    }

    const mockOrder = {
      id: id,
      name: `#${orderNum}`,
      number: orderNum,
      confirmationNumber: confirmationNum,
      processedAt: dateStr,
      statusPageUrl: 'https://blacmelo.com/track',
      financialStatus: 'PAID',
      subtotal: { amount: totalAmt, currencyCode: 'AED' },
      totalTax: { amount: '0.00', currencyCode: 'AED' },
      totalPrice: { amount: totalAmt, currencyCode: 'AED' },
      discountApplications: {
        nodes: []
      },
      fulfillments: {
        nodes: [
          { status: 'SUCCESS' }
        ]
      },
      shippingAddress: {
        name: 'Alex Melo',
        formatted: ['123 Luxury Way', 'Penthouse A', 'New York, NY 10001', 'United States'],
        formattedArea: 'New York, NY 10001, US'
      },
      lineItems: {
        nodes: [
          {
            id: 'line_mock_1',
            title: 'BLACMELO ORIGINAL TEE',
            variantTitle: 'Jet Black / L',
            quantity: 1,
            price: { amount: totalAmt, currencyCode: 'AED' },
            totalDiscount: { amount: '0.00', currencyCode: 'AED' },
            image: {
              url: 'https://cdn.shopify.com/s/files/1/0088/3130/files/Mock_Black_Tee.jpg?v=1',
              altText: 'BLACMELO Original Tee',
              width: 300,
              height: 400
            }
          }
        ]
      }
    };

    return {
      order: mockOrder as any,
      lineItems: mockOrder.lineItems.nodes as any[],
      discountValue: null,
      discountPercentage: null,
      fulfillmentStatus: 'SUCCESS',
    };
  }

  // Normal flow
  const orderId = atob(params.id);
  const {data, errors}: {data: OrderQuery; errors?: Array<{message: string}>} =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;

  // Extract line items directly from nodes array
  const lineItems = order.lineItems.nodes;

  // Extract discount applications directly from nodes array
  const discountApplications = order.discountApplications.nodes;

  // Get fulfillment status from first fulfillment node
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

  // Get first discount value with proper type checking
  const firstDiscount = discountApplications[0]?.value;

  // Type guard for MoneyV2 discount
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<
          typeof firstDiscount,
          {__typename: 'MoneyV2'}
        >)
      : null;

  // Type guard for percentage discount
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (
          firstDiscount as Extract<
            typeof firstDiscount,
            {__typename: 'PricingPercentageValue'}
          >
        ).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();
  return (
    <div className="account-order">
      <h2>Order {order.name}</h2>
      <p>Placed on {new Date(order.processedAt!).toDateString()}</p>
      {order.confirmationNumber && (
        <p>Confirmation: {order.confirmationNumber}</p>
      )}
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((lineItem, lineItemIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
            ))}
          </tbody>
          <tfoot>
            {((discountValue && discountValue.amount) ||
              discountPercentage) && (
              <tr>
                <th scope="row" colSpan={3}>
                  <p>Discounts</p>
                </th>
                <th scope="row">
                  <p>Discounts</p>
                </th>
                <td>
                  {discountPercentage ? (
                    <span>-{discountPercentage}% OFF</span>
                  ) : (
                    discountValue && <Money data={discountValue!} />
                  )}
                </td>
              </tr>
            )}
            <tr>
              <th scope="row" colSpan={3}>
                <p>Subtotal</p>
              </th>
              <th scope="row">
                <p>Subtotal</p>
              </th>
              <td>
                <Money data={order.subtotal!} />
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Tax
              </th>
              <th scope="row">
                <p>Tax</p>
              </th>
              <td>
                <Money data={order.totalTax!} />
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Total
              </th>
              <th scope="row">
                <p>Total</p>
              </th>
              <td>
                <Money data={order.totalPrice!} />
              </td>
            </tr>
          </tfoot>
        </table>
        <div>
          <h3>Shipping Address</h3>
          {order?.shippingAddress ? (
            <address>
              <p>{order.shippingAddress.name}</p>
              {order.shippingAddress.formatted ? (
                <p>{order.shippingAddress.formatted}</p>
              ) : (
                ''
              )}
              {order.shippingAddress.formattedArea ? (
                <p>{order.shippingAddress.formattedArea}</p>
              ) : (
                ''
              )}
            </address>
          ) : (
            <p>No shipping address defined</p>
          )}
          <h3>Status</h3>
          <div>
            <p>{fulfillmentStatus}</p>
          </div>
        </div>
      </div>
      <br />
      <p>
        <a target="_blank" href={order.statusPageUrl} rel="noreferrer">
          View Order Status →
        </a>
      </p>
    </div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <tr key={lineItem.id}>
      <td>
        <div>
          {lineItem?.image && (
            <div>
              <Image data={lineItem.image} width={96} height={96} />
            </div>
          )}
          <div>
            <p>{lineItem.title}</p>
            <small>{lineItem.variantTitle}</small>
          </div>
        </div>
      </td>
      <td>
        <Money data={lineItem.price!} />
      </td>
      <td>{lineItem.quantity}</td>
      <td>
        <Money data={lineItem.totalDiscount!} />
      </td>
    </tr>
  );
}
