 <template>
    <el-menu 
      active-text-color="#ffd04b"
      background-color="#545c64"
      text-color="#fff"
      default-active="/Home"
      :collapse="isCollapse"
      collaps-transition="false"
      style="height: 100vh;"
      router>
      <el-menu-item index="/Home">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>

      <el-menu-item index="/Navigation1">
        <el-icon><Soccer /></el-icon>
        <span>导航一</span>
      </el-menu-item>

      <el-menu-item index="/Navigation2">
        <el-icon><Football /></el-icon>
        <span>导航二</span>
      </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import { ElMenuItem } from 'element-plus';
import { House } from '@element-plus/icons-vue'
import { Football } from '@element-plus/icons-vue'
import { Soccer } from '@element-plus/icons-vue'

const isCollapse = false
</script>
 