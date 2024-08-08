/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './LineChartComponent.css';

const salesData = [
  {
    name: 'Jan',
    profit: 24,
  },
  {
    name: 'Feb',
    profit: 13,
  },
  {
    name: 'Mar',
    profit: 20,
  },
  {
    name: 'Apr',
    profit: 27,
  },
  {
    name: 'May',
    profit: 18,
  },
  {
    name: 'Jun',
    profit: 23,
  },
  {
    name: 'Jun',
    profit: 23,
  },
  {
    name: 'Jun',
    profit: 23,
  },
  {
    name: 'Jun',
    profit: 23,
  },
  {
    name: 'Jun',
    profit: 23,
  },
]; 

function LineChartComponent({data}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data || salesData}
        margin={{
          right: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="WPM" stroke="#8b5cf6" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='chart-label'>
        <p>{label} sec</p>
        <p>
          WPM:
          <span >{Math.round(payload[0].value)}</span>
        </p>
      </div>
    );
  }
};