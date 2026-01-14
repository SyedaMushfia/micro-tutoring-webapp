import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';

function EarningsHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const { backendUrl } = useAppContext();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/earnings/history`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setHistory(res.data.history);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, [backendUrl]);

  return (
    <div className='w-[35vw]'>
        <TableContainer component={Paper} className="!bg-[#f2f4fc] !md:w-[35vw] h-[605px] !shadow-lg sm:px-[3%] xs:px-[10%] mt-4 !rounded-2xl">
          <h1 className='mt-4 mb-6 ml-4 text-text1 text-center font-semibold text-[#2e294e]'>Earnings History</h1>
          <Table aria-label="simple table" className='mt-4 !md:w-[39.25vw]'>
            <TableHead>
              <TableRow>
                <TableCell className='bg-[#2e294e] !text-white font-semibold'>Date</TableCell>
                <TableCell align="right" className='bg-[#2e294e] !text-white font-semibold'>Question ID</TableCell>
                <TableCell align="right" className='bg-[#2e294e] !text-white font-semibold'>Subject</TableCell>
                <TableCell align="right" className='bg-[#2e294e] !text-white font-semibold'>Amount Earned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {history.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right"><span className="block max-w-[140px] truncate" title={row.questionId}>{row.questionId}</span></TableCell>
                <TableCell align="right">{row.subject}</TableCell>
                <TableCell align="right">
                  <span className="text-green-600 font-semibold">
                    +{row.amount}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
    </div>
  );
}

export default EarningsHistory;