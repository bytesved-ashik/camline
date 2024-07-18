// ** React Imports
import { SyntheticEvent, useState } from "react";

// ** MUI Imports
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import TabAccount from "@/views/pages/account-setting/TabAccount";
import { Icon } from "@iconify/react";
import { Box } from "@mui/material";

// Styled TabList component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff !important",
  },
  "& .MuiTab-root": {
    minHeight: 38,
    minWidth: 110,
    borderRadius: 8,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const UserAccount = () => {
  // ** State
  const [value, setValue] = useState<string>("1");

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label="customized tabs example">
        <Tab
          value="1"
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ...{ "& svg": { mr: 2 } },
              }}
            >
              <Icon icon="mdi:account-outline" fontSize="1.4rem" />
              Account Details
            </Box>
          }
        />
      </TabList>
      <TabPanel value="1">
        <TabAccount />
      </TabPanel>
      <TabPanel value="2"></TabPanel>
    </TabContext>
  );
};
export default UserAccount;
