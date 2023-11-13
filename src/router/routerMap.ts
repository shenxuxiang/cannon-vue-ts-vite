import type { VNode } from 'vue';
import { h } from 'vue';
import { isEmpty } from '@/utils';
import LazyLoader from '@/components/LazyLoader';
import type { RouteMeta, RouteComponent } from 'vue-router';
import { HomeOutlined, SettingOutlined, UserSwitchOutlined } from '@ant-design/icons-vue';

export type MenuItems = {
  key: string;
  label?: string;
  icon?: () => VNode;
  children?: MenuItems;
}[];

export type RouterItem = {
  name: string;
  path: string;
  label?: string;
  meta?: RouteMeta;
  icon?: () => VNode;
  children?: RouterItem[];
  component?: RouteComponent;
};

const iconStyle = 'font-size: 18px; margin-right: 10px';

const routerMap: RouterItem[] = [
  {
    name: 'work-info',
    path: '/work-info',
    label: '作业信息',
    icon: () => h(HomeOutlined, { style: iconStyle }),
    meta: { requiresAuth: true },
    component: LazyLoader(() => import('../pages/workInfo.vue')),
  },
  {
    name: 'system',
    path: '/system',
    label: '系统管理',
    icon: () => h(SettingOutlined, { style: iconStyle }),
    children: [
      {
        name: 'system-role',
        path: '/system/role',
        label: '角色管理',
        icon: () => h(UserSwitchOutlined, { style: iconStyle }),
        meta: { requiresAuth: true },
        component: LazyLoader(() => import('../pages/system/role/index.vue')),
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    meta: { requiresAuth: false },
    component: LazyLoader(() => import('../pages/404.vue')),
  },
];

export default routerMap;

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

/**
 * 找出菜单的第一项。
 * @param menuItems 用户菜单列表
 * @returns
 */
export function getHomePagePath(menuItems: MenuItems) {
  if (isEmpty(menuItems)) return null;

  const stack = [menuItems[0]];
  let firstItem = {} as (typeof menuItems)[number];
  while (stack.length) {
    firstItem = stack.shift()!;
    if (firstItem?.children?.length) stack.push(firstItem.children[0]);
  }

  return firstItem?.key ?? null;
}
