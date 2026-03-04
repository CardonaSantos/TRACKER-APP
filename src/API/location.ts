import axios from "axios";

export const sendLocationToServer = async (payload: any) => {
  try {
    await axios.post(
      `${process.env.EXPO_PUBLIC_CRM_API_URL}/real-time/update-location`,
      payload,
    );
    console.log("Ubicación enviada desde el fondo");
  } catch (error) {
    console.error("Error enviando ubicación:", error);
  }
};
