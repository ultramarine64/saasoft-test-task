export interface Label {
  text: string;
}

export interface Account {
  id: string;
  labels: Label[];
  accountType: 'Локальная' | 'LDAP';
  login: string;
  password: string | null;
  isValid: boolean;
}
