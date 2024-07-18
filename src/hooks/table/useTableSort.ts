import { useCallback, useState } from "react";

const UseTableSort = () => {
  const [sort, setSortConfig] = useState<undefined | string>();

  const onSortModelChange = useCallback((e: { field: string; sort: string | null | undefined }[]) => {
    const item = e[0];
    if (item) {
      setSortConfig(`${item.field}:${item?.sort || "desc"}`);
    } else {
      setSortConfig(undefined);
    }
  }, []);

  return [
    {
      onSortModelChange,
    },
    { sort },
  ];
};
export default UseTableSort;
