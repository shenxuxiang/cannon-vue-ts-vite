import { defineStore } from 'pinia';
import { queryWorkTypeList } from '@/services';

export default defineStore('mainStore', {
  state() {
    return {
      workTypeList: [],
    };
  },
  actions: {
    queryWorkTypeList() {
      return queryWorkTypeList().then((response: any) => {
        this.workTypeList = response.data?.map?.((item: any) => ({ value: item.dictId, label: item.dictName })) ?? [];
      });
    },
  },
});
