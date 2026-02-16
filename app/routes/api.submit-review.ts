import type {Route} from './+types/api.submit-review';

interface ReviewResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: any;
}

export const action = async ({ request, context }: Route.ActionArgs) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await request.formData();
    
    // Prepare Judge.me API request
    const judgemeFormData = new FormData();
    judgemeFormData.append('api_token', context.env.JUDGEME_PUBLIC_TOKEN || '');
    judgemeFormData.append('shop_domain', context.env.JUDGEME_SHOP_DOMAIN || '');
    judgemeFormData.append('platform', 'shopify');
    judgemeFormData.append('id', formData.get('productId') as string);
    judgemeFormData.append('email', formData.get('email') as string);
    judgemeFormData.append('name', formData.get('name') as string);
    judgemeFormData.append('rating', formData.get('rating') as string);
    judgemeFormData.append('title', formData.get('title') as string);
    judgemeFormData.append('body', formData.get('body') as string);
    
    const size = formData.get('size');
    if (size) {
      judgemeFormData.append('custom_fields[size]', size as string);
    }
    
    const recommend = formData.get('recommend');
    judgemeFormData.append('recommend', recommend === 'true' ? 'true' : 'false');

    // Handle photos
    const photoCount = parseInt(formData.get('photoCount') as string || '0');
    for (let i = 0; i < photoCount; i++) {
      const photo = formData.get(`photo_${i}`);
      if (photo) {
        judgemeFormData.append(`pictures[${i}]`, photo);
      }
    }

    // Submit to Judge.me API
    const response = await fetch('https://judge.me/api/v1/reviews', {
      method: 'POST',
      body: judgemeFormData,
    });

    const data = await response.json() as any;

    if (!response.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: data?.message || data?.error || 'Failed to submit review',
        details: data
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Review submitted successfully',
      data
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
