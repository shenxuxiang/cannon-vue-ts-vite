<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined, SlackSquareOutlined } from '@ant-design/icons-vue';
import { Layout, Avatar, Menu, Dropdown, Breadcrumb } from 'ant-design-vue';
import type { NavBarList } from 'qm-vnit-vue/lib/NavigationBar';
import type { BasicContextType } from '@/common/basicContext';
import { RouterView, useRouter, useRoute } from 'vue-router';
import { splitPath, matchPath, setLocalStorage, getLocalStorage } from '@/utils';
import { NavigationBar } from 'qm-vnit-vue';
import { ref, watch, inject } from 'vue';
import { logout } from '@/api/login';

const VITE_TITLE = import.meta.env.VITE_TITLE;
const { Content, Sider, Header, Footer } = Layout;

const route = useRoute();
const router = useRouter();
const menuCollapse = ref(false);
const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const { basicContext } = inject<BasicContextType>('basicContext')!;

const { userInfo, userMenuItems, userPermissions, homeURL } = basicContext;
const activeKey = ref(homeURL.value!);
const navBarList = ref<NavBarList>(getLocalStorage('NAVBAR_LIST') || [getPathOfMatchObject(homeURL.value!)!]);

// 监听路由变化
watch(
  [userInfo, () => route.path],
  () => {
    selectedKeys.value = [route.path];
    handleExpandKeys(route.path);
  },
  { immediate: true },
);

watch(
  () => route.path,
  () => {
    const matched = getPathOfMatchObject(route.path);
    if (matched) {
      // 如果当前的 navBarList 中不含有与 matched.key 匹配的项，则新增并修改 NavigationBar 组件的 activeKey。
      if (navBarList.value.some((item) => item.key === matched.key)) {
        activeKey.value = matched.key;
      } else {
        navBarList.value.push(matched);
        setLocalStorage('NAVBAR_LIST', navBarList.value);
        activeKey.value = matched.key;
      }
    }
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

function navBarChange(key: string) {
  activeKey.value = key;
  router.push(key);
}

function navBarDelete(newNavBarList: any) {
  navBarList.value = newNavBarList;
  setLocalStorage('NAVBAR_LIST', navBarList.value);
}

// 通过 routePath 查找匹配路径对象。
function getPathOfMatchObject(routePath: string) {
  let result;
  const keys = [...userPermissions.value.keys()];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (matchPath(key, routePath)) {
      result = { key: key, label: userPermissions.value.get(key)!.name };
      break;
    }
  }

  return result;
}
</script>

<template>
  <Layout style="height: 100vh" theme="light">
    <Sider theme="light" :width="240" class="qm-layout-left-side" :collapsed="menuCollapse">
      <section class="qm-layout-logo-x" :style="{ width: menuCollapse ? '80px' : '240px' }">
        <SlackSquareOutlined
          class="qm-layout-log-icon"
          :style="{ transform: menuCollapse ? 'translateX(18px) scale(1.2)' : 'translateX(5px) scale(1)' }"
        />
        <h1 :class="['qm-layout-log-title', { hide: menuCollapse }]">{{ VITE_TITLE }}</h1>
      </section>
      <Menu
        v-model:openKeys="openKeys"
        theme="light"
        mode="inline"
        :selectedKeys="selectedKeys"
        :inlineCollapsed="menuCollapse"
        :items="userMenuItems as any"
        style="border: none"
        @select="handleChangeSelectedKeys"
      />
    </Sider>
    <Layout>
      <Header class="qm-layout-header" style="height: 80px">
        <div className="qm-body-header-toolbar">
          <div className="qm-body-header-toolbar-icons" @click="handleTriggerMenuCollapse">
            <MenuFoldOutlined v-if="menuCollapse" />
            <MenuUnfoldOutlined v-else />
          </div>

          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
            <Breadcrumb.Item><a href="">Application List</a></Breadcrumb.Item>
            <Breadcrumb.Item>An Application</Breadcrumb.Item>
          </Breadcrumb>

          <Dropdown placement="bottomLeft">
            <template #overlay>
              <Menu>
                <Menu.Item>
                  <div type="text" @click="handleLogout">退出登录</div>
                </Menu.Item>
                <Menu.Item>
                  <div type="text" @click="handleUpdatePasswd">修改密码</div>
                </Menu.Item>
              </Menu>
            </template>
            <div class="qm-body-header-admin">
              <Avatar size="small" shape="circle" style="background-color: #87d068; vertical-align: middle">
                {{ userInfo.username?.slice(0, 1) }}
              </Avatar>
              <span className="qm-body-header-userName">{{ userInfo.realName }}</span>
            </div>
          </Dropdown>
        </div>
        <NavigationBar :navBarList="navBarList" :activeKey="activeKey" @change="navBarChange" @delete="navBarDelete" />
      </Header>
      <Content class="qm-container">
        <div class="qm-page-content">
          <RouterView v-slot="{ Component }">
            <transition name="router-fade" mode="out-in" appear>
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
        <Footer class="qm-footer">安徽阡陌网络科技有限公司 ©2022 Created by Qianmo</Footer>
      </Content>
    </Layout>
  </Layout>
</template>

<style lang="less">
.qm-layout-left-side {
  border-right: 1px solid #f2f2f2;
  height: 100vh;
  padding-top: 64px;
  overflow-x: hidden;
  overflow-y: auto;
}
.qm-layout-logo-x {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 64px;
  padding: 8px;
  box-sizing: border-box;
  border-right: 1px solid #f2f2f2;
  background-color: #fff;
}
.qm-layout-log-icon {
  font-size: 30px;
  transition: 0.3s ease;
  color: @themeColor;
  transform: translateX(5px);
}
.qm-layout-log-title {
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
.qm-layout-header.qm-layout-header {
  padding: 0;
  background: #fff !important;
}

.qm-body-header-toolbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  margin: 0;
  padding-left: 12px;
  border-bottom: 1px solid #f2f2f2;
  line-height: 1;
}
.qm-body-header-toolbar-icons {
  width: 36px;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
.qm-body-header-admin {
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 40px;
  padding: 0 10px;
  margin-right: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: #f8f8f8;
  }
}
.qm-body-header-userName {
  margin-left: 10px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 48px;
}
.qm-container {
  height: calc(100vh - 80px);
  overflow: auto;
}
.qm-page-content {
  position: relative;
  display: inline-block;
  width: 100%;
  min-height: calc(100vh - 126px);
}
.qm-footer.qm-footer {
  flex-shrink: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  line-height: 32px;
  font-size: 14px;
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
