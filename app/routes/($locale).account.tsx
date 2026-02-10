import {
  data as remixData,
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome back, ${customer.firstName}`
      : `Welcome to your account`
    : 'Account Details';

  return (
    <div className="account-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-text">
            <h1 className="dashboard-heading">{heading}</h1>
            <p className="dashboard-subheading">
              Manage your orders, profile, and addresses
            </p>
          </div>
          <div className="dashboard-header-actions">
            <Link to="/collections/all-products" className="dashboard-btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <div className="dashboard-nav-section">
              <h3 className="dashboard-nav-title">Account</h3>
              <AccountMenu />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <Outlet context={{customer}} />
        </main>
      </div>
    </div>
  );
}

function AccountMenu() {
  return (
    <div className="dashboard-nav-links">
      <NavLink
        to="/account/orders"
        className={({isActive}) =>
          `dashboard-nav-link ${isActive ? 'active' : ''}`
        }
      >
        <svg
          className="dashboard-nav-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="3"
            width="14"
            height="14"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M7 7h6M7 10h6M7 13h4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <div className="dashboard-nav-link-content">
          <span className="dashboard-nav-link-title">Orders</span>
          <span className="dashboard-nav-link-desc">View order history</span>
        </div>
      </NavLink>

      <NavLink
        to="/account/profile"
        className={({isActive}) =>
          `dashboard-nav-link ${isActive ? 'active' : ''}`
        }
      >
        <svg
          className="dashboard-nav-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="7"
            r="3"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <div className="dashboard-nav-link-content">
          <span className="dashboard-nav-link-title">Profile</span>
          <span className="dashboard-nav-link-desc">Personal information</span>
        </div>
      </NavLink>

      <NavLink
        to="/account/addresses"
        className={({isActive}) =>
          `dashboard-nav-link ${isActive ? 'active' : ''}`
        }
      >
        <svg
          className="dashboard-nav-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 2l6 4v8l-6 4-6-4V6l6-4z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M10 10v6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="dashboard-nav-link-content">
          <span className="dashboard-nav-link-title">Addresses</span>
          <span className="dashboard-nav-link-desc">Shipping addresses</span>
        </div>
      </NavLink>

      <div className="dashboard-nav-divider"></div>

      <Logout />
    </div>
  );
}

function Logout() {
  return (
    <Form className="dashboard-logout-form" method="POST" action="/account/logout">
      <button type="submit" className="dashboard-nav-link logout-link">
        <svg
          className="dashboard-nav-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 3h3v14h-3M7 10h9M13 7l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M3 3v14" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="dashboard-nav-link-content">
          <span className="dashboard-nav-link-title">Sign Out</span>
          <span className="dashboard-nav-link-desc">Logout from account</span>
        </div>
      </button>
    </Form>
  );
}
