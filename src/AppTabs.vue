<template>
  <ion-app>
    <ion-router-outlet v-if="userData.auth"></ion-router-outlet>
    <LoginVue v-if="!userData.auth" /> 

  </ion-app>
</template>

<script setup>
import LoginVue from "./views/LoginPage.vue";
import { useUserData } from "./stores/userData";
const userData = useUserData();
const init = async () => {

  await userData.validarSesion();
}
init()
</script>

<style>
body.scanner-active {
  --background: transparent;
  --ion-background-color: transparent;
}
</style>
