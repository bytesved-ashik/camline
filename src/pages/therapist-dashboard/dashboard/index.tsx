import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Theme,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Query from "src/layouts/components/queries/Query";
import Caption from "src/components/ui/typography/Caption";
import useInPoolQueries from "@/hooks/therapist/useInPoolQueries";
import { QueryData } from "@/types/interfaces/query.interface";
import { Icon } from "@iconify/react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useSocket } from "@/store/socket/useSocket";
import { NOTIFICATION_TYPE } from "@/enums/messageTypes";
import useGetUpcomingSession from "@/hooks/common/useGetUpcomingSession";
import PerfectScrollbarComponent from "react-perfect-scrollbar";
import RequestInPool from "@/hooks/common/requestInPool";
import useGetUserInfo from "@/hooks/profile/useGetUserInfo";
import { endSessoin } from "@/services/sessions.service";

const TherapistDashboard = () => {
  const { requestsInPool, refetch } = useInPoolQueries();
  const { socket } = useSocket();
  const scrollRef = useRef<{ element: HTMLElement | null }>({ element: null });
  const { data: users } = useGetUserInfo();

  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [filter, setFilter] = useState("Instant_Sessions");

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    refetch: refresh,
  } = useGetUpcomingSession({
    limit: 5,
  });

  const { customUserData, customHasNextPage, customFetchNextPage } = RequestInPool({
    limit: 5,
  });

  const handleReachEnd = async () => {
    setScrollPosition(scrollRef.current?.element?.scrollTop || 0);
    if (hasNextPage) {
      fetchNextPage();
    }
    if (customHasNextPage) {
      customFetchNextPage();
    }
  };

  useEffect(() => {
    if (scrollRef.current.element) {
      scrollRef.current.element.scrollTop = scrollPosition;
    }
  }, [data, scrollPosition, customUserData]);

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
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on(NOTIFICATION_TYPE.REQUEST_ACCEPTED_BY_THERAPIST, () => {
        refetch();
      });
    }
  }, [socket]);

  const walletAndQueryPool = [
    <Grid item xs={12} key="query-pool">
      <Card sx={{ height: "100%" }}>
        <CardHeader title="Query pool" />
        <CardContent>
          <List sx={{ p: 0 }}>
            <ListItem sx={{ p: 0 }}>
              <ListItemText primary="Query" />
              <Typography mx={2.5}>Status</Typography>
            </ListItem>

            {requestsInPool && requestsInPool.length > 0 ? (
              <>
                {requestsInPool.map((item: QueryData, index: number) => (
                  <Query key={index} data={item} refetch={refetch} schedule={false} />
                ))}
              </>
            ) : (
              <Box
                sx={{
                  mt: 6,
                  mb: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100px",
                  "& svg": { mr: 2 },
                }}
              >
                <Icon icon="mdi:alert-circle-outline" fontSize={20} />
                <Typography>No Queries in Pool </Typography>
              </Box>
            )}
          </List>
        </CardContent>
      </Card>
    </Grid>,
  ];

  const upcomingScheduled = [
    <Grid item xs={12} key="query-pool">
      <Card sx={{ height: "100%" }}>
        <CardHeader title="Upcoming Session" />
        <CardContent>
          <ScrollWrapper isOverFlowScroll={isOverFlowScroll}>
            <List sx={{ p: 0 }}>
              <ListItem sx={{ p: 0 }}>
                <ListItemText primary="Query" />
                <Typography mx={2.5}>Status</Typography>
              </ListItem>

              {isLoading ? (
                <p>Loading</p>
              ) : data ? (
                data.pages.map((pages) => {
                  return pages.results.map((item, index) => {
                    return <Query key={index} data={item} refetch={refresh} schedule={true} />;
                  });
                })
              ) : (
                <Box
                  sx={{
                    mt: 6,
                    mb: 5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100px",
                    "& svg": { mr: 2 },
                  }}
                >
                  <Icon icon="mdi:alert-circle-outline" fontSize={20} />
                  <Typography>No upcomingScheduled in Pool </Typography>
                </Box>
              )}
            </List>
          </ScrollWrapper>
        </CardContent>
      </Card>
    </Grid>,
  ];

  const handleChange = (event: any, newValue: any) => {
    setFilter(newValue);
  };

  useEffect(() => {
    if (users && users[0]?._id) {
      endSessoin(users && users[0]?._id)
        .then(() => {
          console.log("Therapist now available");
        })
        .catch((error) => {
          console.error("Error leaving session:", error);
        });
    }
  }, [users]);

  return (
    <>
      <Grid container spacing={6} alignItems="center" mb={6}>
        <Grid item lg={7} md={6} xs={12}>
          <Caption
            data={{
              title: "Dashboard",
              subText: "Access to all your session details on this page",
            }}
          />
        </Grid>
        <Grid item lg={5} md={6} xs={12}>
          <Box
            sx={{
              textAlign: "right",
              "@media screen and (max-width: 767px)": {
                textAlign: "left",
              },
            }}
          >
            <ButtonGroup size="medium">
              <Button>Private</Button>
              <Button disabled={true}>Public</Button>
              <Button disabled={true}>Webinar</Button>
            </ButtonGroup>
          </Box>
        </Grid>
      </Grid>
      <Tabs
        value={filter}
        onChange={handleChange}
        sx={{
          background: "#F7F7F9",
          width: "100%",
          justifyContent: "flex-start",
          "@media screen and (max-width: 767px)": {
            overflow: "auto",
          },
        }}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab label="Instant Sessions" value="Instant_Sessions" />
        <Tab label="Scheduled Sessions" value="Scheduled_Sessions" />
      </Tabs>{" "}
      <Grid container spacing={6} mb={6}>
        {filter == "Instant_Sessions" ? walletAndQueryPool.reverse() : upcomingScheduled}
      </Grid>
    </>
  );
};

export default TherapistDashboard;
