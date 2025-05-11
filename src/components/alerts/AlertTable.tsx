import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button
} from '@mui/material';
import { Warning, Dangerous } from '@mui/icons-material';
import type { Alert } from '@/types';
import { ALERT_LEVELS, ALERT_TYPES } from '@/types/constants';

interface AlertTableProps {
  alerts: Alert[];
  onAcknowledge: (alertId: number) => void;
}

export default function AlertTable({ alerts, onAcknowledge }: AlertTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Level</TableCell>
            <TableCell>Type</TableCell>
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
                  icon={alert.alertLevel === 'danger' ? <Dangerous /> : <Warning />}
                  label={ALERT_LEVELS.find(l => l.value === alert.alertLevel)?.label}
                  color={alert.alertLevel === 'danger' ? 'error' : 'warning'}
                />
              </TableCell>
              <TableCell>
                {ALERT_TYPES.find(t => t.value === alert.type)?.label}
              </TableCell>
              <TableCell>{alert.message}</TableCell>
              <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
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
      </Table>
    </TableContainer>
  );
}
