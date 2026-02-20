# Customer Account System - Implementation Guide

## Overview

This document explains the customer account system implementation in your Hydrogen storefront, based on Shopify's Customer Account API. The system handles customer authentication, account management, orders, addresses, and profile updates.

**Reference**: [Shopify Customer Accounts Documentation](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/customer-accounts)

---

## Architecture Overview

### Current Implementation Status

Your storefront already has a **complete customer account system** implemented with:

✅ **Authentication Routes**
- Login (`/account/login`)
- Logout (`/account/logout`)
- Authorization (`/account/authorize`)

✅ **Account Management Routes**
- Account Dashboard (`/account`)
- Orders List (`/account/orders`)
- Order Details (`/account/orders/$id`)
- Profile Management (`/account/profile`)
- Address Management (`/account/addresses`)

✅ **GraphQL Queries & Mutations**
- Customer details query
- Customer orders query
- Customer update mutation
- Customer address mutations

---

## System Components

### 1. Authentication Flow

#### Login Process
**File**: `app/routes/($locale).account_.login.tsx`

```typescript
export async function loader({request, context}: Route.LoaderArgs) {
  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
  });
}
```

**How it works**:
1. User clicks "Login" button
2. Redirects to Shopify's Customer Account API OAuth flow
3. User authenticates with Shopify
4. Shopify redirects back to `/account/authorize`
5. Authorization route exchanges code for access token
6. User is logged in and redirected to account dashboard

#### Logout Process
**File**: `app/routes/($locale).account_.logout.tsx`

Handles customer logout and session cleanup.

---

### 2. Account Layout & Navigation

**File**: `app/routes/($locale).account.tsx`

This is the main account layout that wraps all account pages:

```typescript
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
```

**Features**:
- Fetches customer details on load
- Displays personalized welcome message
- Provides navigation menu (Orders, Profile, Addresses, Sign out)
- Uses `<Outlet>` to render child routes

---

### 3. Customer Data Structure

#### Customer Fragment
**File**: `app/graphql/customer-account/CustomerDetailsQuery.ts`

```graphql
fragment Customer on Customer {
  id
  firstName
  lastName
  defaultAddress {
    ...Address
  }
  addresses(first: 6) {
    nodes {
      ...Address
    }
  }
}

fragment Address on CustomerAddress {
  id
  formatted
  firstName
  lastName
  company
  address1
  address2
  territoryCode
  zoneCode
  city
  zip
  phoneNumber
}
```

**Available Customer Data**:
- Basic info: `id`, `firstName`, `lastName`
- Email: `emailAddress.emailAddress`
- Phone: `phoneNumber.phoneNumber`
- Default address
- All addresses (up to 6)

---

### 4. Orders Management

#### Orders List
**File**: `app/routes/($locale).account.orders._index.tsx`

**Query**: `app/graphql/customer-account/CustomerOrdersQuery.ts`

```graphql
fragment OrderItem on Order {
  totalPrice {
    amount
    currencyCode
  }
  financialStatus
  fulfillmentStatus
  fulfillments(first: 1) {
    nodes {
      status
    }
  }
  id
  number
  confirmationNumber
  processedAt
}
```

**Features**:
- Paginated order list
- Sort by processed date (newest first)
- Filter by query string
- Shows order status, total, and fulfillment status

#### Order Details
**File**: `app/routes/($locale).account.orders.$id.tsx`

Displays detailed information about a specific order.

---

### 5. Profile Management

**File**: `app/routes/($locale).account.profile.tsx`

**Mutation**: `app/graphql/customer-account/CustomerUpdateMutation.ts`

```graphql
mutation customerUpdate(
  $customer: CustomerUpdateInput!
  $language: LanguageCode
) @inContext(language: $language) {
  customerUpdate(input: $customer) {
    customer {
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
    }
    userErrors {
      code
      field
      message
    }
  }
}
```

**Updatable Fields**:
- First name
- Last name
- Email address
- Phone number

---

### 6. Address Management

**File**: `app/routes/($locale).account.addresses.tsx`

**Mutations**: `app/graphql/customer-account/CustomerAddressMutations.ts`

**Available Operations**:
- Create new address (`customerAddressCreate`)
- Update existing address (`customerAddressUpdate`)
- Delete address (`customerAddressDelete`)
- Set default address (`customerDefaultAddressUpdate`)

---

## Shopify Customer Account API Features

### Customer Creation & Activation

According to Shopify docs, you can implement:

#### 1. Customer Registration
```graphql
mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
      email
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
```

**Process**:
1. User fills registration form
2. Call `customerCreate` mutation
3. Shopify sends welcome/activation email
4. Customer clicks activation link
5. Customer sets password using `customerActivateByUrl` mutation

#### 2. Customer Activation
```graphql
mutation customerActivateByUrl(
  $activationUrl: URL!
  $password: String!
) {
  customerActivateByUrl(
    activationUrl: $activationUrl
    password: $password
  ) {
    customer {
      id
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
```

