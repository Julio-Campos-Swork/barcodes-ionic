import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'

export const useCameraScanner = defineStore('useCameraScan', () => {
  const scanResult = ref('')
  const scanActive = ref(false)

  /**
   * Comprueba si el usuario ha otorgado permiso para usar la cámara. Si el usuario no ha otorgado
   * permiso, solicitará permiso
   * @returns Un valor booleano.
   */
  const checkPermission = async () => {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true })
      if (status.granted) return true // the user granted permission
      return false
    } catch (e) {
      console.log(e)
      return false
    }
  }
  /**
   * "Si el usuario tiene permiso para usar la cámara, la cámara se activará y el usuario podrá
   * escanear un código de barras. Si el usuario escanea un código de barras, este se mostrará en el
   * campo de entrada. Si el usuario no no escanee un código de barras, la cámara se desactivará".
   * </código>
   * @returns El resultado es una cadena.
   */
  const startScan = async () => {
    scanActive.value = true
    try {
      const permission = await checkPermission()
      if (!permission) return
      await BarcodeScanner.hideBackground()
      document.querySelector('body').classList.add('scanner-active')
      const result = await BarcodeScanner.startScan()
      result?.hasContent ? (scanResult.value = result.content) : stopScan()
      // Si no se presiona el boton cerrar continuara scaneando y agregando productos
    } catch (e) {
      console.log(e)
      stopScan()
    }
  }
  /**
   * Si la variable scanActive es verdadera, detenga la exploración y elimine la clase scanner-active
   * del elemento del cuerpo.
   */
  const stopScan = () => {
    scanActive.value = false
    BarcodeScanner.showBackground()
    BarcodeScanner.stopScan()
    document.querySelector('body').classList.remove('scanner-active')
  }

  return { scanResult, scanActive, startScan, stopScan }
})
