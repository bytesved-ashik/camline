import createApi from "../utils/axios";
import { METHODS } from "../enums/axios.enums";
import { AxiosResponse } from "axios";
import { IPagination } from "@/types/interfaces/pagination.interface";
import { QueryRequestParam } from "@/types/interfaces/queryRequest.interface";
import { IInterestPost, IInterestResponse } from "@/types/interfaces/interest.interface";

const interestApi = createApi("/interest");

export const getInterest = async (params: QueryRequestParam) => {
  const { data }: AxiosResponse<IPagination<IInterestResponse>> = await interestApi({
    method: METHODS.GET,
    params: params,
  });

  return data;
};
export const sendInterest = async (body: IInterestPost) => {
  const { data } = await interestApi({
    method: METHODS.POST,
    data: body,
  });

  return data;
};
