import { IPagination } from "./pagination.interface";

export interface IWalletBalanceResponse {
  _id: string;
  mainBalance: number;
  bonusBalance: number;
  holdedMainBalance: number;
  holdedBonusBalance: number;
  freeTrialMinutes: number;
}

export type IWalletTransaction = {};

export type IWalletTransactionResponse = IPagination<IWalletTransaction>;

export type IWalletTouupCheck = {
  checkTopUpResult: boolean;
};
