/* eslint-disable comma-dangle */
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useUserData } from './userData'
import { CapacitorHttp } from '@capacitor/core'
import { useCameraScanner } from './cameraScanner'
export const useCodigosBusqueda = defineStore('useCodigosBusqueda', () => {
  const useCamera = useCameraScanner()
  const userData = useUserData()
  const datosProducto = ref([])
  const errorResp = ref('')
  const posibleProd = ref([])
  const barcodeAutoItem = ref([])
  const qrCodeDataProd = reactive({ dataProd: [], totalProd: '' })
  /**
   * Toma un código de barras, lo envía al servidor y, si el servidor encuentra un producto con ese
   * código de barras, devuelve los datos del producto.
   * @param codigo - es el código de barras del producto
   */
  const searchProducto = async (codigo) => {
    errorResp.value = ''
    if (codigo !== '') {
      datosProducto.value = []
      const path = `${userData.BASE_URL}productos/buscarProd/`
      const datos = new URLSearchParams()
      datos.append('barcode', codigo)
      const options = {
        url: path,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: userData.AuthToken,
        },
        data: datos.toString(),
      }
      try {
        const resp = await CapacitorHttp.post(options)
        const data = JSON.parse(resp.data)
        console.log(data)
        if (data.status === 'OK') {
          datosProducto.value = data.res
        } else {
          errorResp.value = 'El Producto No existe'
        }
      } catch (error) {
        console.log(error)
        errorResp.value = 'Revisa tu conexión o comunicate con soporte'
      }
    } else {
      errorResp.value = 'El Id no es correcto!'
    }
  }

  /**
   * Busca un producto en la base de datos y devuelve una lista de posibles productos.
   * @param val - el valor del campo de entrada
   */
  const searchPAuto = async (val) => {
    errorResp.value = ''
    val = val == null ? '*' : val
    if (val !== '' && val.length > 1) {
      const path = `${userData.BASE_URL}productos/buscar/${val}/`
      const options = {
        url: path,
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: userData.AuthToken,
        },
      }
      try {
        const resp = await CapacitorHttp.get(options)
        const data = JSON.parse(resp.data)
        console.log(data)
        if (data.status === 'OK') {
          posibleProd.value = data.res
        } else {
          errorResp.value = 'El Producto No existe'
        }
      } catch (error) {
        console.log(error)
        errorResp.value = `Revisa tu conexión o comunicate con soporte ${error}`
      }
    } else {
      posibleProd.value = []
    }
  }

  /**
   * Toma un código de barras como parámetro y luego envía una solicitud posterior al servidor con el
   * código de barras como parámetro y luego devuelve la respuesta del servidor.
   * @param barcode - el código de barras que el usuario está escribiendo en la entrada
   */
  const searchBarcodeAuto = async (barcode) => {
    barcodeAutoItem.value = []
    errorResp.value = ''
    const path = `${userData.BASE_URL}productos/buscarProd/`
    const datos = new URLSearchParams()
    datos.append('barcode', barcode)
    const options = {
      url: path,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: userData.AuthToken,
      },
      data: datos.toString(),
    }
    try {
      const resp = await CapacitorHttp.post(options)
      const data = JSON.parse(resp.data)
      console.log(data)
      if (data.status === 'OK') {
        barcodeAutoItem.value = data.res
      } else {
        errorResp.value = 'El Producto No existe'
      }
    } catch (error) {
      console.log(error)
      errorResp.value = 'Revisa tu conexión o comunicate con soporte'
    }
  }

  /**
   * Es una función que realiza una solicitud de publicación a un servidor y, si la respuesta es
   * correcta, guarda la respuesta en una variable.
   * @param qrCode - el código QR que se escanea
   */
  const searchQRCode = async (qrCode) => {
    errorResp.value = ''
    const path = `${userData.BASE_URL}productos/searchQR/`
    const datos = new URLSearchParams()
    datos.append('codeQR', qrCode)

    const options = {
      url: path,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: userData.AuthToken,
      },
      data: datos.toString(),
    }
    try {
      const resp = await CapacitorHttp.post(options)
      const data = JSON.parse(resp.data)
      console.log('productos/searchQR/', data)
      if (data.status === 'OK') {
        qrCodeDataProd.dataProd = data.res
        qrCodeDataProd.totalProd = data.total
        useCamera.scanActive = false
      } else {
        errorResp.value = '¡Error!, Código QR invalido'
      }
    } catch (error) {
      console.log(error)
      errorResp.value = 'Revisa tu conexión o comunicate con soporte'
    }
  }

  return {
    qrCodeDataProd,
    searchProducto,
    datosProducto,
    errorResp,
    searchPAuto,
    posibleProd,
    barcodeAutoItem,
    searchBarcodeAuto,
    searchQRCode,
  }
})
