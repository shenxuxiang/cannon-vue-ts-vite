<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined, SlackSquareOutlined } from '@ant-design/icons-vue';
import { Popover, Layout, Avatar, Menu, Button, Space } from 'ant-design-vue';
import type { BasicContextType } from '@/common/basicContext';
import { RouterView, useRouter, useRoute } from 'vue-router';
import avatarUrl from '@/assets/images/avatar.png';
import { ref, watch, inject, toRefs } from 'vue';
import { logout } from '@/api/login';
import { splitPath } from '@/utils';

const VITE_TITLE = import.meta.env.VITE_TITLE;
const { Content, Sider, Header, Footer } = Layout;

const route = useRoute();
const router = useRouter();
const menuCollapse = ref(false);
const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const { basicContext } = inject<BasicContextType>('basicContext')!;

const { userInfo, userMenuItems } = toRefs(basicContext);

// 监听路由变化
watch(
  [userInfo, () => route.path],
  () => {
    selectedKeys.value = [route.path];
    handleExpandKeys(route.path);
  },
  { immediate: true },
);

function handleTriggerMenuCollapse() {
  menuCollapse.value = !menuCollapse.value;
}

function handleChangeSelectedKeys(values: any) {
  selectedKeys.value = values.selectedKeys;
  router.push(values.selectedKeys[0]);
}

function handleLogout() {
  logout().then(() => router.push('/login'));
}

function handleUpdatePasswd() {
  router.push('/update-passwd');
}

function handleExpandKeys(pathname: string) {
  openKeys.value = splitPath(pathname);
}
</script>

<template>
  <Layout style="min-height: 100vh" theme="light">
    <Sider theme="light" :width="240" :collapsed="menuCollapse">
      <section class="qm-logo">
        <SlackSquareOutlined
          class="qm-log-icon"
          :style="{ transform: menuCollapse ? 'translateX(18px) scale(1.2)' : 'translateX(5px) scale(1)' }"
        />
        <h1 :class="['qm-log-title', { hide: menuCollapse }]">{{ VITE_TITLE }}</h1>
      </section>
      <Menu
        v-model:openKeys="openKeys"
        mode="inline"
        :selectedKeys="selectedKeys"
        :inlineCollapsed="menuCollapse"
        :items="userMenuItems as any"
        @select="handleChangeSelectedKeys"
      />
    </Sider>
    <Layout>
      <Header class="qm-header">
        <div class="control-menu-collapse-icon" @click="handleTriggerMenuCollapse">
          <MenuFoldOutlined v-if="menuCollapse" />
          <MenuUnfoldOutlined v-else />
        </div>
        <Popover>
          <template #content>
            <Space direction="vertical" size="small">
              <Button type="text" @click="handleLogout">退出登录</Button>
              <Button type="text" @click="handleUpdatePasswd">修改密码</Button>
            </Space>
          </template>
          <div class="qm-avatar">
            <Avatar :size="48" :src="userInfo.avater || avatarUrl" />
            {{ userInfo.username }}
          </div>
        </Popover>
      </Header>
      <Content class="qm-container">
        <div class="qm-page-content">
          <RouterView v-slot:default="{ Component }">
            <Transition mode="out-in" name="router-fade">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
        <Footer class="qm-footer">安徽阡陌网络科技有限公司 ©2022 Created by Qianmo</Footer>
      </Content>
    </Layout>
  </Layout>
</template>

<style lang="less">
.qm-logo {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: 8px;
  box-sizing: border-box;
  &::after {
    position: absolute;
    bottom: 0;
    content: '';
    height: 0.5px;
    width: 100%;
    background: rgba(1, 1, 1, 0.03);
  }
}
.qm-log-icon {
  // margin-left: 8px;
  font-size: 30px;
  transition: 0.3s ease;
  color: @themeColor;
  transform: translateX(5px);
}
.qm-log-title {
  flex: 1 0 0;
  line-height: 1;
  font-size: 18px;
  font-weight: bold;
  color: @themeColor;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-left: 10px;
  &.hide {
    flex: 0;
    opacity: 0;
    visibility: hidden;
  }
}
.qm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0 !important;
  background: #fff !important;
}
.control-menu-collapse-icon {
  padding: 0 20px 0;
  font-size: 18px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
  &:hover {
    color: #1677ff;
  }
}
.qm-avatar {
  font-size: 16px;
  color: #333;
}
.qm-container {
  height: calc(100vh - 64px);
  overflow: auto;
}
.qm-page-content {
  position: relative;
  display: inline-block;
  width: 100%;
  min-height: calc(100vh - 126px);
}
.qm-footer {
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  line-height: 1;
}

.router-fade-enter-active {
  animation: fade_in 0.2s linear;
}
.router-fade-leave-active {
  animation: fade_out 0.2s ease;
}

@keyframes fade_in {
  0% {
    transform: translate(200px);
    opacity: 0;
  }
  100% {
    transform: translate(0px);
    opacity: 1;
  }
}
@keyframes fade_out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
@/api/login
