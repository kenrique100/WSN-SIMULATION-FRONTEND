import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, TableFooter, TablePagination
} from '@mui/material';
import { Warning, Dangerous, Info } from '@mui/icons-material';
import type { Alert, AlertLevel } from '@/types';
import { formatDate } from '@/types/helpers';
import Loading from '@/components/common/Loading';
import ErrorAlert from '@/components/common/ErrorAlert';

interface AlertTableProps {
  alerts: Alert[];
  onAcknowledge: (alertId: number) => void;
  totalElements: number;
  page: number;
  size: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  error?: Error | null;
}

const getAlertIcon = (level: AlertLevel) => {
  switch (level) {
    case 'CRITICAL': return <Dangerous />;
    case 'WARNING': return <Warning />;
    default: return <Info />;
  }
};

const getAlertColor = (level: AlertLevel) => {
  switch (level) {
    case 'CRITICAL': return 'error';
    case 'WARNING': return 'warning';
    default: return 'info';
  }
};

export default function AlertTable({
                                     alerts,
                                     onAcknowledge,
                                     totalElements,
                                     page,
                                     size,
                                     onPageChange,
                                     isLoading = false,
                                     error = null
                                   }: AlertTableProps) {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert message={error.message} />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Level</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.alertId}>
              <TableCell>
                <Chip
                  icon={getAlertIcon(alert.alertLevel)}
                  label={alert.alertLevel}
                  color={getAlertColor(alert.alertLevel)}
                />
              </TableCell>
              <TableCell>{alert.message || 'No message'}</TableCell>
              <TableCell>{formatDate(new Date(alert.timestamp))}</TableCell>
              <TableCell>
                {alert.acknowledged ? (
                  <Chip label="Acknowledged" color="success" />
                ) : (
                  <Chip label="Pending" color="default" />
                )}
              </TableCell>
              <TableCell>
                {!alert.acknowledged && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onAcknowledge(alert.alertId)}
                  >
                    Acknowledge
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10]}
              count={totalElements}
              rowsPerPage={size}
              page={page}
              onPageChange={(_, newPage) => onPageChange(newPage)}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}