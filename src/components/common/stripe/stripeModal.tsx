import { loadStripe } from "@stripe/stripe-js";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import * as toast from "@/utils/toast";
import { useTheme } from "@mui/material/styles";

import Modal from "@/components/common/custom-mui-components/Modal";

// import { axios } from "../config";
import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { stripePublishKey } from "@/constants/environmentConstant";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Icon from "src/@core/components/icon";
import createApi from "@/utils/axios";
import useWalletUtility from "@/hooks/wallet/useWalletUtility";
import { publishEvt } from "@/utils/events";

type StripeProps = {
  amount: number;
  setVisible: Dispatch<SetStateAction<boolean>>;
  closeDialogue: () => void;
};

const stripeApi = createApi("/stripe");

if (!stripePublishKey) throw new Error("Stripe publish key not found");
const stripePromise = loadStripe(
  "pk_live_51Oc7BZKBVPKp4Iz55vkRenYS7cg7kxGa8n02bwwA977QXqdAjWKsB6GEbAG4pgwHIoBmnOzQCMkvavMq3txTfAjJ00TqvQcAEH"
);

export default function Stripe({ amount, setVisible, closeDialogue }: StripeProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const checkoutAmount = amount * 100;
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    const fetchClientSecret = async () => {
      const { data: paymentIntent } = await stripeApi.post("/client_secret/", {
        amount: checkoutAmount,
        saveCard: saveCard,
      });

      setClientSecret(paymentIntent.clientSecret);
      setVisible(true);
    };

    setClientSecret("");
    fetchClientSecret().catch((err) => {
      const errorMessage = err.response?.data?.error;
      setVisible(true);
      toast.error(errorMessage ?? "Something went wrong");
    });
  }, [amount, setVisible]);

  return (
    <>
      {clientSecret && (
        <>
          <Elements options={options} stripe={stripePromise}>
            <CheckOutForm
              setVisible={setVisible}
              setSaveCard={setSaveCard}
              clientSecret={clientSecret}
              closeDialogue={closeDialogue}
              amount={amount}
            />
          </Elements>
        </>
      )}
    </>
  );
}

function CheckOutForm({
  setVisible,
  clientSecret,
  setSaveCard,
  closeDialogue,
  amount,
}: {
  setVisible: Dispatch<SetStateAction<boolean>>;
  clientSecret: string;
  setSaveCard: Dispatch<SetStateAction<boolean>>;
  closeDialogue: () => void;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setIsTouupDone, setShowTopUpModal } = useWalletUtility();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);

        return "Please Validate your card details";
      } else {
        setMessage("An unexpected error occurred.");
      }

      return "error";
    }

    setVisible(false);
    closeDialogue();

    return "Payment succeeded!";
  };

  const paymentElementOptions = {
    layout: "tabs",
  };
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Modal
      open={true}
      onClose={() => {
        setVisible(false);
        setMessage("");
      }}
    >
      <Grid p={5}></Grid>
      <Dialog
        fullScreen={fullScreen}
        onClose={() => setVisible(false)}
        aria-labelledby="customized-dialog-title"
        open={true}
        maxWidth="md"
        scroll="body"
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ textAlign: "center" }}></Typography>
          <Typography variant="caption" sx={{ textAlign: "center", display: "block" }}>
            {/* Fill your CC Details */}
            <Typography sx={{ fontWeight: 600 }}>Total</Typography>
            <Typography sx={{ fontWeight: 600 }}>£{amount ? (amount + (amount * 20) / 100).toFixed(2) : 0}</Typography>
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setVisible(false)}
            sx={{ top: 10, right: 10, position: "absolute", color: "grey.500" }}
          >
            <Icon icon="mdi:close" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box p={5}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            {message && <div id="payment-message">{message}</div>}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setSaveCard(event.target.checked)}
                  />
                }
                label="Save Card for future billing?"
                sx={{ "& .MuiTypography-root": { color: "text.secondary" } }}
              />
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mt: "20px" }}>
          <Button
            variant="contained"
            disabled={isLoading || !stripe || !elements}
            onClick={() => {
              handleSubmit().then((message) => {
                if (!message) return;
                if (message === "Payment succeeded!") {
                  setVisible(false);
                  setIsTouupDone(true);
                  setShowTopUpModal(false);
                  publishEvt("touupSuccess");
                  setMessage("");
                  toast.success(message);

                  return;
                }
                setIsLoading(false);
                toast.error(message);
              });
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : "Pay Now"}
          </Button>
          <Button variant="outlined" onClick={() => setVisible(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Modal>
  );
}
