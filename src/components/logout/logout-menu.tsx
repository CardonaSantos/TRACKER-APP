import { useAuth } from "@/auth/auth-store";
import { useGetProfileUser } from "@/hooks/use-user/use-user";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { ActivityIndicator, Avatar, Divider, Menu } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function UserMenu() {
  const [visible, setVisible] = useState(false);
  const { logout, user } = useAuth();

  // 1. Solo pedimos data si el ID existe realmente
  const { data, isLoading } = useGetProfileUser(user?.id);

  // 2. Definimos una imagen por defecto para evitar el undefined
  const defaultAvatar = "https://tu-servidor.com/default-avatar.png";

  // 3. Preparamos el source validando la existencia de la URL
  const avatarSource = data?.perfil?.avatar?.url
    ? { uri: data.perfil.avatar.url }
    : { uri: defaultAvatar };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleCloseSesion = () => {
    closeMenu();
    logout();

    Toast.show({
      type: "success",
      text1: `Sesion cerrada`,
    });
  };

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Pressable onPress={openMenu}>
            {isLoading ? (
              /* Opcional: Mostrar un loader pequeño mientras carga */
              <ActivityIndicator size="small" />
            ) : (
              <Avatar.Image
                size={24}
                source={avatarSource} // Ahora siempre es un objeto válido
              />
            )}
          </Pressable>
        }
      >
        <Menu.Item
          leadingIcon="account"
          onPress={() => {
            closeMenu();
            console.log("Perfil");
          }}
          title="Perfil"
        />

        <Menu.Item
          leadingIcon="cog"
          onPress={() => {
            closeMenu();
            console.log("Configuración");
          }}
          title="Configuración"
        />

        <Divider />

        <Menu.Item
          leadingIcon="logout"
          onPress={() => {
            handleCloseSesion();
          }}
          title="Cerrar sesión"
        />
      </Menu>
    </View>
  );
}
