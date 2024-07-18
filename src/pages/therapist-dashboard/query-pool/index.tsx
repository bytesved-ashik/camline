import { getAllMatchingRequests, getRequestInPool, getScheduledRequests } from "@/services/session.service";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "src/@core/hooks/useSettings";
import Caption from "src/components/ui/typography/Caption";
import QueryPoolContent from "./QueryPoolContent";
import SidebarPool from "./SidebarPool";
import { Tabs } from "@/enums/filterTabs.enums";
import { IMatchedRequests } from "@/types/interfaces/matchedRequests.interface";
import { REQUEST_STATUS } from "@/enums/requestStatus.enums";
import { ROLE } from "@/enums/role.enums";
import useAllMatchingQueries from "@/hooks/therapist/useAllMatchingQueries";

const QueryPool = ({}) => {
  const theme = useTheme();
  const { settings } = useSettings();
  const scrollRef = useRef<{ element: HTMLElement | null }>({ element: null });

  // ** Vars
  const limit = 15;
  const leftSidebarWidth = "260px";
  const initialRequestParams = { q: "", sort: "createdAt:desc", limit: limit, page: 1 };
  const { skin } = settings;
  const [activeTab, setActiveTab] = useState("All");
  const [queryData, setQueryData] = useState<IMatchedRequests[]>([]);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const [requestParams, setRequestParams] = useState(initialRequestParams);
  const [totalRequestCount, setTotalRequestCount] = useState(0);
  const [refreshQueryData, setRefreshQueryData] = useState(false);
  const { matchingQueriesRequests, refetch } = useAllMatchingQueries(requestParams);

  const contentWidth = `calc(100% - ${leftSidebarWidth})`;

  const handleActiveTab = (tabName: string) => {
    setTotalRequestCount(0);
    setActiveTab(tabName);
  };
  const handleStatusFilter = async (status: REQUEST_STATUS) => {
    // TODO: filter by status
    console.log("filter status", status);
  };
  const handleOnEndReach = async () => {
    setScrollPosition(scrollRef.current?.element?.scrollTop || 0);
    setRequestParams({ ...requestParams, limit: 10, page: requestParams.page + 1 });

    switch (activeTab) {
      case Tabs.ALL:
        fetchAllMatchingQueries();
        break;
      case Tabs.INPOOL:
        fetchInPoolQueries();
        break;
      case Tabs.SCHEDULED:
        fetchScheduledQueries();
        break;
      default:
        break;
    }
  };

  const fetchAllMatchingQueries = async () => {
    const res = await getAllMatchingRequests(requestParams);
    setTotalRequestCount(res.totalDocs);
    setHasNextPage(res.hasNextPage);
  };

  const fetchInPoolQueries = async () => {
    const res = await getRequestInPool(requestParams);
    setTotalRequestCount(res.totalDocs);
    setHasNextPage(res.hasNextPage);
  };

  const fetchScheduledQueries = async () => {
    const res = await getScheduledRequests(requestParams);
    setTotalRequestCount(res.totalDocs);
    setHasNextPage(res.hasNextPage);
  };

  useEffect(() => {
    setRequestParams(initialRequestParams);
    switch (activeTab) {
      case Tabs.ALL:
        fetchAllMatchingQueries();
        break;
      case Tabs.INPOOL:
        fetchInPoolQueries();
        break;
      case Tabs.SCHEDULED:
        fetchScheduledQueries();
        break;
      default:
        break;
    }
  }, [activeTab, refreshQueryData]);

  useEffect(() => {
    if (scrollRef.current.element) {
      scrollRef.current.element.scrollTop = scrollPosition;
    }
  }, [matchingQueriesRequests, scrollPosition]);

  useEffect(() => {
    setQueryData(matchingQueriesRequests || []);
  }, [matchingQueriesRequests]);

  useEffect(() => {
    refetch();
  }, [refreshQueryData]);

  return (
    <>
      <Grid container spacing={6} mb={6}>
        <Grid item xs={12}>
          <Caption
            data={{
              title: "Query Pool",
              subText: "View request details on this page",
            }}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          width: "100%",
          height: "calc(100% - 100px)",
          display: "flex",
          borderRadius: 1,
          overflow: "hidden",
          position: "relative",
          boxShadow: skin === "bordered" ? 0 : 6,
          ...(skin === "bordered" && { border: `1px solid ${theme.palette.divider}` }),
        }}
      >
        <SidebarPool
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
          leftSidebarWidth={leftSidebarWidth}
          numberOfQueries={totalRequestCount}
          handleStatusFilter={handleStatusFilter}
        />
        <QueryPoolContent
          scrollPosition={scrollPosition}
          scrollRef={scrollRef}
          queryData={queryData}
          setRefreshQueryData={setRefreshQueryData}
          contentWidth={contentWidth}
          handleOnEndReach={handleOnEndReach}
          hasNextPage={hasNextPage}
        />
      </Box>
    </>
  );
};

export default QueryPool;

QueryPool.roleGuard = [ROLE.THERAPIST];
