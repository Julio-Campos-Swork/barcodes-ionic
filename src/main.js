import { createApp } from 'vue'
import * as IonComponents from '@ionic/vue';
import App from './AppTabs.vue'
import { defineCustomElements } from '@ionic/pwa-elements/loader';
// import './assets/main.css'
import { registerPlugins } from './plugins'

const app = createApp(App)

registerPlugins(app)
//auto importa los componentes de Ionic (opcional por que consume recursos)
Object.keys(IonComponents).forEach(key => {
    if (/^Ion[A-Z]\w+$/.test(key)) {
        app.component(key, IonComponents[key]);
    }
});
app.mount("#app");

export default async () => {
    await defineCustomElements(window);
}