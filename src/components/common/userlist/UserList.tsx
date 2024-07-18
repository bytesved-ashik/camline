import { REQUEST_STATUS } from "@/enums/requestStatus.enums";
import { ROLE } from "@/enums/role.enums";
import useGetUserInfo from "@/hooks/profile/useGetUserInfo";
import { createRequest } from "@/services/session.service";
import { getTranscript } from "@/services/sessions.service";
import { shortlistTherapist } from "@/services/user.service";
import { userId } from "@/utils/string";
import {
  Avatar,
  Badge,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import TopUpWallet from "@/components/ui/dialogs/TopUpWallet";
import useWalletUtility from "@/hooks/wallet/useWalletUtility";

export type ITherapistDetails = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  isOnline: boolean;
  name: string;
  id: string;
  profilePicture: string;
  recommendation: string;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
};

export type ITherapistCategories = {
  name: string;
  _id: string;
};

export type IWallet = {
  _id: string;
  availableVATCharge: any;
  bonusBalance: number;
  createdAt: string;
  freeTrialMinutes: number;
  holdedBonusBalance: number;
  holdedMainBalance: number;
  holdedTrialMinutes: number;
  id: string;
  mainBalance: number;
  updatedAt: string;
  user: string;
  withdrawalBalance: number;
};

