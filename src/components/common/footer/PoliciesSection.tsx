import { Grid, Link, Stack, Typography } from "@mui/material";

const policiesLink = [
  { title: "Cookies ", url: "/cookies" },
  { title: "Privacy Policy ", url: "/privacy" },
  { title: "Terms of Service", url: "/terms" },
];
export default function FooterPoliciesSection() {
  return (
    <Grid
      container
      sx={{
        py: 5,
        lg: {
          mt: "0",
        },
        mt: "1rem",
      }}
      maxWidth={"xl"}
      margin={"auto"}
    >
      <Grid item width="100%">
        <Stack
          flexWrap="wrap"
          alignItems="center"
          sx={{
            flexWrap: "wrap",
            flexDirection: {
              lg: "row",
              xs: "column-reverse",
            },
            justifyContent: {
              lg: "space-between",
              xs: "center",
            },
          }}
        >
          <Typography
            width="100%"
            flex={1}
            variant="subtitle2"
            color="#4E4F55"
            fontWeight="300"
            sx={{
              textAlign: {
                lg: "left",
                xs: "center",
              },
              mt: {
                xl: "0",
                xs: "1rem",
              },
            }}
          >
            ©{new Date().getFullYear()} Camline Enterprises Ltd. All rights reserved.
          </Typography>
          <Stack direction="row" flexWrap="wrap" alignItems="center" justifyContent="center">
            {policiesLink.map((footerRowData, i) => (
              <Link
                key={i}
                href={footerRowData.url}
                underline="none"
                color="#161519"
                textTransform="uppercase"
                lineHeight={"1rem"}
                letterSpacing="0.46px"
                fontWeight="500"
                display="block"
                sx={{
                  fontSize: {
                    sm: "0.813rem",
                    xs: "0.7rem",
                  },
                  padding: {
                    sm: "0 1rem",
                    xs: "0 0.5rem",
                  },
                  ":hover": { color: "#666CFF" },
                }}
              >
                {footerRowData.title}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
