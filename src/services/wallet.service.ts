import { IPagination } from "@/types/interfaces/pagination.interface";
import { ITransactionHistory } from "@/types/interfaces/transactionHistory.interface";
import { METHODS } from "src/enums/axios.enums";
import { IWalletBalanceResponse, IWalletTouupCheck } from "src/types/interfaces/wallet.interface";
import createApi from "src/utils/axios";

const walletApi = createApi("/wallet");

export const getWalletBalance = async (): Promise<IWalletBalanceResponse> => {
  const { data } = await walletApi.get("/balance");

  return data;
};

export const CheckTopup = async (): Promise<IWalletTouupCheck> => {
  const { data } = await walletApi.post("/check-topup");

  return data;
};

export const getWalletTransactions = async (pageParams?: {
  page?: number;
  limit?: number;
  sort?: string;
}): Promise<IPagination<ITransactionHistory>> => {
  const { data } = await walletApi({
    url: "/transactions",
    method: METHODS.GET,
    params: pageParams,
  });

  return data;
};
