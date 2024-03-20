import { toRefs } from 'vue';
import type { App, ToRefs } from 'vue';
import { reactive, watch } from 'vue';
import type { MenuItems } from '@/router';
import { getLocalStorage, isEmpty } from '@/utils';
import { getHomeURL, getPermissions, getMenuItems } from '@/router';

export type BasicContext = {
  homeURL: string | null;
  userMenuItems: MenuItems;
  userInfo: { [key: string]: any };
  userPermissions: Map<string, { name: string; path: string }>;
};

export type UpdateBasicContext = (value: Partial<BasicContext>) => void;

export type BasicContextType = {
  basicContext: ToRefs<BasicContext>;
  updateBasicContext: UpdateBasicContext;
};

export default function install(app: App) {
  const userInfo = getLocalStorage('USER_INFO') || {};
  const userPermissions = getPermissions(userInfo?.resourceTree ?? []);
  const userMenuItems = getMenuItems(userPermissions);
  const homeURL = getHomeURL(userMenuItems);

  const basic = reactive<BasicContext>({
    homeURL,
    userInfo,
    userMenuItems,
    userPermissions,
  });

  watch(
    () => basic.userInfo,
    () => {
      app.config.globalProperties.userButtonList = basic.userInfo.buttonNameList;
    },
    { immediate: true },
  );

  function updateBasicContext(context: Partial<BasicContext>) {
    const value = { ...context };
    if (!isEmpty(value.userInfo)) {
      value.userPermissions = getPermissions(value.userInfo?.resourceTree ?? []);
      value.userMenuItems = getMenuItems(value.userPermissions);
      value.homeURL = getHomeURL(value.userMenuItems);
    }

    Object.assign(basic, value);
  }

  app.provide('basicContext', { basicContext: toRefs(basic), updateBasicContext });
}
