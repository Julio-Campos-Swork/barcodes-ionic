<template>
  <ion-page>
    <Header :scanActive="useCamera.scanActive" @stopScan="useCamera.stopScan()" />
    <ion-content :fullscreen="true" v-if="!useCamera.scanActive">
      <ion-row class="ion-justify-content-center ion-padding">
        <ion-text color="tertiary">
          <h1>Generar QR por paquete</h1>
        </ion-text>
      </ion-row>
      <ion-row class="ion-justify-content-center ion-padding">
        <!-- pestañas de segmentos -->
        <ion-segment color="primary" :scrollable="true">
          <ion-segment-button value="auto" @click="secciones('Auto')">
            <ion-label>Escaner</ion-label>
          </ion-segment-button>
          <ion-segment-button value="codigo" @click="secciones('Manual')">
            <ion-label>Ingreso Manual</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-row>

      <!-- inicio seccion de busqueda automatica por camara -->
      <ion-grid v-if="contentAuto">
        <ion-row
          class="ion-justify-content-center ion-padding"
          v-if="!useCamera.scanActive"
        >
          <ion-icon
            class="tamañoBoton"
            @click="startCamera('Auto')"
            :icon="scanCircleOutline"
            color="primary"
          >
          </ion-icon>
        </ion-row>
      </ion-grid>

      <!-- Seccion de busqueda por codigo NT -->
      <ion-grid v-if="contentCodigo">
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="outline">
            <ion-icon
              @click="startCamera('Manual')"
              slot="start"
              :icon="camera"
            ></ion-icon>
            <ion-input
              @keypress.enter="selectProd(searchValue)"
              @keyup="searchP(searchValue)"
              clear-input
              required
              v-model="searchValue"
              placeholder="Ingresa código de producto"
            ></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding" v-if="contentCodigo">
          <ion-select
            placeholder="Posibles productos"
            interface="popover"
            @ionChange="selectProd($event.detail.value)"
          >
            <ion-select-option
              v-for="item in useCodigos.posibleProd"
              :key="item.ID_PROD"
              >{{ item.ART_CODIGO }}</ion-select-option
            >
          </ion-select>
        </ion-row>
      </ion-grid>

      <ion-grid v-if="selected">
        <ion-row class="ion-justify-content-center ion-padding">
          <div style="width: 100px">
            <ion-item fill="outline">
              <ion-label position="floating">Cantidad</ion-label>
              <ion-input
                min="1"
                type="number"
                required
                placeholder="Cantidad"
                v-model="cantidad"
              >
              </ion-input>
            </ion-item>
          </div>
        </ion-row>

        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Articulo</ion-label>
            <ion-input readonly v-model="selectedProduct.ART_ID"></ion-input>
          </ion-item>
        </ion-row>

        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Producto</ion-label>
            <ion-input readonly v-model="selectedProduct.ART_CODIGO"></ion-input>
          </ion-item>
        </ion-row>

        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Descripcion</ion-label>
            <ion-textarea
              readonly
              v-model="selectedProduct.ART_DESCRIPCION"
            ></ion-textarea>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-button @click="agregarP()" color="success">Agregar Producto</ion-button>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-button @click="reset()" color="danger">Cancelar</ion-button>
        </ion-row>
      </ion-grid>

      <!-- fin de seccion busqueda por NT -->

      <!-- productos agregados -->
      <ion-grid class="ion-padding" v-if="contentProdFinal">
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-text color="primary" class="ion-justify-content-center">
            <h4>Lista de productos</h4>
          </ion-text>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-text color="dark" class="ion-justify-content-center">
            <p>
              Productos en el paquete:
              <span style="color: blue; font-size: 18px"
                >{{ finalDataProduct.length }}
              </span>
            </p>
          </ion-text>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-select
            interface="popover"
            placeholder="Productos agregados"
            @ionChange="showProductoFinal($event.detail.value)"
          >
            <ion-select-option
              v-for="producto in finalDataProduct"
              :key="producto.ID_PROD"
              >{{ producto.ART_CODIGO }}</ion-select-option
            >
          </ion-select>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">ID</ion-label>
            <ion-input readonly v-model="finalDataIndividual.ART_ID"></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Producto</ion-label>
            <ion-input readonly v-model="finalDataIndividual.LIN_NOMBRE"></ion-input>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-item fill="solid">
            <ion-label position="floating">Descripcion</ion-label>
            <ion-textarea
              readonly
              v-model="finalDataIndividual.ART_DESCRIPCION"
            ></ion-textarea>
          </ion-item>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-icon
            color="success"
            size="large"
            style="padding-top: 10px"
            :icon="addCircleOutline"
            @click="changeCantidad('sumar')"
          ></ion-icon>
          <div style="width: 100px">
            <ion-item>
              <ion-label position="floating">Cantidad</ion-label>
              <ion-input
                min="1"
                :size="2"
                required
                type="number"
                placeholder="Cantidad"
                v-model="finalDataIndividual.cantidad"
              >
              </ion-input>
            </ion-item>
          </div>
          <ion-icon
            style="padding-top: 10px"
            color="danger"
            size="large"
            :icon="removeCircleOutline"
            @click="changeCantidad('restar')"
          ></ion-icon>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <ion-button
            v-if="btnEliminar"
            class="ion-padding"
            @click="removeProduct(finalDataIndividual)"
            color="danger"
            >Eliminar Producto</ion-button
          >
          <ion-button class="ion-padding" @click="genStringQR()" color="primary"
            ><ion-icon class="ion-padding" :icon="qrCodeOutline"></ion-icon>Generar
            QR</ion-button
          >
        </ion-row>

        <ion-row class="ion-justify-content-center ion-padding" v-if="qrShow">
          <ion-icon
            class="ion-padding"
            color="success"
            size="large"
            @click="printQR()"
            :icon="printOutline"
          ></ion-icon>
          <ion-icon
            class="ion-padding"
            @click="resetImgQR()"
            color="danger"
            size="large"
            :icon="trashBinOutline"
          ></ion-icon>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding">
          <div id="qr_code"></div>
        </ion-row>

        <ion-row class="ion-justify-content-center ion-padding">
          <ion-button v-if="btnReset" @click="resetAll()" color="danger"
            >Reiniciar</ion-button
          >
        </ion-row>
      </ion-grid>
      <ion-button @click="clickF()">Click</ion-button>
    </ion-content>
    <div class="cameraContainer" v-if="useCamera.scanActive">
      <div class="rectangulo"></div>
    </div>
  </ion-page>
