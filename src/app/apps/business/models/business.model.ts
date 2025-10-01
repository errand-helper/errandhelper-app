import { Category } from '../../sharedmodule/models/category';

export interface BusinessDetail {
  id?: string;
  user: string;
  business_name: string;
  business_tagline: string;
  business_description: string;
  category: Category[];
  service_areas: ServiceArea[];
  services: Service[];
  frequently_asked_question: FrequentlyAskedQuestion[];
  business_logo: string;
  business_email: string;
  business_phone: string;
  registration_number: string;
  kra_pin: string;
  social_links: SocialLink;
  available:Boolean;
  is_verified:Boolean;
}

export interface FrequentlyAskedQuestion {
  id?: string;
  question: string;
  answer: string;
  isOpen?: boolean;
}

export interface Service {
  id?: string;
  name: string;
  category: string;
  price_type: string;
  price_from: string;
  price_to: string;
}

export interface SocialLink {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  website: string;
}

export interface ServiceArea {
  id?: string;
  area_name: string;
  latitude: string;
  longitude: string;
  physical_address: string;
  service_radius: number | null ;
  user?: string;

}

export interface FrequentlyAskedResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: FrequentlyAskedQuestion[];
}

export interface ServiceResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

export interface ServiceAreaResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceArea[];
}
