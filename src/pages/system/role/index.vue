<script setup lang="ts">
import { queryRoleTableList } from '@/services/systemRole';
import { Tag, Button, Popconfirm } from 'ant-design-vue';
import { ContentFormTable } from 'qm-vnit-vue';
import useMainStore from '@/store/main';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { isEmpty } from '@/utils';
import dayjs from 'dayjs';

const mainStore = useMainStore();
const { queryWorkTypeList } = mainStore;
const { workTypeList } = storeToRefs(mainStore);

isEmpty(workTypeList.value) && queryWorkTypeList();

const pageNum = ref(1);
const pageSize = ref(10);
const tableRef = ref<InstanceType<typeof ContentFormTable>>();

const columns = computed(() => [
  {
    title: '序号',
    dataIndex: 'roleId',
  },
  {
    title: '关键字搜索',
    dataIndex: 'keyword',
    formType: 'input',
    visibleInTable: false,
  },
  {
    dataIndex: 'workType',
    title: '作业类型',
    formType: 'select',
    visibleInTable: false,
    options: workTypeList.value,
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: {
      compare: (a: any, b: any) => a.status - b.status,
      multiple: 1,
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
  },
]);
</script>

<template>
  <ContentFormTable ref="tableRef" rowKey="roleId" :columns="columns" :queryTableList="queryRoleTableList">
    <template #extra>
      <Button type="primary" ghost>新增</Button>
    </template>

    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'roleId'">
        {{ (pageNum - 1) * pageSize + index + 1 }}
      </template>

      <template v-else-if="column.dataIndex === 'status'">
        <Tag v-if="record.status === 1" color="#87d068">启用</Tag>
        <Tag v-else color="#f50">禁用</Tag>
      </template>

      <template v-else-if="column.dataIndex === 'updateTime'">
        {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>

      <template v-else-if="column.dataIndex === 'action'">
        <Popconfirm
          :overlayStyle="{ width: '300px' }"
          title="角色删除后，关联该角色的用户将无权限使用系统，是否确定继续？"
        >
          <Button v-auth="'btn.Role.remove'" danger type="link"> 删除 </Button>
        </Popconfirm>

        <Button v-auth="'btn.Role.update'" type="link"> 编辑 </Button>
      </template>
    </template>
  </ContentFormTable>
</template>
