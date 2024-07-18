// ** Types
import { Socket } from "socket.io-client";
import { ThemeColor } from "src/@core/layouts/types";
import { QueryAccepted } from "../interfaces/queryAccepted.interface";
import { Dispatch, SetStateAction } from "react";
import { IAccountDetails } from "../interfaces/profile.interface";

export type StatusType = "busy" | "away" | "online" | "offline";

export type StatusObjType = {
  busy: ThemeColor;
  away: ThemeColor;
  online: ThemeColor;
  offline: ThemeColor;
};

export type ProfileUserType = {
  id: string | undefined;
  role: string | undefined;
  about: string;
  avatar: string;
  fullName: string;
  status: any;
  settings: {
    isNotificationsOn: boolean;
    isTwoStepAuthVerificationEnabled: boolean;
  };
};

export type MsgFeedbackType = {
  isSent: boolean;
  isSeen: boolean;
  isDelivered: boolean;
};

export type ChatType = {
  chatSessionId: string;
  createdAt: Date | string;
  message: string;
  messageType: "text" | "session";
  receivers: string[];
  senderId: number;
  _id: number;
  updatedAt: Date | string;
  feedback: MsgFeedbackType;
  session: QueryAccepted;
};

export type ChatsObj = {
  id: number;
  userId: number;
  chat: ChatType[];
  unseenMsgs: number;
  lastMessage?: ChatType;
};

export type ContactType = {
  id: number;
  role: string;
  about: string;
  avatar?: string;
  fullName: string;
  status: StatusType;
  avatarColor?: ThemeColor;
};

export type ChatsArrType = {
  id: number;
  role: string;
  about: string;
  chat: ChatsObj;
  avatar?: string;
  fullName: string;
  status: StatusType;
  avatarColor?: ThemeColor;
};

export type SelectedChatType = null | {
  chat: ChatsObj;
  contact: ChatsArrType;
};

export type ChatStoreType = {
  chats: ChatsArrType[] | null;
  contacts: ContactType[] | null;
  userProfile: ProfileUserType | null;
  selectedChat: SelectedChatType;
};

export type SendMsgParamsType = {
  chat?: ChatsObj;
  message: string;
  contact?: ChatsArrType;
};
export type IAllChats = {
  session: {
    therapist: {
      _id: string;
      firstName: string;
      lastName: string;
      id: string;
    };
    attendees: [
      {
        _id: string;
        firstName: string;
        lastName: string;
        id: string;
      }
    ];
    id: string;
  };
  id: string;
  users: IAccountDetails[];
  _id: string;
  chatSessionId: string;
};

export type ChatContentType = {
  hidden: boolean;
  mdAbove: boolean;
  store: ChatStoreType;
  sidebarWidth: number;
  dispatch: Dispatch<any>;
  statusObj: StatusObjType;
  userProfileRightOpen: boolean;
  handleLeftSidebarToggle: () => void;
  getInitials: (val: string) => string;
  sendMsg: (params: SendMsgParamsType) => void;
  handleUserProfileRightSidebarToggle: () => void;
};

export type ChatSidebarLeftType = {
  hidden: boolean;
  mdAbove: boolean;
  store: ChatStoreType;
  sidebarWidth: number;
  userStatus: StatusType;
  dispatch: Dispatch<any>;
  leftSidebarOpen: boolean;
  statusObj: StatusObjType;
  userProfileLeftOpen: boolean;
  removeSelectedChat: () => void;
  selectChat: (id: number) => void;
  handleLeftSidebarToggle: () => void;
  getInitials: (val: string) => string;
  setUserStatus: (status: StatusType) => void;
  handleUserProfileLeftSidebarToggle: () => void;
  formatDateToMonthShort: (value: string, toTimeForCurrentDay: boolean) => void;
};

export type UserProfileLeftType = {
  hidden: boolean;
  store: ChatStoreType;
  sidebarWidth: number;
  userStatus: StatusType;
  statusObj: StatusObjType;
  userProfileLeftOpen: boolean;
  setUserStatus: (status: StatusType) => void;
  handleUserProfileLeftSidebarToggle: () => void;
};

export type UserProfileRightType = {
  hidden: boolean;
  store: ChatStoreType;
  sidebarWidth: number;
  statusObj: StatusObjType;
  userProfileRightOpen: boolean;
  getInitials: (val: string) => string;
  handleUserProfileRightSidebarToggle: () => void;
};

export type SendMsgComponentType = {
  store: ChatStoreType;
  dispatch: Dispatch<any>;
  sendMsg: (params: SendMsgParamsType) => void;
};
export type IChatData = {
  chat: ChatsObj;
  contact: ContactType;
  userContact: ProfileUserType;
};
export type ChatLogType = {
  socket: Socket | undefined;
  hidden: boolean;
  data: IChatData;
  refetch: () => void;
  setShowScheduleDialogue: Dispatch<SetStateAction<boolean>>;
  chatKey?: string;
  sessionId?: string;
};

export type MessageType = {
  createdAt: string | Date;
  message: string;
  senderId: number;
  feedback: MsgFeedbackType;
  messageType: "text" | "session";
  session: QueryAccepted;
};

export type ChatLogChatType = {
  msg: string;
  time: string | Date;
  feedback: MsgFeedbackType;
  isScheduledMessage: boolean;
  session: QueryAccepted;
};

export type FormattedChatsType = {
  senderId: number;
  messages: ChatLogChatType[];
};

export type MessageGroupType = {
  senderId: number;
  messages: ChatLogChatType[];
};

export type IGetChatData = {
  chatSessionId: string;
  createdAt: string;
  updatedAt: string;
  users: string[];
  _id: string;
};
