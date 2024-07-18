import { useGetProfilePic } from "@/hooks/profile/useGetProfilePic";
import { useSessionData } from "@/store/sessionData/useSessionData";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import CustomAvatar from "src/@core/components/mui/avatar";
import CustomChip from "src/@core/components/mui/chip";
import { getUserInfo } from "src/services/auth.service";
import { getRequestById } from "src/services/session.service";
import { UserData } from "src/types/interfaces/user.interface";
import { UserRequest } from "@/types/interfaces/userRequest.interface";
import { ROLE } from "@/enums/role.enums";

const TherapistDetails = () => {
  const [userInfo, setUserInfo] = useState<UserData>();
  const { sessionData } = useSessionData();
  const { data: session } = useSession();
  const { profilePic } = useGetProfilePic(
    session?.user.role === ROLE.THERAPIST ? sessionData?.attendees[0].user._id : sessionData?.therapist._id
  );

  const [userRequest, setUserRequest] = useState<UserRequest>();

  const userData = async () => {
    const data = await getUserInfo();
    setUserInfo(data);
  };

  useEffect(() => {
    const fetchUserRequest = async () => {
      if (sessionData) {
        const userRequest = await getRequestById(sessionData.request);
        setUserRequest(userRequest);
      }
    };

    if (sessionData) {
      fetchUserRequest();
    }
  }, [sessionData]);

  useEffect(() => {
    userData();
  }, []);

  return (
    <Card>
      <CardContent sx={{ pb: 8, display: "flex", alignItems: "center", flexDirection: "column", boxShadow: "none" }}>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center", gap: "10%" }}>
          <CustomAvatar
            skin="light"
            variant="rounded"
            src={profilePic}
            sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: "3rem" }}
          />
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800, textTransform: "capitalize", color: "text.primary" }}>
              {userInfo?.role == ROLE.USER ? sessionData?.therapist.name : sessionData?.attendees[0].user.name}
            </Typography>
            <CustomChip
              skin="light"
              size="small"
              label={userInfo?.role === ROLE.USER ? "User" : "Therapist"}
              sx={{
                height: "24px",
                width: "100px",
                bgcolor: "#e1e4f1",
                borderRadius: "4px",
                fontSize: "0.85rem",
                fontWeight: 550,
                color: "#546fff",
                textTransform: "capitalize",
              }}
            />
          </Box>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", my: 3, alignItems: "flex-end" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Current plan:
              </Typography>
              <Typography> Free Plan</Typography>
            </Box>
            <CustomChip
              skin="light"
              size="small"
              label="Upgrade your plan"
              sx={{
                height: "26px",
                paddingX: "12px",
                fontSize: "0.85rem",
                fontWeight: 500,
                bgcolor: "#ffeae9",
                color: "#ff4d49",
              }}
            />
          </Box>
        </Box>
      </CardContent>
      <CardContent>
        <Typography variant="h6">Query details</Typography>
        <Divider />
        <Typography variant="body1" sx={{ mb: 2 }}>
          Query:
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {userRequest?.query}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Therapist Category:
        </Typography>
        <CustomChip
          skin="light"
          size="small"
          label={userRequest?.categories[0].name}
          sx={{
            height: "26px",
            fontSize: "0.75rem",
            fontWeight: 500,
            bgcolor: "#ededff",
            paddingX: "12px",
            color: "#666cff",
          }}
        />
      </CardContent>
    </Card>
  );
};

export default TherapistDetails;
