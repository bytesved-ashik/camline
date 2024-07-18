import { QueryKeyString } from "src/enums/queryKey.enums";
import { IGetSessionsRequest, IGetUpcomingSession } from "@/types/interfaces/sessionRequest.interface";
import { useInfiniteQuery } from "react-query";
import { getConnected } from "@/services/sessions.service";

export default function useCallLogsPage(params?: IGetSessionsRequest) {
  const fetchSessionHistory = async ({ page = 1, ...queryParam }: IGetUpcomingSession) => {
    const data = await getConnected({ page, ...queryParam });

    return {
      results: data.docs,
      nextPage: data.nextPage,
      totalPages: data.totalPages,
    };
  };

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery(
    [QueryKeyString.SESSION_HISTORY_DATA, params],
    ({ pageParam }) => fetchSessionHistory({ ...params, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  return { data, isLoading, hasNextPage, fetchNextPage };
}
