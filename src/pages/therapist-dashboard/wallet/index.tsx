import PaymentSession from "@/components/session-payments";
import CardWidgetsActivityTimeline from "@/components/ui/card/statistics/CardWidgetsActivityTimeline";
import AddNewCard from "@/components/ui/dialogs/AddNewCard";
import { Icon } from "@iconify/react";
import { Button, Grid } from "@mui/material";

import React, { useState } from "react";
import CardGeneralStatistics from "src/components/ui/card/statistics/CardGeneralStatistics";
import CardStatisticsBarChart from "src/components/ui/card/statistics/CardStatisticsBarChart";
import CardStatisticsRadialBarChart from "src/components/ui/card/statistics/CardStatisticsRadialBarChart";
import CardStatsVertical from "src/components/ui/card/statistics/CardStatisticsVertical";
import Caption from "src/components/ui/typography/Caption";

const Wallet = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickShow = () => {
    setOpen(true);
  };

  return (
    <>
      <Grid container spacing={6} className="match-height">
        <Grid item lg={5} xs={12}>
          <Caption
            data={{
              title: "Wallet",
              subText: "Balance and payments details",
            }}
          />
        </Grid>
        <Grid item lg={7} xs={12} sx={{ textAlign: "right" }}>
          <Button onClick={handleClickShow} variant="contained" color="primary" endIcon={<Icon icon="mdi:add" />}>
            Add Card
          </Button>
        </Grid>
        <Grid item lg={4} xs={12}>
          <CardGeneralStatistics />
        </Grid>
        <Grid item lg={4} xs={12}>
          <CardWidgetsActivityTimeline />
        </Grid>
        <Grid item lg={4} xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <CardStatisticsBarChart />
            </Grid>
            <Grid item xs={6}>
              <CardStatsVertical
                stats="£13.4k"
                color="success"
                trendNumber="+38%"
                title="Total Sales"
                chipText="Last Six Month"
                icon={<Icon icon="mdi:currency-gbp" />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatsVertical
                color="info"
                stats="142.8k"
                trendNumber="+62%"
                chipText="Last One Year"
                title="Total Impressions"
                icon={<Icon icon="mdi:link" />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsRadialBarChart />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={12} xs={12}>
          <PaymentSession />
        </Grid>
      </Grid>
      <AddNewCard onClose={handleClose} setVisible={setOpen} open={open} />
    </>
  );
};

export default Wallet;
