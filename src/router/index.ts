import { getUserToken, isEmpty, matchPath, setLocalStorage } from '@/utils';
import type { BasicContextType } from '@/common/basicContext';
import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/components/MainLayout.vue';
import type { RouteRecordRaw } from 'vue-router';
import { pathToRegexp } from 'path-to-regexp';
import { message } from 'ant-design-vue';
import useMainStore from '@/store/main';
import routerMap from './routerMap';
import type { VNode } from 'vue';
import { inject } from 'vue';
import LazyLoader from '@/components/LazyLoader';

const BASE_URL = import.meta.env.BASE_URL;
// 白名单
const whiteList = new Set(['/login', '/404', '/update-passwd']);
// 根路径正则
const ROOT_PATH_PATTERN = pathToRegexp(BASE_URL);

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes: [
    {
      name: 'login',
      path: '/login',
      meta: { requiresAuth: false },
      component: LazyLoader(() => import('../pages/login.vue')),
    },
    {
      name: 'update-passwd',
      path: '/update-passwd',
      meta: { requiresAuth: true },
      component: LazyLoader(() => import('../pages/updatePassword.vue')),
    },
    {
      name: '404',
      path: '/404',
      meta: { requiresAuth: false },
      component: LazyLoader(() => import('../pages/404.vue')),
    },
    {
      path: '/',
      component: MainLayout,
      children: routerMap as RouteRecordRaw[],
    },
  ],
});

export default router;

router.beforeEach(async (to) => {
  // inject() 必须放在作用域的顶部，否则出现异常。
  const { basicContext, updateBasicContext } = inject<BasicContextType>('basicContext')!;
  const { userInfo, homeURL, userPermissions } = basicContext;
  const {
    path,
    meta: { requiresAuth = true },
  } = to;
  const { queryUserInfo } = useMainStore();

  if (requiresAuth || !whiteList.has(path)) {
    // 获取本地缓存中是否存在用户 Token，根据 Token 判断用户是否已经登录。
    if (!getUserToken()) {
      message.warning('用户暂未登录！');
      return '/login';
    }

    if (isEmpty(userInfo.value)) {
      try {
        const { data } = await queryUserInfo();
        // 用户信息同步更新到本地缓存、BasicContext 上下文
        setLocalStorage('USER_INFO', data);
        updateBasicContext({ userInfo: data });
      } catch (error) {
        // 注意，如果获取用户信息接口抛出异常，axios 底层封装会自动判断是否重定向到登录页面。
        return false;
      }
    }

    // 当用户直接访问根路由（BASE_URL）时，重定向到项目首页或登录页。
    if (ROOT_PATH_PATTERN.test(path)) {
      if (homeURL.value) {
        return homeURL.value;
      } else {
        return '/login';
      }
    }

    // 根据用户的权限判定用户是否有权访问该页面
    if (routerGuard(userPermissions.value, path)) {
      return true;
    } else {
      return '/404';
    }
  }

  return true;
});

/**
 * 路由守卫
 * @param permissions 路由权限集合
 * @param pathname 页面路径
 * @returns
 */
export function routerGuard(permissions: Map<string, object>, pathname: string) {
  if (whiteList.has(pathname)) return true;

  if (permissions.size <= 0 || permissions.has(pathname)) return true;

  let matched = null;
  permissions.forEach((_, k) => {
    if (matched!) return;
    matched = matchPath(k, pathname);
  });

  if (matched) return true;

  return false;
}

/**
 * 获取用户菜单列表
 * @param permissions 用户路由权限
 * @param routes 路由配置
 * @returns
 */
export function getMenuItems(permissions: Map<string, { name: string; path: string }>, routes = routerMap) {
  const menuItems: MenuItems = [];

  routes.forEach((route) => {
    const { label, path, icon, children } = route;
    if (permissions.has(path)) {
      const item: MenuItems[number] = { label, icon, key: path };
      if (children && children.length > 0) {
        item.children = getMenuItems(permissions, children!);
      }

      menuItems.push(item);
    }
  });

  return menuItems;
}

/**
 * 获取用户访问权限集合
 * @param resourceTree
 * @returns
 */
export function getPermissions(resourceTree: any[]) {
  const stack = [...resourceTree];
  const menuMap = new Map<string, { name: string; path: string }>();

  while (stack.length) {
    const item = stack.shift();
    const { code, children, name, type, path } = item;
    let routePath = '';
    if (type === 1 || type === 2) routePath = code;
    if (type === 3) routePath = path;
    if (routePath) {
      menuMap.set(routePath, { path: routePath, name });
      let length = children?.length ?? 0;
      while (length--) {
        stack.unshift(children[length]);
      }
    }
  }

  return menuMap;
}

export type MenuItems = {
  key: string;
  label?: string;
  icon?: () => VNode;
  children?: MenuItems;
}[];

/**
 * 获取网站首页 URL
 * @param menuItems 菜单列表
 * @returns
 */
export function getHomeURL(menuItems: MenuItems) {
  if (!menuItems?.length) return null;

  const stack = [menuItems[0]];
  let firstItem = {} as MenuItems[number];
  while (stack.length) {
    firstItem = stack.shift()!;
    if (firstItem?.children?.length) stack.push(firstItem.children[0]);
  }

  return firstItem?.key ?? null;
}
