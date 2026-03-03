import { useAuth } from "@/auth/auth-store";
import { useLogin } from "@/hooks/use-login/use-login";
import { getApiErrorMessageAxios } from "@/utils/useGetApiAxiosError";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

export interface login_form_type {
  correo: string;
  contrasena: string;
}

function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<login_form_type>({
    mode: "onBlur",
    defaultValues: {
      correo: "",
      contrasena: "",
    },
  });

  const loginRequest = useLogin();
  const { setAuth } = useAuth();

  const handleSubmitLogin = async (dto: login_form_type) => {
    try {
      const response = await loginRequest.mutateAsync(dto);

      await setAuth(response.access_token, response.user);

      Toast.show({
        type: "success",
        text1: `Bienvenido ${response.user.nombre}`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getApiErrorMessageAxios(error),
      });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: "bold", color: "red" }}>Correo:</Text>

      <Controller
        control={control}
        name="correo"
        rules={{
          required: "El correo es obligatorio",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Ingresa un correo válido",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Correo"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: errors.correo ? "red" : "black",
              marginBottom: 5,
            }}
          />
        )}
      />
      {errors.correo && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          {errors.correo.message}
        </Text>
      )}

      <Text style={{ fontWeight: "bold", marginTop: 10 }}>Contraseña:</Text>

      <Controller
        control={control}
        name="contrasena"
        rules={{
          required: "La contraseña es obligatoria",
          minLength: {
            value: 6,
            message: "Debe tener al menos 6 caracteres",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Contraseña"
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: errors.contrasena ? "red" : "black",
              marginBottom: 5,
            }}
          />
        )}
      />
      {errors.contrasena && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          {errors.contrasena.message}
        </Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title={loginRequest.isPending ? "Ingresando..." : "Ingresar"}
          onPress={handleSubmit(handleSubmitLogin)}
          disabled={loginRequest.isPending}
        />
      </View>
    </View>
  );
}

export default Login;
