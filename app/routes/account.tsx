import {
  data as remixData,
  Form,
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
  const {data, errors} = await customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
    {
      variables: {
        language: customerAccount.i18n.language,
      },
    },
  );

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
      ? `Welcome to your account`
      : `Welcome to your account`
    : 'Account Details';

  const subheading = customer?.firstName 
    ? `${customer.firstName}${customer.lastName ? ' ' + customer.lastName : ''}`
    : 'Manage your orders, profile, and addresses';

  return (
    <div className="account-layout">
      <div className="account-container">
        <div className="account-header">
          <h1 className="account-title">{heading}</h1>
          <p className="account-subtitle">{subheading}</p>
        </div>
        
        <div className="account-content">
          <aside className="account-sidebar">
            <AccountMenu />
          </aside>
          
          <main className="account-main">
            <Outlet context={{customer}} />
          </main>
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  return (
    <nav className="account-nav" role="navigation">
      <div className="account-nav-section">
        <h3 className="account-nav-title">ACCOUNT</h3>
        <ul className="account-nav-list">
          <li>
            <NavLink 
              to="/account/orders" 
              className={({isActive}) => 
                `account-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <svg className="account-nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/account/profile" 
              className={({isActive}) => 
                `account-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <svg className="account-nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/account/addresses" 
              className={({isActive}) => 
                `account-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <svg className="account-nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2L2 5v6c0 3 6 5 6 5s6-2 6-5V5l-6-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Addresses
            </NavLink>
          </li>
        </ul>
      </div>
      
      <div className="account-nav-footer">
        <Logout />
      </div>
    </nav>
  );
}

function Logout() {
  return (
    <Form className="account-logout-form" method="POST" action="/account/logout">
      <button type="submit" className="account-logout-button">
        <svg className="account-nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Sign Out
      </button>
    </Form>
  );
}
