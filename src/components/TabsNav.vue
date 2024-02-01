<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="buscarCB" href="/buscarCB">
          <ion-icon :icon="barcode" />
          <ion-label>Bacodes</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="generarQR" href="/generarQR">
          <ion-icon :icon="qrCode" />
          <ion-label>Generar QR</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="validarQR" href="/validarQR">
          <ion-icon :icon="qrCodeSharp" />
          <ion-label>Leer código QR</ion-label>
        </ion-tab-button>


      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup>
import { qrCode, qrCodeSharp, qrCodeOutline, barcode, home } from "ionicons/icons";
</script>
