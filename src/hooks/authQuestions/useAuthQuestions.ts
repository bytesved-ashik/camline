import { getAuthQuestions } from "src/services/authQuestions.service";
import { useQuery } from "react-query";
import { QueryKeyString } from "src/enums/queryKey.enums";

export default function useAuthQuestions(role: string) {
  const { data, isLoading } = useQuery([QueryKeyString.REGISTER_QUESTIONS_DATA, role], async () => getAuthQuestions(role));

  return { slideQuestionsData: data, numberOfQuestions: data?.length ?? 0, isLoading };
}
