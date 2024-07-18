import * as toast from "@/utils/toast";
import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { leaveSession } from "@/services/sessions.service";

import { Dispatch, SetStateAction } from "react";

import { useBalance } from "@/store/wallet/useBalance";
import { QueryKeyString } from "@/enums/queryKey.enums";
import { useQueryClient } from "react-query";

// ** Styled Components

type Props = {
  rejoinSessionId: string;
  setShowReJoinAlert: Dispatch<SetStateAction<boolean>>;
};
const queryRequestParams = {
  sort: "createdAt:desc",
  limit: 5,
  page: 1,
};

const RejoinAlert = ({ rejoinSessionId, setShowReJoinAlert }: Props) => {
  const router = useRouter();
  const { refetch: BalanceRefetch } = useBalance();
  const queryClient = useQueryClient();

  const handelEndSession = async (sessionId: string) => {
    leaveSession(sessionId)
      .then(() => {
        queryClient.invalidateQueries([QueryKeyString.USER_QUERIES_DATA, queryRequestParams]);
        toast.success("Session Ended Succesfully");
        setShowReJoinAlert(false);

        setTimeout(() => {
          BalanceRefetch();
        }, 1000);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  const handelRejoinSession = async (sessionId: string) => {
    router.push({
      pathname: `/session/${sessionId}`,
    });
  };
  if (router.route.includes("session")) return null;

  return (
    <Alert severity="error" sx={{ display: "grid", gridTemplateColumns: "0.01fr 0.99fr", alignItems: "center", mb: 4 }}>
      <Grid sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "bold", fontSize: "1rem", color: "#111013" }}>You are still in session.</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", minWidth: "250px" }}>
          <Button variant="contained" color="primary" onClick={() => handelRejoinSession(rejoinSessionId)}>
            Rejoin
          </Button>
          <Button variant="contained" color="error" onClick={() => handelEndSession(rejoinSessionId)}>
            End Session
          </Button>
        </Box>
      </Grid>
    </Alert>
  );
};

export default RejoinAlert;
