import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    if (!data.business_id || !data.customerName || !data.customerEmail || !data.customerPhone) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const lead = {
      business_id: data.business_id,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      service_needed: data.serviceNeeded ?? '',
      zip_code: data.zipCode ?? '',
      description: data.description ?? '',
      status: 'new',
      created_at: new Date().toISOString(),
    };

    const docRef = await db.collection('leads').add(lead);

    return new Response(
      JSON.stringify({ success: true, id: docRef.id }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
