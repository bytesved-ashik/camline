import createApi from "../utils/axios";
import { METHODS } from "../enums/axios.enums";

const stripeAPi = createApi("/");

export const postTopupAmount = async (params: any) => {
  const { data } = await stripeAPi({
    url: "/database-script/add-balance-to-user",
    method: METHODS.POST,
    data: params,
  });

  return data;
};
