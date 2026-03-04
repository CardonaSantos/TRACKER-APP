export const crmEndpoints = {
  auth: {
    login: "/auth/login-user",
  },
  users: {
    base: "/users",
    byId: (id: string | number) => `/users/${id}`,
  },
  profile: {
    byId: (id: string | number) => `/user/user-profile-info/${id}`,
  },
  tracking: {
    sendLocation: "/tracking/location",
  },
} as const;
