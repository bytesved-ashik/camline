import { ROLE } from "@/enums/role.enums";
import { useGetProfilePic } from "@/hooks/profile/useGetProfilePic";
import { IAllChats } from "@/types/apps/chatTypes";
import { styled } from "@mui/material/styles";
import { Avatar, Badge, Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

export default function ProfileButton({
  selectedProfileId,
  onSelectProfile,
  profile,
  isCallingChatView,
}: {
  profile?: IAllChats;
  selectedProfileId: string;
  onSelectProfile: Dispatch<SetStateAction<string>>;
  isCallingChatView?: boolean;
}) {
  const { data: session } = useSession();
  const imgSrc = "images/avatars/1.png";
  const { profilePic } = useGetProfilePic(profile?.users[session?.user.role === ROLE.THERAPIST ? 0 : 1]._id);

  return (
    <Button
      variant={selectedProfileId === profile?.chatSessionId ? "outlined" : "text"}
      fullWidth
      onClick={() => onSelectProfile(profile!.chatSessionId)}
      sx={{
        display: "flex",
        py: "1rem",
        justifyContent: "space-between",
        textTransform: "none",
        "@media screen and (max-width: 767px)": {
          borderColor: isCallingChatView ? "transparent" : "rgba(84, 111, 255, 0.5)",
          padding: isCallingChatView ? "0" : "16px 21px",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "space-between" }}>
        <Badge
          overlap="circular"
          badgeContent={<BadgeContentSpan />}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          sx={{ borderRadius: "50%" }}
        >
          <Avatar alt="profile pic" src={profilePic ? profilePic : imgSrc} sx={{ width: "2.5rem", height: "2.5rem" }} />
        </Badge>
        <Box sx={{ display: "flex", ml: 3, alignItems: "flex-start", flexDirection: "column" }}>
          <Typography sx={{ fontWeight: 600, color: selectedProfileId === profile?.id ? "#fff" : "#5D5F72" }}>
            {profile?.users[session?.user.role === ROLE.THERAPIST ? 0 : 1].firstName}{" "}
            {profile?.users[session?.user.role === ROLE.THERAPIST ? 0 : 1].lastName}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8rem", color: selectedProfileId === profile?.id ? "#fff" : "text.disabled" }}
          >
            {moment("2023-09-04T10:24:17.587Z").calendar(null, {
              sameDay: "[Today]",
              lastDay: "[Yesterday]",
              lastWeek: "DD MMM",
              sameElse: "DD MMM",
            })}
          </Typography>
        </Box>
      </Box>
    </Button>
  );
}
