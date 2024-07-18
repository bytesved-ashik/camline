import { QueryKeyString } from "src/enums/queryKey.enums";
import { IGetSessionsRequest, IGetUpcomingSession } from "@/types/interfaces/sessionRequest.interface";
import { useInfiniteQuery } from "react-query";
import { getRequestInPool } from "@/services/session.service";

export default function RequestInPool(params?: IGetSessionsRequest) {
  const fetchSessionHistory = async ({ page = 1, ...queryParam }: IGetUpcomingSession) => {
    const userData: any = await getRequestInPool({ page, ...queryParam });

    return {
      results: userData.docs,
      nextPage: userData.nextPage,
      totalPages: userData.totalPages,
    };
  };

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery<any>(
    [QueryKeyString.SESSION_HISTORY_DATA, params],
    ({ pageParam }) => fetchSessionHistory({ ...params, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  return {
    customUserData: data,
    customIsLoading: isLoading,
    customHasNextPage: hasNextPage,
    customFetchNextPage: fetchNextPage,
  };
}