</template>

<script setup>
import printJS from "print-js";
import QRious from "qrious";
import Header from "../components/Header.vue";
import { ref } from "vue";
import { alertController } from "@ionic/vue";
import { useCodigosBusqueda } from "../stores/codigosBarraStore";
import { useCameraScanner } from "../stores/cameraScanner";
import {
  searchCircle,
  camera,
  addCircle,
  barcode,
  addCircleOutline,
  removeCircleOutline,
  qrCodeOutline,
  scanCircleOutline,
  printOutline,
  trashBinOutline,
  shareOutline,
} from "ionicons/icons";
import { loadingController } from "@ionic/vue";
const useCodigos = useCodigosBusqueda();
const useCamera = useCameraScanner();
const searchValue = ref("");
const cantidad = ref(1);
const selectedProduct = ref([]);
const selected = ref(false);
const contentCodigo = ref(false);
const contentAuto = ref(false);
const contentManual = ref(false);
const finalDataProduct = ref([]);
const contentProdFinal = ref(false);
const finalDataIndividual = ref([]);
const btnEliminar = ref(false);
const btnReset = ref(false);
const stringQR = ref("");
const handlerMessage = ref("");
/*
 ****Metodo para la barra navegadora de secciones
 ****controlamos la visualizacion de los grid
 */
const secciones = (tipo) => {
  switch (tipo) {
    case "Auto":
      contentCodigo.value = false;
      contentAuto.value = true;
      contentManual.value = false;
      break;
    case "Manual":
      contentCodigo.value = true;
      contentAuto.value = false;
      contentManual.value = false;
      break;
  }
};

/*
 ****Llamanos a la store para hacer la busqueda por caracteres 'productos/buscar/${val}/`
 ****En caso de obtener un error de la api se moestrara con el metodo 'errorMsj()'
 ****
 */
const searchP = async (valor) => {
  await useCodigos.searchPAuto(valor);
  if (useCodigos.errorResp) await errorMsj();
};

/*
 ****Metodo exclusivo para el auto completado
 ****Recibe el valor selecionado de nuestro "select" y lo
 ****reasignamos a "selectedProduct" para poder renderizarlo en pantalla
 ****
 */
const selectProd = async (valor) => {
  searchValue.value = valor;
  if (valor) {
    await useCodigos.searchPAuto(valor);
    selected.value = true;
    selectedProduct.value = useCodigos.posibleProd[0];
  }
};
/*
 ****Agregamos el producto con la cantidad de forma manual
 ****Se establece una busqueda, si existe, suma la cantidad
 ****Si no existe, agregamos, reiniciamos valores de busqeuda y cantidad
 ****
 */
