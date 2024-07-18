import * as toast from "src/utils/toast";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

interface IMutateParams<Param, ReturnType> {
  api: (param: Param) => Promise<ReturnType>;
  success?: string;
  error?: string;
  onSuccess?: (data: ReturnType) => void;
  onError?: (err: AxiosError) => void;
}

export function useCustomMutation<Param, ReturnType>({
  api,
  success,
  error,
  onSuccess,
  onError,
}: IMutateParams<Param, ReturnType>) {
  return useMutation(async (param: Param) => api(param), {
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      if (success) toast.success(success);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      if (onError) onError(err);
      if (err.response?.data?.message) {
        toast.error(err.response?.data?.message);

        return;
      }
      if (error) toast.error(error);
    },
  });
}
