"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/routes";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define the dashboard data structure
interface DashboardData {
  tokenUsage: {
    totalIssued: number;
    totalUsed: number;
    remaining: number;
  };
  tokenUsageHistory?: {
    date: string;
    totalUsed: number;
  }[];
  whisperBlocks: {
    totalCreated: number;
    createdToday: number;
  };
  billing: {
    totalRevenue: number;
    recentTransactionsCount: number;
  };
  users: {
    total: number;
    today: number;
  };
  userSignupsHistory?: {
    date: string;
    newUsers: number;
  }[];
  database: {
    status: string;
    uptime: string;
  };
  crawler: {
    active: number;
    pending: number;
    lastError: string | null;
  };
  errors: Array<{
    timestamp: string;
    message: string;
  }>;
  auditLogs?: Array<{
    timestamp: string;
    action: string;
    performedBy: string;
  }>;
}

export default function AdminGodsEyeView() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Only allowed admins: super admin's email and view-only admin role.
  const allowedAdmins = ["steven@bulawebs.com"];
  const isAllowedAdmin =
    user && (allowedAdmins.includes(user.email) || user.role === "admin_view");

  // State for dashboard data and date range filters
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [pollInterval, setPollInterval] = useState<number>(10000); // Poll every 10 seconds
  const [notification, setNotification] = useState<string>("");

  // Fetch dashboard data from API with optional date filtering.
  const fetchDashboardData = async () => {
    try {
      let url = "/api/admin/dashboard";
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await fetch(url);
      const data: DashboardData = await res.json();
      setDashboardData(data);

      // If errors are present, display a notification.
      if (data.errors && data.errors.length > 0) {
        setNotification(`There are ${data.errors.length} error(s) reported. Please check the error log.`);
      } else {
        setNotification("");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setNotification("Unable to fetch dashboard data, please try again later.");
    }
  };

  // Polling: fetch data on mount and periodically
  useEffect(() => {
    if (!loading && !isAllowedAdmin) {
      router.push(ROUTES.public.home);
    }

    if (!loading && isAllowedAdmin) {
      fetchDashboardData();
      const interval = setInterval(() => {
        fetchDashboardData();
      }, pollInterval);
      return () => clearInterval(interval);
    }
  }, [user, loading, startDate, endDate]);

  // CSV export function: Exports dashboard metrics as CSV
  const exportCSV = () => {
    if (!dashboardData) return;

    // Prepare CSV content (simple example; can be improved)
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Total Tokens Issued,${dashboardData.tokenUsage.totalIssued}\n`;
    csvContent += `Total Tokens Used,${dashboardData.tokenUsage.totalUsed}\n`;
    csvContent += `Remaining Tokens,${dashboardData.tokenUsage.remaining}\n`;
    csvContent += `Total Whisper Blocks,${dashboardData.whisperBlocks.totalCreated}\n`;
    csvContent += `Whisper Blocks Created Today,${dashboardData.whisperBlocks.createdToday}\n`;
    csvContent += `Total Revenue,${dashboardData.billing.totalRevenue}\n`;
    csvContent += `Recent Transactions,${dashboardData.billing.recentTransactionsCount}\n`;
    csvContent += `Total Users,${dashboardData.users.total}\n`;
    csvContent += `Users Signed Up Today,${dashboardData.users.today}\n`;
    csvContent += `Database Status,${dashboardData.database.status}\n`;
    csvContent += `Database Uptime,${dashboardData.database.uptime}\n`;
    csvContent += `Active Crawlers,${dashboardData.crawler.active}\n`;
    csvContent += `Pending Crawlers,${dashboardData.crawler.pending}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare data for the token usage chart
  const tokenChartData = {
    labels: dashboardData?.tokenUsageHistory?.map((d) => d.date) || [],
    datasets: [
      {
        label: "Total Tokens Used",
        data: dashboardData?.tokenUsageHistory?.map((d) => d.totalUsed) || [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Gods-Eye-View Dashboard</h1>

      {notification && (
        <div className="bg-red-200 text-red-800 p-2 rounded mb-4">
          {notification}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
        {/* Date Filters */}
        <div className="flex space-x-2 items-center">
          <label htmlFor="startDate" className="font-semibold">Start:</label>
          <input
            id="startDate"
            type="date"
            className="border p-1 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 items-center">
          <label htmlFor="endDate" className="font-semibold">End:</label>
          <input
            id="endDate"
            type="date"
            className="border p-1 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Apply Filters
        </button>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded ml-auto"
        >
          Export CSV
        </button>
      </div>

      {/* Display Key Metrics */}
      {dashboardData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white shadow p-4 rounded">
            <h2 className="font-bold">Token Usage</h2>
            <p>Total Issued: {dashboardData.tokenUsage.totalIssued}</p>
            <p>Total Used: {dashboardData.tokenUsage.totalUsed}</p>
            <p>Remaining: {dashboardData.tokenUsage.remaining}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="font-bold">Whisper Blocks</h2>
            <p>Total Created: {dashboardData.whisperBlocks.totalCreated}</p>
            <p>Created Today: {dashboardData.whisperBlocks.createdToday}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="font-bold">Billing</h2>
            <p>Total Revenue: ${dashboardData.billing.totalRevenue}</p>
            <p>Recent Transactions: {dashboardData.billing.recentTransactionsCount}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="font-bold">Users</h2>
            <p>Total Users: {dashboardData.users.total}</p>
            <p>New Signups Today: {dashboardData.users.today}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="font-bold">Database</h2>
            <p>Status: {dashboardData.database.status}</p>
            <p>Uptime: {dashboardData.database.uptime}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="font-bold">Crawler Status</h2>
            <p>Active: {dashboardData.crawler.active}</p>
            <p>Pending: {dashboardData.crawler.pending}</p>
            <p>Last Error: {dashboardData.crawler.lastError || "None"}</p>
          </div>
        </div>
      ) : (
        <p>Loading dashboard data...</p>
      )}

      {/* Token Usage Chart */}
      {dashboardData?.tokenUsageHistory && dashboardData.tokenUsageHistory.length > 0 && (
        <div className="bg-white shadow p-4 rounded mb-8">
          <h2 className="font-bold mb-2">Token Usage Over Time</h2>
          <Line data={tokenChartData} />
        </div>
      )}

      {/* Audit Logs */}
      {dashboardData?.auditLogs && dashboardData.auditLogs.length > 0 && (
        <div className="bg-white shadow p-4 rounded mb-8">
          <h2 className="font-bold mb-2">Audit Logs</h2>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Timestamp</th>
                <th className="px-4 py-2 border">Action</th>
                <th className="px-4 py-2 border">Performed By</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.auditLogs.map((log, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{log.timestamp}</td>
                  <td className="px-4 py-2 border">{log.action}</td>
                  <td className="px-4 py-2 border">{log.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error Logs */}
      {dashboardData?.errors && dashboardData.errors.length > 0 && (
        <div className="bg-white shadow p-4 rounded mb-8">
          <h2 className="font-bold mb-2">Error Logs</h2>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Timestamp</th>
                <th className="px-4 py-2 border">Message</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.errors.map((err, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border">{err.timestamp}</td>
                  <td className="px-4 py-2 border">{err.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 