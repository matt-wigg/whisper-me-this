import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface DataEntry {
  avg_logprob: number;
  compression_ratio: number;
  end: number;
  id: number;
  no_speech_prob: number;
  seek: number;
  start: number;
  temperature: number;
  text: string;
  tokens: number[];
}

interface DataTableProps {
  data: DataEntry[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            {/* <TableCell>Seek</TableCell>
            <TableCell>Temperature</TableCell> */}
            <TableCell>Compression Ratio</TableCell>
            <TableCell>Average Log Probability</TableCell>
            <TableCell>No Speech Probability</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.id}</TableCell>
              <TableCell>{entry.text}</TableCell>
              <TableCell>{entry.start}</TableCell>
              <TableCell>{entry.end}</TableCell>
              {/* <TableCell>{entry.seek}</TableCell>
              <TableCell>{entry.temperature}</TableCell> */}
              <TableCell>{entry.compression_ratio}</TableCell>
              <TableCell>{entry.avg_logprob}</TableCell>
              <TableCell>{entry.no_speech_prob}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DataTable;
