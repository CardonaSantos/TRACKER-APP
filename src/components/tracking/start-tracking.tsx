import { LOCATION_TASK_NAME } from "@/Tasks/real-time-location/locationTask";
import * as Location from "expo-location"; // ¡No olvides importar Location!
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { ActivityIndicator, Icon, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

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
    setIsLoading(true); // Iniciamos el spinner

    try {
      if (isTracking) {
        // --- APAGAR EL TRACKING ---
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        setIsTracking(false);
        Toast.show({ type: "info", text1: "Rastreo detenido" });
      } else {
        // --- ENCENDER EL TRACKING ---

        // A. Pedir permisos primero
        const { status: fgStatus } =
          await Location.requestForegroundPermissionsAsync();
        const { status: bgStatus } =
          await Location.requestBackgroundPermissionsAsync();

        if (fgStatus !== "granted" || bgStatus !== "granted") {
          Toast.show({
            type: "error",
            text1: "Se requieren permisos de ubicación",
          });
          setIsLoading(false);
          return; // Salimos de la función si no hay permisos
        }

        // B. Iniciar la tarea de fondo
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 15000,
          //   distanceInterval: 20,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Tracker Nova activo",
            notificationBody: "Compartiendo tu ubicación en tiempo real",
            notificationColor: "#FF0000",
          },
        });

        setIsTracking(true);
        Toast.show({ type: "success", text1: "Rastreo iniciado" });
      }
    } catch (error) {
      console.error("Error al cambiar estado de ubicación:", error);
      Toast.show({ type: "error", text1: "Error al iniciar el rastreo" });
    } finally {
      setIsLoading(false); // Apagamos el spinner sin importar si falló o fue exitoso
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
