import type { APIRoute } from 'astro';

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

    // TODO: Save to Supabase
    // import { supabase } from '../../lib/supabase';
    // const { error } = await supabase!.from('leads').insert([{
    //   business_id: data.business_id,
    //   customer_name: data.customerName,
    //   customer_email: data.customerEmail,
    //   customer_phone: data.customerPhone,
    //   service_needed: data.serviceNeeded,
    //   zip_code: data.zipCode,
    //   description: data.description,
    //   status: 'new',
    // }]);
    // if (error) throw error;

    console.log('Lead received:', {
      business_id: data.business_id,
      name: data.customerName,
      email: data.customerEmail,
    });

    return new Response(
      JSON.stringify({ success: true, id: `lead-${Date.now()}` }),
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
