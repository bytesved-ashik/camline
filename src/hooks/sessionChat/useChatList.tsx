import { useQuery } from "react-query";
import { QueryKeyString } from "src/enums/queryKey.enums";
import { getChats } from "@/services/chat.service";
import { IAllChats } from "@/types/apps/chatTypes";

export default function useChatList() {
  const { data, isLoading, refetch } = useQuery<IAllChats[]>(QueryKeyString.CHAT_LIST_DATA, async () => getChats());

  return { chatData: data ?? [], isLoading, refetch };
}
