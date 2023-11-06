<script setup lang="ts">
import { queryWorkInfoPageList } from '@/services/workInfo';
import { ContentFormTable } from 'qm-vnit-vue';
import { Popconfirm } from 'ant-design-vue';
import { reactive, computed } from 'vue';
import { Button } from 'ant-design-vue';
import useMainStore from '@/store/main';
import { storeToRefs } from 'pinia';
import { isEmpty } from '@/utils';

const mainStore = useMainStore();
const { queryWorkTypeList } = mainStore;
const { workTypeList } = storeToRefs(mainStore);

isEmpty(workTypeList.value) && queryWorkTypeList();

// 数据
const state = reactive({
  pageSize: 10,
  pageNum: 1,
});

const columns = computed(() => [
  {
    dataIndex: 'index',
    title: '序号',
  },
  {
    dataIndex: 'userName',
    title: '姓名',
    formType: 'input',
  },
  {
    dataIndex: 'time',
    title: '查询时间',
    formType: 'rangePicker',
    visibleInTable: false,
    dataFormat: (values: any) => {
      return {
        startTime: values[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values[1].format('YYYY-MM-DD HH:mm:ss'),
      };
    },
  },
  {
    dataIndex: 'workType',
    title: '作业类型',
    formType: 'select',
    visibleInTable: false,
    options: workTypeList.value,
  },
  {
    title: '职业',
    dataIndex: 'profession',
  },
  {
    title: '联系方式',
    dataIndex: 'tel',
  },
  {
    title: '性别',
    dataIndex: 'sex',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '操作',
    dataIndex: 'workId',
  },
]);

function handlePaginationChange(pageNum: number, pageSize: number) {
  Object.assign(state, { pageNum, pageSize });
}
</script>

<template>
  <div class="page">
    <ContentFormTable
      rowKey="workId"
      submitButtonText="查询"
      :columns="columns"
      :queryTableList="queryWorkInfoPageList"
      @paginationChange="handlePaginationChange"
    >
      <template #bodyCell="{ column, index }">
        <template v-if="column.dataIndex === 'index'">
          {{ state.pageSize * (state.pageNum - 1) + index + 1 }}
        </template>

        <template v-if="column.dataIndex === 'workId'">
          <Popconfirm title="你确定要删除这行内容吗？">
            <Button danger type="link" style="margin-left: -16px">删除</Button>
          </Popconfirm>
          <Button type="link">编辑</Button>
        </template>
      </template>
    </ContentFormTable>
  </div>
</template>
