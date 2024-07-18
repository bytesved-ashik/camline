import { Icon } from "@iconify/react";
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Typography } from "@mui/material";
import { Ref, forwardRef, ReactElement, useState } from "react";
import Fade, { FadeProps } from "@mui/material/Fade";
import "react-credit-cards/es/styles-compiled.css";
import WithDrawMethod from "../card/WithDrawMethod";
import * as toast from "src/utils/toast";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const WithdrawFunds = (props: any) => {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");

  const onAmountChange = (value: string) => {
    setAmount(value);
  };
  const onEmailChange = (value: string) => {
    setEmail(value);
  };

  const validateEmail = (email: string) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    return regex.test(email);
  };

  const handleWithdrawFunds = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (amount > props.mainBalance) {
      return toast.error("Insufficient balance");
    }
    if (!validateEmail(email)) {
      return toast.error("Invalid email syntax");
    }
    if (email) {
      // TODO : withdraw here
      console.log(email);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      scroll="body"
      onClose={props.onHide}
      open={props.show}
      TransitionComponent={Transition}
      onBackdropClick={props.onHide}
    >
      <form onSubmit={handleWithdrawFunds}>
        <DialogContent
          sx={{
            pb: 6,
            px: { xs: 8, sm: 15 },
            pt: { xs: 8, sm: 12.5 },
            position: "relative",
          }}
        >
          <IconButton size="small" onClick={props.onHide} sx={{ position: "absolute", right: "1rem", top: "1rem" }}>
            <Icon icon="mdi:close" />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 3, lineHeight: "2rem" }}>
              Withdraw your funds
            </Typography>
            <Typography variant="body2">Provide email address of your PayPal Account to withdraw funds</Typography>
          </Box>

          <WithDrawMethod
            onAmountChange={onAmountChange}
            amount={amount}
            onEmailChange={onEmailChange}
            email={email}
            isWithdrawModel={true}
          />
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: "center" }}>
          <Button variant="contained" sx={{ mr: 2 }} type="submit">
            Withdraw
          </Button>
          <Button variant="outlined" color="secondary" onClick={props.onHide}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WithdrawFunds;
