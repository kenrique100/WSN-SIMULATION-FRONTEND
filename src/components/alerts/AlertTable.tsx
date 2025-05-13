// src/components/alerts/AlertTable.tsx
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, TableFooter, TablePagination
} from '@mui/material';
import { Warning, Dangerous, Info } from '@mui/icons-material';
import type { Alert } from '@/types';
import { formatDate } from '@/types/helpers';

interface AlertTableProps {
  alerts: Alert[];
  onAcknowledge: (alertId: number) => void;
  totalElements: number;
  page: number;
  size: number;
  onPageChange: (page: number) => void;
}

const getAlertIcon = (level: 'INFO' | 'WARNING' | 'CRITICAL') => {
  switch (level) {
    case 'CRITICAL': return <Dangerous />;
    case 'WARNING': return <Warning />;
    default: return <Info />;
  }
};

const getAlertColor = (level: 'INFO' | 'WARNING' | 'CRITICAL') => {
  switch (level) {
    case 'CRITICAL': return 'error';
    case 'WARNING': return 'warning';
    default: return 'info';
  }
};

const getAlertLabel = (level: 'INFO' | 'WARNING' | 'CRITICAL') => {
  switch (level) {
    case 'CRITICAL': return 'Critical';
    case 'WARNING': return 'Warning';
    default: return 'Info';
  }
};

export default function AlertTable({
                                     alerts,
                                     onAcknowledge,
                                     totalElements,
                                     page,
                                     size,
                                     onPageChange
                                   }: AlertTableProps) {
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
                        label={getAlertLabel(alert.alertLevel)}
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