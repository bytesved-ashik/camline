import { IPagination } from "@/types/interfaces/pagination.interface";
import { ITransactionHistory } from "@/types/interfaces/transactionHistory.interface";
import { useQuery } from "react-query";
import { QueryKeyString } from "src/enums/queryKey.enums";
import { getWalletTransactions } from "src/services/wallet.service";
import * as toast from "src/utils/toast";

type PageParams = {
  sort: string;
  page: number;
};
export default function useTransactionHistory({ sort, page }: PageParams) {
  const limit = 5;
  const { data, refetch } = useQuery<IPagination<ITransactionHistory>>(
    [QueryKeyString.TRANSACTION_HISTORY_DATA, sort, page, limit],
    async () => getWalletTransactions({ sort, page, limit }),
    {
      onError: () => {
        toast.error("Error fetching transaction history");
      },
    }
  );

  return { transactions: data, refetch };
}
