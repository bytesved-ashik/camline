// ** MUI Imports
import Grid from "@mui/material/Grid";
import Caption from "src/components/ui/typography/Caption";
import { ROLE } from "@/enums/role.enums";
import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { REQUEST_STATUS } from "@/enums/requestStatus.enums";
import useUserQueries from "@/hooks/session/useUserQueries";
import { cancelRequestById, createRequest } from "@/services/session.service";
import useGetUserInfo from "@/hooks/profile/useGetUserInfo";
import toast from "react-hot-toast";
import TopUpWallet from "@/components/ui/dialogs/TopUpWallet";
import useWalletUtility from "@/hooks/wallet/useWalletUtility";

import CardQuery from "@/components/ui/card/CardQuery";

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const Dashboard = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [queryTitle, setQueryTitle] = useState("Need urgent help");
  const { data: users } = useGetUserInfo();
  const { setShowTopUpModal, showTopUpModal } = useWalletUtility();

  const queryRequestParams = {
    requestStatus: REQUEST_STATUS.IN_POOL,
  };
  const { userQueries } = useUserQueries(queryRequestParams);

  const quickSearch = async () => {
    if (
      userQueries &&
      userQueries?.pages[0]?.results.length > 0 &&
      userQueries?.pages[0]?.results[0]?.requestStatus ===
        REQUEST_STATUS.IN_POOL
    ) {
      await cancelRequestById(userQueries.pages[0].results[0]._id);
    }

    await createNewRequest();
  };

  const createNewRequest = async () => {
    if (
      users &&
      users[0]?.profile?.questions &&
      users[0]?.profile?.questions[0]?.answers
    ) {
      setQueryTitle(users[0].profile.questions[0].answers[0]);
    }
    await createRequest(createQueryData)
      .then(() => {
        setOpenDialog(false);
        toast.success(
          "Request created. please wait until Therapist will accept."
        );
      })
      .catch((err) => {
        setOpenDialog(false);
        if (
          err?.response?.data?.message === "Don't have a top-up transaction" ||
          err?.response?.data?.message === "Insufficient funds"
        ) {
          toast.error("You don't have enough balance to create a query");
          setShowTopUpModal(true);

          return;
        }
        toast.error(err.response.data.message ?? "Reuqest failed.");
      });
  };

  const createQueryData = {
    requestType: "private",
    requestStatus: REQUEST_STATUS.IN_POOL,
    categories: (users && users[0].profile.categories) ?? [
      "642fcaa6ddc2d5e4bd5adb8b",
    ],
    query: queryTitle,
    minBudget: 1,
    maxBudget: 1,
  };

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }, []);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Caption
            data={{
              title: "Dashboard",
              subText: "Access to all your session details on this page",
            }}
          />
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          <CardQuery />
        </Grid>
      </Grid>

      <Dialog
        fullScreen={fullScreen}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        maxWidth="sm"
        scroll="body"
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", display: "block" }}
          >
            Instantly Connect to a therapist.
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4, textAlign: "center" }}>
          <BoxWrapper mb={6}>
            <Button variant="contained" onClick={quickSearch}>
              Quick Connect
            </Button>
          </BoxWrapper>
          <Divider>OR</Divider>
          <Button
            variant="outlined"
            sx={{ my: "1rem" }}
            onClick={() => setOpenDialog(false)}
          >
            Dashboard
          </Button>
        </DialogContent>
      </Dialog>

      <TopUpWallet
        closeDialog={() => setShowTopUpModal(false)}
        showDialog={showTopUpModal}
      />
    </>
  );
};

export default Dashboard;

Dashboard.authGuard = [ROLE.USER];
