
export interface Location {
  address: string;
  town: string;
  location: string;
  city: string;
}

export interface Image {
  id: number;
  image_url?: string;
  uploaded_at?: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface Milestone {
  description: string;
  amount: number;
}

export interface Errand {
  id: string;
  locations?: Location[];
  images?: Image[];
  start_date: string;
  stop_date: string;
  reference_number: string;
  errand_title: string;
  descriptions: string[];
  priority: string;
  budget_type: string;
  budget_amount: string;
  estimated_hours: number;
  use_milestones: boolean;
  payment_method: string;
  special_instructions: string;
  contact_preference: string;
  agree_terms: boolean;
  agree_escrow: boolean;
  services: Service[];
  milestones: Milestone[];
  status: string;
  created_at: string;
  updated_at: string;
  client: string;
  business: string;
  paid: boolean;
  business_id: string;
}
