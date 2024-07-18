/* eslint-disable*/
import Image from "next/image";
import { Grid, Box, Typography, ListItem, List, Container, Divider } from "@mui/material";
import Link from "@mui/material/Link";
import { Stack } from "@mui/system";
import FooterPoliciesSection from "./PoliciesSection";
import { IMAGES } from "src/assets";

export type ILinkedTitle = {
  icon: string;
  title: string;
  subText?: string;
  url: string;
};

interface IFooterData {
  title: string;
  data: ILinkedTitle[];
}

interface ISocialData {
  url: string;
  Icon: JSX.Element;
}

// { icon: "/images/icon/call.svg", title: "Hotline", subText: "Phone: 0800 123 456", url: "tel:+822456974" },
const footerColumnData: IFooterData[] = [
  {
    title: "Get In Touch",
    data: [
      {
        icon: "/images/icon/email.png",
        title: "Email",
        subText: "support@24hrtherapy.co.uk",
        url: "mailto:support@24hrtherapy.co.uk",
      },
      {
        icon: "/images/icon/location.png",
        title: "Address",
        subText: "Cuffley Place, Office Suite 112, Sopers Road, London EN6 4SG  United Kingdom",
        url: "#",
      },
    ],
  },
];

const footerColumnData2 = [
  {
    title: "Company",
    data: [
      { title: "About Us", url: "/about" },
      { title: "Contact", url: "/contact" },
      { title: "Business Enquiries", url: "/business" },
      { title: "Join The Team", url: "/auth/register/" },
    ],
  },
  {
    title: "Information",
    data: [
      { title: "FAQ", url: "/faqs" },
      { title: "Types of Therapy", url: "/type-of-therapies" },
      { title: "Types of Conditions", url: "/mental-health" },
      {
        title: "Emergency Contacts",
        url: "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/",
        external: true,
      },
    ],
  },
];

const socialLinks: ISocialData[] = [
  {
    Icon: <img src="/images/icon/facebook.svg" alt="" />,
    url: "https://www.facebook.com/24hrTherapy/",
  },
  {
    Icon: <img src="/images/icon/instagram.svg" alt="" />,
    url: "https://www.instagram.com/24hr_therapyonline/",
  },
  {
    Icon: <img src="/images/icon/linkedin.svg" alt="" />,
    url: "https://www.linkedin.com/in/camline-therapy-339440263/",
  },
  {
    Icon: <img src="/images/icon/youtube.svg" alt="" />,
    url: "https://www.youtube.com/@Camline24Therapy",
  },
  {
    Icon: <img src="/images/icon/tiktok.svg" alt="" />,
    url: "https://www.tiktok.com/@24hr_therapyonline/",
  },
];

