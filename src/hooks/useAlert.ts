import { useState } from 'react';

export const useAlert = () => {
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [postAlert, setPostAlert] = useState(false);
  const [reportAlert, setReportAlert] = useState(false);

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

  // プロフィール写真変更完了のアラート

  // プロフィール写真の削除アラート
  return {
    deleteAlert,
    DeleteAlert,
    postAlert,
    PostAlert,
    reportAlert,
    ReportAlert,
  };
};
