<template>
  <div>
    <el-card>
      <el-button type="danger" @click="edit('add')">新增专题</el-button>
      <el-row style="margin-top: 10px">
        <el-col :span="currentLeftSize">
          <Table
            :columns="columns"
            :showPagination="true"
            :dataSource="tableData"
            :fetch="loadDataList"
            :options="tableOptions"
            @rowClick="rowClick"
          >
            <template #cover="{ row }">
              <Cover :cover="row.cover"></Cover>
            </template>
            <template #operation="{ row }">
              <div class="operation">
                <a href="javascript:void(0)" @click="edit('update', row)"
                  >修改</a
                >
                <el-divider direction="vertical"></el-divider>
                <a href="javascript:void(0)" @click="deleteCategory(row)"
                  >删除</a
                >
              </div>
            </template>
          </Table>
        </el-col>

        <el-col :span="24 - currentLeftSize">
          <div class="special-blog-tree">
            <el-tree
              class="tree-panel"
              ref="treeRef"
              :data="blogList"
              defaultExpandAll
              node-key="blogId"
              :expand-on-click-node="false"
              :props="treeProps"
              :highLight-current="true"
              draggable
              @node-drop="blogDrag"
            >
              <template #default="{ node, data }">
                <span class="custom-node-style">
                  <span class="node-title">{{ data.title }}</span>
                  <span class="node-op">
                    <template v-if="data.blogId == 0">
                      <a
                        class="alink"
                        href="javascript:void(0)"
                        @click="editBlog('add', data)"
                        >添加博客</a
                      ></template
                    >
                    <template v-else>
                  
                      <a
                        class="alink"
                        href="javascript:void(0)"
                        @click="editBlog('add', data)"
                        >新增下级文章</a
                      >
                    </template>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <Dialog
      :title="addBlogDialog.title"
      :buttons="addBlogDialog.buttons"
      :ifShow="addBlogDialog.ifShow"
      @close="addBlogDialog.ifShow = false"
    >
      <!-- 展示一个列表，使用elementplus组件，展示博客列表，提供多选框用于选择 -->
      <el-table
        :data="addBlogDialog.blogList"
        :show-checkbox="true"
        :style="{ width: '100%' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="blogId"
          label="博客ID"
          width="100"
        ></el-table-column>
      </el-table>
    </Dialog>
    <Dialog
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :ifShow="dialogConfig.ifShow"
      @close="dialogConfig.ifShow = false"
    >
      <el-form :rules="rules" ref="formDataRef" :model="formData">
        <el-form-item label="名称" prop="categoryName">
          <el-input
            placeholder="请输入专题名称"
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
  loadDataList: "/category/loadCategory4Special",
  saveCategory: "/category/saveCategory4Special",
  delCategory: "/category/delCategory4Special",
  getSpecialInfo: "/blog/getSpecialInfo",
  loadBlogList: "/blog/loadBlog",
  getBlogById: "/blog/getBlogById",
  addBlogToSpecial: "/blog/saveBlog4Special",
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
  extHeight: 100,
};
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList,
  });
  if (!result) {
    return;
  }
  Object.assign(tableData, result.data);
};
const currentLeftSize = ref(24);
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
            url: api.saveCategory,
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
  categoryName: [{ required: true, message: "请输入专题名称" }],
};
const edit = (type, value) => {
  if (type === "add") {
    dialogConfig.title = "新增专题";
    // 清空formdata
    Object.assign(formData, {
      blogCount: 0,
      categoryDesc: null,
      categoryId: null,
      categoryName: null,
      categoryType: 0,
      cover: null,
      firstBlogId: null,
      nickName: null,
      sort: 1,
      userId: null,
    });
  } else if (type === "update") {
    dialogConfig.title = "修改专题";
    Object.assign(formData, value);
    dialogConfig.cover = value.cover;
  }
  dialogConfig.ifShow = true;
};

const deleteCategory = async (row) => {
  proxy.Confirm(`确定删除专题"${row.categoryName}"吗？`, async () => {
    let result = await proxy.Request({
      url: api.delCategory,
      params: {
        categoryId: row.categoryId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
    proxy.Msg.success("操作成功");
    if (blogList.value) {
      if (blogList.value.length > 0) {
        if (row.categoryId === blogList.value[0].categoryId) {
          currentLeftSize.value = 24;
        }
      }
    }
  });
};
const delBlog = async (data) => {
  proxy.Confirm(`确定从该专题中移除博客"${data.title}"吗？`, async () => {
    let result = await proxy.Request({
      url: api.addBlogToSpecial,
      params: {
        blogId: data.blogId,

        blogType: 0,
      },
    });

    if (!result) {
      return;
    }
    loadBlogList(data.categoryId);
    proxy.Msg.success("操作成功");
  });
};
const rowClick = (row) => {
  loadBlogList(row.categoryId);
  addBlogDialog.categoryId = row.categoryId;
};
// 加载博客列表
const loadBlogList = async (categoryId) => {
  let result = await proxy.Request({
    url: api.getSpecialInfo,
    params: {
      categoryId: categoryId,
      showType: "1",
    },
  });

  if (!result) {
    return;
  }
  blogList.value = result.data;
  currentLeftSize.value = 12;
};
const blogList = ref([]);
const treeProps = {
  children: "children",
  label: "title",
  value: "blogId",
};
const blogDrag = (info) => {
  console.log(info);
};

const handleSelectionChange = (val) => {
  addBlogDialog.willAddblogList = val;
};
const addBlogDialog = reactive({
  title: "新增博客",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: async (e) => {
        // 新增博客
        console.log(addBlogDialog.willAddblogList);
        const willAddBlogItems = [];
        for (let i = 0; i < addBlogDialog.willAddblogList.length; i++) {
          const blogId = addBlogDialog.willAddblogList[i].blogId;
          const result = await proxy.Request({
            url: api.getBlogById,
            params: {
              blogId: blogId,
            },
          });
          if (!result) {
            continue;
          }
          willAddBlogItems.push(result.data);
        }
        for (let i = 0; i < willAddBlogItems.length; i++) {
          const blog = willAddBlogItems[i];
          const result = await proxy.Request({
            url: api.addBlogToSpecial,
            params: {
              pBlogId: addBlogDialog.pBlogId,
              blogId: blog.blogId,
              categoryId: addBlogDialog.categoryId,
              editorType: blog.editorType,
              title: blog.title,
              content: blog.content,
              markdownContent: blog.markdownContent,
            },
          });

          if (!result) {
            continue;
          }
        }

        addBlogDialog.ifShow = false;
        loadBlogList(addBlogDialog.categoryId);
        proxy.Msg.success("操作成功");
      },
    },
  ],
  ifShow: false,
});
const editBlog = async (type, data) => {
  if (type === "add") {
    // 新增博客
    addBlogDialog.ifShow = true;
    addBlogDialog.pBlogId = data.blogId;
    const result = await proxy.Request({
      url: api.loadBlogList,
    });
    if (!result) {
      return;
    }
    addBlogDialog.blogList = result.data.list;
  } else if (type === "edit") {
    // 修改博客
    proxy.Msg.success("修改博客");
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
.custom-node-style {
  display: flex;
  justify-content: space-between;
  flex: 1;
  a {
    text-decoration: none;
    color: cornflowerblue;
  }
}
</style>
