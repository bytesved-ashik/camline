import { labels } from "@/constants/queryLabelsConstant";
import { REQUEST_STATUS } from "@/enums/requestStatus.enums";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { getCategories } from "@/services/category.service";
import { acceptNotificationFromPatient, rejectRequestById } from "@/services/session.service";
import { useSessionData } from "@/store/sessionData/useSessionData";
import { Category } from "@/types/interfaces/category.interface";
import { IMatchedRequests } from "@/types/interfaces/matchedRequests.interface";
import { Icon } from "@iconify/react";
import {
  Box,
  Card,
  Checkbox,
  Chip,
  Divider,
  Grid,
  IconButton,
  Input,
  List,
  Skeleton,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import ListItem, { ListItemProps } from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { useRouter } from "next/router";
import { Dispatch, PropsWithChildren, SetStateAction, useEffect, useState } from "react";
import PerfectScrollbarComponent from "react-perfect-scrollbar";
import { v4 as uuidv4 } from "uuid";

export type Props = {
  contentWidth: string;
  queryData: IMatchedRequests[];
  handleOnEndReach: () => void;
  setRefreshQueryData: Dispatch<SetStateAction<boolean>>;
  hasNextPage: boolean;
  scrollPosition: number;
  scrollRef: React.MutableRefObject<{ element: HTMLElement | null }>;
};

const QueryPoolContent = (props: Props) => {
  const scrollRef = props.scrollRef;
  const [filled, setFilled] = useState(false);
  const { setSessionId } = useSessionData();
  const [prevQueryData, setPrevQueryData] = useState<IMatchedRequests[]>([]);

  const { mutate: acceptNotification } = useCustomMutation({
    api: acceptNotificationFromPatient,
    onSuccess: (res) => {
      setSessionId(res._id);

      router.push({
        pathname: `/session/${res._id}`,
      });
    },
    onError: () => {
      props.setRefreshQueryData((prev) => !prev);
    },
  });
  useEffect(() => {
    if (scrollRef.current.element) {
      scrollRef.current.element.scrollTop = props.scrollPosition;
    }
  }, [props.scrollPosition]);

  const getChipColor = (requestStatus: string) => {
    const label = labels.find((label) => label.status === requestStatus);

    return label ? label.color : "default";
  };

  const handleClick = () => {
    setFilled(!filled);
  };

  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const OnRefreshButtonClick = async () => {
    props.setRefreshQueryData((prev) => !prev);
  };

  const router = useRouter();

  const handleAccept = async (sessionId: string) => {
    const streamId = uuidv4();
    acceptNotification({ streamId, sessionId });
  };
  const handleReject = async (sessionId: string) => {
    await rejectRequestById(sessionId)
      .then(() => {
        props.setRefreshQueryData((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // TODO: some category by the backend gives string,so when fixed, later this should be changes to type Category
  const getCategoryNameById = (id: any) => {
    const category = allCategories.find((category: Category) => category._id === id);

    return category ? category.name : "";
  };

  const isOverFlowScroll = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  const PerfectScrollbar = styled(PerfectScrollbarComponent)({
    maxHeight: 250,
  });

  const ScrollWrapper = ({ children, isOverFlowScroll }: PropsWithChildren<{ isOverFlowScroll: boolean }>) => {
    if (isOverFlowScroll) {
      return <Box sx={{ maxHeight: 920, overflowY: "auto", overflowX: "hidden" }}>{children}</Box>;
    } else {
      return (
        <PerfectScrollbar
          containerRef={(el) => {
            scrollRef.current.element = el;
          }}
          onYReachEnd={props.handleOnEndReach}
          options={{ wheelPropagation: false, suppressScrollX: true }}
          sx={{ minHeight: "100%" }}
        >
          {children}
        </PerfectScrollbar>
      );
    }
  };

  useEffect(() => {
    // Fetch all categories from API and store them in memory
    const fetchAllCategories = async () => {
      try {
        const categories = await getCategories();

        setAllCategories(categories);

        const categoryNamesDict: { [key: string]: string } = {};
        categories.forEach((category) => {
          categoryNamesDict[category._id] = category.name;
        });
        if (JSON.stringify(props.queryData) !== JSON.stringify(prevQueryData)) {
          setPrevQueryData(props.queryData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllCategories();
  }, [props.queryData]);

  const MailItem = styled(ListItem)<ListItemProps>(({ theme }) => ({
    cursor: "pointer",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    justifyContent: "space-between",
    transition: "border 0.15s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    "&:not(:first-child)": {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    "&:hover": {
      zIndex: 2,
      boxShadow: theme.shadows[3],
      transform: "translateY(-2px)",
      "& + .MuiListItem-root": { borderColor: "transparent" },
    },
    [theme.breakpoints.up("xs")]: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
    },
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
  }));

  return (
    <>
      <Card component="div" sx={{ width: "100%" }}>
        <Box
          sx={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", "& .ps__rail-y": { zIndex: 5 } }}
        >
          <Box sx={{ height: "100%", backgroundColor: "background.paper" }}>
            <Box sx={{ px: 5, py: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Input
                  placeholder="Search query"
                  sx={{ width: "100%", "&:before, &:after": { display: "none" } }}
                  startAdornment={
                    <InputAdornment position="start" sx={{ color: "text.disabled" }}>
                      <Icon icon="mdi:magnify" fontSize="1.375rem" />
                    </InputAdornment>
                  }
                />
              </Box>
            </Box>
            <Divider sx={{ m: "0 !important" }} />
            <Box sx={{ py: 1.75, px: { xs: 2.5, sm: 5 } }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}></Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton size="small" sx={{ "& svg": { color: "text.disabled" } }} onClick={OnRefreshButtonClick}>
                    <Icon icon="mdi:reload" fontSize="1.375rem" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ m: "0 !important" }} />
            <Box sx={{ p: 0, position: "relative", overflowX: "hidden", height: "calc(100% - 7rem)" }}>
              <ScrollWrapper isOverFlowScroll={isOverFlowScroll}>
                <List sx={{ p: 0 }}>
                  {props.queryData.length > 0 ? (
                    <>
                      {props.queryData.map((item: IMatchedRequests) => (
                        <MailItem
                          key={item._id}
                          sx={{
                            backgroundColor: "background.paper",
                            "@media screen and (max-width: 767px)": {
                              flexWrap: "wrap",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              overflowX: "hidden",
                              overflowY: "auto",
                              alignItems: "center",
                              position: "relative",
                              zIndex: "999",
                            }}
                          >
                            <Box
                              sx={{
                                mr: 4,
                                display: "flex",
                                overflowX: "hidden",
                                overflowY: "auto",
                                alignItems: "center",
                                "@media screen and (max-width: 767px)": {
                                  alignItems: "flex-start",
                                },
                              }}
                            >
                              <Checkbox
                                sx={{
                                  "@media screen and (max-width: 767px)": {
                                    paddingLeft: "0",
                                    paddingTop: "3px",
                                  },
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={handleClick}
                                sx={{
                                  mr: { xs: 0, sm: 3 },
                                  color: filled ? "text.secondary" : "warning.main",
                                  "& svg": {
                                    display: { xs: "none", sm: "block" },
                                  },
                                }}
                              >
                                {filled ? <Icon icon="mdi:star-outline" /> : <Icon icon="ic:outline-star-border" />}
                              </IconButton>
                              <Box>
                                <Typography
                                  noWrap
                                  sx={{
                                    mr: 4,
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                    width: "100%",
                                    "@media screen and (max-width: 767px)": {
                                      whiteSpace: "normal",
                                    },
                                  }}
                                >
                                  {item.query}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: { xs: "flex-start", sm: "center" },
                                    mt: 1,
                                    "@media screen and (max-width: 767px)": {
                                      flexDirection: "column",
                                    },
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      minWidth: "50px",

                                      // whiteSpace: "nowrap",
                                      color: "text.disabled",
                                      mr: 4,
                                      "@media screen and (max-width: 767px)": {
                                        whiteSpace: "normal",
                                        marginBottom: "10px",
                                      },
                                    }}
                                  >
                                    {moment(item.requestedAt).format("h:mm A")}
                                  </Typography>
                                  <Chip
                                    label={
                                      item.categories[0].name
                                        ? item.categories[0].name
                                        : getCategoryNameById(item.categories[0])
                                    }
                                    sx={{
                                      height: 26,
                                      whiteSpace: "normal",
                                      "@media screen and (max-width: 767px)": {
                                        whiteSpace: "normal",
                                        height: "auto",
                                        marginBottom: "10px",
                                        padding: "5px 0",
                                      },
                                      "& .MuiChip-label": {
                                        whiteSpace: "normal",
                                      },
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Box sx={{ ml: "auto", mr: 4, display: "flex", flexDirection: "row" }}>
                            {item.requestStatus === REQUEST_STATUS.IN_POOL ? (
                              <>
                                <IconButton
                                  onClick={() => {
                                    handleAccept(item._id);
                                  }}
                                  title="Accept Query"
                                >
                                  <Icon icon="fluent-mdl2:accept-medium" fontSize="1.3rem" />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    handleReject(item._id);
                                  }}
                                  title={"Reject Query"}
                                >
                                  <Icon icon="mdi:window-close" fontSize="1.3rem" />
                                </IconButton>
                              </>
                            ) : null}
                          </Box>
                          <Box
                            sx={{
                              mr: 4,
                              backgroundColor: getChipColor(item.requestStatus),
                              borderRadius: "20px",
                            }}
                          >
                            <Chip
                              label={item.requestStatus}
                              sx={{ color: "white", padding: "6px", textTransform: "capitalize", width: "6.5rem" }}
                            />
                          </Box>
                        </MailItem>
                      ))}
                      <>
                        {props.hasNextPage ? (
                          <Grid container spacing={1} mb={8}>
                            <Skeleton variant="text" width={"95%"} height={"4rem"} sx={{ margin: "0 auto" }} />
                            <Skeleton variant="text" width={"95%"} height={"4rem"} sx={{ margin: "0 auto" }} />
                          </Grid>
                        ) : null}
                      </>
                    </>
                  ) : (
                    <Box sx={{ mt: 6, display: "flex", justifyContent: "center", alignItems: "center", "& svg": { mr: 2 } }}>
                      <Icon icon="mdi:alert-circle-outline" fontSize={20} />
                      <Typography>No Queries Found</Typography>
                    </Box>
                  )}
                </List>
              </ScrollWrapper>
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default QueryPoolContent;
