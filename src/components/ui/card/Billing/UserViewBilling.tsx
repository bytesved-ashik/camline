import { getPaymentMethods } from "@/services/stripe.service";
import { CreatePaymentMethodData } from "@/types/interfaces/stripe.interface";
import { Box, Button, Card, CardContent, CardHeader, List, Theme, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import PerfectScrollbarComponent from "react-perfect-scrollbar";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const UserViewBilling = () => {
  const scrollRef = useRef<HTMLElement | null>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const { data: session } = useSession();
  const [paymentMethodsData, setPaymentMethodsData] = useState<CreatePaymentMethodData[]>([]);
  useEffect(() => {
    getPaymentMethods().then((res) => setPaymentMethodsData(res.data));
  }, []);
  const handleReachEnd = async () => {
    setScrollPosition(scrollRef.current?.scrollTop || 0);
  };

  const isOverFlowScroll = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  const PerfectScrollbar = styled(PerfectScrollbarComponent)({
    maxHeight: 220,
  });

  const ScrollWrapper = ({ children, isOverFlowScroll }: PropsWithChildren<{ isOverFlowScroll: boolean }>) => {
    if (isOverFlowScroll) {
      return <Box sx={{ maxHeight: 300, overflowY: "auto", overflowX: "hidden" }}>{children}</Box>;
    } else {
      return (
        <PerfectScrollbar
          containerRef={(el) => {
            scrollRef.current = el;
          }}
          onYReachEnd={handleReachEnd}
          options={{ wheelPropagation: false, suppressScrollX: true }}
          sx={{ maxHeight: 300 }}
        >
          {children}
        </PerfectScrollbar>
      );
    }
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Payment Methods" />
      {paymentMethodsData && paymentMethodsData.length > 0 ? (
        <CardContent>
          <ScrollWrapper isOverFlowScroll={isOverFlowScroll}>
            <List sx={{ p: 0 }}>
              {paymentMethodsData.map((item, index: number) => (
                <>
                  <Box
                    key={index}
                    sx={{
                      p: 5,
                      display: "flex",
                      borderRadius: 1,
                      flexDirection: ["column", "row"],
                      justifyContent: ["space-between"],
                      alignItems: ["flex-start", "center"],
                      mb: index !== paymentMethodsData.length - 1 ? 4 : undefined,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <div>
                      <img height="25" alt={item.card.brand} src={`/images/cards/${item.card.brand}.png`} />
                      <Box sx={{ mt: 0.5, display: "flex", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 500, textTransform: "capitalize" }}>{session?.user.name}</Typography>
                      </Box>
                      <Typography variant="body2">
                        **** **** **** {item.card.last4.substring(item.card.last4.length - 4)}
                      </Typography>
                    </div>

                    <Box sx={{ mt: [3, 0], textAlign: ["start", "end"] }}>
                      <Button variant="outlined" sx={{ mr: 3 }}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="secondary">
                        Delete
                      </Button>
                      <Typography variant="body2" sx={{ mt: 5 }}>
                        Card expires at {item.card.exp_month}/{item.card.exp_year}
                      </Typography>
                    </Box>
                  </Box>
                </>
              ))}
            </List>
          </ScrollWrapper>
        </CardContent>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>No data available</div>
      )}
    </Card>
  );
};

export default UserViewBilling;
