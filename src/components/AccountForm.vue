<template>
  <el-card class="account-card" :class="{ 'invalid-card': !localAccount.isValid }">
    <el-form :model="localAccount" label-position="top" class="account-form">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="Метки" :class="{ 'is-error': labelsError }">
            <el-input
              v-model="localAccount.labels"
              placeholder="Метки (через ;)"
              @blur="validateLabels"
              :class="{ 'input-error': labelsError }"
              maxlength="50"
            ></el-input>
            <div v-if="labelsError" class="el-form-item__error">
              Максимум 50 символов.
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="Тип записи">
            <el-select v-model="localAccount.accountType" @change="validatePassword">
              <el-option label="Локальная" value="Локальная"></el-option>
              <el-option label="LDAP" value="LDAP"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="Логин" :class="{ 'is-error': loginError }">
            <el-input
              v-model="localAccount.login"
              placeholder="Логин"
              @blur="validateLogin"
              :class="{ 'input-error': loginError }"
              maxlength="100"
            ></el-input>
            <div v-if="loginError" class="el-form-item__error">
              Логин обязателен (до 100 символов).
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item
            label="Пароль"
            v-if="localAccount.accountType === 'Локальная'"
            :class="{ 'is-error': passwordError }"
          >
            <el-input
              v-model="localAccount.password"
              :type="passwordFieldType"
              placeholder="Пароль"
              @blur="validatePassword"
              :class="{ 'input-error': passwordError }"
              maxlength="100"
            >
              <template #append>
                <el-button @click="passwordVisible = !passwordVisible">
                  <el-icon v-if="passwordVisible"><View /></el-icon>
                  <el-icon v-else><Hide /></el-icon>
                </el-button>
              </template>
            </el-input>
            <div v-if="passwordError" class="el-form-item__error">
              Пароль обязателен (до 100 символов).
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-button
      type="danger"
      :icon="Delete"
      circle
      class="delete-button"
      @click="handleDelete"
    ></el-button>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { Delete, View, Hide } from '@element-plus/icons-vue';
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElIcon,
} from 'element-plus';

interface Account {
  id: string;
  labels: string;
  accountType: 'Локальная' | 'LDAP';
  login: string;
  password: string | null;
  isValid: boolean;
}

const props = defineProps<{
  account: Account;
}>();

const emit = defineEmits(['delete', 'update']);

const localAccount = ref<Account>({ ...props.account });

const labelsError = ref<boolean>(false);
const loginError = ref<boolean>(false);
const passwordError = ref<boolean>(false);
const passwordVisible = ref<boolean>(false);

const passwordFieldType = computed(() =>
  passwordVisible.value ? 'text' : 'password'
);

const validateLabels = () => {
  labelsError.value = localAccount.value.labels.length > 50;
  updateAccountValidity();
};

const validateLogin = () => {
  loginError.value =
    localAccount.value.login.length === 0 ||
    localAccount.value.login.length > 100;
  updateAccountValidity();
};

const validatePassword = () => {
  if (localAccount.value.accountType === 'Локальная') {
    passwordError.value =
      localAccount.value.password === null ||
      localAccount.value.password.length === 0 ||
      localAccount.value.password.length > 100;
  } else {
    passwordError.value = false;
  }
  updateAccountValidity();
};

const updateAccountValidity = () => {
  const isLabelsValid = !labelsError.value;
  const isLoginValid = !loginError.value;
  let isPasswordValid = true;
  if (localAccount.value.accountType === 'Локальная') {
    isPasswordValid = !passwordError.value;
  }

  localAccount.value.isValid =
    isLabelsValid && isLoginValid && isPasswordValid;

  emit('update', localAccount.value);
};

watch(
  () => localAccount.value.accountType,
  (newType) => {
    if (newType === 'LDAP') {
      localAccount.value.password = null;
    } else {
      if (localAccount.value.password === null) {
        localAccount.value.password = '';
      }
    }
    validatePassword();
  }
);

onMounted(() => {
  validateLabels();
  validateLogin();
  validatePassword();
});

const handleDelete = () => {
  emit('delete', props.account.id);
};
</script>

<style scoped>
.account-card {
  position: relative;
  margin-bottom: 20px;
  padding-right: 60px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.invalid-card {
  border: 2px solid #f56c6c;
  box-shadow: 0 4px 15px rgba(245, 108, 108, 0.2);
}

.account-form .el-form-item {
  margin-bottom: 10px;
}

.delete-button {
  position: absolute;
  top: 20px;
  right: 20px;
}

.input-error {
  border-color: #f56c6c !important;
}

.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
