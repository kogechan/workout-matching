import {
  currentUserAtom,
  reportUserModalAtom,
  reportUserTargetAtom,
} from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useAlert } from '@/hooks/useAlert';
import CheckIcon from '@mui/icons-material/Check';

const REPORT_REASONS = ['ハラスメント', '違法行為', 'なりすまし', 'その他'];

export const UserReport = () => {
  const [reportModalOpen, setReportModalOpen] = useAtom(reportUserModalAtom);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const { reportAlert, ReportAlert } = useAlert();
  const [currentUserId] = useAtom(currentUserAtom);
  const [reportTarget] = useAtom(reportUserTargetAtom);

  const handleReasonChange = (e: SelectChangeEvent) => {
    setReason(e.target.value);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      console.error('理由を選択してください');
      return;
    }
    setLoading(true);

    try {
      const { error: submitError } = await supabase.from('reports').insert({
        reporter_id: currentUserId,
        reported_id: reportTarget?.id,
        reason,
        details: details || null,
      });

      if (submitError) throw submitError;

      setTimeout(() => {
        setReportModalOpen(false);
        ReportAlert();
      }, 2000);

      setTimeout(() => {
        setReason('');
        setDetails('');
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Snackbar
        open={reportAlert}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          報告しました。ご協力ありがとうございました。
        </Alert>
      </Snackbar>
      <Dialog
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            style: {
              borderRadius: 16,
            },
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>ユーザーを報告</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              ユーザー: {reportTarget?.username}
            </DialogContentText>

            <FormControl fullWidth sx={{ mb: 2 }} required>
              <InputLabel id="report-reason-label">通報理由</InputLabel>
              <Select
                labelId="report-reason-label"
                value={reason}
                label="通報理由"
                onChange={handleReasonChange}
                disabled={loading}
              >
                {REPORT_REASONS.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="詳細（任意）"
              multiline
              rows={4}
              value={details}
              onChange={handleDetailsChange}
              fullWidth
              disabled={loading}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setReportModalOpen(false)}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Box sx={{ position: 'relative' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !reason}
              >
                通報する
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
