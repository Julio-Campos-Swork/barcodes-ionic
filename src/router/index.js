/* eslint-disable comma-dangle */
import { createRouter, createWebHistory } from '@ionic/vue-router'
import HomeView from '../views/HomeView.vue'
import TabsNav from '../components/TabsNav.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/',
      component: TabsNav,
      children: [
        {
          path: '',
          redirect: '/home',
        },
        {
          path: 'home',
          name: 'Home',
          component: HomeView,
        },
        {
          path: 'buscarCB',
          name: 'Buscar Producto Codigo De Barras',
          component: () => import('../views/BuscarCodigoBarras.vue'),
        },
        {
          path: 'generarQR',
          name: 'Generador de Paquetes',
          component: () => import('../views/GenerarQR.vue'),
        },
        {
          path: 'validarQR',
          name: 'Validador De QR',
          component: () => import('../views/ValidarQR.vue'),
        },
      ],
    },
  ],
})

export default router
