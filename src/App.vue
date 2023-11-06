<template>
  <ConfigProvider :locale="zhCN" :theme="theme">
    <RouterView />
  </ConfigProvider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';

import { ConfigProvider } from 'ant-design-vue';
import { RouterView } from 'vue-router';
import 'dayjs/locale/zh-cn';
import { ref } from 'vue';
import dayjs from 'dayjs';
dayjs.locale('zh-cn');

const theme = ref({
  token: {
    colorLink: '#6C69FF',
    colorPrimary: '#6C69FF',
  },
});
</script>
