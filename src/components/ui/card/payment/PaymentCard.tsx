import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import OptionsMenu from "src/@core/components/option-menu";
import { Icon } from "@iconify/react";
import { ReactNode } from "react";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";
import { useBalance } from "@/store/wallet/useBalance";

interface DataType {
  title: string;
  amount: string;
  trend: ReactNode;
  color: ThemeColor;
  trendNumber: string;
}

const data: DataType[] = [
  {
    title: "April",
    color: "error",
    amount: "$18,879",
    trendNumber: "15%",
    trend: (
      <Box sx={{ color: "error.main", fontSize: "1.4rem" }}>
        <Icon icon="mdi:chevron-down" />
      </Box>
    ),
  },
  {
    title: "March",
    color: "success",
    amount: "$10,357",
    trendNumber: "85%",
    trend: (
      <Box sx={{ color: "error.main", fontSize: "1.4rem" }}>
        <Icon icon="mdi:chevron-up" />
      </Box>
    ),
  },
  {
    title: "February",
    color: "success",
    amount: "$4,860",
    trendNumber: "48%",
    trend: (
      <Box sx={{ color: "error.main", fontSize: "1.4rem" }}>
        <Icon icon="mdi:chevron-up" />
      </Box>
    ),
  },
  {
    title: "January",
    color: "error",
    amount: "$899",
    trendNumber: "16%",
    trend: (
      <Box sx={{ color: "error.main", fontSize: "1.4rem" }}>
        <Icon icon="mdi:chevron-down" />
      </Box>
    ),
  },
];
const PaymentCard = () => {
  const { mainBalance } = useBalance();

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title="Payments"
        action={
          <OptionsMenu
            options={["Refresh", "Share", "Reschedule"]}
            iconButtonProps={{ size: "small", sx: { color: "text.primary" } }}
          />
        }
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(2.5)} !important` }}>
        <Box sx={{ mb: 5.75, display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h4">{mainBalance.toFixed(2)}</Typography>
            <Typography variant="caption">Total Balance</Typography>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableBody>
              {data.map((row: DataType) => {
                return (
                  <TableRow
                    key={row.title}
                    sx={{
                      "&:last-of-type td": { border: 0 },
                      "& .MuiTableCell-root": {
                        "&:last-of-type": { pr: 0 },
                        "&:first-of-type": { pl: 0 },
                        py: (theme) => `${theme.spacing(2.75)} !important`,
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", "& svg": { mr: 1.8, color: `${row.color}.main` } }}>
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                          {row.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                        {Number(row.amount).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <Typography variant="body2" sx={{ mr: 1.5, color: `${row.color}.main` }}>
                          {row.trendNumber}
                        </Typography>
                        {row.trend}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
