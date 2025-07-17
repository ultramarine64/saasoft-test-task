import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Account, Label } from '@/types';

const parseLabels = (labelsString: string): Label[] => {
  return labelsString
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => ({ text: s }));
};

const formatLabels = (labelsArray: Label[]): string => {
  return labelsArray.map((l) => l.text).join(';');
};

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);

  const loadAccounts = () => {
    try {
      const storedAccounts = localStorage.getItem('accounts');
      if (storedAccounts) {
        const parsedRawAccounts: any[] = JSON.parse(storedAccounts);
        accounts.value = parsedRawAccounts
          .map((rawAccount: any) => {
            const labels: Label[] = parseLabels(rawAccount.labels as string);

            return {
              ...rawAccount,
              labels: labels,
            } as Account;
          })
          .filter((account: Account) => account.isValid);
      }
    } catch (e) {
      console.error('Ошибка при загрузке данных из localStorage:', e);
      accounts.value = [];
    }
  };

  const saveAccounts = () => {
    const accountsToSave = accounts.value
      .filter((account) => account.isValid)
      .map((account) => {
        return { ...account, labels: formatLabels(account.labels) };
      });
    localStorage.setItem('accounts', JSON.stringify(accountsToSave));
  };

  const addAccount = () => {
    const newAccount: Account = {
      id: Date.now().toString(),
      labels: [],
      accountType: 'Локальная',
      login: '',
      password: '',
      isValid: false,
    };
    accounts.value.push(newAccount);
  };

  const updateAccount = (updatedAccount: Account) => {
    const index = accounts.value.findIndex((acc) => acc.id === updatedAccount.id);
    if (index !== -1) {
      accounts.value[index] = updatedAccount;
      saveAccounts();
    }
  };

  const deleteAccount = (id: string) => {
    accounts.value = accounts.value.filter((acc) => acc.id !== id);
    saveAccounts();
  };

  loadAccounts();

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
});
