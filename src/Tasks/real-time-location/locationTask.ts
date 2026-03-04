import { sendLocationToServer } from "@/API/location";
import { getApiErrorMessageAxios } from "@/utils/useGetApiAxiosError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Battery from "expo-battery";
import * as TaskManager from "expo-task-manager";
import Toast from "react-native-toast-message";

export const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Error en la tarea de ubicación:", error);
    Toast.show({
      text1: getApiErrorMessageAxios(error),
      text2: "Error encontrado",
    });
    return;
  }

  if (data) {
    const { locations } = data as any;
    const location = locations[0];

    // 1. Leemos tu llave existente del AuthContext
    const authDataString = await AsyncStorage.getItem("auth-storage");

    if (authDataString) {
      // 2. Parseamos el JSON para volverlo un objeto usable
      const parsedAuth = JSON.parse(authDataString);

      // 3. Accedemos al usuario y luego al ID (justo como lo pensaste)
      const userId = parsedAuth.user?.id;

      if (userId) {
        const batteryLevel = await Battery.getBatteryLevelAsync();

        const payload = {
          usuarioId: userId, // Aquí usamos el ID extraído
          latitud: location.coords.latitude,
          longitud: location.coords.longitude,
          precision: location.coords.accuracy,
          velocidad: location.coords.speed || 0,
          bateria: Math.round(batteryLevel * 100),
        };

        // Enviamos al servidor
        await sendLocationToServer(payload);
      }
    }
  }
});