function UserList({
  therapist,
  categories,
  profilePicture,
  onShortlist,
  inCall,
  onCheckTherapist,
  DisplayTranscript,
  transcriptId,
  sessionTime,
  duration,
  therapiseName,
  isInShortlist,
}: {
  therapist: ITherapistDetails;
  categories: ITherapistCategories[];
  profilePicture?: { filepath: string };
  isInShortlist: boolean;
  onShortlist: (id: string) => void;
  onCheckTherapist: (id: string) => void;
  inCall: boolean;
  DisplayTranscript?: boolean;
  transcriptId?: string;
  sessionTime?: any;
  duration?: number;
  therapiseName?: any;
}) {
  const router = useRouter();
  const { data: users } = useGetUserInfo();
  const [connectLoading, setConnectLoading] = useState(false);
  const [status, setStatus] = useState(therapist.status);
  const [statusLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState<string>("");
  const { setShowTopUpModal, showTopUpModal } = useWalletUtility();

  useEffect(() => {
    setStatus(therapist.status);
  }, [therapist]);

  const onViewDetail = () => {
    userId.setUserId = therapist._id;
    router.push("/user-account");
  };

  const BadgeContentSpan = styled("span")(({ theme }) => ({
    width: 11,
    height: 11,
    borderRadius: "50%",
    backgroundColor: inCall ? "red" : therapist.isOnline ? theme.palette.success.main : theme.palette.grey[500],
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  }));

  const createQueryData = {
    requestType: "private-specific-therapist",
    requestStatus: REQUEST_STATUS.IN_POOL,
    categories: (users && users[0].profile?.categories) ?? ["642fcaa6ddc2d5e4bd5adb8b"],
    query: "Need private session with you",
    minBudget: 1,
    maxBudget: 1,
    therapist: therapist?._id,
  };

  const createNewRequest = async () => {
    setConnectLoading(true);
    await createRequest(createQueryData)
      .then(() => {
        setConnectLoading(false);
        toast.success("Request created. please wait until Therapist will accept.");
      })
      .catch((err) => {
        setConnectLoading(false);
        if (
          err?.response?.data?.message === "Don't have a top-up transaction" ||
          err?.response?.data?.message === "Insufficient funds"
        ) {
          toast.error("You don't have enough balance to create a query");
          setShowTopUpModal(true);

          return;
        }
        toast.error(err.response.data.message ?? "Request failed.");
        console.error(err);
      });
  };

  const onShortlisted = () => {
    shortlistTherapist(therapist._id)
      .then(() => {
        onShortlist(therapist._id);
      })
      .catch((err) => console.log("Error in shortlist => ", err));
  };

  const handleOpenModal = (therapistId: string) => {
    if (users && users[0]?.roles[0] === ROLE.USER && users[0]?.wallet?.mainBalance <= 15) {
      toast.error("insufficient funds");

      return;
    } else {
      onCheckTherapist(therapistId);
    }
  };

  const toggleDrawer = (newOpen: boolean, id: string) => async () => {
    setOpen(newOpen);
    try {
      const transcript = await getTranscript(id);
      setSelectedTranscript(transcript || "");
    } catch (error) {
      setOpen(false);
    }
  };

  const closeDrawer = () => {
    setOpen(false);
    setSelectedTranscript("");
  };

  const DrawerList = (
    <Box sx={{ width: 350 }} role="presentation" onClick={closeDrawer}>
      <IconButton
        onClick={closeDrawer}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      <ListItem>
        {selectedTranscript ? (
          <ListItemText primary={selectedTranscript} />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: `calc(100vh - 100px)`,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </ListItem>
    </Box>
  );

  const convertDateTime = (timestamp: string) => {
    const date = new Date(timestamp);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];

    const day = date.getDate();
    let dayWithSuffix;
    switch (day % 10) {
      case 1:
        dayWithSuffix = `${day}st`;
        break;
      case 2:
        dayWithSuffix = `${day}nd`;
        break;
      case 3:
        dayWithSuffix = `${day}rd`;
        break;
      default:
        dayWithSuffix = `${day}th`;
    }

    const year = date.getFullYear();
    let hours = date.getHours();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedDateTime = `${monthName} ${dayWithSuffix} ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;

    return formattedDateTime;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            display: "flex",
            ml: 3,
            alignItems: "flex-start",
            flexDirection: "row",
            minWidth: "27vw",
            justifyContent: "flex-start",
          }}
        >
          <Badge
            overlap="circular"
            badgeContent={<BadgeContentSpan />}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            sx={{ borderRadius: "50%", color: "red", mr: 5 }}
          >
            <Avatar
              alt={therapist?.firstName?.toUpperCase()}
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${profilePicture?.filepath}`}
              sx={{ width: "6rem", height: "6rem" }}
            />
          </Badge>
          <Box
            sx={{
              display: "flex",
              ml: 3,
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}> {therapiseName}</Typography>
            <Box
              sx={{
                display: "block",
                textAlign: "left",
              }}
            >
              {categories &&
                categories.length > 0 &&
                categories.map((val) => (
                  <Chip
                    key={val._id}
                    sx={{
                      mr: 2,
                      mt: 2,
                      "@media screen and (max-width: 767px)": {
                        height: "auto",
                        padding: "5px 0",
                      },
                      "& .MuiChip-label": {
                        whiteSpace: "normal",
                      },
                    }}
                    label={val.name}
                  />
                ))}
            </Box>

            {DisplayTranscript && (
              <>
                {" "}
                <Box sx={{ color: "rgba(76, 78, 100, 0.87)" }}>
                  {sessionTime?.sessionStartTime
                    ? convertDateTime(sessionTime?.sessionStartTime)
                    : convertDateTime(sessionTime?.joinedAttendees[0]?.joinedAt ?? "")}{" "}
                </Box>
                <Box sx={{ color: "rgba(76, 78, 100, 0.87)" }}>
                  Duration:{" "}
                  {duration && Math.floor(duration / 60) + ":" + String(duration && duration % 60).padStart(2, "0")}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "end",
            gap: 5,
            "@media screen and (max-width: 767px)": {
              gap: 5,
            },
          }}
        >
          {users && users[0].roles[0] === ROLE.ADMIN && (
            <>
              <Button variant="outlined" onClick={onViewDetail}>
                View Detail
              </Button>

              <Button
                sx={{ width: 120, height: 40 }}
                variant="contained"
                color={status === "active" ? "primary" : "error"}
                disabled={statusLoading}
              >
                {statusLoading ? <CircularProgress size={20} /> : status}
              </Button>
            </>
          )}
          <>
            {users && users[0].roles[0] === ROLE.USER ? (
              <Button
                sx={{ width: 200, height: 40 }}
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal(therapist._id)}
              >
                {"Schedule Call"}
              </Button>
            ) : (
              ""
            )}
            {users && users[0].roles[0] === ROLE.THERAPIST ? (
              <Button
                sx={{ width: 200, height: 40 }}
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal(therapist._id)}
              >
                {"Schedule Call"}
              </Button>
            ) : (
              ""
            )}

            {users &&
              users[0].roles[0] === ROLE.USER &&
              (!isInShortlist ? (
                <Button variant="outlined" onClick={onShortlisted}>
                  Shortlist
                </Button>
              ) : (
                ""
              ))}

            {users && users[0].roles[0] === ROLE.USER && (
              <Button
                sx={{ width: 120, height: 40 }}
                variant="contained"
                color="primary"
                onClick={createNewRequest}
                disabled={connectLoading}
              >
                {connectLoading ? <CircularProgress size={20} /> : "Connect"}
              </Button>
            )}

            {DisplayTranscript && (
              <Button
                sx={{
                  width: 120,
                  height: 40,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
                variant="outlined"
                color="primary"
                onClick={toggleDrawer(true, transcriptId ? transcriptId : "")}
              >
                {"Transcript"}
              </Button>
            )}
          </>
        </Box>
      </Grid>
      <div>
        <Drawer open={open} onClose={closeDrawer} anchor="right">
          {DrawerList}
        </Drawer>
      </div>
      <TopUpWallet
        closeDialog={() => {
          setShowTopUpModal(false);
        }}
        showDialog={showTopUpModal}
      />
    </Grid>
  );
}

export default memo(UserList);
