import axios from '@/utils/axios';
// 用户信息
export const queryUserInfo = () => axios.post('/v1.0/sysUser/info');

// 作业类型列表
export const queryWorkTypeList = () => axios.post('/v1.0/sysDict/type/list');
