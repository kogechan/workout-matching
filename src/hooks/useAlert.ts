import { useState } from 'react';

export const useAlert = () => {
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [postAlert, setPostAlert] = useState(false);
  const [reportAlert, setReportAlert] = useState(false);
  const [blockAlert, setBlockAlert] = useState(false);
  const [messageDeleteAlert, setMessageDeleteAlert] = useState(false);
  const [accountDeleteAlert, setAccountDeleteAlert] = useState(false);

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

  // ブロックのアラート
  const BlockAlert = () => {
    setBlockAlert(true);
    setTimeout(() => {
      setBlockAlert(false);
    }, 3000);
  };

  // メッセージルームの削除アラート
  const MessageDeleteAlert = () => {
    setMessageDeleteAlert(true);
    setTimeout(() => {
      setMessageDeleteAlert(false);
    }, 3000);
  };

  // 大会のアラート
  const AccountDeleteAlert = () => {
    setAccountDeleteAlert(true);
    setTimeout(() => {
      setAccountDeleteAlert(false);
    }, 3000);
  };

  return {
    deleteAlert,
    DeleteAlert,
    postAlert,
    PostAlert,
    reportAlert,
    ReportAlert,
    blockAlert,
    BlockAlert,
    messageDeleteAlert,
    MessageDeleteAlert,
    accountDeleteAlert,
    AccountDeleteAlert,
  };
};
