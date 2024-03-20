import * as api from '@/api/main';
import { defineStore } from 'pinia';
import { getLocalStorage } from '@/utils';

export default defineStore('mainStore', {
  state() {
    return {
      userInfo: getLocalStorage('USER_INFO') || {},
      workTypeList: [],
    };
  },
  actions: {
    async queryUserInfo() {
      const resp = await api.queryUserInfo();
      this.userInfo = resp.data || {};
      return resp;
    },
    async queryWorkTypeList() {
      const resp = await api.queryWorkTypeList();
      this.workTypeList = resp.data?.map?.((item: any) => ({ value: item.dictId, label: item.dictName })) ?? [];
      return resp;
    },
  },
});
