import React from 'react';
import ReactApexChart from 'react-apexcharts';

const UserAnalyticsChart = ({ chartData }) => {
  return (
    <ReactApexChart
      options={chartData.options}
      series={chartData.series}
      type="line"
      height={350}
    />
  );
};

export default UserAnalyticsChart;
