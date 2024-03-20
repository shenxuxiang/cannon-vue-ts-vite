<script setup lang="ts">
import { inject } from 'vue';
import router from '@/router';
import { Button } from 'ant-design-vue';
import NotFoundSvg from '@/assets/images/404.svg';
import type { BasicContextType } from '@/common/basicContext';

const {
  basicContext: { homeURL },
} = inject<BasicContextType>('basicContext')!;

function goHome() {
  router.push(homeURL.value || '/login');
}
</script>

<template>
  <div class="page">
    <NotFoundSvg width="70%" height="" />
    <div>
      <h1 class="title">UH OH！页面丢失</h1>
      <p class="subtitle">您所访问的页面不存在，您可以点击下方的按钮，返回主页</p>
      <Button ghost type="primary" class="button" @click="goHome">返回首页</Button>
    </div>
  </div>
</template>

<style scoped lang="less">
.page {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.img {
  display: block;
  width: 70%;
}
.title {
  margin: 0;
  padding: 0;
  color: #999;
  font-size: 32px;
}
.subtitle {
  margin: 10px 0 0;
  padding: 0;
  color: gray;
  font-size: 15px;
  line-height: 1.5;
}
.button {
  margin-top: 20px;
  width: 160px;
  border-radius: 16px;
}
</style>
