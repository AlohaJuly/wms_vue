<template>
  <el-scrollbar class="main-scroll">
    <div class="toolbar">
      <el-input
        v-model="queryParam"
        placeholder="请输入姓名/账号搜索"
        clearable
        class="search-input"
        :suffix-icon="Search"
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      />
      <el-select v-model="sexFilter" class="sex-select">
        <el-option label="全部" value="all" />
        <el-option label="男" value="0" />
        <el-option label="女" value="1" />
      </el-select>
      <el-button type="primary" @click="handleSearch">查询</el-button>

      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>

    <el-table
      :data="tableData"
      v-loading="loading"
      class="main-table"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f5f5', color: '#333', fontWeight: 'bold' }"
      border
    >
      <el-table-column prop="id" label="ID" min-width="80" />
      <el-table-column prop="num" label="账号" min-width="150" />
      <el-table-column prop="name" label="姓名" min-width="160" />
      <el-table-column prop="age" label="年龄" min-width="90" />
      <el-table-column prop="sex" label="性别" min-width="90">
        <template #default="{ row }">
          <span class="sex-tag" :class="row.isMale ? 'sex-tag-male' : 'sex-tag-female'">
            {{ row.sex }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="roleLabel" label="角色" min-width="140">
        <template #default="{ row }">
          <span class="role-tag" :class="row.roleClass">
            {{ row.roleLabel }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" min-width="180" />
      <el-table-column label="操作" min-width="160">
        <template #default>
          <el-button size="small" type="primary">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 50]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      v-model="centerDialogVisible"
      title="新增用户"
      width="500"
      align-center="true"
      @closed="resetForm"
    >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" style="max-width: 500px">
      <el-form-item label="账号" prop="num">
        <el-col :span="20">
          <el-input v-model="form.num" />
        </el-col>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-col :span="20">
          <el-input v-model="form.password" type="password" show-password />
        </el-col>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-col :span="20">
          <el-input v-model="form.name" />
        </el-col>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-col :span="20">
          <el-input v-model="form.age" />
        </el-col>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio value="0">男</el-radio>
          <el-radio value="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-col :span="20">
          <el-input v-model="form.phone" />
        </el-col>
      </el-form-item>
    </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="save">
              确认
            </el-button>
          </div>
        </template>
    </el-dialog>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { nextTick, onMounted, reactive, ref } from "vue";

interface UserRow {
  id: number | string;
  num: string;
  name: string;
  age: number | string;
  sex: string;
  isMale: boolean;
  roleId: string;
  roleLabel: string;
  roleClass: string;
  phone: string;
}

const tableData = ref<UserRow[]>([]);
const loading = ref(false);
const total = ref(0);
const queryParam = ref("");
const sexFilter = ref<"all" | "0" | "1">("all");

const pageNum = ref(1);
const size = ref<ComponentSize>("default");
const pageSize = ref(5);
const background = ref(false);
const disabled = ref(false);

const centerDialogVisible = ref(false);
const formRef = ref<FormInstance>();

interface RuleForm {
  name: string;
  num: string;
  password: string;
  sex: "0" | "1";
  age: string;
  phone: string;
  roleId: string;
}

const createInitialForm = (): RuleForm => ({
  name: "",
  num: "",
  password: "",
  sex: "0",
  age: "",
  phone: "",
  roleId: "2",
});

const form = reactive<RuleForm>(createInitialForm());

const getRoleMeta = (roleId: string) => {
  if (roleId === "0") {
    return { roleLabel: "超级管理员", roleClass: "role-super-admin" };
  }
  if (roleId === "1") {
    return { roleLabel: "管理员", roleClass: "role-admin" };
  }
  if (roleId === "2") {
    return { roleLabel: "用户", roleClass: "role-user" };
  }
  return { roleLabel: roleId || "未知角色", roleClass: "role-user" };
};

const mapUserRow = (item: Record<string, any>): UserRow => {
  const roleValue = item.roleId ?? item.roleIds ?? item.roles ?? "";
  const roleId = Array.isArray(roleValue) ? String(roleValue[0] ?? "") : String(roleValue ?? "");
  const { roleLabel, roleClass } = getRoleMeta(roleId);

  const sexRaw = item.sex ?? item.gender;
  const sexRawStr = String(sexRaw ?? "").toLowerCase();
  const isMale =
    sexRawStr === "0" || sexRawStr === "male" || sexRawStr === "m" || String(sexRaw ?? "") === "男";

  const sex = String(sexRaw) === "1" ? "女" : String(sexRaw) === "0" ? "男" : String(sexRaw ?? "");

  return {
    id: item.id ?? "",
    num: String(item.num ?? item.account ?? item.username ?? ""),
    name: String(item.name ?? item.realName ?? ""),
    age: item.age ?? "",
    sex,
    isMale,
    roleId,
    roleLabel,
    roleClass,
    phone: String(item.phone ?? item.mobile ?? ""),
  };
};

const fetchUserList = async () => {
  loading.value = true;
  try {
    const param: Record<string, string> = {
      name: queryParam.value.trim(),
    };

    if (sexFilter.value !== "all") {
      param.sex = sexFilter.value;
    }

    const response = await axios.post("http://localhost:8090/user/querypage", {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      param,
      centerDialogVisible: false,
    });

    const payload = response.data;
    total.value = Number(payload?.total ?? 0);

    const rawList = payload?.data ?? [];
    const list = Array.isArray(rawList) ? rawList : [];
    tableData.value = list.map((item) => mapUserRow(item));
  } catch (error) {
    console.error("获取用户列表失败:", error);
    ElMessage.error("获取用户列表失败，请检查后端服务是否启动");
  } finally {
    loading.value = false;
  }
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  pageNum.value = 1;
  fetchUserList();
};

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  fetchUserList();
};

