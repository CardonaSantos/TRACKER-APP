export const loginQkeys = {
  all: ["crm"] as const,

  users: () => [...loginQkeys.all, "users"] as const,
  user: (id: string | number) => [...loginQkeys.users(), id] as const,

  tracking: () => [...loginQkeys.all, "tracking"] as const,
};
