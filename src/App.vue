<template>
  <ion-app>
    <!-- menu desplegable -->
    <ion-menu v-if="!userData.auth" side="start" contentId="main">
      <ion-header>
        <ion-toolbar color="primary" >
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-menu-toggle>
            <ion-item routerLink="/" router-direction="root">
              <ion-icon :icon="home" slot="start"></ion-icon>
              <ion-label>Home</ion-label>
            </ion-item>
            <ion-item routerLink="/buscarCB" router-direction="root">
              <ion-icon :icon="barcode" slot="start"></ion-icon>
              <ion-label>VALIDAR BARCODE</ion-label>
            </ion-item>
            <ion-item routerLink="/generarQR" router-direction="root">
              <ion-icon :icon="qrCode" slot="start"></ion-icon>
              <ion-label>GENERAR QR</ion-label>
            </ion-item>
            <ion-item routerLink="/validarQR" router-direction="root">
              <ion-icon :icon="qrCodeOutline" slot="start"></ion-icon>
              <ion-label>VALIDAR QR</ion-label>
            </ion-item>
            <ion-item routerLink="/validarmultipleQR" router-direction="root">
              <ion-icon :icon="qrCodeSharp" slot="start"></ion-icon>
              <ion-label>VALIDAR QR MULTIPLE</ion-label>
            </ion-item>
          </ion-menu-toggle>
        </ion-list>
      </ion-content>
      <ion-button expand="block" color="danger" @click="logout()"
        >Cerrar Sesion</ion-button
      >
    </ion-menu>
    <ion-router-outlet v-if="!userData.auth" id="main" />
    <!-- <LoginVue v-if="!userData.auth" /> -->
  </ion-app>
</template>

<script setup>
import LoginVue from "./views/Login.vue";
import { useUserData } from "./stores/userData";
import { qrCode, qrCodeSharp, qrCodeOutline, barcode, home } from "ionicons/icons";

const userData = useUserData();
userData.validarSesion();
const logout = () => {
  localStorage.clear();
  userData.validarSesion();
};
const init = () => {
localStorage.clear()

}
init()
</script>

<style>
body.scanner-active {
  --background: transparent;
  --ion-background-color: transparent;
}
</style>