const handleSearch = () => {
  pageNum.value = 1;
  fetchUserList();
};

const handleAdd = () => {
  centerDialogVisible.value = true;
  nextTick(() => {
    resetForm();
  });
};

onMounted(() => {
  fetchUserList();
});

const resetForm = () => {
  Object.assign(form, createInitialForm());
  formRef.value?.clearValidate();
};

// 保存提交新增用户信息
const save = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
  } catch {
    ElMessage.warning("请先完善表单信息");
    return;
  }

  try {
    await axios.post("http://localhost:8090/user/save", { ...form });
    ElMessage.success("新增用户成功");
    centerDialogVisible.value = false;
    fetchUserList();
  } catch (error) {
    console.error("新增用户失败:", error);
    ElMessage.error("新增用户失败，请检查后端服务是否启动");
  }
};

const validateAge = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error("请输入年龄"));
    return;
  }

  if (!/^\d+$/.test(value)) {
    callback(new Error("年龄必须为整数"));
    return;
  }

  const ageNum = Number(value);
  if (ageNum < 1 || ageNum > 120) {
    callback(new Error("请输入 1-120 之间的年龄"));
    return;
  }

  callback();
};

const validateNumUnique = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (!value) {
    callback();
    return;
  }

  // Skip remote check when format is invalid; local rules will show the message.
  if (!/^[a-zA-Z0-9_]+$/.test(value) || value.length < 4 || value.length > 20) {
    callback();
    return;
  }

  const parseExistsValue = (payload: unknown): boolean => {
    if (typeof payload === "boolean") return payload;
    if (typeof payload === "number") return payload === 1;
    if (typeof payload === "string") {
      const text = payload.trim().toLowerCase();
      if (text === "true" || text === "1") return true;
      if (text === "false" || text === "0") return false;
      return false;
    }

    if (payload && typeof payload === "object") {
      const data = payload as Record<string, unknown>;
      const candidateKeys = ["data", "result", "exists", "isExist", "isExists", "value"];
      for (const key of candidateKeys) {
        if (key in data) return parseExistsValue(data[key]);
      }
    }

    return false;
  };

  axios
    .get("http://localhost:8090/user/checknum", { params: { num: value.trim() } })
    .then((response) => {
      const exists = parseExistsValue(response.data);
      if (exists) {
        callback(new Error("账号已存在，请更换"));
        return;
      }
      callback();
    })
    .catch((error) => {
      console.error("校验账号是否存在失败:", error);
      callback(new Error("账号校验失败，请稍后重试"));
    });
};

// 表单验证规则
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 20, message: "姓名长度应在 2-20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应在 6-20 个字符", trigger: "blur" },
    { pattern: /^\S+$/, message: "密码不能包含空格", trigger: "blur" },
  ],
  num: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 4, max: 20, message: "账号长度应在 4-20 个字符", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9_]+$/, message: "账号仅支持字母、数字和下划线", trigger: "blur" },
    { validator: validateNumUnique, trigger: "blur" },
  ],
  age: [
    { required: true, message: "请输入年龄", trigger: "blur" },
    { validator: validateAge, trigger: "blur" },
  ],
  sex: [
    { required: true, message: "请选择性别", trigger: "change" },
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号", trigger: "blur" },
  ],
});
</script>


<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  margin-left: 5px;
}

.search-input {
  width: 280px;
}

.search-input :deep(.el-input__wrapper) {
  height: 40px;
}

.search-input :deep(.el-input__inner) {
  height: 100%;
  line-height: 40px;
}

.search-input :deep(.el-input__suffix) {
  display: flex;
  align-items: center;
}

.sex-select {
  width: 120px;
}

.main-scroll {
  width: 100%;
}

.main-table {
  width: 100%;
}

.sex-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;
  line-height: 1.4;
}

.sex-tag-male {
  background-color: #409eff;
}

.sex-tag-female {
  background-color: #ff8dc7;
}

.role-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;
  line-height: 1.4;
}

.role-super-admin {
  background-color: #d81b60;
}

.role-admin {
  background-color: #f57c00;
}

.role-user {
  background-color: #43a047;
}
</style>
