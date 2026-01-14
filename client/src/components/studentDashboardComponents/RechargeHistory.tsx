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

function RechargeHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const { backendUrl } = useAppContext();

  useEffect(() => {
    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/recharge/topup-history`, { withCredentials: true });
            if (res.data.success) {
            setHistory(res.data.history);
            } 
        } catch (error: any) {
            console.error(error)
        }
    } 

    fetchHistory();
  }, [backendUrl])

  return (
    <TableContainer component={Paper} className="!bg-[#f2f4fc] !md:w-[42vw] h-[335px] !shadow-lg sm:px-[3%] xs:px-[10%] mt-4 !rounded-2xl">
      <h1 className='mt-4 mb-6 ml-4 text-text1 text-center font-semibold text-[#2e294e]'>Recharge History</h1>
      <Table aria-label="simple table" className='mt-4 !md:w-[39.25vw]'>
        <TableHead>
          <TableRow>
            <TableCell className='bg-[#2e294e] !text-white font-semibold'>Date</TableCell>
            <TableCell align="right" className='bg-[#2e294e] !text-white font-semibold'>Amount</TableCell>
            <TableCell align="right" className='bg-[#2e294e] !text-white font-semibold'>Card Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {history.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {new Date(row.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.cardNumber}</TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RechargeHistory;