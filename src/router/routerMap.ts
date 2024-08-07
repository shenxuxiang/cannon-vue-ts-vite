import { h } from 'vue';
import type { VNode } from 'vue';
import LazyLoader from '@/components/LazyLoader';
import type { RouteMeta, RouteComponent } from 'vue-router';
import { HomeOutlined, SettingOutlined, UserSwitchOutlined } from '@ant-design/icons-vue';

export type RouterItem = {
  name: string;
  path: string;
  label?: string;
  meta?: RouteMeta;
  icon?: () => VNode;
  children?: RouterItem[];
  component?: RouteComponent;
};

const routerMap: RouterItem[] = [
  {
    name: 'work-info',
    path: '/work-info',
    label: '作业信息',
    icon: () => h(HomeOutlined),
    meta: { requiresAuth: true },
    component: LazyLoader(() => import('../pages/workInfo.vue')),
  },
  {
    name: 'system',
    path: '/system',
    label: '系统管理',
    icon: () => h(SettingOutlined),
    children: [
      {
        name: 'system-role',
        path: '/system/role',
        label: '角色管理',
        icon: () => h(UserSwitchOutlined),
        meta: { requiresAuth: true },
        component: LazyLoader(() => import('../pages/system/role/index.vue')),
      },
      {
        name: 'system-user',
        path: '/system/user',
        label: '角色管理',
        icon: () => h(UserSwitchOutlined),
        meta: { requiresAuth: true },
        component: LazyLoader(() => import('../pages/system/user/index.vue')),
      },
    ],
  },
];

export default routerMap;
