import { Dispatch, SetStateAction, useEffect } from "react";

import { QueryAccepted } from "@/types/interfaces/queryAccepted.interface";
import { useRouter } from "next/router";

// ** Styled Components

type Props = {
  requestAcceptedNotification: QueryAccepted;
  setShowRequestDialogue?: Dispatch<SetStateAction<boolean>>;
};

const QueryRequest = ({ requestAcceptedNotification }: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.push({
      pathname: `/session/${requestAcceptedNotification._id}`,
    });
  }, [requestAcceptedNotification]);

  return null;
};

export default QueryRequest;