const agregarP = () => {
  let index = finalDataProduct.value.findIndex(
    (prod) => prod.ID_PROD == selectedProduct.value.ID_PROD
  );
  if (index == -1) {
    selectedProduct.value.cantidad = cantidad.value;
    finalDataProduct.value.push(selectedProduct.value);
  } else {
    let cant = parseInt(finalDataProduct.value[index].cantidad);
    finalDataProduct.value[index].cantidad = cant + parseInt(cantidad.value);
  }
  reset();
  contentProdFinal.value = true;
  cantidad.value = 1;
  searchValue.value = "";
};

/*
      ****De nuestro productos agregados mostramos en pantalla el actual para poder manipularlo
      ****Damos la opcion de poder eliminar el producto

      ****
      */
const showProductoFinal = (codigo) => {
  let index = finalDataProduct.value.findIndex((prod) => prod.ART_CODIGO == codigo);
  finalDataIndividual.value = finalDataProduct.value[index];
  btnEliminar.value = true;
  btnReset.value = true;
};

/*
 ****Metodo exclusivo para el auto completado
 */
const reset = () => {
  cantidad.value = 1;
  searchValue.value = "";
  useCodigos.posibleProd = [];
  selectedProduct.value = [];
  selected.value = false;
};

/*
 ****Hacemos reset de los valores globales
 */
const resetAll = async () => {
  const alert = await alertController.create({
    header: "Atencion!",
    message: "Esta acción eliminara todos los datos en pantalla, no se puede revertir",
    buttons: [
      {
        text: "Cancelar",
        handler: () => {
          handlerMessage.value = "cancel";
        },
      },
      {
        text: "Confirmar",
        handler: () => {
          confirmReset();
        },
      },
    ],
  });

  await alert.present();
  // await confirmReset()
};
const confirmReset = async () => {
  resetImgQR();
  cantidad.value = 1;
  searchValue.value = "";
  useCodigos.posibleProd = [];
  selectedProduct.value = [];
  selected.value = false;
  finalDataIndividual.value = [];
  finalDataProduct.value = [];
  searchValue.value = "";
  contentProdFinal.value = false;
  btnReset.value = false;
  qrShow.value = false;
};

/*
      ****Metodo para agregar al nuestro array final
      
      */
const addProdAuto = (producto) => {
  let index = finalDataProduct.value.findIndex(
    (prod) => prod.ID_PROD == producto.ID_PROD
  );
  if (index == -1) {
    producto.cantidad = 1;
    finalDataProduct.value.push(producto);
  } else {
    let cant = parseInt(finalDataProduct.value[index].cantidad);
    finalDataProduct.value[index].cantidad = cant + 1;
  }
  contentProdFinal.value = true;
  btnReset.value = true;
};

/*
 ****Eliminar producto de la seleccion final
 ****finaldataIndividual se eliminara del array final y lo reseteamos
 ****Si no tenemos mas datos al momento de eliminar, no mostraremos nada en pantalla
 ****
 */
const removeProduct = (producto) => {
  let index = finalDataProduct.value.findIndex(
    (prod) => prod.ID_PROD == producto.ID_PROD
  );
  finalDataProduct.value.splice(index, 1);
  finalDataIndividual.value = [];
  btnEliminar.value = false;
  if (finalDataProduct.value.length == 0) {
    contentProdFinal.value = false;
    btnEliminar.value = false;
  }
};

/*
 *Con este metodo consultamos la API, agregamos producto de manera automatica
 */
const confirmAdd = ref(false);
const searchPAuto = async (codigo) => {
  //Si Hay valor llamanos a la Api, si no, error
  //Si no hay error en la respuesta asignamos datos
  if (codigo != "") {
    await useCodigos.searchBarcodeAuto(codigo);
    if (useCodigos.errorResp == "") {
      addProdAuto(useCodigos.barcodeAutoItem);
      confirmAdd.value = true;
    } else {
      await errorMsj(useCodigos.errorResp);
      confirmAdd.value = false;
    }
  } else {
    await errorMsj("Codigo no válido");
    confirmAdd.value = false;
  }
};

/*
 *Modificador de cantidad en el producto selecionado del paquete
 *Condiciones para no llegar a negativo
 *
 */
const changeCantidad = (operacion) => {
  if (operacion == "sumar") {
    if (finalDataIndividual.value.cantidad >= 1) finalDataIndividual.value.cantidad++;
  }
  if (operacion == "restar") {
    if (finalDataIndividual.value.cantidad != 1) finalDataIndividual.value.cantidad--;
  }
};

// metodo que crea el mensaje de error (en caso de haberlo)

const errorMsj = async (mensaje = "") => {
  // const mensaje = useCodigos.errorResp;
  let valor = "";
  mensaje ? (valor = mensaje) : (valor = useCodigos.errorResp);

  const loading = await loadingController.create({
    message: valor,
    duration: 2500,
    spinner: "circles",
    backdropDismiss: true,
  });

  loading.present();
  useCodigos.errorResp = "";
};

