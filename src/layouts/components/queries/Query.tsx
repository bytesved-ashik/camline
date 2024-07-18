import {
  acceptIncomingSession,
  acceptNotificationFromPatient,
  cancelRequestById,
  getRequestById,
  rejectIncomingSession,
  rejectRequestById,
  updateRequestById,
} from "@/services/session.service";
import { Category } from "@/types/interfaces/category.interface";
import { v4 as uuidv4 } from "uuid";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import Icon from "src/@core/components/icon";
import * as toast from "src/utils/toast";
import dayjs from "dayjs";
import CustomChip from "src/@core/components/mui/chip";
import { useSession } from "next-auth/react";
import { ROLE } from "@/enums/role.enums";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useRouter } from "next/router";
import { joinSessionAsUser, leaveSession } from "@/services/sessions.service";
import { useBalance } from "@/store/wallet/useBalance";
import { REQUEST_STATUS } from "@/enums/requestStatus.enums";
import { useQueryClient } from "react-query";
import { QueryKeyString } from "@/enums/queryKey.enums";
import { IAccountDetails } from "@/types/interfaces/profile.interface";
import { useSessionData } from "@/store/sessionData/useSessionData";

interface DataType {
  _id: string;
  query: string;
  requestStatus: string;
  categories: Category[];
  user: IAccountDetails;
  color?: string;
  sessionId?: any;
  scheduleSessionDuration?: any;
  scheduleEndDate?: any;
  scheduleStartDate?: any;
  therapist?: string;
}
const queryRequestParams = {
  sort: "createdAt:desc",
  limit: 5,
  page: 1,
};

