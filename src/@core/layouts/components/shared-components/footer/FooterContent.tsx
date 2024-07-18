// ** MUI Imports
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography
        sx={{
          mr: 2,
          fontSize: {
            xs: "0.7rem",
            md: "1rem",
          },
        }}
      >
        Camline {new Date().getFullYear()} ©24 Hour Therapy - All Rights Reserved
      </Typography>
      {hidden ? null : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            "& :not(:last-child)": { mr: 4 },
          }}
        >
          <Link target="_blank" href="https://www.24hrtherapy.co.uk/page_id=3274" sx={{ color: "text.primary" }}>
            Cookies
          </Link>
          <Link target="_blank" href="https://www.24hrtherapy.co.uk/page_id=3" sx={{ color: "text.primary" }}>
            Privacy Policy
          </Link>

          <Link target="_blank" href="https://www.24hrtherapy.co.uk/page_id=3276" sx={{ color: "text.primary" }}>
            Terms of Service
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default FooterContent;
