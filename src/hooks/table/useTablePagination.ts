import { useCallback, useState } from "react";

export type PaginationParams = { limit?: number; page?: number };
const UseTablePagination = () => {
  const [total, updateTotal] = useState(0);
  const [paginationConfig, setPaginationConf] = useState<{
    limit: undefined | number;
    page: undefined | number;
  }>({ limit: 100, page: undefined });

  const onPageChange = useCallback((e: number) => {
    setPaginationConf((prev) => {
      return {
        ...prev,
        page: e,
      };
    });
  }, []);

  const onPageSizeChange = useCallback((e: number) => {
    setPaginationConf((prev) => {
      return {
        ...prev,
        limit: e,
      };
    });
  }, []);

  const setTotal = useCallback(({ total }: { total: number }) => {
    updateTotal(total);
  }, []);

  return [
    {
      rowCount: total,
      onPageChange,
      onPageSizeChange,
      rowsPerPageOptions: [25, 50, 100],
    },
    { paginationConfig, setTotal },
  ];
};
export default UseTablePagination;
