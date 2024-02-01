/* eslint-disable comma-dangle */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CapacitorHttp } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'
export const useUserData = defineStore('userData', () => {
  // declaracion de las variables que se utilizan para login y que se exportaran
  const userData = ref({})
  const AuthToken = ref('')
  const BASE_URL = 'http://192.168.0.120/barcodesAPI/'
  // const BASE_URL = ref("https://lacasadelosalmuerzos.com/rest-api-local/reportes/android");
  const auth = ref(false)
  const IP = ref('')
  const city = ref('')
  const region = ref('')
  const respLogin = ref('')

  /**
   * Si el usuario tiene un token, configure el token y la autenticación en verdadero; de lo contrario,
   * configure userData en un objeto vacío, configure el token en una cadena vacía y configure la
   * autenticación en falso.
   */
  const validarSesion = async () => {
    const { value } = await Preferences.get({ key: 'AuthToken' })
    if (value) {
      AuthToken.value = value
      auth.value = true
    } else {
      userData.value = {}
      AuthToken.value = ''
      auth.value = false
    }
  }

  /**
   * Envía una solicitud POST al servidor con el correo electrónico y la contraseña del usuario, y el
   * servidor responde con un token si el usuario es válido.
   * </código>
   * @param email - correo electrónico
   * @param pass - "123456"
   */
  const login = async (email, pass) => {
    await getIP()
    const path = `${BASE_URL}login/validated/`
    const datos = new URLSearchParams()
    datos.append('email', email)
    datos.append('password', pass)
    datos.append('ip', IP.value)
    datos.append('pais', city.value)
    datos.append('region', region.value)
    const options = {
      url: path,
      headers: {
        // 'Content-Type': 'multipart/form-data; charset=utf-8; boundary='+ Math.random().toString().substr(2),
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json',
      },
      data: datos.toString(),
    }
    try {
      const resp = await CapacitorHttp.post(options)
      const data = JSON.parse(resp.data)
      console.log(data)
      if (data.res === 'OK') {
        if (data.token !== '') {
          userData.value = data

          // Guardamos en memoria el token
          await Preferences.set({
            key: 'AuthToken',
            value: data.token,
          })
          respLogin.value = 'Sesion Iniciada'
          await validarSesion()
        } else if (data.resU === 'Usuario Desactivado') {
          respLogin.value = 'Usuario Desactivado'
        } else if (data.token === '') {
          respLogin.value = 'Usuario o contraseña incorrectos'
        } else {
          respLogin.value = 'Error en el servidor'
        }
      }
    } catch (error) {
      console.log('Revise su conexión o comuníquese a soporte', error)
      respLogin.value = `Revise su conexión o comuníquese a soporte ${error}`
    }
  }

  /**
   * Realiza una solicitud a la API de ipapi.co y luego establece el valor de los campos de entrada de
   * IP, ciudad y región en los datos devueltos por la API.
   */
  const getIP = async () => {
    const options = {
      url: 'https://ipapi.co/json/',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const resp = await CapacitorHttp.get(options)
      IP.value = resp.data.ip
      city.value = resp.data.city
      region.value = resp.data.region
    } catch (error) {
      console.log(error)
    }
  }

  const logOut = async () => {
    await Preferences.remove({ key: 'AuthToken' })
    userData.value = {}
    AuthToken.value = ''
    auth.value = false
    IP.value = ''
    city.value = ''
    region.value = ''
    respLogin.value = ''
    await validarSesion()
  }
  return {
    logOut,
    userData,
    AuthToken,
    auth,
    validarSesion,
    respLogin,
    login,
    BASE_URL,
  }
})
