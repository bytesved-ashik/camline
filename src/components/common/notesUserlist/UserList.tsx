import UserNotes from "@/components/ui/dialogs/NotesDrawer";
import { useGetProfilePic } from "@/hooks/profile/useGetProfilePic";
import { IAccountDetails } from "@/types/interfaces/profile.interface";
import { Avatar, Badge, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import moment from "moment";

export default function NotesUserList({ user, profilePicture }: { user: IAccountDetails; profilePicture: string }) {
  const { profilePic } = useGetProfilePic(profilePicture);

  const BadgeContentSpan = styled("span")(({ theme }) => ({
    width: 11,
    height: 11,
    borderRadius: "50%",
    backgroundColor: user.isOnline ? theme.palette.success.main : theme.palette.grey[500],
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  }));

  return (
    <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
      <Box
        sx={{
          display: "flex",
          ml: 3,
          alignItems: "flex-start",
          flexDirection: "row",
          minWidth: "27vw",
          justifyContent: "flex-start",
        }}
      >
        <Badge
          overlap="circular"
          badgeContent={<BadgeContentSpan />}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          sx={{ borderRadius: "50%", color: "red", mr: 5 }}
        >
          <Avatar alt={user.firstName.toUpperCase()} src={`${profilePic}`} sx={{ width: "6rem", height: "6rem" }} />
        </Badge>
        <Box
          sx={{
            display: "flex",
            ml: 3,
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography sx={{ fontWeight: 100, fontSize: "1rem" }}>
            {moment(user.updatedAt).format("MMMM Do YYYY, h:mm:ss a")}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "row", mt: 5 }}>
            <UserNotes userId={user._id} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
