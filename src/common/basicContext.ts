import type { MenuItems } from '@/router';
import type { App } from 'vue';
import { reactive } from 'vue';

export type BasicContext = {
  userInfo: any;
  userMenuItems: MenuItems;
  userPermissions: Map<string, { name: string; path: string }>;
};

export type UpdateBasicContext = (value: Partial<BasicContext>) => void;

export type BasicContextType = {
  basicContext: BasicContext;
  updateBasicContext: UpdateBasicContext;
};

export default function install(app: App) {
  const basic = reactive<BasicContext>({
    userInfo: {},
    userMenuItems: [],
    userPermissions: new Map(),
  });

  function updateBasicContext(context: Partial<BasicContext>) {
    Object.assign(basic, context);
  }

  app.provide('basicContext', { basicContext: basic, updateBasicContext });
}
