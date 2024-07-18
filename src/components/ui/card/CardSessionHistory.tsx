import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import moment from "moment";
import useGetSessionsHistory from "@/hooks/common/useGetSessionsHistory";
import { ISession } from "@/types/interfaces/session.interface";
import PerfectScrollbarComponent from "react-perfect-scrollbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import useGetUserInfo from "@/hooks/profile/useGetUserInfo";
import { ROLE } from "@/enums/role.enums";
import { getWalletBalance } from "@/services/wallet.service";
import DateRangeSelector from "@/components/common/DateRangeSelector/DateRangeSelector";
import CloseIcon from "@mui/icons-material/Close";

const CardSessionHistory = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [getSessionParams, setGetSessionParams] = useState<any>({
    sessionStatus: "ended",
    limit: 5,
  });
  const { data: users } = useGetUserInfo();
  const [walletBalance, setWalletBalance] = useState<string>("");
  const isTherapist = users ? users[0].roles[0] === ROLE.THERAPIST : false;
  const isVAT = users ? users[0].profile?.VATNumber : false;
  const { data, isLoading, hasNextPage, fetchNextPage } = useGetSessionsHistory(getSessionParams);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const scrollRef = useRef<{ element: HTMLElement | null }>({ element: null });
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [open, setOpen] = React.useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState<string>("");

  useEffect(() => {
    getWalletBalance().then((data) => {
      const b = localStorage.getItem("WalletBalance");
      if (!b) setWalletBalance(data.mainBalance.toFixed(2).toString());
    });
  }, []);

  const handleReachEnd = async () => {
    setScrollPosition(scrollRef.current?.element?.scrollTop || 0);
    if (hasNextPage) {
      fetchNextPage();
    }
  };
  const isOverFlowScroll = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  const PerfectScrollbar = styled(PerfectScrollbarComponent)({
    maxHeight: 280,
  });

  const ScrollWrapper = ({ children, isOverFlowScroll }: PropsWithChildren<{ isOverFlowScroll: boolean }>) => {
    if (isOverFlowScroll) {
      return (
        <Box
          sx={{
            height: {
              xs: "400px",
              sm: "400px",
              md: "520px",
              lg: "420px",
              xl: "400px",
            },
            overflowY: "auto",
            overflowX: {
              xs: "auto",
              md: "hidden",
            },
          }}
        >
          {children}
        </Box>
      );
    } else {
      return (
        <PerfectScrollbar
          containerRef={(el) => {
            scrollRef.current.element = el;
          }}
          onYReachEnd={handleReachEnd}
          options={{ wheelPropagation: false, suppressScrollX: true }}
          sx={{
            height: {
              xs: "400px",
              sm: "400px",
              md: "430px",
              lg: "420px",
              xl: "400px",
            },
          }}
        >
          {children}
        </PerfectScrollbar>
      );
    }
  };

  useEffect(() => {
    if (scrollRef.current.element) {
      scrollRef.current.element.scrollTop = scrollPosition;
    }
  }, [data, scrollPosition]);

  const UserTableHead = () => (
    <TableHead>
      <TableRow
        sx={{
          "& .MuiTableCell-root": {
            py: (theme) => `${theme.spacing(2.5)} !important`,
          },
        }}
      >
        <TableCell scope="col">
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            {isTherapist ? "Patient Name" : "Therapist Name"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Date/Time
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Duration
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Amount
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            VAT
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            TOTAL
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const UserRow = (row: ISession) => (
    <TableRow
      key={row._id}
      sx={{
        "& .MuiTableCell-root": {
          border: 0,
          py: (theme) => `${theme.spacing(3)} !important`,
        },
      }}
    >
      <TableCell>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              flex: "1 1",
              display: "flex",
              overflow: "hidden",
              flexDirection: "column",
            }}
          >
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "text.primary" }}>
              {isTherapist ? row.attendees.at(0)?.user.name : `${row.therapist.firstName} ${row.therapist.lastName}`}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="caption">{moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">
          {Math.floor(row.duration / 60) + ":" + String(row.duration % 60).padStart(2, "0")}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">£{row?.tid?.amount.toFixed(2)}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">£{row?.tid?.VATCharge.toFixed(2)}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">£{(row?.tid?.amount + row?.tid?.VATCharge).toFixed(2)}</Typography>
      </TableCell>
    </TableRow>
  );

  const TherapistTableHead = () => (
    <TableHead>
      <TableRow
        sx={{
          "& .MuiTableCell-root": {
            py: (theme) => `${theme.spacing(2.5)} !important`,
          },
        }}
      >
        <TableCell scope="col">
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Client Name
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Date/Time
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Duration
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Trial Minutes
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Earning
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Commision
          </Typography>
        </TableCell>
        {isVAT && (
          <TableCell>
            <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
              VAT
            </Typography>
          </TableCell>
        )}
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            TOTAL
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const closeDrawer = () => {
    setOpen(false);
    setSelectedTranscript("");
  };

  const TherapistRow = (row: ISession) => (
    <TableRow
      key={row._id}
      sx={{
        "& .MuiTableCell-root": {
          border: 0,
          py: (theme) => `${theme.spacing(3)} !important`,
        },
      }}
    >
      <TableCell>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              flex: "1 1",
              display: "flex",
              overflow: "hidden",
              flexDirection: "column",
            }}
          >
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "text.primary" }}>
              {isTherapist
                ? `${row.users[0][0].firstName} ${row.users[0][0].lastName}`
                : `${row?.therapist?.firstName} ${row?.therapist.lastName}`}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="caption">{moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">
          {Math.floor(row.duration / 60) + ":" + String(row.duration % 60).padStart(2, "0")}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">{row.tid.usedFreeTrialMinutes.toString().replaceAll(".", ":")}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">£{(row.sessionPrice + row.tid.VATCharge).toFixed(2)}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">£{(row.tid.platformVATCharge + row.tid.commissionAmount).toFixed(2)}</Typography>
      </TableCell>
      {isVAT && (
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            <Typography variant="caption">{row.tid.therapistVATCharge.toFixed(2)}</Typography>
          </Typography>
        </TableCell>
      )}
      <TableCell>
        <Typography variant="caption">
          £
          {(
            (isVAT ? row.tid.therapistVATCharge : 0) +
            row.sessionPrice -
            (row.tid?.commissionAmount ? row.tid.commissionAmount : 0)
          ).toFixed(2)}
        </Typography>
      </TableCell>
    </TableRow>
  );

  const AdminTableHead = () => (
    <TableHead>
      <TableRow
        sx={{
          "& .MuiTableCell-root": {
            py: (theme) => `${theme.spacing(2.5)} !important`,
          },
        }}
      >
        <TableCell scope="col">
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Therapist Name
          </Typography>
        </TableCell>
        <TableCell scope="col">
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            User Name
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Date/Time
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Duration
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="overline" sx={{ color: "text.black", fontWeight: "500" }}>
            Commision
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const AdminRow = (row: ISession) => (
    <TableRow
      key={row._id}
      sx={{
        "& .MuiTableCell-root": {
          border: 0,
          py: (theme) => `${theme.spacing(3)} !important`,
        },
      }}
    >
      <TableCell>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              flex: "1 1",
              display: "flex",
              overflow: "hidden",
              flexDirection: "column",
            }}
          >
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "text.primary" }}>
              {row.therapist.firstName + " " + row.therapist.lastName}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              flex: "1 1",
              display: "flex",
              overflow: "hidden",
              flexDirection: "column",
            }}
          >
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "text.primary" }}>
              {row.attendees.at(0)?.user.firstName + " " + row.attendees.at(0)?.user.lastName}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="caption">{moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">{Math.floor(row.duration / 60) + ":" + (row.duration % 60)}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">£{(row.tid.platformVATCharge + row.tid.commissionAmount).toFixed(2)}</Typography>
      </TableCell>
    </TableRow>
  );

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

  return (
    <>
      <Card
        sx={{
          height: {
            xs: "400px",
            sm: "400px",
            md: "520px",
            lg: "420px",
            xl: "400px",
          },
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            "@media screen and (max-width: 767px)": {
              flexDirection: "column",
            },
            alignItems: "center",
          }}
        >
          <Grid item xs={6}>
            <CardHeader title="Transaction History" />
          </Grid>
          {users && users[0].roles[0] === ROLE.ADMIN && (
            <Grid item xs={6} sx={{ display: "flex", alignItems: "end", justifyContent: "end" }}>
              <DateRangeSelector
                onDateSelect={(sDate, eDate) => {
                  setGetSessionParams({
                    sessionStatus: "ended",
                    limit: 10,
                    startDate: sDate,
                    endDate: eDate,
                  });
                }}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                startDate={startDate}
                onClear={() => {
                  setGetSessionParams({ sessionStatus: "ended", limit: 10 });
                  setEndDate("");
                  setStartDate("");
                }}
              />
            </Grid>
          )}
          {isTherapist && (
            <Box
              sx={{
                alignItems: "center",
                mr: 2,
                mt: 2,
                display: "flex",
                flexDirection: "row",
                "@media screen and (max-width: 767px)": {
                  marginLeft: "20px",
                  marginRight: "20px",
                },
              }}
            >
              <Box
                sx={{
                  mr: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  "@media screen and (max-width: 767px)": {
                    alignItems: "flex-start",
                  },
                }}
              >
                <Typography>Available to Withdraw</Typography>
                <Typography>£ {walletBalance ? walletBalance : 0}</Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                Withdraw
              </Button>
            </Box>
          )}
        </Box>

        <TableContainer>
          {data?.pages[0]?.results.length > 0 ? (
            <ScrollWrapper isOverFlowScroll={isOverFlowScroll}>
              <Table>
                {users && users[0].roles[0] === ROLE.THERAPIST && <TherapistTableHead />}
                {users && users[0].roles[0] === ROLE.USER && <UserTableHead />}
                {users && users[0].roles[0] === ROLE.ADMIN && <AdminTableHead />}
                <TableBody>
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    data &&
                    data.pages.map((page) =>
                      page.results.map((row: ISession) => {
                        return users && users[0].roles[0] === ROLE.THERAPIST ? (
                          <TherapistRow {...row} />
                        ) : users && users[0].roles[0] === ROLE.USER ? (
                          <UserRow {...row} />
                        ) : (
                          users && users[0].roles[0] === ROLE.ADMIN && <AdminRow {...row} />
                        );
                      })
                    )
                  )}
                </TableBody>
              </Table>
            </ScrollWrapper>
          ) : (
            <Box
              sx={{
                mt: 6,
                mb: 5,
                display: "flex",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                justifyContent: "center",
                alignItems: "center",
                "& svg": { mr: 2 },
              }}
            >
              <Icon icon="mdi:alert-circle-outline" fontSize={20} />
              <Typography>No Transaction History</Typography>
            </Box>
          )}
        </TableContainer>
      </Card>
      <Dialog aria-labelledby="customized-dialog-title" open={openDialog} maxWidth="sm" scroll="body" fullWidth>
        <>
          <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ textAlign: "center", display: "block" }}>
              Withdraw Money
            </Typography>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 4, textAlign: "center" }}>
            <Typography>
              Thankyou for your request. Please send your invoice to <b>payments@24hrtherapy.co.uk</b>
            </Typography>
            <Button
              variant={"outlined"}
              sx={{ my: "1rem" }}
              onClick={() => {
                setWalletBalance("0");
                setOpenDialog(false);
              }}
            >
              Ok
            </Button>
          </DialogContent>
        </>
      </Dialog>

      <div>
        <Drawer open={open} onClose={closeDrawer} anchor="right">
          {DrawerList}
        </Drawer>
      </div>
    </>
  );
};

export default CardSessionHistory;
