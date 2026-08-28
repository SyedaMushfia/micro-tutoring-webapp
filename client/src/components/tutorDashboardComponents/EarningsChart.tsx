import { LineChart } from '@mui/x-charts/LineChart';

interface Earning {
  amount: number;
  createdAt: string;
}

interface EarningsChartProps {
  earnings: Earning[];
}

function EarningsChart({ earnings }: EarningsChartProps) {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(today.getDate() - 6);

  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + index);
    return day;
  });

  const weeklyTotals = days.map((day) => earnings
    .filter((earning) => {
      const createdAt = new Date(earning.createdAt);
      return createdAt.toDateString() === day.toDateString();
    })
    .reduce((total, earning) => total + earning.amount, 0));

  return (
    <div className="bg-[#f2f4fc] shadow-lg rounded-2xl p-6 mt-4 w-full">
      <h2 className="text-[#2e294e] font-semibold text-lg mb-4">
        Weekly Earnings Overview
      </h2>

      <LineChart
        height={218}
        xAxis={[
          {
            data: days.map((day) => day.toLocaleDateString('en-US', { weekday: 'short' })),
            scaleType: 'point',
            label: 'Days',
            labelStyle: {
              fill: '#555',
              fontSize: 12,
            },
            tickLabelStyle: {
              fill: '#555',
              fontSize: 11,
            },
          },
        ]}
        series={[
          {
            data: weeklyTotals,
            label: 'Earnings (LKR)',
            color: '#2e294e',
            curve: 'monotoneX',
            showMark: true,
          },
        ]}
        grid={{
          horizontal: true,
          vertical: false,
        }}
        sx={{
          '& .MuiChartsAxis-line': {
            stroke: '#ddd',
          },
          '& .MuiChartsAxis-tick': {
            stroke: '#ddd',
          },
          '& .MuiChartsGrid-line': {
            stroke: '#e6e6f0',
            strokeDasharray: '4 4',
          },
          '& .MuiChartsLegend-root': {
            color: '#2e294e',
          },
          '& .MuiChartsTooltip-root': {
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          },
        }}
      />
    </div>
  );
}

export default EarningsChart;
