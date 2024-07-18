export interface ITransactionHistory {
  _id: string;
  type: string;
  amount: number;
  holdedMainBalance: number;
  holdedBonusBalance: number;
  holdedTrialMinutes: number;
  tid: string;
  user: string;
  remarks: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
