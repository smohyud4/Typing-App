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
  
  const salesData = [
    {
      name: 'Jan',
      revenue: 4000,
      profit: 2400,
    },
    {
      name: 'Feb',
      revenue: 3000,
      profit: 1398,
    },
    {
      name: 'Mar',
      revenue: 9800,
      profit: 2000,
    },
    {
      name: 'Apr',
      revenue: 3908,
      profit: 2780,
    },
    {
      name: 'May',
      revenue: 4800,
      profit: 1890,
    },
    {
      name: 'Jun',
      revenue: 3800,
      profit: 2390,
    },
  ];
  
export default function LineChartComponent() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={salesData}
          margin={{
            right: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
          <Line type="monotone" dataKey="profit" stroke="#8b5cf6" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  