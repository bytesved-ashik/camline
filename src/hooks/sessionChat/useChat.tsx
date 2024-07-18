import { useQuery } from "react-query";
import { QueryKeyString } from "src/enums/queryKey.enums";
import { getChatMessages } from "@/services/chat.service";
import { ChatType } from "@/types/apps/chatTypes";

export default function useSessionChat(sessionId: string, key?: string) {
  const { data, isLoading, refetch } = useQuery<ChatType[]>(
    [QueryKeyString.CHAT_MESSAGE_DATA, sessionId, key],
    async () => getChatMessages({ id: sessionId, key: key ?? "uniqueKey" }),
    {
      enabled: !!sessionId,
    }
  );

  return { chatData: data ?? [], isLoading, refetch };
}
