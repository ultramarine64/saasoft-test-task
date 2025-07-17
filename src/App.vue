<template>
  <el-container class="common-layout">
    <el-header class="header">
      <h1>Учетные записи</h1>
      <el-button type="primary" :icon="Plus" @click="addAccount">
        Добавить
      </el-button>
    </el-header>

    <el-main class="main-content">
      <el-card class="hint-card">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Используйте ';' для разделения меток"
          placement="top-start"
        >
          <div class="hint-text">
            <el-icon><InfoFilled /></el-icon>
            <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель: ;</span>
          </div>
        </el-tooltip>
      </el-card>

      <div class="account-list">
        <AccountForm
          v-for="account in accountStore.accounts"
          :key="account.id"
          :account="account"
          @delete="deleteAccount"
          @update="handleAccountUpdate"
        />
        <p v-if="!accountStore.accounts.length" class="no-accounts-message">
          Нажмите "+" для добавления первой учетной записи.
        </p>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/stores/accounts';
import AccountForm from '@/components/AccountForm.vue';
import { Plus, InfoFilled } from '@element-plus/icons-vue';
import { ElButton, ElCard, ElContainer, ElHeader, ElMain, ElMessage, ElTooltip, ElIcon } from 'element-plus';
import { Account } from '@/types';

const accountStore = useAccountStore();

const addAccount = () => {
  accountStore.addAccount();
  ElMessage({
    message: 'Новая учетная запись добавлена',
    type: 'success',
  });
};

const deleteAccount = (id: string) => {
  accountStore.deleteAccount(id);
  ElMessage({
    message: 'Учетная запись удалена',
    type: 'success',
  });
};

const handleAccountUpdate = (updatedAccount: Account) => {
  accountStore.updateAccount(updatedAccount);
};
</script>

<style scoped>
.common-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.header h1 {
  margin: 0;
  color: #303133;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hint-card {
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

.hint-text {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.hint-text .el-icon {
  margin-right: 8px;
  color: #1890ff;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

.no-accounts-message {
  text-align: center;
  color: #909399;
  font-size: 16px;
  margin-top: 50px;
}
</style>
