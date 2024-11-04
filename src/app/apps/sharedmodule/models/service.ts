import { Category } from "./category";

export interface Service {
  id:          string;
  name:        string;
  business:    string;
  category_id: string;
  category:    Category;
}


