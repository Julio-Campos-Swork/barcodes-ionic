<template>
    <ion-grid class="contenedor" :fixed="true">
      <ion-row class="ion-justify-content-center">
        <ion-col class="ion-align-self-center">
          <ion-card>
            <ion-card-header color="primary">
              <ion-card-title class="ion-text-center" color="white">Login</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item required class="margenitem">
                  <ion-input
                    type="email"
                    placeholder="Correo"
                    v-model="email"
                  ></ion-input>
                </ion-item>

                <ion-item class="margenitem">
                  <ion-input
                    required
                    type="password"
                    placeholder="Contraseña"
                    v-model="password"
                  ></ion-input>
                </ion-item>
              </ion-list>
              <ion-button expand="block" color="success" @click="login()"
                >Ingresar</ion-button
              >
              
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
</template>

<script setup>
import { ref } from "vue";
import { useUserData } from "../stores/userData";
import { loadingController } from "@ionic/vue";
const email = ref("aux2@gmail.com");
const password = ref("123456789");
const userData = useUserData();


const login = async () => {
  await userData.login(email.value, password.value);
  const loading = await loadingController.create({
    message: userData.respLogin,
    duration: 2500,
    spinner: "circles",
    backdropDismiss: true,
  });

  loading.present();
};
</script>

<style scoped>
.contenedor {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.subtitlecard {
  font-size: large;
}
.margenitem {
  margin-bottom: 15px;
}
</style>
