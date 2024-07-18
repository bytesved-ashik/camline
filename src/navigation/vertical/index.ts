// ** Type import
import { ROLE } from "@/enums/role.enums";
import { VerticalNavItemsType } from "src/@core/layouts/types";

const Navigation = (dashBoardPath: string): VerticalNavItemsType => {
  const userType = localStorage.getItem("TCUSER");

  const therapistRoute = [
    {
      title: "Dashboard",
      path: dashBoardPath,
      icon: "mdi:home-outline",
    },
    {
      title: "Chats",
      path: "/chats",
      icon: "mdi:chat-outline",
    },
    {
      title: "Notes",
      path: "/notes",
      icon: "mdi:note-edit",
    },
    {
      title: "Transaction History",
      path: "/calls",
      icon: "mdi:cash",
    },
    {
      title: "Call Logs",
      path: "/callLogs",
      icon: "mdi:call",
    },
  ];

  const userRoutes = [
    {
      title: "Dashboard",
      path: dashBoardPath,
      icon: "mdi:home-outline",
    },
    {
      title: "Chats",
      path: "/chats",
      icon: "mdi:chat-outline",
    },
    {
      title: "Transaction History",
      path: "/calls",
      icon: "mdi:cash",
    },
    {
      title: "Payment History",
      path: "/transactions",
      icon: "mdi:cash",
    },
    {
      title: "Therapist",
      path: "/therapist",
      icon: "material-symbols:physical-therapy",
    },
    {
      title: "Call Logs",
      path: "/callLogs",
      icon: "mdi:call",
    },
  ];

  const adminRoutes = [
    {
      title: "Users",
      path: "/users",
      icon: "mdi:people",
    },
    {
      title: "Therapist",
      path: "/therapist",
      icon: "material-symbols:physical-therapy",
    },
    {
      title: "Referral Codes",
      path: "/referal",
      icon: "material-symbols:group-add",
    },
    {
      title: "Transaction History",
      path: "/calls",
      icon: "mdi:cash",
    },
    {
      title: "Payment History",
      path: "/transactions",
      icon: "mdi:cash",
    },
    {
      title: "Call Logs",
      path: "/callLogs",
      icon: "mdi:call",
    },
  ];

  return userType === ROLE.ADMIN ? adminRoutes : userType === ROLE.USER ? userRoutes : therapistRoute;
};

export default Navigation;
