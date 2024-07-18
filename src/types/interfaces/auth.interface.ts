import { ROLE } from "@/enums/role.enums";
import { IQuestionAnswered } from "./authQuestions.interface";

export interface ILoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    roles: Array<string>;
    status: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    id: string;
    role: ROLE;
  };
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  roles: ROLE[];
  categories?: string[];
  questions?: IQuestionAnswered[];
  referralCode?: string;
  VATNumber?: string;
  bio?: string;
}

export interface ITherapistRegisterRequest extends IRegisterRequest {
  perSessionPrice?: number;
  profilePicture?: string;
  medias?: ITherapistMediaUploadRequest[];
  therapistAvailability?: ITherapistAvailability;
}

export interface ITherapistAvailability {
  is24HoursAvailable: boolean;
  availability: IAvaibilityTime[];
  userId?: string;
}

export interface IAvaibilityTime {
  dayInString: string;
  startDate: string | null;
  endDate: string | null;
}

export interface ITherapistMediaUploadRequest {
  type: string;
  mediaId: string[];
}
export interface IUserRegisterRequest extends IRegisterRequest {
  budget?: number;
}

export interface IRegisterResponse {
  message: string;
}