#### 3. Password Recovery
```graphql
mutation customerRecover($email: String!) {
  customerRecover(email: $email) {
    customerUserErrors {
      code
      field
      message
    }
  }
}
```

**Process**:
1. User requests password reset
2. Call `customerRecover` mutation
3. Shopify sends reset email
4. Customer clicks reset link
5. Customer sets new password using `customerResetByUrl` mutation

#### 4. Password Reset
```graphql
mutation customerResetByUrl(
  $resetUrl: URL!
  $password: String!
) {
  customerResetByUrl(
    resetUrl: $resetUrl
    password: $password
  ) {
    customer {
      id
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
```

---

## Context & Session Management

### Hydrogen Context
**File**: `app/lib/context.ts`

The `createHydrogenRouterContext` function sets up:
- **Storefront API client**: For product/collection queries
- **Customer Account API client**: For customer authentication
- **Cart**: Shopping cart management
- **Session**: Secure session storage
- **i18n**: Internationalization support

### Customer Account Context

Available in all route loaders via `context.customerAccount`:

```typescript
// Check if customer is logged in
const isLoggedIn = await context.customerAccount.isLoggedIn();

// Query customer data
const {data} = await context.customerAccount.query(QUERY, {variables});

// Perform mutations
const {data} = await context.customerAccount.mutate(MUTATION, {variables});

// Login redirect
return context.customerAccount.login({countryCode: 'US'});

// Logout
return context.customerAccount.logout();
```

---

## Email Template Customization

### Shopify Admin Setup

To customize customer account emails:

1. **Go to**: Shopify Admin → Settings → Notifications
2. **Find**: Customer notifications section
3. **Customize**:
   - Customer account invite
   - Customer account password reset
   - Customer account welcome

### Link to Your Storefront

Update email templates to link to your custom storefront:

**Activation Link**:
```liquid
https://yourstorefront.com/account/activate?activation_url={{ customer.account_activation_url }}
```

**Password Reset Link**:
```liquid
https://yourstorefront.com/account/reset?reset_url={{ customer.reset_password_url }}
```

---

## Security Best Practices

### 1. Session Security
- Use strong `SESSION_SECRET` environment variable
- Sessions are encrypted and stored securely
- Tokens are never exposed to client-side JavaScript

### 2. HTTPS Only
- All customer account operations require HTTPS
- OAuth redirects only work with secure URLs

### 3. Token Management
- Access tokens are managed by Hydrogen automatically
- Tokens are refreshed automatically when expired
- No manual token handling required

### 4. CORS & CSP
- Customer Account API handles CORS automatically
- Ensure your domain is registered in Shopify admin

---

## Route Structure

```
/account
├── /login              → OAuth login redirect
├── /logout             → Logout and session cleanup
├── /authorize          → OAuth callback handler
├── /                   → Account dashboard (redirects to /orders)
├── /orders             → Order history list
│   └── /$id            → Individual order details
├── /profile            → Edit profile information
└── /addresses          → Manage shipping addresses
```

---

## Missing Features (Optional Enhancements)

Based on Shopify's documentation, you could add:

### 1. Customer Registration Page
Create a signup form that uses `customerCreate` mutation.

### 2. Account Activation Page
Handle activation URLs from email and call `customerActivateByUrl`.

### 3. Password Recovery Flow
- Forgot password form (`customerRecover`)
- Reset password page (`customerResetByUrl`)

### 4. Multipass Integration
If using Multipass for SSO:
```graphql
mutation customerAccessTokenCreateWithMultipass($multipassToken: String!) {
  customerAccessTokenCreateWithMultipass(multipassToken: $multipassToken) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      message
    }
  }
}
```

### 5. Enhanced Profile Features
- Avatar upload
- Marketing preferences
- Account deletion request

---

## Testing Checklist

- [ ] Login flow works correctly
- [ ] Logout clears session
- [ ] Protected routes redirect to login when not authenticated
- [ ] Customer data loads on account pages
- [ ] Orders display correctly with pagination
- [ ] Profile updates save successfully
- [ ] Address CRUD operations work
- [ ] Email templates link to correct URLs
- [ ] Mobile responsive design
- [ ] Error handling for API failures

---

## Next Steps

1. **Review Current Implementation**: Check all account routes are working
2. **Test Authentication Flow**: Verify login/logout works
3. **Customize UI**: Style account pages to match your brand
4. **Add Missing Features**: Implement registration, password recovery if needed
5. **Update Email Templates**: Configure Shopify notification templates
6. **Test Edge Cases**: Handle errors, expired sessions, etc.

---

## Resources

- [Shopify Customer Account API](https://shopify.dev/docs/api/customer)
- [Hydrogen Customer Account](https://shopify.dev/docs/custom-storefronts/hydrogen/customer-accounts)
- [OAuth 2.0 Flow](https://shopify.dev/docs/apps/auth/oauth)
- [Multipass Documentation](https://shopify.dev/docs/api/multipass)
