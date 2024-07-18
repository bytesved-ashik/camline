import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  DialogContentText,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import Query from "src/layouts/components/queries/Query";
import { QueryKeyString } from "@/enums/queryKey.enums";
import { REQUEST_STATUS } from "@/enums/requestStatus.enums";
import useUserQueries from "@/hooks/session/useUserQueries";
import { Category } from "@/types/interfaces/category.interface";
import * as toast from "@/utils/toast";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box } from "@mui/system";
import PerfectScrollbarComponent from "react-perfect-scrollbar";
import Icon from "src/@core/components/icon";
import { getCategories } from "src/services/category.service";
import { createRequest } from "src/services/session.service";
import useWalletUtility from "@/hooks/wallet/useWalletUtility";
import TopUpWallet from "../dialogs/TopUpWallet";
import { useBalance } from "@/store/wallet/useBalance";
import { subscribeEvt } from "@/utils/events";
import useGetUpcomingSession from "@/hooks/common/useGetUpcomingSession";

const CardQuery = () => {
  const queryClient = useQueryClient();
  const selectedTherapyRef = useRef<HTMLInputElement | null>(null);
  const [inputQuery, setInputQuery] = useState("");
  const [openCreateQuery, setOpenCreateQuery] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [requestType] = useState<string>("private");
  const [requestStatus] = useState<REQUEST_STATUS>(REQUEST_STATUS.IN_POOL);
  const [minBudget] = useState<number>(1);
  const [maxBudget] = useState<number>(1);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const scrollRef = useRef<{ element: HTMLElement | null }>({ element: null });
  const [filter, setFilter] = useState("Your_Query");

  const { refetch: balanceRefetch } = useBalance();

  const queryRequestParams = {
    sort: "createdAt:desc",
    limit: 5,
    page: 1,
  };

  const { userQueries, hasNextPage, fetchNextPage, refetch } = useUserQueries(queryRequestParams);

  const {
    data,
    hasNextPage: hasNextPages,
    fetchNextPage: fetchNextPages,
    refetch: refresh,
  } = useGetUpcomingSession({
    limit: 5,
  });
  const { setShowTopUpModal, showTopUpModal } = useWalletUtility();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleSubmit = async () => {
    if (!selectedTherapyRef.current?.value || !inputQuery || /^\s*$/.test(inputQuery)) {
      toast.error("Please fill all the fields");

      return;
    }

    const selectedTherapy = categories.find((category) => {
      if (!selectedTherapyRef.current) {
        return false;
      }

      return category.name === selectedTherapyRef.current.value;
    });

    if (!selectedTherapy) {
      toast.error("Please select a valid therapy category");

      return;
    }

    if (inputQuery.length > 200) {
      toast.error("Please enter reason lesson less than 200 characters");

      return;
    }

    const createQueryData = {
      requestType,
      requestStatus,
      categories: [selectedTherapy._id],
      query: inputQuery,
      minBudget,
      maxBudget,
    };

    createRequest(createQueryData)
      .then(() => {
        toast.success("Query created successfully");
        queryClient.invalidateQueries([QueryKeyString.USER_QUERIES_DATA, queryRequestParams]);
        balanceRefetch();
        setOpenCreateQuery(false);
      })
      .catch((err) => {
        if (
          err?.response?.data?.message === "Don't have a top-up transaction" ||
          err?.response?.data?.message === "Insufficient funds"
        ) {
          toast.error("You don't have enough balance to create a query");
          setShowTopUpModal(true);

          return;
        }
        toast.error(err?.response?.data?.message || "Unexpected Error Occured");
        setOpenCreateQuery(false);
      });
  };

  const handleCloseCreateQuery = () => {
    setOpenCreateQuery(false);
  };

  const getAllCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    subscribeEvt("queryCreated", () => {
      refetch();
    });
  }, []);

  const handleReachEnd = async () => {
    setScrollPosition(scrollRef.current?.element?.scrollTop || 0);
    if (hasNextPage) {
      fetchNextPage();
    }
    if (hasNextPages) {
      fetchNextPages();
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
  }, [userQueries, scrollPosition, data]);

  const handleChange = (event: any, newValue: any) => {
    setFilter(newValue);
  };

  return (
    <>
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
        <Tab label="Your Query" value="Your_Query" />
        <Tab label="Scheduled Sessions" value="Scheduled_Sessions" />
      </Tabs>
      {filter == "Your_Query" ? (
        <Card
          sx={{
            height: {
              xs: "600px",
              md: "400px",
              lg: "350px",
              xl: "850px",
            },
          }}
        >
          <CardHeader title="Your Queries" />
          <CardContent sx={{ height: "100vh" }}>
            <List sx={{ p: 0 }}>
              {!userQueries && userQueries ? (
                <Box
                  sx={{
                    mt: 6,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "& svg": { mr: 2 },
                  }}
                >
                  <Icon icon="mdi:alert-circle-outline" fontSize={20} />
                  <Typography>No Queries</Typography>
                </Box>
              ) : (
                <>
                  <ScrollWrapper isOverFlowScroll={isOverFlowScroll}>
                    <>
                      <List sx={{ paddingX: 4 }}>
                        <ListItem sx={{ p: 0, borderBottom: "2px solid #eaeaec" }}>
                          <ListItemText
                            primaryTypographyProps={{
                              sx: { fontSize: "14px", fontWeight: "bold" },
                            }}
                            primary="QUERY"
                          />
                          <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>STATUS</Typography>
                        </ListItem>
                      </List>

                      <Box sx={{ paddingX: 4 }}>
                        {userQueries?.pages.map((page) =>
                          page.results.map((query) => {
                            return (
                              query?.requestType == "private" && <Query key={query._id} data={query} refetch={refetch} />
                            );
                          })
                        )}
                      </Box>
                    </>
                  </ScrollWrapper>
                </>
              )}
            </List>
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            height: {
              xs: "600px",
              md: "400px",
              lg: "350px",
              xl: "850px",
            },
          }}
        >
          <CardHeader title="Schedule Session" />
          <CardContent sx={{ height: "100vh" }}>
            <List sx={{ p: 0 }}>
              {!data && data ? (
                <Box
                  sx={{
                    mt: 6,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "& svg": { mr: 2 },
                  }}
                >
                  <Icon icon="mdi:alert-circle-outline" fontSize={20} />
                  <Typography>No Queries</Typography>
                </Box>
              ) : (
                <>
                  <ScrollWrapper isOverFlowScroll={isOverFlowScroll}>
                    <>
                      <List sx={{ paddingX: 4 }}>
                        <ListItem sx={{ p: 0, borderBottom: "2px solid #eaeaec" }}>
                          <ListItemText
                            primaryTypographyProps={{
                              sx: { fontSize: "14px", fontWeight: "bold" },
                            }}
                            primary="QUERY"
                          />
                          <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>STATUS</Typography>
                        </ListItem>
                      </List>

                      <Box sx={{ paddingX: 4 }}>
                        {data?.pages.map((page) =>
                          page.results.map((query) => {
                            return <Query key={query._id} data={query} refetch={refresh} scheduledSession={true} />;
                          })
                        )}
                      </Box>
                    </>
                  </ScrollWrapper>
                </>
              )}
            </List>
          </CardContent>
        </Card>
      )}
      <Dialog
        fullScreen={fullScreen}
        aria-labelledby="customized-dialog-title"
        open={openCreateQuery}
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
            onClick={handleCloseCreateQuery}
            sx={{ top: 10, right: 10, position: "absolute", color: "grey.500" }}
          >
            <Icon icon="mdi:close" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <DialogContentText>
            <Box sx={{ mb: 4 }}>
              <TextField
                sx={{ position: "relative" }}
                rows={8}
                multiline
                label="Write your reason"
                id="textarea-outlined-static"
                fullWidth
                value={inputQuery}
                onChange={(e) => {
                  setInputQuery(e.target.value);
                }}
                required
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" sx={{ position: "absolute", bottom: 2, right: 10 }}>
                      {inputQuery.length}/200
                    </Typography>
                  ),
                }}
                error={inputQuery.length > 200}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <Autocomplete
                options={categories}
                getOptionLabel={(item: Category) => item.name}
                id="autocomplete-outlined"
                fullWidth
                renderInput={(params) => <TextField inputRef={selectedTherapyRef} {...params} label="Therapy Type" />}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" onClick={handleCloseCreateQuery}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <TopUpWallet
        closeDialog={() => {
          setShowTopUpModal(false);
        }}
        showDialog={showTopUpModal}
      />
    </>
  );
};

export default CardQuery;
