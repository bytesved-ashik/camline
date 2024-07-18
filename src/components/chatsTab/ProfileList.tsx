import React, { Dispatch, SetStateAction } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { IAllChats } from "@/types/apps/chatTypes";
import { Paper, Typography } from "@mui/material";
import ProfileButton from "./ProfileButton";

const ProfileList = ({
  selectedProfileId,
  onSelectProfile,
  chatData,
}: {
  chatData: IAllChats[];
  selectedProfileId: string;
  onSelectProfile: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Paper elevation={3} sx={{ height: "100%", py: "20px" }}>
      <Typography variant="h6" sx={{ ml: "1.5rem" }}>
        Chat
      </Typography>
      <List sx={{ height: "73vh", overflow: "auto" }}>
        {chatData.map((profile: IAllChats) => (
          <ListItem key={profile.id}>
            <ProfileButton selectedProfileId={selectedProfileId} onSelectProfile={onSelectProfile} profile={profile} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ProfileList;
