import { data } from 'react-router';
import type { Route } from './+types/api.newsletter';

const CUSTOMER_CREATE_MUTATION = `#graphql
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
`;

/**
 * Handles newsletter subscription using the Storefront API's customerCreate mutation.
 * This version uses a randomly generated password to satisfy store requirements
 * where passwords are mandatory for customer creation.
 */
export async function action({ request, context }: Route.ActionArgs) {
    const { storefront } = context;

    try {
        const formData = await request.formData();
        const email = formData.get('email');

        if (!email || typeof email !== 'string') {
            return data({ success: false, error: 'Email is required' }, { status: 400 });
        }

        // Generate a random password to satisfy the store's requirement
        // This allows the newsletter signup to proceed without the user needing to provide one.
        // They can always use "Forgot Password" later if they want to access an actual account.
        const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10) + "!";

        const result: any = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
            variables: {
                input: {
                    email,
                    password: randomPassword,
                    acceptsMarketing: true,
                    firstName: 'Newsletter',
                    lastName: 'Subscriber',
                },
            },
        });

        const shopifyData = result?.data || result;
        const { customer, customerUserErrors } = shopifyData?.customerCreate || {};

        if (customerUserErrors && customerUserErrors.length > 0) {
            const error = customerUserErrors[0];

            // Handle the case where the email is already on the list
            if (error.code === 'TAKEN' || (error.message && error.message.toLowerCase().includes('taken'))) {
                return data({
                    success: true,
                    message: 'You are already in our list!'
                });
            }

            return data({ success: false, error: error.message }, { status: 400 });
        }

        if (!customer) {
            return data({ success: false, error: 'Subscription failed. Please try again later.' }, { status: 400 });
        }

        return data({
            success: true,
            message: 'Successfully subscribed to our newsletter!'
        });

    } catch (err: any) {
        console.error('Newsletter Server Error:', err);
        return data({
            success: false,
            error: 'An unexpected error occurred. Please try again later.'
        }, { status: 500 });
    }
}

export async function loader() {
    return data({ error: 'Method not allowed' }, { status: 405 });
}
