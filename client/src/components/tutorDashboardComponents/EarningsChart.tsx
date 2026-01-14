import { LineChart } from '@mui/x-charts/LineChart';

function EarningsChart() {
  return (
    <div className="bg-[#f2f4fc] shadow-lg rounded-2xl p-6 mt-4 w-full">
      <h2 className="text-[#2e294e] font-semibold text-lg mb-4">
        Weekly Earnings Overview
      </h2>

      <LineChart
        height={218}
        xAxis={[
          {
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
            data: [0, 0, 0, 0, 250],
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
