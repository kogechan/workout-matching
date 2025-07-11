import { useState } from 'react';

export const useAlert = () => {
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [postAlert, setPostAlert] = useState(false);
  const [reportAlert, setReportAlert] = useState(false);
  const [messageDeleteAlert, setMessageDeleteAlert] = useState(false);
  const [accountDeleteAlert, setAccountDeleteAlert] = useState(false);
  const [userBlockAlert, setUserBlockAlert] = useState(false);
  const [userUnBlockAlert, setUserUnBlockAlert] = useState(false);

  // 投稿の削除アラート
  const DeleteAlert = () => {
    setDeleteAlert(true);
    setTimeout(() => {
      setDeleteAlert(false);
    }, 3000);
  };

  // 投稿の成功アラート
  const PostAlert = () => {
    setPostAlert(true);
    setTimeout(() => {
      setPostAlert(false);
    }, 3000);
  };

  // 報告成功のアラート
  const ReportAlert = () => {
    setReportAlert(true);
    setTimeout(() => {
      setReportAlert(false);
    }, 3000);
  };

  // メッセージルームの削除アラート
  const MessageDeleteAlert = () => {
    setMessageDeleteAlert(true);
    setTimeout(() => {
      setMessageDeleteAlert(false);
    }, 3000);
  };

  // 退会のアラート
  const AccountDeleteAlert = () => {
    setAccountDeleteAlert(true);
    setTimeout(() => {
      setAccountDeleteAlert(false);
    }, 3000);
  };

  // ユーザーをブロック成功のアラート
  const UserBlockAlert = () => {
    setUserBlockAlert(true);
    setTimeout(() => {
      setUserBlockAlert(false);
    }, 3000);
  };

  // ユーザーをブロック成功のアラート
  const UserUnBlockAlert = () => {
    setUserUnBlockAlert(true);
    setTimeout(() => {
      setUserUnBlockAlert(false);
    }, 3000);
  };

  return {
    deleteAlert,
    DeleteAlert,
    postAlert,
    PostAlert,
    reportAlert,
    ReportAlert,
    messageDeleteAlert,
    MessageDeleteAlert,
    accountDeleteAlert,
    AccountDeleteAlert,
    userBlockAlert,
    UserBlockAlert,
    userUnBlockAlert,
    UserUnBlockAlert,
  };
};
