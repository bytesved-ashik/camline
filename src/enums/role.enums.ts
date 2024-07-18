export const ROLE = {
  USER: "user",
  ADMIN: "admin",
  THERAPIST: "therapist",
} as const;

export type ROLE = typeof ROLE[keyof typeof ROLE];
