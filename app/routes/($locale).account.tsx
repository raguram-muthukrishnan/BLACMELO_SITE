import {
  data as remixData,
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type { Route } from './+types/($locale).account';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import accountStyles from '~/styles/pages/account.css?url';

export const links = () => [
  { rel: 'stylesheet', href: accountStyles },
];

export function shouldRevalidate() {
  return true;
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { customerAccount, session } = context;
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

  let customer: any = null;

  if (isDebug) {
    // 1. Return high-fidelity mock customer data for local previewing
    customer = {
      id: 'c_mock_123',
      firstName: 'Alex',
      lastName: 'Melo',
      defaultAddress: {
        id: 'addr_mock_default',
        formatted: ['123 Luxury Way', 'Penthouse A', 'New York, NY 10001', 'United States'],
        firstName: 'Alex',
        lastName: 'Melo',
        company: 'Melo Studios',
        address1: '123 Luxury Way',
        address2: 'Penthouse A',
        territoryCode: 'US',
        zoneCode: 'NY',
        city: 'New York',
        zip: '10001',
        phoneNumber: '+12125550199'
      },
      addresses: {
        nodes: [
          {
            id: 'addr_mock_default',
            formatted: ['123 Luxury Way', 'Penthouse A', 'New York, NY 10001', 'United States'],
            firstName: 'Alex',
            lastName: 'Melo',
            company: 'Melo Studios',
            address1: '123 Luxury Way',
            address2: 'Penthouse A',
            territoryCode: 'US',
            zoneCode: 'NY',
            city: 'New York',
            zip: '10001',
            phoneNumber: '+12125550199'
          },
          {
            id: 'addr_mock_2',
            formatted: ['456 Fashion Blvd', 'Suite 404', 'Los Angeles, CA 90015', 'United States'],
            firstName: 'Alex',
            lastName: 'Melo',
            company: '',
            address1: '456 Fashion Blvd',
            address2: 'Suite 404',
            territoryCode: 'US',
            zoneCode: 'CA',
            city: 'Los Angeles',
            zip: '90015',
            phoneNumber: '+13105550188'
          }
        ]
      }
    };

    // 2. Parse overrides from session cookie
    const sessionProfileStr = session.get('mock_profile');
    if (sessionProfileStr) {
      try {
        const overrides = JSON.parse(sessionProfileStr) as { firstName?: string; lastName?: string };
        customer.firstName = overrides.firstName || customer.firstName;
        customer.lastName = overrides.lastName || customer.lastName;
      } catch (e) {}
    }

    const sessionAddressesStr = session.get('mock_addresses');
    if (sessionAddressesStr) {
      try {
        const mockAddresses = JSON.parse(sessionAddressesStr) as any[];
        customer.addresses.nodes = mockAddresses;
        
        const defaultAddrId = session.get('mock_default_address_id');
        const foundDefault = mockAddresses.find((a: any) => a.id === defaultAddrId);
        customer.defaultAddress = foundDefault || mockAddresses[0] || null;
      } catch (e) {}
    } else {
      // Save initial mock state to keep it reactive
      session.set('mock_addresses', JSON.stringify(customer.addresses.nodes));
      session.set('mock_default_address_id', 'addr_mock_default');
    }
  } else {
    // 3. Normal Shopify Customer Flow
    // Handle guest redirect gracefully
    await customerAccount.handleAuthStatus();

    const { data, errors } = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
      variables: {
        language: customerAccount.i18n.language,
      },
    });

    if (errors?.length || !data?.customer) {
      throw new Error('Customer not found');
    }
    customer = data.customer;
  }

  return remixData(
    { customer, isDebug },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const { customer, isDebug } = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `WELCOME BACK, ${customer.firstName.toUpperCase()}`
      : `WELCOME TO YOUR ACCOUNT`
    : 'ACCOUNT DETAILS';

  return (
    <div className="account-dashboard">
      {/* Visual Indicator for local debug preview */}
      {isDebug && (
        <div className="debug-banner">
          <div className="debug-banner-content">
            <span className="debug-badge">PREVIEW MODE</span>
            <span className="debug-message">Simulated Shopify account active. Feel free to interact with profile & addresses!</span>
            <Link to="?debug=false" className="debug-exit-link">Exit Preview</Link>
          </div>
        </div>
      )}

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
            {/* Connection fix: link to /shop instead of broken /collections/all-products */}
            <Link to="/shop" className="dashboard-btn-primary">
              CONTINUE SHOPPING
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
              <h3 className="dashboard-nav-title">ACCOUNT</h3>
              <AccountMenu isDebug={isDebug} />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <Outlet context={{ customer, isDebug }} />
        </main>
      </div>
    </div>
  );
}

