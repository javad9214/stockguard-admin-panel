<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px" style="background: #f5f7fa; padding: 20px;">
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/">Dashboard</el-menu-item>
        <el-menu-item index="/versions">Versions</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="background: #fff; border-bottom: 1px solid #eee; padding-left: 20px;">
        <h2>StockGuard Admin Panel</h2>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
</script>
