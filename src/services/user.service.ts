import createApi from "../utils/axios";
import { METHODS } from "../enums/axios.enums";
import { IAccountDetails, IRejectRequest, Profile } from "@/types/interfaces/profile.interface";
import { IGetSessionsRequest, IReferalPayload } from "@/types/interfaces/sessionRequest.interface";

const sessionApi = createApi("/users");

export const getAccountDetails = async (): Promise<IAccountDetails[]> => {
  const { data } = await sessionApi({
    url: `/profile`,
    method: METHODS.GET,
  });

  return data;
};

export const rejectTherapist = async (details: IRejectRequest): Promise<any> => {
  const { data } = await sessionApi({
    url: `/reject`,
    method: METHODS.POST,
    data: details,
  });

  return data;
};

export const updateAccountDetails = async (details: Profile): Promise<any> => {
  const data = await sessionApi({
    url: `/update-profile`,
    method: METHODS.POST,
    data: details,
  });

  return data;
};

export const deactivateAccount = async (): Promise<any> => {
  const data = await sessionApi({
    url: `/deactivate-account`,
    method: METHODS.PATCH,
  });

  return data;
};

export const getProfilePic = async (userId: string) => {
  const data = await sessionApi({
    url: `/profile-image/${userId}`,
    method: METHODS.GET,

    responseType: "blob",
  });

  return data;
};

export const getTherapistUser = async () => {
  const data = await sessionApi({
    url: `/therapists`,
    method: METHODS.GET,
  });

  return data;
};

export const getFilterTherapistUser = async (filter: string, filterTherapist: string) => {
  let data: any;

  if (filter && filterTherapist) {
    data = await sessionApi({
      url: `/therapists-filter?q=${filterTherapist}&therapistListTabType=${filter}`,
      method: METHODS.GET,
    });
  } else if (filterTherapist) {
    data = await sessionApi({
      url: `/therapists-filter?q=${filterTherapist}`,
      method: METHODS.GET,
    });
  } else if (filter) {
    data = await sessionApi({
      url: `/therapists-filter?therapistListTabType=${filter}`,
      method: METHODS.GET,
    });
  }

  return data;
};

export const shortlistTherapist = async (therapistId: string): Promise<any> => {
  const data = await sessionApi({
    url: `/shortlistedTherapists`,
    method: METHODS.POST,
    data: { therapistId },
  });

  return data;
};

export const getAllUsers = async (filter: IGetSessionsRequest) => {
  const data = await sessionApi({
    url: `/user`,
    params: filter,
    method: METHODS.GET,
  });

  return data;
};

export const updateStatus = async (id: string, status: boolean) => {
  const data = await sessionApi({
    url: `/update-status/${id}`,
    data: { isActive: status },
    method: METHODS.PATCH,
  });

  return data;
};

export const getUserAccount = async (id: string) => {
  const data = await sessionApi({
    url: `/user-profile`,
    data: { userId: id },
    method: METHODS.POST,
  });

  return data;
};

export const closeAccount = async (id: string) => {
  const data = await sessionApi({
    url: `/close-account`,
    data: { userId: id },

    method: METHODS.POST,
  });

  return data;
};

export const getAllReferals = async () => {
  const data = await sessionApi({
    url: `/get-system-ref-code`,
    method: METHODS.GET,
  });

  return data;
};

export const AddReferals = async (payload: IReferalPayload) => {
  const data = await sessionApi({
    url: `/source-generated-referral-code`,
    data: { ...payload },

    method: METHODS.POST,
  });

  return data;
};
