<template>
  <ion-page>
    <Header :scanActive="useCamera.scanActive" @stopScan="useCamera.stopScan()" />
    <ion-content :fullscreen="true" v-if="!useCamera.scanActive">
      <ion-row class="ion-justify-content-center ion-padding">
        <ion-text color="tertiary">
          <h1>Buscar código de barras por producto</h1>
        </ion-text>
      </ion-row>

      <ion-row class="ion-justify-content-center ion-padding">
        <ion-item fill="outline">
          <ion-icon @click="startScan()" slot="start" :icon="camera"></ion-icon>
          <ion-icon
            @click="searchP(searchValue)"
            slot="end"
            :icon="searchCircle"
          ></ion-icon>
          <ion-input
            @click.right.prevent
            @keypress.enter="searchP(searchValue)"
            required
            maxlength="10"
            v-model="searchValue"
            placeholder="Ingresa código de producto"
          ></ion-input>
        </ion-item>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-icon
            v-if="searchValue != ''"
            color="danger"
            class="ion-padding"
            size="large"
            :icon="closeCircle"
            @click="resetSearch()"
          ></ion-icon>
        </ion-row>
      </ion-row>

      <ion-grid v-if="displayInfo">
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Producto</ion-label>
            <ion-input readonly v-model="useCodigos.datosProducto.ART_CODIGO"></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Familia</ion-label>
            <ion-input readonly v-model="useCodigos.datosProducto.FAM_NOMBRE"></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Linea</ion-label>
            <ion-input readonly v-model="useCodigos.datosProducto.LIN_NOMBRE"></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Descripcion</ion-label>
            <ion-textarea
              readonly
              v-model="useCodigos.datosProducto.ART_DESCRIPCION"
            ></ion-textarea>
          </ion-item>
        </ion-row>
      </ion-grid>
    </ion-content>
    <div class="cameraContainer" v-if="useCamera.scanActive">
      <div class="rectangulo"></div>
    </div>
  </ion-page>
</template>

<script setup>
import Header from "../components/Header.vue";
import { camera, searchCircle, closeCircle } from "ionicons/icons";
import { ref } from "vue";
import { useCodigosBusqueda } from "../stores/codigosBarraStore";
import { alertController } from "@ionic/vue";
import { useCameraScanner } from "../stores/cameraScanner";
const useCodigos = useCodigosBusqueda();
const searchValue = ref("");
const useCamera = useCameraScanner();
const displayInfo = ref(false);

/**
 *Toma el codigo de barras y llama al metodo de la Store
 * @param searchV - el codigo de barras. ya sea escaneado o introducido manualmente
 */
const searchP = async (searchV) => {
  await useCodigos.searchProducto(searchV);
  if (useCodigos.datosProducto != []) {
    displayInfo.value = true;
    useCamera.stopScan();
  }
  if (useCodigos.errorResp) {
    const alert = await alertController.create({
      header: "Atencion",
      message: useCodigos.errorResp,
      buttons: ["OK"],
    });
    await alert.present();
  }
};
/**
 *Invocamos al metodo de la store de scaneo y despues el de este componente
 * pasandole el resultado del scaneo
 */
const startScan = async () => {
  useCamera.scanResult = "";
  await useCamera.startScan();
  useCamera.scanResult != "" ? await searchP(useCamera.scanResult) : useCamera.stopScan();
};
/**
 *Devolvemos los valores a su estado original
 */
const resetSearch = () => {
  useCodigos.datosProducto = [];
  searchValue.value = "";
  useCodigos.errorResp = "";
  displayInfo.value = false;
};

// askUser();
</script>

<style scoped>
.cameraContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.rectangulo {
  width: 300px;
  height: 200px;
  border: 4px dashed white;
}
</style>
