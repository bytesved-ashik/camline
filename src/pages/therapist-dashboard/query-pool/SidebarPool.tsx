import { Icon } from "@iconify/react";
import { List, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import CustomBadge from "src/@core/components/mui/badge";
import { Tabs } from "@/enums/filterTabs.enums";
import { REQUEST_STATUS } from "@/enums/requestStatus.enums";
import { labels } from "@/constants/queryLabelsConstant";

type Props = {
  leftSidebarWidth: string;
  handleActiveTab: (val: Tabs) => void;
  activeTab: string;
  numberOfQueries: number;
  handleStatusFilter: (status: REQUEST_STATUS) => void;
};

const SidebarPool = (props: Props) => {
  const leftSidebarWidth = props.leftSidebarWidth;

  return (
    <Paper
      sx={{ overflowY: "hidden", width: leftSidebarWidth, borderRadius: "0 0 0 0", position: "relative", zIndex: "999" }}
    >
      <List component="div">
        <ListItem
          component="div"
          sx={{
            borderLeftColor: "primary.main",
            py: 0,
          }}
        >
          <ListItemButton component="a" onClick={() => props.handleActiveTab(Tabs.ALL)}>
            <ListItemText
              primary="All"
              primaryTypographyProps={{
                noWrap: true,
                sx: { color: props.activeTab === Tabs.ALL ? "primary.main" : "secondary.main" },
              }}
            />
            {props.activeTab === Tabs.ALL && (
              <CustomBadge badgeContent={props.numberOfQueries} color="primary" skin="light"></CustomBadge>
            )}
          </ListItemButton>
        </ListItem>
        <ListItem
          sx={{
            borderLeftColor: "transparent",
            py: 0,
          }}
        >
          <ListItemButton component="a" onClick={() => props.handleActiveTab(Tabs.INPOOL)}>
            <ListItemText
              primary="In-pool"
              primaryTypographyProps={{
                noWrap: true,
                sx: { color: props.activeTab === Tabs.INPOOL ? "primary.main" : "secondary.main" },
              }}
            />
            {props.activeTab === Tabs.INPOOL && (
              <CustomBadge badgeContent={props.numberOfQueries} color="primary" skin="light"></CustomBadge>
            )}
          </ListItemButton>
        </ListItem>
        <ListItem
          sx={{
            borderLeftColor: "transparent",
            py: 0,
          }}
        >
          <ListItemButton component="a" onClick={() => props.handleActiveTab(Tabs.SCHEDULED)}>
            <ListItemText
              primary="Scheduled"
              primaryTypographyProps={{
                noWrap: true,
                sx: { color: props.activeTab === Tabs.SCHEDULED ? "primary.main" : "secondary.main" },
              }}
            />
            {props.activeTab === Tabs.SCHEDULED && (
              <CustomBadge badgeContent={props.numberOfQueries} color="primary" skin="light"></CustomBadge>
            )}
          </ListItemButton>
        </ListItem>
      </List>
      <Typography
        component="h6"
        variant="caption"
        sx={{
          mx: 6,
          mb: 0,
          mt: 3.5,
          lineHeight: ".95rem",
          color: "text.disabled",
          letterSpacing: "0.4px",
          textTransform: "uppercase",
        }}
      >
        Labels
      </Typography>
      <List component="div" sx={{ pt: 1 }}>
        {labels.map((label, index) => (
          <ListItem
            key={index}
            sx={{
              borderLeftColor: "transparent",
              py: 0,
            }}
          >
            <ListItemButton onClick={() => props.handleStatusFilter(label.status)}>
              <ListItemIcon sx={{ "& svg": { mr: 1, color: label.color } }}>
                <Icon icon="mdi:circle" fontSize="0.75rem" />
              </ListItemIcon>
              <ListItemText
                primary={label.text}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { color: "secondary.main" },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SidebarPool;
