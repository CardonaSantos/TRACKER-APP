import { LOCATION_TASK_NAME } from "@/Tasks/real-time-location/locationTask";
import * as Location from "expo-location"; // ¡No olvides importar Location!
import * as TaskManager from "expo-task-manager";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { ActivityIndicator, Icon, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
const TRACKING_MODES = {
  AHORRO: {
    label: "Ahorro",
    icon: "battery-leaf",
    timeInterval: 60000 * 5, // 5 minutos
    distanceInterval: 100, // 100 metros
    accuracy: Location.Accuracy.Balanced,
  },
  ESTANDAR: {
    label: "Estándar",
    icon: "Check",
    timeInterval: 60000, // 1 minuto
    distanceInterval: 30, // 30 metros
    accuracy: Location.Accuracy.High,
  },
  CRITICO: {
    label: "Preciso",
    icon: "target",
    timeInterval: 10000, // 10 segundos
    distanceInterval: 5, // 5 metros
    accuracy: Location.Accuracy.Highest,
  },
};
function StartTracking() {
  const { colors } = useTheme();

  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const jumpValue = useRef(new Animated.Value(0)).current;

  // 1. Verificar si ya estaba rastreando cuando se abre la app
  useEffect(() => {
    const checkStatus = async () => {
      const hasStarted =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      setIsTracking(hasStarted);
    };
    checkStatus();
  }, []);

  // 2. La función principal que se ejecuta al presionar el botón
  const handleToggleTracking = async () => {
    console.log("========== TRACK BUTTON PRESSED ==========");

    setIsLoading(true);

    try {
      console.log("STEP 1 → Checking task registration");

      const isRegistered =
        await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);

      console.log("TASK REGISTERED:", isRegistered);

      const hasStarted =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

      console.log("TASK ALREADY STARTED:", hasStarted);

      if (isTracking) {
        console.log("STEP 2 → Stopping tracking");

        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);

        console.log("STOP REQUEST SENT");

        setIsTracking(false);

        const started =
          await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

        console.log("TRACKING STATUS AFTER STOP:", started);

        Toast.show({ type: "info", text1: "Rastreo detenido" });
      } else {
        console.log("STEP 2 → Starting tracking");

        console.log("STEP 3 → Requesting permissions");

        const { status: fgStatus } =
          await Location.requestForegroundPermissionsAsync();

        console.log("FOREGROUND PERMISSION:", fgStatus);

        const { status: bgStatus } =
          await Location.requestBackgroundPermissionsAsync();

        console.log("BACKGROUND PERMISSION:", bgStatus);

        if (fgStatus !== "granted" || bgStatus !== "granted") {
          console.log("PERMISSION DENIED");

          Toast.show({
            type: "error",
            text1: "Se requieren permisos de ubicación",
          });

          setIsLoading(false);
          return;
        }

        console.log("STEP 4 → Starting background location updates");

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 60000,
          distanceInterval: 15,
          pausesUpdatesAutomatically: false,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Tracker Nova activo",
            notificationBody: "Compartiendo ubicación en tiempo real",
            notificationColor: "#FF0000",
          },
        });

        console.log("START LOCATION UPDATES REQUEST SENT");

        const started =
          await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

        console.log("TRACKING STATUS AFTER START:", started);

        const registeredTasks = await TaskManager.getRegisteredTasksAsync();

        console.log("REGISTERED TASKS:", registeredTasks);

        setIsTracking(true);

        Toast.show({ type: "success", text1: "Rastreo iniciado" });
      }
    } catch (error: any) {
      console.error("TRACKING TOGGLE ERROR:", error);
      console.error("TRACKING TOGGLE ERROR:", error);
      console.error("ERROR MESSAGE:", error?.message);
      console.error("ERROR CODE:", error?.code);

      Toast.show({
        type: "error",
        text1: "Error al iniciar el rastreo",
        text2: error?.message ?? "Ver consola", // ← Ver qué dice
      });
    } finally {
      console.log("========== TRACK BUTTON FLOW END ==========");

      setIsLoading(false);
    }
  };

  // 3. Lógica de animación (intacta)
  useEffect(() => {
    if (isTracking) {
      const jumpSequence = Animated.sequence([
        Animated.timing(jumpValue, {
          toValue: -15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(jumpValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]);
      Animated.loop(jumpSequence).start();
    } else {
      jumpValue.stopAnimation();
      jumpValue.setValue(0);
    }
  }, [isTracking, jumpValue]);

  return (
    <Pressable
      onPress={handleToggleTracking}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isTracking ? "transparent" : colors.primary,
          borderWidth: isTracking ? 2 : 0,
          borderColor: isTracking ? "#DC2626" : "transparent",
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator color={isTracking ? "#DC2626" : "#fff"} />
        ) : (
          <Animated.View style={{ transform: [{ translateY: jumpValue }] }}>
            <Icon
              source={
                isTracking ? "map-marker-radius-outline" : "map-marker-off"
              }
              size={42}
              color={isTracking ? "#DC2626" : "#fff"}
            />
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
}

const SIZE = 200;
const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StartTracking;
