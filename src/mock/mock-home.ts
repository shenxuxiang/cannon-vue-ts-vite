import Mock from 'mockjs';

// 登录
Mock.mock('/v1.0/home-table-list', 'post', {
  code: 0,
  message: '操作成功',
  data: {
    list: [
      {
        id: '1',
        userName: '张十三',
        sex: 'man',
        age: 30,
        tel: '13333333333',
        profession: '电工',
      },
      {
        id: '2',
        userName: '王五',
        sex: 'man',
        age: 30,
        tel: '13945093333',
        profession: '演员',
      },
      {
        id: '3',
        userName: '小沈',
        sex: 'man',
        age: 30,
        tel: '18200010022',
        profession: '程序员',
      },
      {
        id: '4',
        userName: '张飞',
        sex: 'man',
        age: 33,
        tel: '17888889999',
        profession: '普通职工',
      },
      {
        id: '5',
        userName: '关于',
        sex: 'man',
        age: 34,
        tel: '18088227766',
        profession: '高级白领',
      },
    ],
    pageSize: 10,
    total: 100,
    pageNum: 1,
  },
});

Mock.mock('/v1.0/sysRole/page', 'post', {
  code: 0,
  message: '操作成功',
  data: {
    total: 4,
    list: [
      {
        createTime: '2023-09-06T15:08:25.74001',
        updateTime: '2023-11-06T16:15:37.526',
        deleted: false,
        roleId: '7912832241871364514',
        roleName: 'sxx',
        remark: 'sxx',
        status: 1,
        sort: 0,
        systemDefault: false,
        resourceIdList: [],
      },
      {
        createTime: '2023-08-30T08:39:27.551142',
        updateTime: '2023-08-30T08:39:36.59',
        deleted: false,
        roleId: '7891822292651483153',
        roleName: '赵大个',
        remark: '赵大个',
        status: 1,
        sort: 0,
        systemDefault: false,
        resourceIdList: [],
      },
      {
        createTime: '2023-08-23T13:54:27.98029',
        updateTime: '2023-08-23T13:54:27.98029',
        deleted: false,
        roleId: '7871620175240372533',
        roleName: '管理员',
        remark: '',
        status: 1,
        sort: 0,
        systemDefault: false,
        resourceIdList: [],
      },
      {
        createTime: '2023-08-16T03:19:05.762647',
        updateTime: '2023-08-23T09:07:51.773',
        deleted: false,
        roleId: '2',
        roleName: '机手',
        remark: '111',
        status: 1,
        sort: 2,
        systemDefault: true,
        resourceIdList: [],
      },
    ],
    pageNum: 1,
    pageSize: 10,
    size: 4,
    startRow: 1,
    endRow: 4,
    pages: 1,
    prePage: 0,
    nextPage: 0,
    isFirstPage: true,
    isLastPage: true,
    hasPreviousPage: false,
    hasNextPage: false,
    navigatePages: 8,
    navigatepageNums: [1],
    navigateFirstPage: 1,
    navigateLastPage: 1,
  },
});