function AccountMenu({ isDebug }: { isDebug: boolean }) {
  return (
    <div className="dashboard-nav-links">
      <NavLink
        to="/account/orders"
        end
        className={({ isActive }) =>
          `dashboard-nav-link ${isActive ? 'active' : ''}`
        }
      >
        <svg
          className="dashboard-nav-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <div className="dashboard-nav-link-content">
          <span className="dashboard-nav-link-title">ORDERS</span>
          <span className="dashboard-nav-link-desc">View order history</span>
        </div>
      </NavLink>

      <NavLink
        to="/account/profile"
        className={({ isActive }) =>
          `dashboard-nav-link ${isActive ? 'active' : ''}`
        }
      >
        <svg
          className="dashboard-nav-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <div className="dashboard-nav-link-content">
          <span className="dashboard-nav-link-title">PROFILE</span>
          <span className="dashboard-nav-link-desc">Personal details</span>
        </div>
      </NavLink>

      <NavLink
        to="/account/addresses"
        className={({ isActive }) =>
          `dashboard-nav-link ${isActive ? 'active' : ''}`
        }
      >
        <svg
          className="dashboard-nav-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <div className="dashboard-nav-link-content">
          <span className="dashboard-nav-link-title">ADDRESSES</span>
          <span className="dashboard-nav-link-desc">Shipping & billing</span>
        </div>
      </NavLink>

      <div className="dashboard-nav-divider"></div>

      <div className="dashboard-nav-section">
        <h3 className="dashboard-nav-title">MEMBERSHIP</h3>
        <NavLink
          to="/blacmelo-club"
          className={({ isActive }) =>
            `dashboard-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <svg
            className="dashboard-nav-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <div className="dashboard-nav-link-content">
            <span className="dashboard-nav-link-title">BLACMELO CLUB</span>
            <span className="dashboard-nav-link-desc">Exclusive club rewards</span>
          </div>
        </NavLink>

        <NavLink
          to="/the-private-access"
          className={({ isActive }) =>
            `dashboard-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <svg
            className="dashboard-nav-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <div className="dashboard-nav-link-content">
            <span className="dashboard-nav-link-title">PRIVATE ACCESS</span>
            <span className="dashboard-nav-link-desc">Exclusive online drops</span>
          </div>
        </NavLink>
      </div>

      <div className="dashboard-nav-divider"></div>

      <Logout isDebug={isDebug} />
    </div>
  );
}

function Logout({ isDebug }: { isDebug: boolean }) {
  if (isDebug) {
    return (
      <Link to="?debug=false" className="dashboard-nav-link logout-link">
        <svg
          className="dashboard-nav-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <div className="dashboard-nav-link-content">
          <span className="dashboard-nav-link-title">EXIT PREVIEW</span>
          <span className="dashboard-nav-link-desc">Return to normal auth</span>
        </div>
      </Link>
    );
  }

  return (
    <Form className="dashboard-logout-form" method="POST" action="/account/logout">
      <button type="submit" className="dashboard-nav-link logout-link">
        <svg
          className="dashboard-nav-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <div className="dashboard-nav-link-content">
          <span className="dashboard-nav-link-title">SIGN OUT</span>
          <span className="dashboard-nav-link-desc">Logout from account</span>
        </div>
      </button>
    </Form>
  );
}

