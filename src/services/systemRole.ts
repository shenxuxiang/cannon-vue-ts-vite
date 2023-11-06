import { axios } from '@/utils';

// 系统角色分页列表
export const queryRoleTableList = (query: any) => axios.post('/v1.0/sysRole/page', query);
