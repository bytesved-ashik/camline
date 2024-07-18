// ** MUI Imports
import Grid from "@mui/material/Grid";
import Caption from "src/components/ui/typography/Caption";
import { ROLE } from "@/enums/role.enums";
import { Box, Button, List, Paper, Theme, styled, useMediaQuery } from "@mui/material";
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import UserList from "@/components/common/userlist/UserList";
import PerfectScrollbarComponent from "react-perfect-scrollbar";
import ScheduleCallModal from "@/components/common/userlist/ScheduleCallModal";
import { useSession } from "next-auth/react";
import useGetSessionsHistory from "@/hooks/common/useGetSessionsHistory";

const CallLogs = () => {
  const scrollRef = useRef<{ element: HTMLElement | null }>({ element: null });

  const {
    data: callLogs,
    hasNextPage,
    fetchNextPage,
  } = useGetSessionsHistory({
    sessionStatus: "ended",
    limit: 5,
  });
  const { data: users } = useSession();
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [therapistData, setTherapistData] = useState<any[]>([]);
  const [therapistId, setTherapistId] = useState<string>("");

  const onShortlist = useCallback(
    (id: string) => {
      const tcopy = JSON.parse(JSON.stringify(therapistData));
      setTherapistData([]);
      const t = tcopy.filter((val: any) => val.user._id !== id);
      setTherapistData(JSON.parse(JSON.stringify(t)));
    },
    [therapistData]
  );

  const onCheckTherapist = useCallback(
    (id: string) => {
      setTherapistId(id);
    },
    [therapistData]
  );

  const handleCloseModal = () => {
    setTherapistId("");
  };

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
  }, [callLogs, scrollPosition]);

  return (
    <Grid
      container
      spacing={6}
      sx={{
        "@media screen and (max-width: 767px)": {
          width: "100%",
          marginLeft: 0,
        },
      }}
    >
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Caption
              data={{
                title: users && users.user?.roles[0] === ROLE.USER ? "Therapist" : "User",
                subText:
                  users && users.user?.roles[0] === ROLE.USER
                    ? "Previously connected therapists"
                    : users && users.user?.roles[0] === ROLE.ADMIN
                    ? `Total Therapists: ${therapistData.length}`
                    : "Previously connected user",
              }}
            />
          </Box>
        </Box>
      </Grid>

      <Paper
        sx={{
          p: 2,
          margin: "auto",
          maxWidth: "100%",
          flexGrow: 1,
          ml: 6,
          mt: 5,
          "@media screen and (max-width: 767px)": {
            marginLeft: 0,
          },
        }}
      >
        <Grid item xs={12}>
          <List>
            <>
              <Box
                sx={{
                  paddingX: 1,
                  display: "grid",
                  m: 5,
                  "@media screen and (max-width: 767px)": {
                    marginLeft: 0,
                    marginRight: 0,
                  },
                }}
              >
                <ScrollWrapper isOverFlowScroll={isOverFlowScroll}>
                  {callLogs &&
                    callLogs.pages?.map((pages: any) => {
                      return pages.results.map((therapist: any, index: any) => {
                        return (
                          <Button
                            sx={{
                              pt: 2,
                              pb: 3,
                              textTransform: "none",
                              width: "100%",
                              mb: 5,
                            }}
                            key={index}
                          >
                            <UserList
                              profilePicture={
                                users && users.user.roles[0] === ROLE.USER
                                  ? therapist.therapist.profilePicture
                                  : therapist.users[0][0].profilePicture
                              }
                              therapist={
                                users && users.user.roles[0] === ROLE.THERAPIST
                                  ? therapist?.users[0][0]
                                  : therapist?.therapist
                              }
                              categories={users && users.user.roles[0] === ROLE.USER ? therapist.therapist.categories : []}
                              isInShortlist={therapist.isInShortlist}
                              sessionTime={therapist}
                              onShortlist={onShortlist}
                              onCheckTherapist={onCheckTherapist}
                              inCall={therapist?.isTherapistInsession}
                              DisplayTranscript={true}
                              transcriptId={therapist?._id}
                              duration={therapist?.duration}
                              therapiseName={
                                users && users.user.roles[0] === ROLE.THERAPIST
                                  ? `${therapist.attendees[0]?.user?.firstName} ${therapist.attendees[0]?.user?.lastName}`
                                  : `${therapist?.therapist?.firstName} ${therapist?.therapist?.lastName}`
                              }
                            />
                          </Button>
                        );
                      });
                    })}
                </ScrollWrapper>
              </Box>
            </>
          </List>
        </Grid>
        <ScheduleCallModal
          showDialog={therapistId ? true : false}
          closeDialog={handleCloseModal}
          therapistId={therapistId}
          therapistCall={true}
        />
      </Paper>
    </Grid>
  );
};

export default CallLogs;
