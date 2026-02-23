import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type {Route} from './+types/account.orders._index';
import {useRef} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2 className="orders-title">Order History</h2>
        <p className="orders-description">View and track your orders</p>
      </div>
      
      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="orders-table" aria-live="polite">
      {orders?.nodes.length ? (
        <div className="orders-list">
          <PaginatedResourceSection connection={orders}>
            {({node: order}) => <OrderItem key={order.id} order={order} />}
          </PaginatedResourceSection>
        </div>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  return (
    <div className="empty-orders">
      <div className="empty-orders-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="16" width="40" height="40" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 24h40M20 16v-4M44 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      {hasFilters ? (
        <>
          <h3 className="empty-orders-title">No orders found</h3>
          <p className="empty-orders-text">No orders match your search criteria</p>
          <Link to="/account/orders" className="empty-orders-link">
            Clear filters
          </Link>
        </>
      ) : (
        <>
          <h3 className="empty-orders-title">No orders yet</h3>
          <p className="empty-orders-text">You haven't placed any orders yet. Start shopping to see your orders here.</p>
          <Link to="/collections" className="empty-orders-button">
            Continue Shopping
          </Link>
        </>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="order-search-form"
      aria-label="Search orders"
    >
      <div className="order-search-container">
        <div className="order-search-inputs">
          <div className="order-search-field">
            <label htmlFor="order-number" className="order-search-label">
              Order #
            </label>
            <input
              id="order-number"
              type="search"
              name={ORDER_FILTER_FIELDS.NAME}
              placeholder="Search by order number"
              aria-label="Order number"
              defaultValue={currentFilters.name || ''}
              className="order-search-input"
            />
          </div>
          <div className="order-search-field">
            <label htmlFor="confirmation-number" className="order-search-label">
              Confirmation #
            </label>
            <input
              id="confirmation-number"
              type="search"
              name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
              placeholder="Search by confirmation number"
              aria-label="Confirmation number"
              defaultValue={currentFilters.confirmationNumber || ''}
              className="order-search-input"
            />
          </div>
        </div>

        <div className="order-search-actions">
          <button type="submit" disabled={isSearching} className="order-search-button">
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          {hasFilters && (
            <button
              type="button"
              disabled={isSearching}
              onClick={() => {
                setSearchParams(new URLSearchParams());
                formRef.current?.reset();
              }}
              className="order-search-clear"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  const orderDate = new Date(order.processedAt);
  
  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-card-info">
          <Link to={`/account/orders/${btoa(order.id)}`} className="order-number">
            Order #{order.number}
          </Link>
          <span className="order-date">
            {orderDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
        <div className="order-card-status">
          <span className={`order-status-badge ${order.financialStatus?.toLowerCase()}`}>
            {order.financialStatus}
          </span>
          {fulfillmentStatus && (
            <span className={`order-status-badge ${fulfillmentStatus.toLowerCase()}`}>
              {fulfillmentStatus}
            </span>
          )}
        </div>
      </div>
      
      <div className="order-card-body">
        {order.confirmationNumber && (
          <div className="order-detail">
            <span className="order-detail-label">Confirmation:</span>
            <span className="order-detail-value">{order.confirmationNumber}</span>
          </div>
        )}
        <div className="order-detail">
          <span className="order-detail-label">Total:</span>
          <span className="order-detail-value order-total">
            <Money data={order.totalPrice} />
          </span>
        </div>
      </div>
      
      <div className="order-card-footer">
        <Link to={`/account/orders/${btoa(order.id)}`} className="order-view-link">
          View Order Details
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
