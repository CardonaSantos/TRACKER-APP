import { sendLocationToServer } from "@/API/location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Battery from "expo-battery";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  console.log("========== BACKGROUND TASK EXECUTION ==========");

  if (error) {
    console.error("BACKGROUND TASK ERROR:", error);
    return;
  }

  console.log("TASK EVENT RECEIVED");

  if (data) {
    console.log("LOCATION DATA RECEIVED FROM SYSTEM");

    const { locations } = data as any;

    console.log("LOCATIONS ARRAY LENGTH:", locations?.length);

    const location = locations[0];

    console.log("LAT:", location.coords.latitude);
    console.log("LNG:", location.coords.longitude);
    console.log("ACCURACY:", location.coords.accuracy);
    console.log("SPEED:", location.coords.speed);
    console.log("TIMESTAMP:", location.timestamp);

    console.log("STEP → Reading auth storage");

    const authDataString = await AsyncStorage.getItem("auth-storage");

    console.log("AUTH STORAGE EXISTS:", !!authDataString);

    if (authDataString) {
      const parsedAuth = JSON.parse(authDataString);

      const userId = parsedAuth.user?.id;

      console.log("USER ID FOUND:", userId);

      if (userId) {
        console.log("STEP → Reading battery level");

        const batteryLevel = await Battery.getBatteryLevelAsync();

        console.log("BATTERY LEVEL:", batteryLevel);

        const payload = {
          usuarioId: userId,
          latitud: location.coords.latitude,
          longitud: location.coords.longitude,
          precision: location.coords.accuracy,
          velocidad: location.coords.speed || 0,
          bateria: Math.round(batteryLevel * 100),
        };

        console.log("PAYLOAD PREPARED:", payload);

        console.log("STEP → Sending location to server");

        await sendLocationToServer(payload);

        console.log("LOCATION SENT TO SERVER");
      } else {
        console.log("USER ID NOT FOUND IN AUTH STORAGE");
      }
    } else {
      console.log("AUTH STORAGE NOT FOUND");
    }
  }

  console.log("========== BACKGROUND TASK END ==========");
});
