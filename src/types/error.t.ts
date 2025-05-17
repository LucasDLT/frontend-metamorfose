export interface Ierror {
  [key: string]: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  confirmPassword?: string | undefined;
}

export interface IformErrors {
  title?: string | undefined;
  history?: string | undefined;
  category?: string | undefined;
  url?: string | undefined;
  active?: string | undefined;
  createdAt?: string | undefined;
}
