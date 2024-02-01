// se agregago esta linea
import { IonicVue } from "@ionic/vue";

// se agregago esta linea
import "@ionic/vue/css/core.css";

// se agregaron este conjunto de lineas
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

// se agregaron este conjunto de lineas
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";


import { createPinia } from 'pinia'
import router from '../router'


export function registerPlugins (app) {

app.
use(createPinia())
.use(IonicVue)
.use(router)
}