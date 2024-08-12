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

function transformData(data) {
  data[0]["WPM/s"] = data[1].WPM;

  if (data.length > 60) {
    return data.filter((_, index) => index % 4 === 0 || index === data.size-1);
  }

  if (data.length > 40) {
    return data.filter((_, index) => index % 3 === 0 || index === data.size-1);
  }

  if (data.length > 20) {
    return data.filter((_, index) => index % 2 === 0 || index === data.size-1);
  }
  
  return data;
}

function LineChartComponent({data}) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={100}>
      <LineChart
        width={500}
        height={300}
        data={transformData(data)}
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
        <Line type="monotone" dataKey="WPM/s" stroke="#82ca9d" />
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
          <span>{Math.round(payload[0].value)}</span>
        </p>
        <p>
          WPM/s:
          <span>{Math.round(payload[1].value)}</span>
        </p>
      </div>
    );
  }
};