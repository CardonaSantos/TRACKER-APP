export const crmEndpoints = {
  auth: {
    login: "/auth/login-user",
  },
  users: {
    base: "/users",
    byId: (id: string | number) => `/users/${id}`,
  },
  tracking: {
    sendLocation: "/tracking/location",
  },
} as const;
