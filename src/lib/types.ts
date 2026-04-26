export interface Business {
  id: string;
  name: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email?: string;
  website?: string;
  rating: number;
  reviews_count: number;
  trade_type: 'plumber' | 'electrician' | 'hvac' | 'general';
  service_radius_miles: number;
  image_url?: string;
  hours?: string;
  verified: boolean;
}

export interface Lead {
  id: string;
  business_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_needed: string;
  zip_code: string;
  description: string;
  created_at: string;
  status: 'new' | 'contacted' | 'converted';
}
