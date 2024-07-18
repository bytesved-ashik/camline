// ** MUI Imports
import MuiChip from "@mui/material/Chip";

// ** Third Party Imports
import clsx from "clsx";

// ** Types
import { CustomChipProps } from "./types";

// ** Hooks Imports

const Chip = (props: CustomChipProps) => {
  // ** Props
  const { sx, skin, color, rounded } = props;

  // ** Hook

  const propsToPass = { ...props };

  propsToPass.rounded = undefined;

  return (
    <MuiChip
      {...propsToPass}
      variant="filled"
      className={clsx({
        "MuiChip-rounded": rounded,
        "MuiChip-light": skin === "light",
      })}
      sx={skin === "light" && color ? null : sx}
    />

    // Object.assign(colors[color], sx)
  );
};

export default Chip;
