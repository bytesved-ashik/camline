import { IGetSessionsRequest } from "@/types/interfaces/sessionRequest.interface";
import { useInfiniteQuery } from "react-query";
import { getAllUsers } from "@/services/user.service";

export default function useGetAllUsers(params?: IGetSessionsRequest) {
  const fetchScheduleSessions = async ({ page = 1, ...queryParam }: IGetSessionsRequest) => {
    const { data } = await getAllUsers({ page, ...queryParam });

    return { results: data.docs, nextPage: data.nextPage, totalPages: data.totalPages, totalUsers: data.totalDocs };
  };

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery(
    [params],
    ({ pageParam }) => fetchScheduleSessions({ ...params, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  return { data, isLoading, hasNextPage, fetchNextPage };
}
