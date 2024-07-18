import {
  ILoginRequest,
  ILoginResponse,
  IRegisterResponse,
  ITherapistRegisterRequest,
  IUserRegisterRequest,
} from "src/types/interfaces/auth.interface";
import createApi from "src/utils/axios";
import { METHODS } from "src/enums/axios.enums";
import { AxiosResponse } from "axios";
import { UserData } from "src/types/interfaces/user.interface";
import { IResetPassword } from "@/types/interfaces/resetPassword.interface";
import { IChangePassword } from "@/types/interfaces/changePassword.interface";
import { IVerifyEmail } from "@/types/interfaces/verifyemail";

const authApi = createApi("/auth");

export const authLogin = async (loginRequest: ILoginRequest): Promise<ILoginResponse> => {
  const { data } = (await authApi({
    url: "/login",
    method: METHODS.POST,
    data: loginRequest,
  })) as AxiosResponse<ILoginResponse>;

  return data;
};

export const authRegister = async ({
  registerRequest,
  role,
}: {
  registerRequest: IUserRegisterRequest | ITherapistRegisterRequest;
  role: string;
}): Promise<IRegisterResponse> => {
  const { data } = (await authApi({
    url: `/${role}-register`,
    method: METHODS.POST,
    data: registerRequest,
  })) as AxiosResponse<IRegisterResponse>;

  return data;
};

export const getUserInfo = async (): Promise<UserData> => {
  const { data } = await authApi({
    url: "/me",
    method: METHODS.GET,
  });

  return data;
};

export const forgotPassword = async (email: string): Promise<any> => {
  const { data } = await authApi({
    url: "/forgot-password",
    method: METHODS.POST,
    data: { email },
  });

  return data;
};

export const resetPassword = async (params: IResetPassword): Promise<any> => {
  const { data } = await authApi({
    url: "/reset-password",
    method: METHODS.POST,
    data: params,
  });

  return data;
};

export const changePassword = async (params: IChangePassword): Promise<any> => {
  const { data } = await authApi({
    url: "/change-password",
    method: METHODS.POST,
    data: params,
  });

  return data;
};

export const verifyEmail = async (params: IVerifyEmail): Promise<any> => {
  const { data } = await authApi({
    url: "/new-verify-email",
    method: METHODS.POST,
    data: params,
  });

  return data;
};

export const resendEmail = async (id: string) => {
  const data = await authApi({
    url: `resend-verification-email`,
    data: { userId: id },
    method: METHODS.POST,
  });

  return data;
};
