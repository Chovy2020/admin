<template>
  <div class="logo">
    <router-link :to="{name:'workplace'}">
      <!-- <LogoSvg alt="logo" /> -->
      <img src="@/assets/logo.33bdfa23.png" alt="" style="width: 60px; height: 22.8px;">
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: process.env.VUE_APP_PAGE_TITLE,
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