const Query = ({
  data,
  refetch,
  schedule,
  scheduledSession,
}: {
  data: DataType;
  refetch: () => void;
  schedule?: boolean;
  scheduledSession?: boolean;
}) => {
  const { isCameraOn, isMuted, setIsCameraOn, setIsMuted, setStreamId, setSessionId, setIsPreparing } = useSessionData();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { refetch: BalanceRefetch } = useBalance();
  const { mutate: acceptNotification } = useCustomMutation({
    api: acceptNotificationFromPatient,
    onSuccess: (res) => {
      setSessionId(res._id);
      setStreamId(res.streamId);
      handleJoinSession(res);
    },
    onError: () => {
      refetch();
    },
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [enteredQuery, setEnteredQuery] = useState<string>(data.query);
  const [open, setOpen] = useState<boolean>(false);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { data: session } = useSession();

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleUpdateQuery = async () => {
    if (data) {
      await updateRequestById({ id: data._id, query: enteredQuery }).then((res) => {
        if (res) {
          toast.success("Query Generated Successfully");
          setOpen(false);
          refetch();
        }
      });
    }
  };

  const handleReject = async (sessionId: string) => {
    await rejectRequestById(sessionId)
      .then(() => {
        refetch();
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  const handelEndSession = async (requestId: string) => {
    await getRequestById(requestId)
      .then((res) => {
        leaveSession(res.sessionId)
          .then(() => {
            queryClient.invalidateQueries([QueryKeyString.USER_QUERIES_DATA, queryRequestParams]);
            toast.success("Session Ended Succesfully");
            setTimeout(() => {
              BalanceRefetch();
            }, 1000);
            refetch();
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || "Something went wrong");
          });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  const handelRejoinSession = async (requestId: string) => {
    await getRequestById(requestId)
      .then((res) => {
        router.push({
          pathname: `/session/${res.sessionId}`,
        });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  const handleJoinSession = async (sessionData: any) => {
    if (!sessionData?.streamId) return toast.error("Session is not ready yet");
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(async () => {
          await joinSessionAsUser(sessionData._id)
            .then(() => {
              setStreamId(sessionData?.streamId);
              setIsPreparing(false);
              setIsCameraOn(isCameraOn);
              setIsMuted(isMuted);
              router.push({
                pathname: `/session/${sessionData._id}`,
              });
            })
            .catch((error) => {
              toast.error(error?.response?.data?.message || "Some error occured");
            });
        })
        .catch(() => {
          setOpen(true);

          return;
        });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleAccept = async (sessionId: string) => {
    const streamId = uuidv4();
    await acceptNotification({ streamId, sessionId });
  };

  const generateRandomNumberAndString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);

    const randomString = Math.random().toString(36).substring(2, 12);
    const mixedValue = randomNumber.toString() + randomString;

    return mixedValue;
  };

  const handleAcceptIncomingSessiom = async (sessionId: string) => {
    const mixedValue = generateRandomNumberAndString();

    const payload = {
      streamId: mixedValue,
    };
    await acceptIncomingSession(sessionId, payload)
      .then(() => {
        toast.success("Request accepted");
        refetch();
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const handleRejectIncomingSessiom = async (sessionId: string) => {
    await rejectIncomingSession(sessionId)
      .then(() => {
        toast.success("Request rejected");
        refetch();
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const handelCancelQuery = (id: string) => {
    cancelRequestById(id)
      .then((res) => {
        refetch();
        if (res) {
          toast.success("Query Withdrawn");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
    handleClose();
  };

  const handleEdit = () => setOpen(true);
  const handleClosePopup = () => setOpen(false);

  // TODO REFACTOR : Make these below two functions as a single function
  const getChipColor = (requestStatus: string) => {
    switch (requestStatus) {
      case REQUEST_STATUS.IN_POOL:
        return "rgba(253, 181, 40, 0.10)";
      case REQUEST_STATUS.SCHEDULED:
        return "rgba(40, 151, 253, 0.10)";
      case REQUEST_STATUS.EXPIRED:
        return "rgba(255, 98, 95, 0.10)";
      case REQUEST_STATUS.ACCEPTED:
        return "rgba(114, 225, 40, 0.10)";
      case REQUEST_STATUS.IN_SESSION:
        return "rgba(10, 221, 19, 0.10)";
      case REQUEST_STATUS.ENDED:
        return "rgba(255, 98, 95, 0.10)";
      case REQUEST_STATUS.WITHDRAWN:
        return "rgba(5, 5, 5, 0.25);";
      case REQUEST_STATUS.OPEN_SESSION:
        return "rgba(255, 252, 127)";
      default:
        return "rgba(5, 5, 5, 0.25);";
    }
  };
  const getTextColor = (requestStatus: string) => {
    switch (requestStatus) {
      case REQUEST_STATUS.IN_POOL:
        return "#FDB528";
      case REQUEST_STATUS.SCHEDULED:
        return "#2897FD";
      case REQUEST_STATUS.EXPIRED:
        return "#FF4D49";
      case REQUEST_STATUS.ACCEPTED:
        return "#72E128";
      case REQUEST_STATUS.IN_SESSION:
        return "#0ADD13";
      case REQUEST_STATUS.ENDED:
        return "#FF4D49";
      case REQUEST_STATUS.WITHDRAWN:
        return "#FFF";
      case REQUEST_STATUS.OPEN_SESSION:
        return "black";
      default:
        return "#FFF";
    }
  };

  const convertUtcToNormal = (utcDateTime: string, format: string): string => {
    return dayjs(utcDateTime).format(format);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }).format(date);
  };

  console.log("data", data);

  return (
    <>
      <ListItem sx={{ p: 0 }}>
        {session?.user.role === ROLE.USER ? (
          <>
            <Box
              className="lineClamp"
              component={ListItem}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                textAlign: "left",
                alignItems: "start",
              }}
            >
              <Typography sx={{ fontSize: "17px", fontWeight: "bold" }} component={"b"}>
                {data.query}
              </Typography>
              <Typography component={"b"}>{data.categories.map((category) => category.name).join(", ")}</Typography>
              {scheduledSession && (
                <Typography component={"b"} sx={{ color: "#546FFF" }}>
                  {" "}
                  {` ${data?.scheduleStartDate ? formatDate(data.scheduleStartDate) : "N/A"}, ${
                    data?.scheduleSessionDuration
                  } Min`}{" "}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Box
            className="lineClamp"
            component={ListItem}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              textAlign: "left",
              alignItems: "start",
            }}
          >
            <Typography variant={"h6"} component={"b"}>
              {data.user.firstName + " " + data.user.lastName}
            </Typography>
            <Typography variant={"subtitle1"}>{data.query}</Typography>
            <Typography variant="subtitle1">{data.categories.map((category) => category.name).join(", ")}</Typography>
            {schedule && (
              <Typography variant="subtitle1" sx={{ color: "#546FFF" }}>
                Start Time :&nbsp;
                {convertUtcToNormal(data?.scheduleStartDate, "YYYY-MM-DD HH:mm:ss")}
                &nbsp;&nbsp;&nbsp;&nbsp; End Time :&nbsp;
                {convertUtcToNormal(data?.scheduleEndDate, "YYYY-MM-DD HH:mm:ss")}
              </Typography>
            )}
          </Box>
        )}

        {data?.requestStatus === "scheduled_5_minutes_remaining" && session?.user.role === ROLE.THERAPIST ? (
          ""
        ) : data?.requestStatus === "scheduled_5_minutes_remaining" && session?.user.role === ROLE.USER ? (
          !data?.sessionId?.isTherapistJoined ? (
            <CustomChip
              skin="light"
              size="medium"
              label={"Wait for therapist"}
              sx={{
                height: 20,
                fontSize: "0.75rem",
                fontWeight: 500,
                background: getChipColor(REQUEST_STATUS.IN_SESSION),
                color: getTextColor(REQUEST_STATUS.IN_SESSION),
                textTransform: "capitalize",
              }}
            />
          ) : (
            ""
          )
        ) : (
          <CustomChip
            skin="light"
            size="medium"
            label={data?.requestStatus}
            sx={{
              height: 20,
              fontSize: "0.75rem",
              fontWeight: 500,
              background:
                session?.user.role === ROLE.THERAPIST
                  ? data.color === "Green"
                    ? getChipColor(REQUEST_STATUS.IN_SESSION)
                    : data.color === "Orange"
                    ? getChipColor(REQUEST_STATUS.IN_POOL)
                    : getChipColor(REQUEST_STATUS.EXPIRED)
                  : getChipColor(data.requestStatus),
              color:
                session?.user.role === ROLE.THERAPIST
                  ? data.color === "Green"
                    ? getTextColor(REQUEST_STATUS.IN_SESSION)
                    : data.color === "Orange"
                    ? getTextColor(REQUEST_STATUS.IN_POOL)
                    : getTextColor(REQUEST_STATUS.EXPIRED)
                  : getTextColor(data.requestStatus),
              textTransform: "capitalize",
            }}
          />
        )}

        {data.requestStatus === "open schedule" && session?.user.role === ROLE.THERAPIST ? (
          <>
            <Button
              sx={{ margin: 5 }}
              variant="outlined"
              onClick={() => {
                handleAcceptIncomingSessiom(data._id);
              }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                handleRejectIncomingSessiom(data._id);
              }}
            >
              Reject
            </Button>
          </>
        ) : null}

        {(data.requestStatus === "in-pool" ||
          (!data?.sessionId?.isTherapistJoined && data.requestStatus === "scheduled_5_minutes_remaining")) &&
        session?.user.role === ROLE.USER ? (
          <>
            <IconButton aria-haspopup="true" onClick={handleClick}>
              <Icon icon="mdi:dots-vertical" />
            </IconButton>
            <Menu keepMounted anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={() => handelCancelQuery(data._id)}>Withdraw</MenuItem>
            </Menu>
          </>
        ) : null}

        {(data.requestStatus === "accepted" || data?.sessionId?.isTherapistJoined) && session?.user.role === ROLE.USER ? (
          <>
            <Button variant="text" onClick={() => handelRejoinSession(data._id)}>
              Join
            </Button>
            <Button variant="text" color="error" onClick={() => handelEndSession(data._id)}>
              Cancel
            </Button>
          </>
        ) : null}

        {data.requestStatus === "in-session" && session?.user.role === ROLE.USER ? (
          <>
            <IconButton aria-haspopup="true" onClick={handleClick}>
              <Icon icon="mdi:dots-vertical" />
            </IconButton>

            <Menu keepMounted anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
              <MenuItem onClick={() => handelRejoinSession(data._id)}>Rejoin Session</MenuItem>
              <MenuItem onClick={() => handelEndSession(data._id)}>Cancel Session</MenuItem>
            </Menu>
          </>
        ) : null}

        {data.requestStatus === "scheduled_5_minutes_remaining" && session?.user.role === ROLE.THERAPIST ? (
          <>
            <Button
              sx={{ margin: 5 }}
              variant="outlined"
              onClick={() => {
                handleJoinSession({
                  _id: data.sessionId._id,
                  streamId: data.sessionId._id,
                });
              }}
            >
              Join Call
            </Button>
          </>
        ) : null}

        {data.requestStatus === "in-pool" && session?.user.role === ROLE.THERAPIST ? (
          <>
            <Button
              sx={{ margin: 5 }}
              variant="outlined"
              onClick={() => {
                handleAccept(data._id);
              }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                handleReject(data._id);
              }}
            >
              Reject
            </Button>
          </>
        ) : null}
      </ListItem>
      <Dialog
        onClose={handleClosePopup}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        scroll="body"
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Query Form
          </Typography>
          <Typography variant="caption" sx={{ textAlign: "center", display: "block" }}>
            Fill your query request form and select your therapy category
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClosePopup}
            sx={{ top: 10, right: 10, position: "absolute", color: "grey.500" }}
          >
            <Icon icon="mdi:close" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <DialogContentText>
            <Box sx={{ mb: 4 }}>
              <TextField
                rows={8}
                multiline
                value={enteredQuery}
                label="Reason for seeking therapy"
                placeholder="lorem ipsum dolor"
                id="textarea-outlined-static"
                fullWidth
                onChange={(e) => setEnteredQuery(e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Autocomplete
                options={data.categories}
                readOnly
                defaultValue={data.categories[0]}
                getOptionLabel={(item: Category) => item.name}
                id="autocomplete-outlined"
                fullWidth
                renderInput={(params) => <TextField {...params} label="Therapy Type" />}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={handleUpdateQuery}>
            Submit
          </Button>
          <Button variant="outlined" onClick={handleClosePopup}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Query;