function FooterColumn({ rowItems }: { rowItems: ILinkedTitle[] }) {
  return (
    <>
      {rowItems.map((rowItem: ILinkedTitle, index) => (
        <List key={index}>
          <ListItem sx={{ padding: 0, display: "flex", alignItems: "flex-start" }}>
            <button
              style={{
                backgroundColor: "#354BC0",
                minHeight: "44px",
                minWidth: "43px",
                borderRadius: "9px",
                marginRight: "1rem",
              }}
            >
              <img src={rowItem.icon} style={{ marginLeft: "2px", marginTop: "2px" }} />
            </button>
            <div>
              <Link href={rowItem.url} underline="none" target={"_blank"}>
                <Typography
                  variant="subtitle2"
                  fontSize="18px"
                  color="#000"
                  sx={{ ":hover": { color: "#000" }, fontWeight: 500 }}
                >
                  {rowItem.title}
                </Typography>
                {rowItem.subText ? (
                  <Typography
                    variant="subtitle2"
                    fontSize="18px"
                    color="#4E4F55"
                    sx={{
                      maxWidth: "280px",
                      display: "block",
                      mt: "1rm",
                      fontWeight: 300,
                      ":hover": { color: "#666CFF" },
                    }}
                  >
                    {rowItem.subText}
                  </Typography>
                ) : null}
              </Link>
            </div>
          </ListItem>
        </List>
      ))}
    </>
  );
}

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "#F9F8F9", padding: "5.625rem 0 2.375rem" }}>
      <Container
        sx={{
          margin: "auto",
          maxWidth: {
            xs: "xs",
            sm: "sm",
            md: "md",
            lg: "lg",
            xl: "1200px",
          },
        }}
      >
        <Grid container mb={12}>
          <Grid item position="relative" display="flex" flexDirection={"column"} alignItems="center" margin={"auto"}>
            <Link href="/">
              <Image src={IMAGES.Logo} alt="24hrtherapy" width={128} height={44} style={{ marginBottom: "20px" }} />
            </Link>
            <Typography color="#4E4F55" fontWeight="300" fontSize="18px">
              Our Services: Online Therapy Anytime, Anywhere, Day or Night, No Appointments needed.
              <br />
              <br />
              24 Hour Therapy is your premier online therapy platform, dedicated to supporting individuals grappling with
              mental health conditions that impact their thoughts, emotions, or behaviour. Our mission is to deliver top-tier
              therapy services tailored to your needs, accessible at your convenience.
              <br />
              <br />
              Experience the freedom of therapy on your terms with our per-minute charging system, putting you in complete
              control of your spending. Whether you're navigating anxiety, depression, or any other mental health challenge,
              our qualified therapists are here to help, 24/7.
              <br />
              <br />
              With 24 Hour Therapy, you can access high-quality therapy sessions anytime and anywhere, day or night,
              empowering you to prioritize your mental well-being without compromising on quality or convenience
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={"20px"}>
          {footerColumnData.map((footerRowData: IFooterData, i) => (
            <Grid
              key={i}
              item
              xs={12}
              sm={6}
              lg={4}
              sx={{
                "@media screen and (max-width: 767px)": {
                  padding: "0px 1rem",
                  marginBottom: "20px",
                },
              }}
            >
              <Typography fontSize="25px" fontWeight="400" marginBottom="16px" color="#000">
                {footerRowData.title}
              </Typography>
              <FooterColumn rowItems={footerRowData.data} />
            </Grid>
          ))}
          {footerColumnData2.map((footerRowData, i) => (
            <Grid
              key={i}
              item
              xs={12}
              sm={6}
              lg={i === 0 ? 2 : 3}
              sx={{
                "@media screen and (max-width: 767px)": {
                  padding: "0px 1rem",
                  marginBottom: "20px",
                },
              }}
            >
              <Typography fontSize="25px" fontWeight="400" marginBottom="16px" color="#000">
                {footerRowData.title}
              </Typography>
              {footerRowData.data.map((rowItem, index) => (
                <List key={index} sx={{ padding: 1 }}>
                  <ListItem sx={{ padding: 0, display: "flex", alignItems: "center" }}>
                    {rowItem.external ? (
                      <div onClick={() => open(rowItem.url, "_blank")} style={{ cursor: "pointer" }}>
                        <Typography
                          variant="subtitle2"
                          fontSize="18px"
                          color="#4E4F55"
                          sx={{
                            display: "block",
                            mt: "0.5rm",
                            fontWeight: 300,
                            ":hover": { color: "#666CFF" },
                          }}
                        >
                          {rowItem.title}
                        </Typography>
                      </div>
                    ) : (
                      <Link href={rowItem.url} underline="none">
                        <Typography
                          variant="subtitle2"
                          fontSize="18px"
                          color="#4E4F55"
                          sx={{
                            display: "block",
                            mt: "0.5rm",
                            fontWeight: 300,
                            ":hover": { color: "#666CFF" },
                          }}
                        >
                          {rowItem.title}
                        </Typography>
                      </Link>
                    )}
                  </ListItem>
                </List>
              ))}
            </Grid>
          ))}
          <Grid
            item
            xs={12}
            sm={6}
            lg={3}
            sx={{
              "@media screen and (max-width: 767px)": {
                padding: "0px 1rem",
                marginBottom: "20px",
              },
            }}
          >
            <Typography fontSize="28px" fontWeight="400" marginBottom="16px" color="#000">
              Follow Us
            </Typography>
            <Stack direction="row" gap="0rem" alignItems="center" spacing={1}>
              {socialLinks.map((item: ISocialData, index) => (
                <Link
                  sx={{
                    fontSize: "30px",
                    // backgroundColor: "#354BC0",
                    minHeight: "44px",
                    minWidth: "43px",
                    display: "flex",
                    borderRadius: "9px",
                    justifyContent: "center",
                    color: " #FFF",
                    ":hover": { color: "#666CFF" },
                  }}
                  key={index}
                  href={item.url}
                  target="_blank"
                >
                  {item.Icon}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider />
        <FooterPoliciesSection />
      </Container>
    </Box>
  );
}
