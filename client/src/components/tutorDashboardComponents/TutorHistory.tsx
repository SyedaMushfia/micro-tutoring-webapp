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
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function TutorHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const { backendUrl, userData } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/session/tutor/${userData?._id}/history`,
          { withCredentials: true }
        );

        setHistory(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (userData?._id) {
      fetchHistory();
    }
  }, [backendUrl, userData]);

  return (
    <TableContainer
      component={Paper}
      className="!bg-[#f2f4fc] !md:w-[42vw] h-[600px] !shadow-lg sm:px-[3%] xs:px-[10%] mt-4 !rounded-2xl"
    >
      <h1 className="mt-4 mb-6 ml-4 text-text1 text-center font-semibold text-[#2e294e]">
        Session History
      </h1>

      <Table aria-label="simple table" className="mt-4 !md:w-[39.25vw]">
        <TableHead>
          <TableRow>
            <TableCell className="bg-[#2e294e] !text-white font-semibold">Question</TableCell>
            <TableCell align="right" className="bg-[#2e294e] !text-white font-semibold">Subject</TableCell>
            <TableCell align="right" className="bg-[#2e294e] !text-white font-semibold">Student</TableCell>
            <TableCell align="right" className="bg-[#2e294e] !text-white font-semibold">Date</TableCell>
            <TableCell align="right" className="bg-[#2e294e] !text-white font-semibold">Earnings</TableCell>
            <TableCell align="right" className="bg-[#2e294e] !text-white font-semibold">Status</TableCell>
            <TableCell align="right" className="bg-[#2e294e] !text-white font-semibold">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No sessions yet
              </TableCell>
            </TableRow>
          ) : (
            history.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="max-w-[200px] truncate">{row.question}</TableCell>
                <TableCell align="right">{row.subject}</TableCell>
                <TableCell align="right">{row.studentName}</TableCell>
                <TableCell align="right">{new Date(row.startedAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">Rs.{row.amountEarned}</TableCell>
                <TableCell
                  align="right"
                  className={`font-semibold ${
                    row.status === 'completed'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {row.status}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/chatroom/${row.sessionId}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TutorHistory;
