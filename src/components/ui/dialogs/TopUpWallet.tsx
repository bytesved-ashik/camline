import { Icon } from "@iconify/react";
import {
  Box,
  Button,
  CardContent,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Ref, forwardRef, ReactElement, useState, useEffect } from "react";
import Fade, { FadeProps } from "@mui/material/Fade";
import CustomChip from "src/@core/components/mui/chip";
import Modal from "@/components/common/custom-mui-components/Modal";
import * as toast from "src/utils/toast";
import Stripe from "@/components/common/stripe/stripeModal";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const TopUpWallet = (props: any) => {
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(0);

  const onAmountChange = (value: number) => {
    setAmount(value);
  };

  useEffect(() => {
    if (props.amount === null || props.amount === undefined || !props.amount || props.amount < 15) {
      setAmount(15);

      return;
    }
    setAmount(props.amount ?? 0);
  }, []);

  useEffect(() => {
    const charge = 1.5;
    setMinutes(amount / charge);
  }, [amount]);

  return (
    <>
      <Dialog
        fullWidth
        open={props.showDialog}
        maxWidth="md"
        scroll="body"
        onClose={props.closeDialog}
        TransitionComponent={Transition}
        onBackdropClick={props.closeDialog}
      >
        <DialogContent
          sx={{
            px: { xs: 8, sm: 15 },
            py: { xs: 8, sm: 12.5 },
            position: "relative",
          }}
        >
          <IconButton size="small" onClick={props.closeDialog} sx={{ position: "absolute", right: "1rem", top: "1rem" }}>
            <Icon icon="mdi:close" />
          </IconButton>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 1, lineHeight: "2rem" }}>
              Top-up your Wallet
            </Typography>
            <Typography sx={{ mb: 3, lineHeight: "2rem", fontSize: "19px" }}>We charge £1.5 per minute.</Typography>
          </Box>
          <Grid direction="column" container spacing={6}>
            <Grid item xs={7}>
              <TextField
                onChange={(e) => onAmountChange(Number(e.target.value))}
                label="Amount"
                type="number"
                variant="outlined"
                placeholder="Please top up minimum £15"
                fullWidth
                value={amount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="carbon:currency-pound" />
                    </InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                  },
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <Box
                sx={{
                  mb: 4,
                  borderRadius: 1,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Typography sx={{ mb: 4, fontWeight: 600 }}>Top-up Details</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box
                      sx={{
                        mb: 2,
                        gap: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        Top-up Amount
                      </Typography>
                      <Typography variant="body2">£{amount.toFixed(2)} </Typography>
                    </Box>

                    <Box
                      sx={{
                        mb: 2,
                        gap: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        Order Total
                      </Typography>
                      <Typography variant="body2" sx={{ color: "primary.main" }}>
                        £{amount ? amount.toFixed(2) : 0}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        mb: 2,
                        gap: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        Minutes
                      </Typography>
                      <Typography variant="body2" sx={{ color: "primary.main" }}>
                        {`${minutes.toFixed(2)} Minutes`}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        gap: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        Handling Charges
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            mr: 2,
                            textDecoration: "line-through",
                            color: "text.disabled",
                          }}
                        >
                          £{0}
                        </Typography>
                        <CustomChip size="small" skin="light" color="success" label="Free" />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
                <Divider sx={{ m: "0 !important" }} />
                <CardContent sx={{ py: (theme) => `${theme.spacing(3.5)} !important` }}>
                  <Box
                    sx={{
                      gap: 2,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>Total</Typography>
                    <Typography sx={{ fontWeight: 600 }}>£{amount ? amount.toFixed(2) : 0}</Typography>
                  </Box>
                </CardContent>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  sx={{ width: "100%" }}
                  disabled={amount < 15}
                  onClick={() => {
                    if (!amount) {
                      toast.error("Please enter amount");

                      return;
                    }
                    if (amount < 15) {
                      toast.error("Minimum amount should be £15");

                      return;
                    }
                    setOpen(true);
                  }}
                >
                  Top-up
                </Button>
                <Modal open={open} onClose={() => setOpen(false)}>
                  <Stripe amount={amount} setVisible={setOpen} closeDialogue={props.closeDialog} />
                </Modal>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TopUpWallet;
