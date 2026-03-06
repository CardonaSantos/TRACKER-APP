import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Battery from "expo-battery";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, Text } from "react-native-paper";

export default function Perfil() {
  const [authData, setAuthData] = useState<any>(null);
  const [battery, setBattery] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const authDataString = await AsyncStorage.getItem("auth-storage");

      if (authDataString) {
        const parsedAuth = JSON.parse(authDataString);
        setAuthData(parsedAuth);
      }

      const batteryLevel = await Battery.getBatteryLevelAsync();
      setBattery(Math.round(batteryLevel * 100));
    } catch (error) {
      console.error("Error leyendo storage:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title="Datos del usuario (AsyncStorage)" />
        <Card.Content>
          <Text variant="titleMedium">Usuario</Text>
          <Text>ID: {authData?.user?.id ?? "No encontrado"}</Text>
          <Text>Nombre: {authData?.user?.nombre ?? "No encontrado"}</Text>
          <Text>Email: {authData?.user?.correo ?? "No encontrado"}</Text>

          <Text style={styles.section} variant="titleMedium">
            Auth
          </Text>
          <Text>
            Token: {authData?.token ? "Existe token" : "No encontrado"}
          </Text>

          <Text style={styles.section} variant="titleMedium">
            Dispositivo
          </Text>
          <Text>Batería: {battery ?? "Desconocido"}%</Text>

          <Text style={styles.section} variant="titleMedium">
            Raw Storage
          </Text>
          <Text selectable>{JSON.stringify(authData, null, 2)}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginTop: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
