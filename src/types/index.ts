export interface Account {
  id: string;
  labels: string;
  accountType: 'Локальная' | 'LDAP';
  login: string;
  password: string | null;
  isValid: boolean;
}
