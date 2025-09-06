export interface RegisterData {
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginResponse {
  access: string;
  role: string;
  id: number;
}

export interface ApiError {
  error: {
    message: string;
  };
}
