import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { format, subDays } from "date-fns";

// Register components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface Range {
  [key: string]: number;
}

const ranges: Range = {
  "7 Days": 7,
  "30 Days": 30,
  "100 Days": 100,
};

export default function Dashboard() {
  const [selectedRange, setSelectedRange] =
    useState<keyof typeof ranges>("30 Days");

  // Generate labels and data for each metric based on the selected range
  const generateData = (days: number) => {
    const labelsArray = Array.from({ length: days }, (_, i) =>
      format(subDays(new Date(), i), "MMM dd")
    ).reverse();

    const studyHoursData = Array.from(
      { length: days },
      () => Math.floor(Math.random() * 10) + 1 // Random study hours data (1-10 hours)
    );

    const breaksData = Array.from(
      { length: days },
      () => Math.floor(Math.random() * 5) + 1 // Random breaks data (1-5 hours)
    );

    const tasksCompletedData = Array.from(
      { length: days },
      () => Math.floor(Math.random() * 10) + 1 // Random tasks completed data (1-10 tasks)
    );

    return {
      labels: labelsArray,
      studyHoursData,
      breaksData,
      tasksCompletedData,
    };
  };

  const { labels, studyHoursData, breaksData, tasksCompletedData } =
    generateData(ranges[selectedRange]);

  // Data for each bar chart
  const studyHoursBarData = {
    labels: labels,
    datasets: [
      {
        label: "Hours Studied",
        data: studyHoursData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const breaksBarData = {
    labels: labels,
    datasets: [
      {
        label: "Breaks Taken (hrs)",
        data: breaksData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const tasksCompletedBarData = {
    labels: labels,
    datasets: [
      {
        label: "Tasks Completed",
        data: tasksCompletedData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions: ChartJS.ChartOptions<"bar"> = {
    scales: {
      y: {
        beginAtZero: true,
        max: 10, // Adjust max based on your data range
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: true,
      },
      datalabels: {
        display: true,
        align: "end",
        anchor: "end",
        color: "black",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <div className="text-center mb-8 text-2xl">Progress Report</div>

      <select
        className="mb-8 p-2 border border-gray-300 rounded"
        value={selectedRange}
        onChange={(e) =>
          setSelectedRange(e.target.value as keyof typeof ranges)
        }
      >
        {Object.keys(ranges).map((range) => (
          <option key={range} value={range}>
            {range}
          </option>
        ))}
      </select>

      {/* Bar chart for study hours */}
      <div className="w-full max-w-3xl mb-10 overflow-x-auto">
        <div className="min-w-[1200px] h-[400px]">
          <Bar data={studyHoursBarData} options={barOptions} />
        </div>
      </div>

      <div className="w-full max-w-3xl mb-10 overflow-x-auto">
        <div className="min-w-[1200px] h-[400px]">
          <Bar data={breaksBarData} options={barOptions} />
        </div>
      </div>

      <div className="w-full max-w-3xl mb-10 overflow-x-auto">
        <div className="min-w-[1200px] h-[400px]">
          <Bar data={tasksCompletedBarData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
