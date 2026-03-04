import { useAuth } from "@/auth/auth-store";
import { useLogin } from "@/hooks/use-login/use-login";
import { getApiErrorMessageAxios } from "@/utils/useGetApiAxiosError";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="handled" // <-- ESTA ES LA MAGIA
        showsVerticalScrollIndicator={false}
      >
        {/* Logo y Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/log/logopngapk.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Iniciar Sesión</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          {/* Campo Correo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
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
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.input, errors.correo && styles.inputError]}
                />
              )}
            />
            {errors.correo && (
              <Text style={styles.errorText}>{errors.correo.message}</Text>
            )}
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
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
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  style={[styles.input, errors.contrasena && styles.inputError]}
                />
              )}
            />
            {errors.contrasena && (
              <Text style={styles.errorText}>{errors.contrasena.message}</Text>
            )}
          </View>

          {/* Botón de Submit */}
          <TouchableOpacity
            style={[
              styles.button,
              loginRequest.isPending && styles.buttonDisabled,
            ]}
            onPress={handleSubmit(handleSubmitLogin)}
            disabled={loginRequest.isPending}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loginRequest.isPending ? "Ingresando..." : "Ingresar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: "#4B5563",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;
