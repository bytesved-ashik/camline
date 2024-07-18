import { Box, Link, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import EastIcon from "@mui/icons-material/East";
import { IMAGES } from "src/assets";

interface ICondensedNavBarProps {
  url: string;
  title: string;
}

export default function CondensedNavbar({ url, title }: ICondensedNavBarProps) {
  return (
    <Toolbar
      sx={{
        justifyContent: "space-between",
        maxWidth: "xl",
        margin: "auto",
        flexWrap: "wrap",
      }}
      style={{ minHeight: "100px", width: "100%", padding: "0" }}
    >
      <Link href="https://24hrtherapy.co.uk">
        <Image
          src={IMAGES.Logo}
          alt="24hrtherapy"
          width={98}
          height={34}
          style={{ maxWidth: "100%", height: "auto", width: "auto" }}
        />
      </Link>
      <Link href={url} sx={{ color: "#6D788D", textDecoration: "none" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#666CFF",
            flex: "1",
            justifyContent: "flex-end",
          }}
        >
          <Typography variant="body1" component={"span"} sx={{ color: "#666CFF" }}>
            Back to {title}
          </Typography>
          <EastIcon sx={{ marginLeft: "10px" }} />
        </Box>
      </Link>
    </Toolbar>
  );
}
