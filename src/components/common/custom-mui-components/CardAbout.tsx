import { Typography, CardContent, Card } from "@mui/material";
import { Box } from "@mui/system";

type ICardAboutData = {
  title: string;
  icon: JSX.Element;
  total: number;
  color: string;
};

const CardAbout = ({ data }: { data: ICardAboutData }) => {
  return (
    <Card
      sx={{
        maxWidth: {
          lg: "287px",
          md: "287px",
          sm: "100%",
          xs: "100%",
        },
        width: {
          sm: "100%",
          xs: "100%",
        },
        backgroundColor: `${data.color}`,
        marginRight: {
          lg: "20px",
          md: "40px",
          xs: "0",
        },
        mb: {
          lg: 0,
          md: 2,
          sm: 4,
          xs: 2,
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: {
            sm: "1",
            height: "auto",
          },
          py: "40px",
          px: "50px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {data.icon}
          <Typography
            component="div"
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              ml: "18px",
              fontSize: "2.75rem",
              fontWeight: "bold",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            <>
              {data.total}
              <Typography sx={{ ml: "10px", fontWeight: "bold", fontSize: "1.975rem", color: "#fff", lineHeight: 1 }}>
                {data.title.includes("Patients") ? "%" : "+"}
              </Typography>
            </>
          </Typography>
        </Box>
        <Typography sx={{ color: "#fff", maxWidth: "110px", marginTop: "10px" }}> {data.title}</Typography>
      </CardContent>
    </Card>
  );
};

export default CardAbout;
