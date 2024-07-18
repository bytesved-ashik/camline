import { PropsWithChildren } from "react";
import { Box, Modal as MuiModal } from "@mui/material";

type IModalProps = {
  open: boolean;
  onClose: () => void;
  padding?: number;
};

export default function Modal({ open, onClose, children, padding }: PropsWithChildren<IModalProps>) {
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    borderRadius: "1rem",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: padding || 4,
  };

  return (
    <MuiModal open={open} onClose={onClose}>
      <Box sx={style}>{children}</Box>
    </MuiModal>
  );
}
