import { useState } from 'react';

export const useAlert = () => {
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [postAlert, setPostAlert] = useState(false);
  const [reportAlert, setReportAlert] = useState(false);

  const DeleteAlert = () => {
    setDeleteAlert(true);
    setTimeout(() => {
      setDeleteAlert(false);
    }, 3000);
  };

  const PostAlert = () => {
    setPostAlert(true);
    setTimeout(() => {
      setPostAlert(false);
    }, 3000);
  };

  const ReportAlert = () => {
    setReportAlert(true);
    setTimeout(() => {
      setReportAlert(false);
    }, 3000);
  };
  return {
    deleteAlert,
    DeleteAlert,
    postAlert,
    PostAlert,
    reportAlert,
    ReportAlert,
  };
};
