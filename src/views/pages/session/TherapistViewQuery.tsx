import React from "react";
import CustomAvatar from "src/@core/components/mui/avatar";
import { Button, Paper, CardActions, CardContent, Divider, Typography } from "@mui/material";
import CustomChip from "src/@core/components/mui/chip";
import { Box } from "@mui/system";
import Link from "next/link";

const TherapistViewQuery = () => {
  const image = "./images/avatars/1.png";

  return (
    <Paper sx={{ borderRadius: 0, px: 2, py: 4, height: "100%" }}>
      <CardContent sx={{ display: "flex", alignItems: "center", flexDirection: "column", boxShadow: "none" }}>
        <CustomAvatar
          skin="light"
          variant="rounded"
          src={image}
          sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: "3rem" }}
        ></CustomAvatar>
        <Typography sx={{ mb: 3 }}>Seth Hallam</Typography>
        <CustomChip
          skin="light"
          size="small"
          label="Patient"
          color="primary"
          sx={{ height: 20, fontSize: "0.75rem", fontWeight: 500 }}
        />
        <Box sx={{ width: "100%" }}>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography variant="subtitle2" sx={{ mr: 2, color: "text.primary" }}>
                Email:
              </Typography>
              <Typography variant="body2">shallamb@gmail.com</Typography>
            </Box>

            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}>Treatment History: </Typography>
              <Link href="#">
                {" "}
                <Typography variant="body2" sx={{ color: "primary.main" }}>
                  View History
                </Typography>{" "}
              </Link>
            </Box>
            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography variant="subtitle2" sx={{ mr: 2, color: "text.primary" }}>
                Contact:
              </Typography>
              <Typography variant="body2">+1 (234) 464-0600</Typography>
            </Box>
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
          I am writing to inquire about your availability and services as I am interested in beginning therapy. I am
          currently experiencing (insert reason for seeking therapy here) and believe that therapy may be beneficial in
          helping me address these issues.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Therapist Category:
        </Typography>
        <CustomChip
          skin="light"
          size="small"
          label="Work Therapy"
          color="primary"
          sx={{ height: 20, fontSize: "0.75rem", fontWeight: 500 }}
        />
      </CardContent>
      <CardActions sx={{ display: "flex" }}>
        <Button variant="contained" color="error" sx={{ mr: 2 }}>
          Reject
        </Button>
        <Button variant="outlined" color="secondary">
          Cancel
        </Button>
      </CardActions>
    </Paper>
  );
};

export default TherapistViewQuery;
