import { REQUEST_STATUS } from "@/enums/requestStatus.enums";

export const labels = [
  {
    color: "#FDB428",
    text: "In-Pool",
    status: REQUEST_STATUS.IN_POOL,
  },
  {
    color: "#667EFF",
    text: "Accepted",
    status: REQUEST_STATUS.ACCEPTED,
  },
  {
    color: "#68CD24",
    text: "In-Session",
    status: REQUEST_STATUS.IN_SESSION,
  },
  {
    color: "#22CC99",
    text: "Scheduled",
    status: REQUEST_STATUS.SCHEDULED,
  },
  {
    color: "#FF4D49",
    text: "Ended",
    status: REQUEST_STATUS.ENDED,
  },
  {
    color: "#FF6F00",
    text: "Withdrawn",
    status: REQUEST_STATUS.WITHDRAWN,
  },
];
