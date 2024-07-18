import { ROLE } from "@/enums/role.enums";

export type IInterestPost = {
  role: ROLE;
  name: string;
  email: string;
};
export type IInterestResponse = {
  _id: string;
  name: string;
  email: string;
  role: ROLE;
  createdAt: string;
  updatedAt: string;
};
