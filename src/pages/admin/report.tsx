import { Report, ReportStatus } from '@/type/report';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

export const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ReportStatus>('pending');
  const [adminNotes, setAdminNotes] = useState('');
  const router = useRouter();

  // 管理者権限チェック
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/');
        return;
      }

      const { data } = await supabase
        .from('admins')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (!data) {
        router.push('/');
      }
    };
    checkAdmin();
  }, [router]);

  // 通報データの取得
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      // 総取得数
      const { count } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true });

      if (count !== null) {
        setTotal(count);
      }

      // データ取得
      const { data, error } = await supabase
        .from('reports')
        .select(`*, reporter: reporter_id(id, email)`)
        .order('created_at', { ascending: false })
        .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1);

      if (error) {
        console.error(error);
      } else if (data) {
        setReports(data as unknown as Report[]);
      }
      setLoading(false);
    };
    fetchReports();
  }, [page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (report: Report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setAdminNotes('');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedReport(null);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    try {
      const { error } = await supabase
        .from('report')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedReport.id);

      if (error) throw error;

      // 更新成功したら一覧を更新
      setReports(
        reports.map((report) =>
          report.id === selectedReport.id
            ? {
                ...report,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : report
        )
      );

      handleCloseDialog();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'reviewing':
        return 'info';
      case 'resolved':
        return 'success';
      case 'dismissed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        通報管理
      </Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>タイプ</TableCell>
                <TableCell>理由</TableCell>
                <TableCell>報告者</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell>報告日時</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>{report.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {report.reported_type === 'user' ? 'ユーザー' : '投稿'}
                  </TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>
                    {(report as any).reporter?.username || '匿名'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        {
                          pending: '保留中',
                          reviewing: '確認中',
                          resolved: '解決済み',
                          dismissed: '却下',
                        }[report.status]
                      }
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(report.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenDialog(report)}
                    >
                      詳細
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    読み込み中...
                  </TableCell>
                </TableRow>
              )}
              {!loading && reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    通報はありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="1ページあたりの行数"
        />
      </Paper>

      {/* 通報詳細ダイアログ */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedReport && (
          <>
            <DialogTitle>通報詳細</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  対象：
                  {selectedReport.reported_type === 'user'
                    ? 'ユーザー'
                    : '投稿'}{' '}
                  (ID: {selectedReport.reported_id})
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  理由：{selectedReport.reason}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  詳細：
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="body2">
                    {selectedReport.details || '詳細情報なし'}
                  </Typography>
                </Paper>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="status-select-label">ステータス</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={newStatus}
                  label="ステータス"
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                >
                  <MenuItem value="pending">保留中</MenuItem>
                  <MenuItem value="reviewing">確認中</MenuItem>
                  <MenuItem value="resolved">解決済み</MenuItem>
                  <MenuItem value="dismissed">却下</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="管理者メモ"
                multiline
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>キャンセル</Button>
              <Button
                onClick={handleUpdateReport}
                variant="contained"
                color="primary"
              >
                更新
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};
