import { getSessions } from "src/services/sessions.service";
import { QueryKeyString } from "src/enums/queryKey.enums";
import { IGetSessionsRequest } from "@/types/interfaces/sessionRequest.interface";
import { useInfiniteQuery } from "react-query";

export default function useGetSessionsHistory(params?: IGetSessionsRequest) {
  const fetchSessionHistory = async ({ page = 1, ...queryParam }: IGetSessionsRequest) => {
    const data = await getSessions({ page, ...queryParam });

    return { results: data.docs, nextPage: data.nextPage, totalPages: data.totalPages };
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
