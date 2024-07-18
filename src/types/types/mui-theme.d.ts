// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    black: Palette["primary"];
  }
  interface PaletteOptions {
    black?: PaletteOptions["primary"];
  }
}
