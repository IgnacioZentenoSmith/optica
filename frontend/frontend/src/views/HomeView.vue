<template>
  <div>
    <HelloWorld msg="Bienvenido"/>
    <img src="@/assets/logo1 - black over white.png" height="500" alt="">
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
