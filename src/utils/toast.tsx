import toast from "react-hot-toast";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

export const success = (message: string) => {
  const toastId = toast.success(message, {
    position: "bottom-left",
    className: "toastSuccess",
    id: message,
    icon: <CheckCircleRoundedIcon onClick={() => toast.dismiss()} />,
    duration: 2000,
  });

  setTimeout(() => {
    toast.dismiss(toastId);
  }, 2000);
};

export const error = (message: string) => {
  const toastId = toast.error(message, {
    position: "top-right",
    className: "toastError",
    id: message,
    icon: <CancelRoundedIcon onClick={() => toast.dismiss()} />,
    duration: 2800,
  });

  setTimeout(() => {
    toast.dismiss(toastId);
  }, 2800);
};
