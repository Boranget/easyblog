<template>
  <div>
    <div class="top-panel">
      <el-form
        :rules="searchFormRules"
        ref="searchFormDataRef"
        :model="searchFormData"
      >
        <el-row style="display: flex; justify-content: space-between">
          <div style="display:flex;flex:2;justify-content:space-between">
            <el-col :span="5" :style="{ 'margin-right': '30px' }">
              <el-form-item label="标题" prop="titleFuzzy">
                <el-input
                  placeholder="请输入标题关键字"
                  v-model="searchFormData.titleFuzzy"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" :style="{ 'margin-right': '30px' }">
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="searchFormData.status"
                  clearable
                  placeholder="请选择状态"
                >
                  <el-option label="草稿" value="0"></el-option>
                  <el-option label="已发布" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :style="{ 'margin-right': '50px' }">
              <el-form-item label="分类" prop="categoryId">
                <el-select
                  v-model="searchFormData.categoryId"
                  clearable
                  placeholder="请选择分类"
                >
                  <el-option
                    v-for="item in categoryList"
                    :key="item.categoryId"
                    :label="item.categoryName"
                    :value="item.categoryId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div style="display:flex; justify-content: flex-end; width : 500px" >
            <el-col :span="5" >
              <el-button type="danger" @click="loadDataList">搜索</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="danger" @click="showEditWindow('add', row)"
                >新增</el-button
              >
            </el-col>
          </div>
        </el-row>
      </el-form>
    </div>
    <div>
      <Table
        :columns="columns"
        :showPagination="true"
        :dataSource="tableData"
        :fetch="loadDataList"
        :options="tableOptions"
        class="table"
      >
        <template #cover="{ row }">
          <Cover :cover="row.cover"></Cover>
        </template>
        <template #blogInfo="{ row }">
          <div>标题：{{ row.title }}</div>
          <div>分类：{{ row.categoryName }}</div>
          <div>作者：{{ row.nickName }}</div>
        </template>
        <template #typeName="{ row }">
          <div>类型：{{ row.type == 1 ? "原创" : "转载" }}</div>
          <div v-if="row.type == 0">转载地址：{{ row.reprintUrl }}</div>
        </template>
        <template #statusName="{ row }">
          <span v-if="row.status == 1" :style="{ color: 'green' }">{{
            row.statusName
          }}</span>
          <span v-else :style="{ color: 'red' }">{{ row.statusName }}</span>
        </template>
        <template #time="{ row }">
          <div>创建时间：{{ row.createTime }}</div>
          <div>更新时间：{{ row.lastUpdateTime }}</div>
        </template>
        <template #operation="{ row }">
          <div class="operation">
            <a href="javascript:void(0)" @click="showEditWindow('update', row)"
              >修改</a
            >
            <el-divider direction="vertical"></el-divider>
            <a href="javascript:void(0)" @click="deleteBlog(row)">删除</a>
            <el-divider direction="vertical"></el-divider>
            <a href="javascript:void(0)" @click="previewBlog(row)">预览</a>
          </div>
        </template>
      </Table>
      <Window
        :buttons="windowConfig.buttons"
        :ifShow="windowConfig.ifShow"
        @init="windowConfig.init"
        @close="windowConfig.close"
        class="flow-window"
      >
        <div>
          <el-input
            class="title-input"
            placeholder="请输入标题"
            v-model="currentBlogData.title"
          ></el-input>
          <MarkDownEditor
            v-if="currentBlogData.editorType == 1"
            v-model="currentBlogData.markdownContent"
            :heightStr="editorConfig.heightStr"
            @setHtmlContent="editorConfig.setHtmlContent"
          ></MarkDownEditor>
          <HtmlEditor
            v-else
            v-model="currentBlogData.content"
            :heightStr="editorConfig.heightStr"
          ></HtmlEditor>
          <Dialog
            :title="dialogConfig.title"
            :buttons="dialogConfig.buttons"
            :ifShow="dialogConfig.ifShow"
            @close="dialogConfig.close"
            width="700px"
          >
            <el-form
              :rules="dialogFormRules"
              ref="dialogFormRef"
              :model="currentBlogData"
            >
              <el-form-item label="博客分类" prop="categoryId">
                <el-select
                  v-model="currentBlogData.categoryId"
                  clearable
                  placeholder="请选择分类"
                  :style="{ width: '100%' }"
                >
                  <el-option
                    :value="item.categoryId"
                    :label="item.categoryName"
                    v-for="item in categoryList"
                    :key="item.categoryId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="封面" prop="cover">
                <CoverUpload v-model="currentBlogData.cover"></CoverUpload>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-radio-group v-model="currentBlogData.type">
                  <el-radio :value="1">原创</el-radio>
                  <el-radio :value="0">转载</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="转载地址"
                prop="reprintUrl"
                v-if="currentBlogData.type == 0"
              >
                <el-input
                  v-model="currentBlogData.reprintUrl"
                  placeholder="请输入转载地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否允许评论" prop="allowComment">
                <el-radio-group v-model="currentBlogData.allowComment">
                  <el-radio :value="1">允许</el-radio>
                  <el-radio :value="0">禁止</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="摘要" prop="summary">
                <el-input
                  type="textarea"
                  v-model="currentBlogData.summary"
                  placeholder="请输入摘要"
                  :autosize="{ minRows: 4, maxRows: 4 }"
                ></el-input>
              </el-form-item>

              <el-form-item label="博客标签" style="align-items: center">
                <el-tag
                  closable="true"
                  @close="dialogConfig.tagSet.removeTag(index)"
                  style="margin-right: 10px"
                  v-for="(item, index) in currentBlogData.tag"
                  :key="item"
                  >{{ item }}</el-tag
                >
                <span
                  style="font-size: small; color: #999; line-height: 15px"
                  v-if="
                    currentBlogData.tag == 0 && !dialogConfig.tagSet.ifInput
                  "
                  >添加标签更容易被搜索引擎收录</span
                >
                <el-input
                  v-if="dialogConfig.tagSet.ifInput"
                  style="width: 100px"
                  v-model="dialogConfig.tagSet.cacheInput"
                  @keyup.enter="dialogConfig.tagSet.addTag"
                  @blur="dialogConfig.tagSet.addTag"
                ></el-input>
                <span
                  style="
                    margin: 0px 10px;
                    font-size: large;
                    color: cadetblue;
                    cursor: pointer;
                    line-height: 15px;
                  "
                  @click="dialogConfig.tagSet.ifInput = true"
                  >+</span
                >
              </el-form-item>
            </el-form>
          </Dialog>
        </div>
      </Window>
      <BlogPreviewWindow ref="BlogPreviewRef"></BlogPreviewWindow>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadCategory: "/category/loadAllCategory4Blog",
  loadBlogList: "/blog/loadBlog",
};
const searchFormRules = {};
const searchFormData = reactive({});
const searchFormDataRef = ref(null);
const categoryList = ref([]);
const loadCategoryList = async () => {
  let result = await proxy.Request({
    url: api.loadCategory,
  });
  categoryList.value = result.data;
};
const init = async () => {
  loadCategoryList();
};
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 80,
    scopedSlots: "cover",
  },
  {
    label: "文章信息",
    prop: "blogInfo",
    width: 300,
    scopedSlots: "blogInfo",
  },
  {
    label: "类型",
    prop: "typeName",
    width: 300,
    scopedSlots: "typeName",
  },
  {
    label: "编辑器类型",
    prop: "editorTypeName",
    width: 150,
  },
  {
    label: "评论",
    prop: "allowCommentTypeName",
    width: 100,
  },
  {
    label: "状态",
    prop: "statusName",
    width: 100,
    scopedSlots: "statusName",
  },
  {
    label: "时间",
    prop: "time",
    width: 300,
    scopedSlots: "time",
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
  extHeight: 50,
};
const loadDataList = async () => {
  let params = {
    pageNo: tableData.pageNo,
    pageSize: tableData.pageSize,
  };
  Object.assign(params, searchFormData);
  let result = await proxy.Request({
    url: api.loadBlogList,
    params: params,
  });
  if (!result) {
    return;
  }
  Object.assign(tableData, result.data);
};
const windowConfig = ref({
  ifShow: false,
  title: "新增文章",
  buttons: [
    {
      label: "保存",
      text: "保存",
      type: "danger",
      click: () => {
        if (!currentBlogData.title || currentBlogData.title.trim() == "") {
          proxy.Msg.error("请输入标题");
        } else {
          dialogConfig.ifShow = true;
        }
      },
    },
  ],
  init: async () => {},
  close: () => {
    console.log("关闭窗口");
    windowConfig.value.ifShow = false;
  },
});
const showEditWindow = async (type, data) => {
  if (type == "add") {
    let userInfo = await proxy.Request({
      url: "/getUserInfo",
    });
    if (!userInfo) {
      return;
    }
    
    Object.assign(currentBlogData, {
      blogId: null,
      title: "",
      tag: [],
      content: "",
      markdownContent: "",
      editorType: null,
      categoryId: null,
      cover: null,
    });
    currentBlogData.editorType = userInfo.data.editorType;
  } else {
    const result = await proxy.Request({
      url: "/blog/getBlogById",
      params: {
        blogId: data.blogId,
      },
    });
    if (!result) {
      return;
    }
    Object.assign(currentBlogData, result.data);
    currentBlogData.tag = currentBlogData.tag.split("|");
  }
  windowConfig.value.ifShow = true;
};