/*
 *3 metodos que funcionan para generar QR y la vista del mismo
 */
const qrShow = ref(false);
const genStringQR = async () => {
  resetImgQR();
  qrShow.value = true;
  finalDataProduct.value.forEach((prod) => {
    let n = prod.cantidad.toString();
    let countN = n.length;
    let ceros = 5 - countN;
    let cantidad = "";
    for (let index = 0; index < ceros; index++) {
      cantidad = `${cantidad}0`;
    }
    cantidad = `${cantidad}${n}`;
    cantidad = stringQR.value = `${stringQR.value}${prod.FAM_ID}${prod.LIN_ID}${prod.ART_ID}${cantidad}/`;
  });
  genImgQR();
};

/*
 *Metodo que genera la imagen QR
 */
const imagenQRShare = ref(null);
const genImgQR = () => {
  const qr = new QRious({
    element: document.getElementById("qr_code"),
    value: stringQR.value,
    background: "white",
    backgroundAlpha: 0.8,
    foreground: "black",
    foregroundAlpha: 0.8,
    level: "H",
    padding: 15,
    size: 240,
  });
};
//   const imagenData = qr.toDataURL("image/png", 1.0)
//   const image = new Image();
//   image.src = imagenData;
//   console.log("image", image)

//   const imageData = imagenData.split(",")[1];
//   const mimeType = "image/png";
//   const fileName = "qr.png";
//   const fileData = b64toBlob(imageData, mimeType);

//   const testFile = new FileReader();
//   testFile.readAsArrayBuffer(fileData)
//   console.log('testFile',testFile)

//   const fileUrl = URL.createObjectURL(fileData);
//   const file = [{name:fileName, data: fileUrl, mimeType: mimeType}]
//   imagenQRShare.value = file;
// };

// /*
// *Metodo auxiliar que convierte de base 64
// */
// const b64toBlob = (b64Data, mimeType) => {
// const byteCharacters = atob(b64Data);
//   const byteArrays = [];
//   for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
//     const slice = byteCharacters.slice(offset, offset + 1024);
//     const byteNumbers = new Array(slice.length);
//     for (let i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }
//     const byteArray = new Uint8Array(byteNumbers);
//     byteArrays.push(byteArray);
//   }
//   const blob = new Blob(byteArrays, { type: mimeType });
//   return blob;
// }

const resetImgQR = () => {
  let canvas = document.getElementById("qr_code");
  let contexto = canvas.getContext("2d");
  contexto.clearRect(0, 0, canvas.width, canvas.height);
  stringQR.value = "/";
  qrShow.value = false;
};

/*
 *Metodo auxiliar para comenzar el proceso de scaneo
 *En cada caso se iniciará el scanner y despues de asignar valor a
 *search.value iniciamos cada metodo de busqueda
 */
const startCamera = async (tipo) => {
  searchValue.value = "";
  switch (tipo) {
    case "Manual":
      await startScan();
      await searchP();
      break;
    case "Auto":
      await startScan();
      break;
  }
};

/*Scanner
 *Llamanos al metodo guardado en Pinia para scanear
 *
 */
const startScan = async () => {
  useCamera.scanResult = "";
  await useCamera.startScan();
  if (useCamera.scanResult != "") await searchPAuto(useCamera.scanResult);
  if (confirmAdd.value) {
    const resp = await continueScan();
    resp ? await startScan() : useCamera.stopScan();
  } else {
    useCamera.stopScan();
  }
};

/*
 *Metodo que nos confirma si vamos a continuar con el scaneo
 */

const btnConfirmarScan = ref(false);

const continueScan = async () => {
  const alert = await alertController.create({
    buttons: [
      {
        text: "Terminar",
        role: "cancelar",
        handler: () => {
          btnConfirmarScan.value = false;
        },
      },
      {
        text: "¿Escanear De Nuevo?",
        role: "confirm",
        handler: () => {
          btnConfirmarScan.value = true;
        },
      },
    ],
  });

  await alert.present();
  const { role } = await alert.onDidDismiss();
  if (role == "confirm") return true;
  else return false;
};

/*
 *metodo que permite imprimir desde el dispositvo movil
 */
const printQR = async () => {};

const clickF = () => {
  const resp = document.getElementById("qr_code");
  console.log(resp);
  // console.log(finalDataProduct.value.length)
  printJS({
    header: `--${finalDataProduct.value.length}--`,
    printable: resp,
    type: "html",
  });
};
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
  width: 350px;
  height: 200px;
  border: 5px dashed white;
}
</style>
