// ** MUI Imports
import Grid from "@mui/material/Grid";
import Caption from "src/components/ui/typography/Caption";
import { ROLE } from "@/enums/role.enums";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  List,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Theme,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import UserList from "@/components/common/userlist/UserList";
import { getFilterTherapistUser } from "@/services/user.service";
import useGetUserInfo from "@/hooks/profile/useGetUserInfo";
import DateRangeSelector from "@/components/common/DateRangeSelector/DateRangeSelector";
import Input, { InputProps } from "@mui/material/Input";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ScheduleCallModal from "@/components/common/userlist/ScheduleCallModal";

type DebounceProps = {
  handleDebounce: (value: string) => void;
  debounceTimeout: number;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const DebounceInput = (props: InputProps & DebounceProps) => {
  const { handleDebounce, debounceTimeout, value, ...rest } = props;

  const [inputValue, setInputValue] = useState(value);

  const timerRef = useRef<number | undefined>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      handleDebounce(newValue);
    }, debounceTimeout) as unknown as number;
  };

  return <Input {...rest} value={inputValue} onChange={handleChange} />;
};

const statusList = ["All", "active", "inactive", "banned", "suspended", "pending", "reject"];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const Therapist = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState("recommended");
  const [filterTherapist, setFilterTherapist] = useState("");
  const { data: users } = useGetUserInfo();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [therapistData, setTherapistData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<any[]>(["All"]);
  const [therapistId, setTherapistId] = useState<string>("");

  const handleChanges = (event: SelectChangeEvent<typeof filterStatus>) => {
    const {
      target: { value },
    } = event;
    const selectedIds = typeof value === "string" ? value.split(",") : value;
    const isLastValueZero = selectedIds[selectedIds.length - 1] === 0;
    if (isLastValueZero) {
      setFilterStatus([0]);
    } else {
      setFilterStatus(selectedIds.length > 0 ? selectedIds.filter((id: any) => id !== "All") : ["All"]);
    }
  };

  useEffect(() => {
    setTherapistData([]);
    getFilterTherapist(filter, filterTherapist);
  }, [filter, filterTherapist]);

  const getFilterTherapist = (filter: string, filterTherapist: string) => {
    setTherapistData([]);
    setLoading(true);
    let f = filter;
    if (users && users[0].roles[0] === ROLE.ADMIN) {
      if (startDate && endDate) {
        f = `all&startDate=${startDate}&endDate=${endDate}`;
      }
    }
    setFilterStatus(["All"]);
    getFilterTherapistUser(f, filterTherapist).then((data: any) => {
      setLoading(false);
      if (filter === "shortlisted") {
        setTherapistData(JSON.parse(JSON.stringify(data.data)));

        return;
      }

      const newData = data.data.filter((val: any) => !val.isInShortlist);

      setTherapistData(JSON.parse(JSON.stringify(newData)));
      setFilteredData(JSON.parse(JSON.stringify(newData)));
    });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setFilter(newValue);
  };

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

  const handleDebounce = (value: string) => {
    const decodedValue = decodeURIComponent(value.replace(/\+/g, "%20"));
    setFilterTherapist(decodedValue);
  };

  useEffect(() => {
    if (filterStatus.includes("All")) {
      setTherapistData(filteredData);

      return;
    }
    if (filteredData) {
      const filteredTherapist = filteredData.filter((item) => {
        return filterStatus.includes(item.user.status);
      });
      setTherapistData(filteredTherapist);
    }
  }, [filterStatus]);

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "PhoneNumber,FirstName,Lastname,Gender,Status,Email\n" +
      filteredData
        .map(
          (user) =>
            `"${user?.phoneNumber.substring(0, 3)} ${user?.phoneNumber.substring(3)}","${user?.user?.firstName}", "${
              user?.user?.lastName
            }","${user?.user?.gender}","${user?.user?.status}","${user?.user?.email}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Therapist_list.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleCloseModal = () => {
    setTherapistId("");
  };

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
                title: "Therapist",
                subText:
                  users && users[0].roles[0] === ROLE.USER
                    ? "Choose from our recommended therapists"
                    : `Total Therapists: ${therapistData.length}`,
              }}
            />
          </Box>

          {users && users[0].roles[0] === ROLE.ADMIN && (
            <Box sx={{ display: "flex", alignItems: "end", justifyContent: "end" }}>
              <DateRangeSelector
                onDateSelect={() => {
                  getFilterTherapist("all", filterTherapist);
                }}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                startDate={startDate}
                onClear={() => {
                  getFilterTherapist("all", filterTherapist);
                  setEndDate("");
                  setStartDate("");
                }}
              />
              <Box sx={{ minWidth: 100, marginLeft: "20px" }}>
                <FormControl sx={{ m: 1, width: 200 }}>
                  <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={filterStatus}
                    onChange={handleChanges}
                    input={<OutlinedInput label="Status" />}
                    MenuProps={MenuProps}
                  >
                    {statusList.map((name) => (
                      <MenuItem key={name} value={name} style={getStyles(name, filterStatus, theme)}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Tooltip title="Export to CSV" placement="top">
                  <IconButton onClick={downloadCSV}>
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
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
              {users && users[0].roles[0] === ROLE.USER && (
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={filter}
                    onChange={handleChange}
                    sx={{
                      "@media screen and (max-width: 767px)": {
                        overflow: "auto",
                      },
                    }}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    <Tab label="Recommended" value="recommended" />
                    <Tab label="Shortlisted" value="shortlisted" />
                    <Tab label="All" value="all" />
                  </Tabs>
                </Box>
              )}

              <DebounceInput
                value={filterTherapist}
                debounceTimeout={1000}
                handleDebounce={handleDebounce}
                placeholder="Search Therapist"
                sx={{
                  width: "97%",
                  m: 5,
                  "@media screen and (max-width: 767px)": {
                    marginLeft: 0,
                    marginRight: 0,
                  },
                }}
              />
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
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
                  {therapistData.length > 0 &&
                    therapistData?.map((therapist, index) => (
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
                          profilePicture={{ ...therapist.profilePicture }}
                          therapist={therapist.user}
                          categories={therapist?.categories}
                          isInShortlist={filter === "shortlisted" ? true : therapist.isInShortlist}
                          onShortlist={onShortlist}
                          onCheckTherapist={onCheckTherapist}
                          inCall={therapist?.isTherapistInsession}
                          therapiseName={`${therapist?.user?.firstName} ${therapist?.user?.lastName}`}
                        />
                      </Button>
                    ))}
                </Box>
              )}
            </>
          </List>
        </Grid>
        <ScheduleCallModal
          showDialog={therapistId ? true : false}
          closeDialog={handleCloseModal}
          therapistId={therapistId}
        />
      </Paper>
    </Grid>
  );
};

export default Therapist;

Therapist.authGuard = [ROLE.USER, ROLE.ADMIN];
