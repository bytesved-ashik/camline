import { Box, Card, CardContent, CardHeader, Theme, Typography } from "@mui/material";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import OptionsMenu from "../../menu/OptionsMenu";
import CustomChip from "src/@core/components/mui/chip";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import moment from "moment";
import useGetScheduleSessions from "@/hooks/therapist/useGetScheduleSessions";
import { ISession } from "@/types/interfaces/session.interface";
import PerfectScrollbarComponent from "react-perfect-scrollbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";

const ScheduleCard = () => {
  const getSessionParams = { sessionType: "private", sessionStatus: "accepted", limit: 6 };
  const { data, isLoading, hasNextPage, fetchNextPage } = useGetScheduleSessions(getSessionParams);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const scrollRef = useRef<{ element: HTMLElement | null }>({ element: null });
  const router = useRouter();

  const handleReachEnd = async () => {
    setScrollPosition(scrollRef.current?.element?.scrollTop || 0);
    if (hasNextPage) {
      fetchNextPage();
    }
  };
  const isOverFlowScroll = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const PerfectScrollbar = styled(PerfectScrollbarComponent)({
    maxHeight: 310,
  });
  const ScrollWrapper = ({ children, isOverFlowScroll }: PropsWithChildren<{ isOverFlowScroll: boolean }>) => {
    if (isOverFlowScroll) {
      return <Box sx={{ maxHeight: 220, overflowY: "auto", overflowX: "hidden" }}>{children}</Box>;
    } else {
      return (
        <PerfectScrollbar
          containerRef={(el) => {
            scrollRef.current.element = el;
          }}
          onYReachEnd={handleReachEnd}
          options={{ wheelPropagation: false, suppressScrollX: true }}
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

  return (
    <Card
      sx={{
        height: {
          xs: "200px",
          md: "280px",
          lg: "100%",
          xl: "400px",
        },
        position: "relative",
      }}
    >
      <CardHeader
        title="Schedules"
        action={
          <OptionsMenu
            options={["Refresh", "Share", "Reschedule"]}
            iconButtonProps={{ size: "small", sx: { color: "text.primary" } }}
          />
        }
        sx={{ borderBottom: "2px solid #eaeaec" }}
      />
      <CardContent sx={{ mt: 6 }}>
        {data?.pages[0]?.results.length > 0 ? (
          <ScrollWrapper isOverFlowScroll={isOverFlowScroll}>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              data &&
              data.pages.map((page) =>
                page.results.map((session: ISession, index: number) => {
                  const isUpcomming =
                    moment().isSameOrBefore(session?.sessionStartTime) || moment().isSame(session?.sessionStartTime, "day");

                  const joinButton = moment().isSameOrAfter(session?.sessionStartTime);

                  return (
                    isUpcomming && (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: index !== page.results.length ? 5 : undefined,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ fontSize: "20px" }}>
                            <Icon fontSize="1rem" icon="mdi:calendar-blank-outline" />
                          </Box>
                          <Box sx={{ mx: 2, display: "flex", mb: 0.4, flexDirection: "column", flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "text.primary" }}>
                              {moment(session.sessionStartTime).format("Do MMMM YYYY, h:mm a")}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                "& svg": { mr: 1.5, color: "text.secondary", verticalAlign: "middle" },
                              }}
                            >
                              <Typography variant="caption">
                                {session?.attendees[index]?.user._id ? session.attendees[index].user._id : ""}
                              </Typography>
                            </Box>
                          </Box>
                          <CustomChip
                            skin="light"
                            size="small"
                            label={joinButton ? "Join" : "Scheduled"}
                            color={joinButton ? "error" : "primary"}
                            sx={{ height: 20, fontSize: "0.75rem", fontWeight: 500, cursor: "pointer" }}
                            onClick={() => {
                              if (!joinButton) return;
                              router.push({
                                pathname: `/session/${session?._id}`,
                              });
                            }}
                          />
                        </Box>
                      </Box>
                    )
                  );
                })
              )
            )}
          </ScrollWrapper>
        ) : (
          <Box
            sx={{
              mt: 6,
              mb: 5,
              display: "flex",
              position: "absolute",
              top: "50%",
              left: { xs: "47%", sm: "50%" },
              transform: "translate(-50%, -50%)",
              justifyContent: "center",
              alignItems: "center",
              "& svg": { mr: 2 },
            }}
          >
            <Icon icon="mdi:alert-circle-outline" fontSize={20} />
            <Typography sx={{ display: "inline-block" }}>No Scheduled Sessions</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
