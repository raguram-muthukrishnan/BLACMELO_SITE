import {useState} from 'react';
import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type Fetcher,
} from 'react-router';
import type {Route} from './+types/account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';

// Account addresses inherits styles from parent account route
export const links = () => [];

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Addresses'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  await customerAccount.handleAuthStatus();
  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // Normal flow
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const {data, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const {data, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {data, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId};
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error},
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;

  return (
    <div className="addresses-container">
      <div className="account-section-header">
        <h2 className="account-section-title">Addresses</h2>
        <p className="account-section-subtitle">
          Manage your shipping and billing addresses
        </p>
      </div>

      <div className="address-form">
        <legend>Add New Address</legend>
        <NewAddressForm />
      </div>

      {addresses.nodes.length > 0 && (
        <>
          <div className="account-section-header" style={{marginTop: '40px'}}>
            <h3 className="account-section-title" style={{fontSize: '14px', letterSpacing: '0.05em'}}>
              Saved Addresses
            </h3>
          </div>
          <div className="addresses-grid">
            <ExistingAddresses
              addresses={addresses}
              defaultAddress={defaultAddress}
            />
          </div>
        </>
      )}

      {addresses.nodes.length === 0 && (
        <div className="empty-state">
          <svg
            className="empty-state-icon"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 10l20 13.33v26.67L40 70 20 50V23.33L40 10z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path d="M40 40v20" stroke="currentColor" strokeWidth="2" />
          </svg>
          <h3 className="empty-state-title">No saved addresses</h3>
          <p className="empty-state-text">
            Add your first address using the form above.
          </p>
        </div>
      )}
    </div>
  );
}

