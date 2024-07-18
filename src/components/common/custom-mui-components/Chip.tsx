import { Chip as MuiChip } from "@mui/material";

export default function Chip({ label }: { label: string }) {
  return <MuiChip label={label} color="secondary" data-aos="flip-left" />;
}
