import { Icon } from "@iconify/react";
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, IconButton, Typography } from "@mui/material";
import Fade, { FadeProps } from "@mui/material/Fade";
import { Dispatch, ReactElement, Ref, SetStateAction, forwardRef, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "react-credit-cards/es/styles-compiled.css";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getSetupIntent } from "@/services/stripe.service";
import { stripePublishKey } from "@/constants/environmentConstant";
import * as toast from "@/utils/toast";
import { useRouter } from "next/router";

if (!stripePublishKey) throw new Error("Stripe publish key not found");
const stripePromise = loadStripe(
  "pk_live_51Oc7BZKBVPKp4Iz55vkRenYS7cg7kxGa8n02bwwA977QXqdAjWKsB6GEbAG4pgwHIoBmnOzQCMkvavMq3txTfAjJ00TqvQcAEH"
);

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});
type IProp = {
  onClose: () => void;
  open: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};
const AddNewCard = (props: IProp) => {
  const [clientSecret, setClientSecret] = useState("");

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };
  const { onClose, open, setVisible } = props;
  useEffect(() => {
    getSetupIntent().then((res) => setClientSecret(res.client_secret));
  }, []);

  return (
    <>
      {clientSecret && (
        <>
          <Elements options={options} stripe={stripePromise}>
            <SetupIntet setVisible={setVisible} clientSecret={clientSecret} open={open} onClose={onClose} />
          </Elements>
        </>
      )}
    </>
  );
};

function SetupIntet({
  setVisible,
  clientSecret,
  open,
  onClose,
}: {
  setVisible: Dispatch<SetStateAction<boolean>>;
  clientSecret: string;
  onClose: () => void;
  open: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    //   stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }: { paymentIntent: any }) => {
    //     if (!paymentIntent) return;
    //     switch (paymentIntent.status) {
    //       case "succeeded":
    //         setMessage("Payment succeeded!");
    //         break;
    //       case "processing":
    //         setMessage("Your payment is processing.");
    //         break;
    //       case "requires_payment_method":
    //         setMessage("Your payment was not successful, please try again.");
    //         break;
    //       default:
    //         setMessage("Something went wrong.");
    //         break;
    //     }
    //   });
  }, [stripe]);
  const handleSubmit = async () => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return null;
    }

    const { error } = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: location.origin + router.pathname,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  // const handleBlur = () => setFocus(undefined);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      scroll="body"
      onClose={onClose}
      open={open}
      TransitionComponent={Transition}
      onBackdropClick={onClose}
    >
      <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: "relative" }}>
        <IconButton size="small" onClick={onClose} sx={{ position: "absolute", right: "1rem", top: "1rem" }}>
          <Icon icon="mdi:close" />
        </IconButton>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 3, lineHeight: "2rem" }}>
            Add New Card
          </Typography>
          <Typography variant="body2">Add card for future billing</Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12} sx={{ pt: (theme) => `${theme.spacing(5)} !important` }}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <PaymentElement />
                {errorMessage && <div>{errorMessage}</div>}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: "center" }}>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => {
            handleSubmit().then((success) => {
              if (success) {
                setVisible(false);
                setErrorMessage(null);
                toast.success("Payment successful");
              }
            });
          }}
        >
          Submit
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddNewCard;
