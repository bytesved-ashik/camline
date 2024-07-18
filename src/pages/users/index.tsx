import { Box, Button, Grid, IconButton, Paper, Theme, Tooltip, Typography } from "@mui/material";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import PerfectScrollbarComponent from "react-perfect-scrollbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import { ROLE } from "@/enums/role.enums";
import useGetAllUsers from "@/hooks/user/useGetAllUsers";
import Caption from "src/components/ui/typography/Caption";
import UsersList from "@/components/common/userlist/Users";
import DateRangeSelector from "@/components/common/DateRangeSelector/DateRangeSelector";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const Users = () => {
  const [getSessionParams, setGetSessionParams] = useState<any>({ limit: 50 });
  const { data, isLoading, hasNextPage, fetchNextPage } = useGetAllUsers(getSessionParams);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const scrollRef = useRef<{ element: HTMLElement | null }>({ element: null });
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();

  const handleReachEnd = async () => {
    setScrollPosition(scrollRef.current?.element?.scrollTop || 0);
    if (hasNextPage) {
      fetchNextPage();
    }
  };
  const isOverFlowScroll = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  const PerfectScrollbar = styled(PerfectScrollbarComponent)({
    maxHeight: 450,
  });

  const ScrollWrapper = ({ children, isOverFlowScroll }: PropsWithChildren<{ isOverFlowScroll: boolean }>) => {
    if (isOverFlowScroll) {
      return (
        <Box
          sx={{
            height: {
              xs: "100%",
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
              xs: "100%",
              sm: "100%",
              md: "430px",
              lg: "420px",
              xl: "100%",
            },
          }}
        >
          {children}
        </PerfectScrollbar>
      );
    }
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "PhoneNumber,FirstName,Lastname,Gender,Status,Email,Referred By\n" +
      data?.pages[0]?.results
        .map(
          (user: any) =>
            `"${user?.phoneNumber.substring(0, 3)} ${user?.phoneNumber.substring(3)}","${user?.user?.firstName}", "${
              user?.user?.lastName
            }","${user?.user?.gender}","${user?.user?.status}","${user?.user?.email}","${user?.user?.referralCode}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "User_list.csv");
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    if (scrollRef.current.element) {
      scrollRef.current.element.scrollTop = scrollPosition;
    }
  }, [data, scrollPosition]);

  return (
    !isLoading && (
      <>
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
          <Grid item xs={6}>
            <Caption
              data={{
                title: "Users",
                subText: `Total Users: ${JSON.stringify(data?.pages[0]?.totalUsers)}`,
              }}
            />
          </Grid>
          <Grid item xs={6} sx={{ display: "flex", alignItems: "end", justifyContent: "end" }}>
            <DateRangeSelector
              onDateSelect={(startDate, endDate) => {
                setGetSessionParams({
                  limit: 10,
                  startDate: startDate,
                  endDate: endDate,
                });
              }}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              startDate={startDate}
              onClear={() => {
                setGetSessionParams({ limit: 10 });
                setEndDate("");
                setStartDate("");
              }}
            />
            <Tooltip title="Export to CSV" placement="top">
              <IconButton onClick={downloadCSV}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
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
              {data?.pages[0]?.results.length > 0 ? (
                <ScrollWrapper isOverFlowScroll={isOverFlowScroll}>
                  {data &&
                    data.pages.map((page) =>
                      page.results.map((row: any, index: number) => (
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
                          <UsersList user={row.user} categories={row.categories ?? []} userTopUp={row} />
                        </Button>
                      ))
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
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    justifyContent: "center",
                    alignItems: "center",
                    "& svg": { mr: 2 },
                  }}
                >
                  <Icon icon="mdi:alert-circle-outline" fontSize={20} />
                  <Typography>No Users Found</Typography>
                </Box>
              )}
            </Grid>
          </Paper>
        </Grid>
      </>
    )
  );
};

export default Users;

Users.authGuard = [ROLE.ADMIN];
