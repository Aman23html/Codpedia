export interface RegisterUserInput {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  departmentId: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}