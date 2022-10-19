<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img src="./../assets/logo.png" />
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        text-color="#fff"
        background-color="#001529"
        router
        class="nav-menu"
        :collapse="isCollapse"
      >
        <tree-menu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon :size="20"
              ><component :is="isCollapse ? 'Expand' : 'Fold'"
            /></el-icon>
          </div>
          <div class="bread" style="margin-bottom: 6px">
            <BreadCrumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge
            class="notice"
            type="danger"
            :is-dot="noticeCount > 0 ? true : false"
          >
            <el-icon><Bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon :size="20"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱: {{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from './TreeMenu.vue'
import BreadCrumb from './BreadCrumb.vue'
export default {
  name: 'Home',
  components: {
    TreeMenu,
    BreadCrumb
  },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1)
    }
  },
  computed: {
    noticeCount() {
      return this.$store.state.noticeCount
    }
  },
  mounted() {
    this.getNoticeCount()
    this.getMenuList()
  },
  methods: {
    // 折叠meun侧边栏
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    handleLogout(key) {
      if (key === 'email') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = {}
      this.$router.push('/login')
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount()
        console.log(count)
        this.$store.commit('saveNoticeCount',count)
      } catch (error) {
        console.log(error)
      }
    },
    async getMenuList() {
      try {
        const {menuList,actionList} = await this.$api.getPermissionList()
        this.$store.commit('saveMenuList', menuList)
        this.$store.commit('saveActionList', actionList)
        this.userMenu = menuList
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    transition: width 0.5s;
    // overflow-y: auto;
    overflow: hidden;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
      text-indent: -999px;
    }
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        display: flex;
        align-items: center;
        .notice {
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
          margin-top: 6px;
        }
        .user-link {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #4093ff;
        }
      }
    }

    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>