function NewAddressForm() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({stateForMethod}) => (
        <button
          disabled={stateForMethod('POST') !== 'idle'}
          formMethod="POST"
          type="submit"
          className="form-submit"
        >
          {stateForMethod('POST') !== 'idle' ? 'Creating' : 'Create'}
        </button>
      )}
    </AddressForm>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  return (
    <>
      {addresses.nodes.map((address) => {
        const isEditing = editingAddressId === address.id;
        const isDefault = defaultAddress?.id === address.id;

        if (isEditing) {
          return (
            <div key={address.id} className="address-card-edit-wrapper">
              <AddressForm
                addressId={address.id}
                address={address}
                defaultAddress={defaultAddress}
              >
                {({stateForMethod}) => (
                  <>
                    <button
                      disabled={stateForMethod('PUT') !== 'idle'}
                      formMethod="PUT"
                      type="submit"
                      className="address-btn address-btn-edit"
                    >
                      {stateForMethod('PUT') !== 'idle' ? 'Saving' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingAddressId(null)}
                      className="address-btn address-btn-delete"
                      style={{ borderColor: '#888888', color: '#888888' }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </AddressForm>
            </div>
          );
        }

        return (
          <div key={address.id} className="address-card-static">
            <div className="address-card-header">
              <span className="address-card-title">SHIPPING ADDRESS</span>
              {isDefault && <span className="address-default-badge">Default</span>}
            </div>
            
            <div className="address-content">
              <p className="address-name" style={{ fontWeight: 500, margin: '0 0 4px 0' }}>
                {address.firstName} {address.lastName}
              </p>
              {address.company && <p className="address-company" style={{ margin: '0 0 4px 0', opacity: 0.8 }}>{address.company}</p>}
              <p className="address-line" style={{ margin: '0 0 4px 0' }}>{address.address1}</p>
              {address.address2 && <p className="address-line2" style={{ margin: '0 0 4px 0' }}>{address.address2}</p>}
              <p className="address-city-state" style={{ margin: '0 0 4px 0' }}>
                {address.city}, {address.zoneCode} {address.zip}
              </p>
              <p className="address-country" style={{ margin: '0 0 12px 0' }}>{address.territoryCode}</p>
              {address.phoneNumber && (
                <p className="address-phone" style={{ fontSize: '10px', color: '#888888', margin: 0 }}>
                  Phone: {address.phoneNumber}
                </p>
              )}
            </div>

            <div className="address-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setEditingAddressId(address.id)}
                className="address-btn address-btn-edit"
              >
                Edit
              </button>
              <Form method="DELETE" action="/account/addresses" style={{ flex: 1, display: 'flex' }}>
                <input type="hidden" name="addressId" value={address.id} />
                <button
                  type="submit"
                  className="address-btn address-btn-delete"
                >
                  Delete
                </button>
              </Form>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const {state, formMethod} = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;

  return (
    <Form id={addressId} className="addresses-form-layout">
      <fieldset>
        <input type="hidden" name="addressId" defaultValue={addressId} />
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">First name*</label>
            <input
              aria-label="First name"
              autoComplete="given-name"
              defaultValue={address?.firstName ?? ''}
              id="firstName"
              name="firstName"
              placeholder="First name"
              required
              type="text"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">Last name*</label>
            <input
              aria-label="Last name"
              autoComplete="family-name"
              defaultValue={address?.lastName ?? ''}
              id="lastName"
              name="lastName"
              placeholder="Last name"
              required
              type="text"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company" className="form-label">Company</label>
            <input
              aria-label="Company"
              autoComplete="organization"
              defaultValue={address?.company ?? ''}
              id="company"
              name="company"
              placeholder="Company"
              type="text"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Phone</label>
            <input
              aria-label="Phone Number"
              autoComplete="tel"
              defaultValue={address?.phoneNumber ?? ''}
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+16135551111"
              pattern="^\+?[1-9]\d{3,14}$"
              type="tel"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address1" className="form-label">Address line 1*</label>
            <input
              aria-label="Address line 1"
              autoComplete="address-line1"
              defaultValue={address?.address1 ?? ''}
              id="address1"
              name="address1"
              placeholder="Address line 1*"
              required
              type="text"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="address2" className="form-label">Address line 2</label>
            <input
              aria-label="Address line 2"
              autoComplete="address-line2"
              defaultValue={address?.address2 ?? ''}
              id="address2"
              name="address2"
              placeholder="Address line 2"
              type="text"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city" className="form-label">City*</label>
            <input
              aria-label="City"
              autoComplete="address-level2"
              defaultValue={address?.city ?? ''}
              id="city"
              name="city"
              placeholder="City"
              required
              type="text"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="zoneCode" className="form-label">State / Province*</label>
            <input
              aria-label="State/Province"
              autoComplete="address-level1"
              defaultValue={address?.zoneCode ?? ''}
              id="zoneCode"
              name="zoneCode"
              placeholder="State / Province"
              required
              type="text"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="zip" className="form-label">Zip / Postal Code*</label>
            <input
              aria-label="Zip"
              autoComplete="postal-code"
              defaultValue={address?.zip ?? ''}
              id="zip"
              name="zip"
              placeholder="Zip / Postal Code"
              required
              type="text"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="territoryCode" className="form-label">Country Code*</label>
            <input
              aria-label="territoryCode"
              autoComplete="country"
              defaultValue={address?.territoryCode ?? ''}
              id="territoryCode"
              name="territoryCode"
              placeholder="Country"
              required
              type="text"
              maxLength={2}
              className="form-input"
            />
          </div>
        </div>

        <div className="checkbox-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
          <input
            defaultChecked={isDefaultAddress}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
            style={{ cursor: 'pointer', accentColor: '#000000' }}
          />
          <label htmlFor="defaultAddress" className="form-label" style={{ cursor: 'pointer', color: '#555555' }}>
            Set as default address
          </label>
        </div>

        {error && (
          <div className="form-error" style={{ marginTop: '12px' }}>
            <mark>{error}</mark>
          </div>
        )}

        <div className="actions-wrapper" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          {children({
            stateForMethod: (method) => (formMethod === method ? state : 'idle'),
          })}
        </div>
      </fieldset>
    </Form>
  );
}
