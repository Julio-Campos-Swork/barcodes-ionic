<template>
  <ion-header >
      <ion-toolbar color="primary">
          <ion-icon size="large" v-if="scanActive" class="ion-padding" slot="start" :icon="close" @click="emit('stopScan')"></ion-icon>
          <ion-button  slot="end" color="danger" size="small" shape="round" @click="userData.logOut()"><ion-icon :icon="logOut"></ion-icon></ion-button>
        <ion-title class="ion-text-center">{{ route.currentRoute.value.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserData } from '../stores/userData';
import { logOut, close } from "ionicons/icons";
const route = useRouter();
const userData = useUserData();
const props = defineProps({scanActive: Boolean})
const emit = defineEmits(["stopScan"]);


</script>

<style>

</style>