console.log(window.innerHeight);
const editorConfig = reactive({
  heightStr: computed(() => `${window.innerHeight - 150}px`), // 编辑器高度
  setHtmlContent: (html) => {
    currentBlogData.content = html;
  },
});
init();
const dialogFormRef = ref(null);
const dialogFormRules = {
  categoryId: [{ required: true, message: "请选择分类" }],
  type: [{ required: true, message: "请选择类型" }],
  reprintUrl: [{ required: true, message: "请输入转载地址" }],
  allowComment: [{ required: true, message: "请选择是否允许评论" }],
};

const currentBlogData = reactive({
  blogId: null,
  title: "",
  tag: [],
  content: "",
  markdownContent: "",
  editorType: null,
  categoryId: null,
  cover: null,
  summary: null,
  type: null,
  reprintUrl: null,
  allowComment: null,
});
const dialogConfig = reactive({
  title: "保存博客",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: () => {
        dialogFormRef.value.validate(async (valid) => {
          console.log(currentBlogData);
          if (!valid) {
            return;
          }
          const params = {
            blogId: currentBlogData.blogId,
            title: currentBlogData.title,
            content: currentBlogData.content,
            markdownContent: currentBlogData.markdownContent,
            editorType: currentBlogData.editorType,
            categoryId: currentBlogData.categoryId,
            cover: currentBlogData.cover,
            summary: currentBlogData.summary,
            tag: currentBlogData.tag.join("|"),
            type: currentBlogData.type,
            reprintUrl: currentBlogData.reprintUrl,
            allowComment: currentBlogData.allowComment,
          };

          const result = await proxy.Request({
            url: "/blog/saveBlog",
            params: params,
          });
          if (!result) {
            return;
          }

          proxy.Msg.success("保存成功");
          dialogConfig.close();
          windowConfig.value.ifShow = false;
          // 保存成功后清空表单数据
          Object.assign(currentBlogData, {
            blogId: null,
            title: "",
            tag: [],
            content: "",
            htmlContent: "",
            editorType: null,
            categoryId: null,
            cover: null,
          });
          loadDataList();
        });
      },
    },
  ],
  ifShow: false,
  tagSet: {
    ifInput: false,
    cacheInput: null,
    addTag: () => {
      if (
        dialogConfig.tagSet.cacheInput &&
        dialogConfig.tagSet.cacheInput.trim() != ""
      ) {
        var t = dialogConfig.tagSet.cacheInput.trim();
        if (!currentBlogData.tag.includes(t)) {
          currentBlogData.tag.push(t);
        }
        dialogConfig.tagSet.cacheInput = null;
        dialogConfig.tagSet.ifInput = false;
      }
    },
    removeTag: (index) => {
      currentBlogData.tag.splice(index, 1);
    },
  },
  close: () => {
    dialogConfig.ifShow = false;
    dialogConfig.tagSet.ifInput = false;
    dialogConfig.tagSet.cacheInput = null;
  },
});
const deleteBlog = async (data) => {
  proxy.Confirm(`确定删除文章"${data.title}"吗？`, async () => {
    let result = await proxy.Request({
      url: "/blog/recoveryBlog",
      params: {
        blogId: data.blogId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
    proxy.Msg.success("操作成功");
  });
};
const BlogPreviewRef = ref(null);
const previewBlog = (data) => {
  BlogPreviewRef.value.showDetail(data.blogId);
};
</script>

<style lang="scss">
.top-panel {
  padding-left: 10px;
}
.flow-window {
  .title-input {
    width: 100%;
    border-bottom: 1px solid #ddd;
    .el-input__wrapper {
      box-shadow: none;
      input {
        font-size: 18px;
      }
    }
  }
}
</style>
