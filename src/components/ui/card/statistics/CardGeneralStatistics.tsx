// ** React Imports
import { ReactNode, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import TableContainer from "@mui/material/TableContainer";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";
import OptionsMenu from "src/@core/components/option-menu";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@mui/material";
import WithdrawFunds from "../../dialogs/WithdrawFunds";
import TopUpWallet from "../../dialogs/TopUpWallet";

// ** Hooks
import useWalletUtility from "@/hooks/wallet/useWalletUtility";
import { useBalance } from "@/store/wallet/useBalance";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#FDB528 !important",
  },
});

interface DataType {
  title: string;
  amount: string;
  trend: ReactNode;
  color: ThemeColor;
  trendNumber: string;
}

const CardGeneralStatistics = () => {
  const { setShowTopUpModal, setShowWithdrawModal, showTopUpModal, showWithdrawModal } = useWalletUtility();

  const { mainBalance, bonusBalance, refetch: BalanceRefetch } = useBalance();
  const totalBalance = mainBalance + bonusBalance;
  const mainBalancePercentage = (mainBalance / totalBalance) * 100;
  const classes = useStyles();
  useEffect(() => {
    BalanceRefetch();
  }, [BalanceRefetch]);
  const data: DataType[] = [
    {
      title: "Your Balance",
      color: "primary",
      amount: `${mainBalance.toFixed(2)}`,
      trendNumber: "+85%",
      trend: (
        <Box sx={{ color: "success.main" }}>
          <Icon icon="mdi:chevron-up" />
        </Box>
      ),
    },
    {
      title: "Bonus Balance",
      amount: `${bonusBalance.toFixed(2)}`,
      color: "warning",
      trendNumber: "+42%",
      trend: (
        <Box sx={{ color: "success.main" }}>
          <Icon icon="mdi:chevron-up" />
        </Box>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader
          title="Balance"
          titleTypographyProps={{
            sx: {
              lineHeight: "2rem !important",
              letterSpacing: "0.15px !important",
            },
          }}
          action={
            <OptionsMenu
              options={["Last 28 Days", "Last Month", "Last Year"]}
              iconButtonProps={{
                size: "small",
                className: "card-more-options",
              }}
            />
          }
        />
        <CardContent sx={{ pt: (theme) => `${theme.spacing(2.5)} !important` }}>
          <Box sx={{ mb: 5.75, display: "flex", alignItems: "center" }}>
            <CustomAvatar skin="light" variant="rounded" sx={{ mr: 4, width: 50, height: 50 }}>
              <Icon icon="mdi:credit-card" fontSize="2rem" />
            </CustomAvatar>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h4">{(mainBalance + bonusBalance).toFixed(2)}</Typography>
              <Typography variant="caption">Total Balance</Typography>
            </Box>
          </Box>

          <Typography sx={{ mb: 1.5, fontWeight: 600 }}>Your Balance</Typography>

          <LinearProgress
            value={mainBalancePercentage}
            classes={{ root: classes.root }}
            sx={{
              mb: 4,
            }}
            variant="determinate"
            color="primary"
          />

          <Box component="div" className="demo-space-x" sx={{ display: "flex", mb: 4 }}>
            <Button
              onClick={() => {
                setShowTopUpModal(true);
              }}
              sx={{ width: "100%" }}
              variant="contained"
              endIcon={<Icon icon="ic:round-add" />}
            >
              Top-up
            </Button>
            <Button
              sx={{ width: "100%" }}
              variant="outlined"
              color="primary"
              endIcon={<Icon icon="ic:baseline-outbox" />}
              onClick={() => {
                setShowWithdrawModal(true);
              }}
            >
              Withdraw
            </Button>
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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            "& svg": { mr: 1.8, color: `${row.color}.main` },
                          }}
                        >
                          <Icon icon="mdi:circle" fontSize="1rem" />
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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              mr: 1.5,
                              fontWeight: 600,
                              color: "text.primary",
                            }}
                          ></Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box component="div" sx={{ display: "flex", flexWrap: "wrap", mt: 4 }} gap={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& svg": { mr: 1.8, color: `primary.main` },
              }}
            >
              <Icon icon="mdi:circle" fontSize="1rem" />
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                Can withdraw
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& svg": { mr: 1.8, color: `warning.main` },
              }}
            >
              <Icon icon="mdi:circle" fontSize="1rem" />
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                Can not be withdrawn
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <WithdrawFunds
        onHide={() => {
          setShowWithdrawModal(false);
          BalanceRefetch();
        }}
        show={showWithdrawModal}
        mainBalance={mainBalance}
      />
      <TopUpWallet
        closeDialog={() => {
          setShowTopUpModal(false);
          setTimeout(() => {
            BalanceRefetch();
          }, 1000);
        }}
        showDialog={showTopUpModal}
      />
    </>
  );
};

export default CardGeneralStatistics;
