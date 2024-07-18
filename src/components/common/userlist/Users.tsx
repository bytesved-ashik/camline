import { IAccountDetails } from "@/types/interfaces/profile.interface";
import { ITherapistCategories } from "./UserList";
import { Avatar, Badge, Box, Button, Chip, CircularProgress, Grid, Tooltip, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { updateStatus } from "@/services/user.service";
import toast from "react-hot-toast";
import { userId } from "@/utils/string";
import { useRouter } from "next/router";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
import { resendEmail } from "@/services/auth.service";
import { ROLE } from "@/enums/role.enums";
import ScheduleCallModal from "./ScheduleCallModal";
import { useSession } from "next-auth/react";

type IProps = {
  user: IAccountDetails;
  categories: ITherapistCategories[];
  userTopUp?: any;
};

export default function UsersList({ user, categories, userTopUp }: IProps) {
  const [status, setStatus] = useState(user.status);
  const emailVerified = useMemo(() => user.emailVerified, [user.emailVerified]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [therapistId, setTherapistId] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  const { data: users } = useSession();

  const onViewDetail = () => {
    userId.setUserId = user._id;
    router.push("/user-account");
  };

  const updateUserStatus = () => {
    setStatusLoading(true);
    updateStatus(user._id, status !== "active")
      .then((data: any) => {
        setStatus(data.data.status);
        setStatusLoading(false);
      })
      .catch((err) => {
        setStatusLoading(false);
        toast.error(err.response.data.message ?? "There is some issue with server. please try again later.");
      });
  };

  const resendEmailVerification = () => {
    setEmailLoading(true);
    resendEmail(user._id)
      .then((data: any) => {
        setEmailLoading(false);
        toast.success(data.data.message ?? "Email sended successfully.");
      })
      .catch((err) => {
        setEmailLoading(false);
        toast.error(err.response.data.message ?? "There is some issue with server. please try again later.");
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTherapistId("");
  };

  const handleOpenModal = (id: string) => {
    setShowModal(true);
    setTherapistId(id);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
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
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            sx={{ borderRadius: "50%", color: "red", mr: 5 }}
          >
            <Avatar
              alt={user.firstName.toUpperCase()}
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${user?.profile?.profilePicture}`}
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
            <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
              {user.firstName} {user.lastName}
            </Typography>
            {users?.user.role === ROLE.ADMIN && (
              <Typography sx={{ fontWeight: 300, fontSize: "0.7rem" }}>
                Referred By: {user?.referredBy?.firstName + " " + user?.referredBy?.lastName}
              </Typography>
            )}
            {userTopUp?.wallet?.mainBalance > 0 && (
              <Typography sx={{ fontWeight: 400, fontSize: "1rem" }}>
                Amount / Minutes : {`£ ${(userTopUp?.wallet?.mainBalance).toFixed(2)}`} / {userTopUp?.paidMinutes} Minutes
              </Typography>
            )}
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
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "end",
            gap: 10,
            "@media screen and (max-width: 767px)": {
              gap: 5,
            },
          }}
        >
          {users && users?.user?.roles[0] === ROLE.ADMIN ? (
            <>
              <Button variant="outlined" onClick={onViewDetail}>
                View Detail
              </Button>

              <Button
                sx={{ width: 120, height: 40 }}
                variant="contained"
                color={status === "active" ? "primary" : "error"}
                onClick={updateUserStatus}
                disabled={statusLoading}
              >
                {statusLoading ? <CircularProgress size={20} /> : status}
              </Button>
              {!emailVerified && (
                <Tooltip title="Resend Email verification">
                  <Button variant="outlined" onClick={resendEmailVerification} disabled={emailLoading}>
                    {emailLoading ? <CircularProgress size={20} /> : <UnsubscribeIcon />}
                  </Button>
                </Tooltip>
              )}
            </>
          ) : (
            <Button
              sx={{ width: 170, height: 40 }}
              variant="contained"
              color={"primary"}
              onClick={() => handleOpenModal(user?._id)}
              disabled={statusLoading}
            >
              {statusLoading ? <CircularProgress size={20} /> : "Schedule Call"}
            </Button>
          )}
        </Box>
        <ScheduleCallModal
          showDialog={showModal}
          closeDialog={handleCloseModal}
          therapistId={therapistId}
          therapistCall={true}
        />
      </Grid>
    </Grid>
  );
}
