import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import { Icon } from "@iconify/react";

type Props = {
  amount: string;
  onAmountChange: (value: string) => void;
  email?: string;
  onEmailChange?: (email: string) => void;
  isWithdrawModel?: boolean;
};

const WithDrawMethod = (props: Props) => {
  return (
    <>
      {props.isWithdrawModel ? (
        <TextField
          onChange={(e) => {
            if (props.onEmailChange) {
              props.onEmailChange(e.target.value);
            }
          }}
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={props.email}
          sx={{ mb: 8 }}
        />
      ) : null}

      <TextField
        onChange={(e) => props.onAmountChange(e.target.value)}
        label="Amount"
        type="number"
        variant="outlined"
        fullWidth
        value={props.amount}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon icon="carbon:currency-dollar" />
            </InputAdornment>
          ),

          inputProps: {
            min: 0,
          },
        }}
      />
    </>
  );
};

export default WithDrawMethod;
