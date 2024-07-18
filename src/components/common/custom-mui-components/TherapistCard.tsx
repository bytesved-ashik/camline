import { Card, CardContent, CardMedia, Typography } from "@mui/material";

type ICardTherapist = {
  category: string;

  description: string;
  image: string;
};

const TherapistCard = ({ data }: { data: ICardTherapist }) => {
  return (
    <Card
      sx={{
        borderRadius: "6px",
        minHeight: "350px",
        display: "flex",
        width: "100%",
        alignItems: "flex-end",
        flexDirection: "column",
        position: "relative",
      }}
      className="cardTeam"
    >
      <CardMedia
        component="img"
        height="350"
        image={data.image}
        alt="Paella dish"
        sx={{ objectFit: "cover", borderRadius: "6px", width: "100%", objectPosition: "" }}
      />
      <CardContent className="cardContent" sx={{ position: "absolute", bottom: "0", left: "0", right: "0" }}>
        <Typography fontSize="1.75rem" lineHeight="120%" marginBottom="4px" color="#fff">
          {data.category}
        </Typography>
        <Typography fontSize="14px" fontWeight="300" lineHeight="150%" color="#fff" className="texDesc">
          {data.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TherapistCard;
