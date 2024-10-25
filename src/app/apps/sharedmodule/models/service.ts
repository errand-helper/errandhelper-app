import { Category } from "./category";

export interface Service {
  id:         string;
  name:       string;
  business:   string;
  categories: Category[];
}

