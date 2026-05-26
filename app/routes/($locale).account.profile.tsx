import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type {Route} from './+types/account.profile';

// Account profile inherits styles from parent account route
export const links = () => [];

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {session, customerAccount} = context;
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

  if (!isDebug) {
    await customerAccount.handleAuthStatus();
  }

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount, session} = context;
  const isDebug = session.get('debug') === 'true';

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  if (isDebug) {
    const firstName = form.get('firstName')?.toString().trim();
    const lastName = form.get('lastName')?.toString().trim();

    if (!firstName || !lastName) {
      return data(
        {error: 'First name and last name are required', customer: null},
        {status: 400}
      );
    }

    const updatedProfile = { firstName, lastName };
    session.set('mock_profile', JSON.stringify(updatedProfile));

    // Form updated customer profile data to return to client
    const customer = {
      id: 'c_mock_123',
      firstName,
      lastName,
      defaultAddress: null,
      addresses: { nodes: [] }
    };

    return {
      error: null,
      customer: customer as any,
    };
  }

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="profile-container">
      <div className="account-section-header">
        <h2 className="account-section-title">Profile</h2>
        <p className="account-section-subtitle">
          Manage your personal information
        </p>
      </div>

      <Form method="PUT" className="profile-form">
        <legend>Personal Information</legend>
        <fieldset>
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Enter your first name"
              aria-label="First name"
              defaultValue={customer.firstName ?? ''}
              minLength={2}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Enter your last name"
              aria-label="Last name"
              defaultValue={customer.lastName ?? ''}
              minLength={2}
              required
              className="form-input"
            />
          </div>
        </fieldset>

        {action?.error && (
          <div className="form-error">
            <mark>{action.error}</mark>
          </div>
        )}

        <button type="submit" disabled={state !== 'idle'} className="form-submit">
          {state !== 'idle' ? 'Updating...' : 'Update Profile'}
        </button>
      </Form>
    </div>
  );
}
