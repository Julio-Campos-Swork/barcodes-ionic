

<template>
 <ion-page>
  <Header :scanActive="useCamera.scanActive" @stopScan="useCamera.stopScan()" />
  <ion-content :fullscreen="true" v-if="!useCamera.scanActive">
    <ion-row class="ion-justify-content-center ion-padding">
        <ion-text color="tertiary">
          <h1>Escaneo de código QR</h1>
        </ion-text>
      </ion-row>

      <!-- inicio seccion de busqueda automatica por camara -->
      <ion-grid>
        <ion-row
          class="ion-justify-content-center ion-padding"
          v-if="!useCamera.scanActive"
        >
          <ion-icon
            class="tamañoBoton"
            @click="startCamera()"
            :icon="scanCircleOutline"
            color="primary"
          >
          </ion-icon >
        </ion-row>
      </ion-grid>
      
      <ion-grid v-if="useCodigos.qrCodeDataProd.totalProd != ''">
      <ion-row class="ion-justify-content-center ion-padding">
     
            <ion-item>
              <ion-label class="ion-text-right" position="floating">Total de Productos</ion-label>
              <ion-input
              class="ion-text-center"
                readonly
                v-model="useCodigos.qrCodeDataProd.totalProd"
              >
              </ion-input>
            </ion-item>
      
        </ion-row>

        <ion-row class="ion-justify-content-center ion-padding" >
          <ion-select
            placeholder="Productos en el paquete"
            interface="popover"
            @ionChange="selectProd($event.detail.value)"
          >
            <ion-select-option
              v-for="item in useCodigos.qrCodeDataProd.dataProd"
              :key="item.producto.ID_PROD"
              >{{ item.producto.ART_CODIGO }} - {{ item.cantidad }}</ion-select-option
            >
          </ion-select>
        </ion-row>
        
 <ion-grid v-if="activeP">

      <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Producto</ion-label>
            <ion-input readonly v-model="selectedProd.producto.ART_CODIGO"></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Cantidad</ion-label>
            <ion-input readonly v-model="selectedProd.cantidad"></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Linea</ion-label>
            <ion-input readonly v-model="selectedProd.producto.LIN_NOMBRE"></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Descripcion</ion-label>
            <ion-textarea
              readonly
              v-model="selectedProd.producto.ART_DESCRIPCION"
            ></ion-textarea>
          </ion-item>
        </ion-row> 
    </ion-grid>
</ion-grid>
    <ion-row class="ion-justify-content-center ion-padding" v-if="activeP">
        <ion-button color="danger" @click="reset()">Reiniciar</ion-button>
    </ion-row>
  </ion-content>
  <div class="cameraContainer" v-if="useCamera.scanActive">
      <div class="rectangulo"></div>
    </div>
 </ion-page>
</template>
<script setup>
import Header from '../components/Header.vue';
import { scanCircleOutline } from 'ionicons/icons';
import { useCodigosBusqueda } from '../stores/codigosBarraStore';
import { useCameraScanner } from '../stores/cameraScanner';
import {ref} from 'vue'
const useCodigos = useCodigosBusqueda();
const useCamera = useCameraScanner();
const selectedProd = ref([])
const activeP = ref(false)
const searchTemp = ref("")

/** 
*Iniciamos el metodo que activa el lector en nuestra store
**/
const startCamera = async () => {
    useCamera.scanResult = "";
    activeP.value = true;
  await useCamera.startScan();
  if(useCamera.scanResult != "") {
  await useCodigos.searchQRCode(useCamera.scanResult)
  useCamera.stopScan();
  }
  if(useCodigos.errorResp != "") await errorMsj()
}

/** 
*Al momento de selecionar un producto de nuestro "Select"
*Hacemos una busqueda para determinar si existe y mostrarlo en pantalla
@param productID = codigo del articulo del producto
**/

const selectProd = (productID) => {
let index = useCodigos.qrCodeDataProd.dataProd.findIndex((producto) => 
    producto.producto.ART_CODIGO == productID);
if(index != -1){
    selectedProd.value = useCodigos.qrCodeDataProd.dataProd[index]
    activeP.value = true;
}
else console.log("error, no esta el producto")
}

/** 
*Este método solo se invocará si tenemos error en la respuesta de la API
**/

const errorMsj = async () => {
   const loading = await loadingController.create({
    message: useCodigos.errorResp,
    duration: 2500,
    spinner: "circles",
    backdropDismiss: true,
  });

  loading.present();
};

/** 
*Regresamos nuestros valores a su estado inicial
**/
const reset = () => {
    
selectedProd.value = [];
activeP.value = false;
useCodigos.qrCodeDataProd.dataProd = [];
useCodigos.qrCodeDataProd.totalProd = "";
}
</script>

<style scoped>
.tamañoBoton {
  font-size: 100px;
}
.cameraContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.rectangulo {
  width: 250px;
  height: 250px;
  border: 4px dashed white;
}
</style>