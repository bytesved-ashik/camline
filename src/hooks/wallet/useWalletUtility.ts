import { useState } from "react";

export default function useWalletUtility() {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isTouupDone, setIsTouupDone] = useState(false);

  return { showTopUpModal, setShowTopUpModal, showWithdrawModal, setShowWithdrawModal, setIsTouupDone, isTouupDone };
}
