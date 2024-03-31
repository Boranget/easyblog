<template>
  <div>
    <el-button type="danger" @click="edit('add')">新增分类</el-button>
    <Table
      :columns="columns"
      :showPagination="false"
      :dataSource="tableData"
      :fetch="loadDataList"
      :options="tableOptions"
    >
      <template #cover="{ row }">
        <Cover :cover="row.cover"></Cover>
      </template>
      <template #operation="{ index, row }">
        <div class="operation">
          <a href="javascript:void(0)" @click="edit('update', row)">修改</a>
          <el-divider direction="vertical"></el-divider>
          <a href="javascript:void(0)" @click="deleteCategory(row)">删除</a>
          <el-divider direction="vertical"></el-divider>
          <a
            href="javascript:void(0)"
            :class="[index === 0 ? 'cannot' : '']"
            @click="move(index, (type = 'up'))"
            >上移</a
          >
          <el-divider direction="vertical"></el-divider>
          <a
            href="javascript:void(0)"
            :class="[index === tableData.list.length - 1 ? 'cannot' : '']"
            @click="move(index, (type = 'down'))"
            >下移</a
          >
        </div>
      </template>
    </Table>
    <Dialog
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :ifShow="dialogConfig.ifShow"
      @close="dialogConfig.ifShow = false"
    >
      <el-form :rules="rules" ref="formDataRef" :model="formData">
        <el-form-item label="名称" prop="categoryName">
          <el-input
            placeholder="请输入分类名称"
            v-model="formData.categoryName"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="categoryDesc">
          <el-input
            type="textarea"
            placeholder="请输入简介"
            :autosize="{ minRows: 4, maxRows: 4 }"
            v-model="formData.categoryDesc"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadDataList: "/category/loadAllCategory4Blog",
  addCategory: "/category/saveCategory4Blog",
  deleteCategory: "/category/delCategory4Blog",
  changeSort: "/category/changeCategorySort4Blog",
};
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 80,
    scopedSlots: "cover",
  },
  {
    label: "名称",
    prop: "categoryName",
    width: 150,
  },
  {
    label: "简介",
    prop: "categoryDesc",
  },
  {
    label: "博客数量",
    prop: "blogCount",
    width: 100,
  },
  {
    label: "操作",
    prop: "operation",
    width: 200,
    scopedSlots: "operation",
  },
];
const tableData = reactive({});
const tableOptions = {
  extHeight: 10,
};
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList,
  });
  if (!result) {
    return;
  }
  tableData.list = result.data;
};
const dialogConfig = reactive({
  title: "添加",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: async (e) => {
        formDataRef.value.validate(async (v) => {
          if (!v) {
            return;
          }
          let params = {};
          Object.assign(params, formData);
          let result = await proxy.Request({
            url: api.addCategory,
            params: params,
          });
          if (!result) {
            return;
          }
          dialogConfig.ifShow = false;
          loadDataList();
          proxy.Msg.success("操作成功");
        });
      },
    },
  ],
  ifShow: false,
});
const formDataRef = ref();
const formData = reactive({});
const rules = {
  categoryName: [{ required: true, message: "请输入分类名称" }],
};
const edit = (type, value) => {
  if (type === "add") {
    dialogConfig.title = "新增分类";
    // 清空formdata
    console.log(formData);
    Object.assign(formData, {
      blogCount: 0,
      categoryDesc: "",
      categoryId: null,
      categoryName: "",
      categoryType: 0,
      cover: null,
      firstBlogId: null,
      nickName: null,
      sort: 1,
      userId: null,
    });
  } else if (type === "update") {
    dialogConfig.title = "修改分类";
    Object.assign(formData, value);
    dialogConfig.cover = value.cover;
  }
  dialogConfig.ifShow = true;
};

const deleteCategory = async (row) => {
  proxy.Confirm(`确定删除分类"${row.categoryName}"吗？`, async () => {
    let result = await proxy.Request({
      url: api.deleteCategory,
      params: {
        categoryId: row.categoryId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
    proxy.Msg.success("操作成功");
  });
};
const move = async (index, type) => {
  if (
    (type === "up" && index > 0) ||
    (type === "down" && index < tableData.list.length - 1)
  ) {
    //判断是否可以移动
    let temp = tableData.list[index];
    let indexDiff = type === "up" ? -1 : 1;
    tableData.list.splice(index, 1);
    tableData.list.splice(index + indexDiff, 0, temp);
    let result = await proxy.Request({
      url: api.changeSort,
      dataType: "json",
      params: tableData.list,
    });
    if (!result) {
      return;
    }
    // loadDataList();
    proxy.Msg.success("操作成功");
  }
};
</script>

<style lang="scss">
.operation {
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    text-decoration: none;
    color: cornflowerblue;
  }
  // a被禁用时颜色变灰
  a.cannot {
    cursor: not-allowed;
    color: #ccc;
  }
}
</style>
