"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/lib/routes";
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
import ErrorBoundary from '@/components/ErrorBoundary'

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
    user && (allowedAdmins.includes(user.email ?? "") || user.role === "admin_view");

  // State for dashboard data and date range filters
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [pollInterval, setPollInterval] = useState<number>(10000); // Poll every 10 seconds
  const [notification, setNotification] = useState<string>("");

  // Fetch dashboard data from API with optional date filtering.
  const fetchDashboardData = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      let url = "/api/admin/dashboard";
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      
      const res = await fetch(url, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data: DashboardData = await res.json();
      setDashboardData(data);

      // If errors are present, display a notification.
      if (data.errors && data.errors.length > 0) {
        setNotification(`There are ${data.errors.length} error(s) reported. Please check the error log.`);
      } else {
        setNotification("");
      }
    } catch (error) {
      // Handle abort errors differently
      if (error instanceof DOMException && error.name === 'AbortError') {
        setNotification('Request timed out. Please try again.');
      } else if (error instanceof Error) {
        console.error("Error fetching dashboard data:", error);
        setNotification("Unable to fetch dashboard data, please try again later.");
      } else {
        console.error("Unknown error:", error);
        setNotification("An unknown error occurred.");
      }
    }
  }, [startDate, endDate]);

  // Polling: fetch data on mount and periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (!loading && isAllowedAdmin) {
      const fetchWithInterval = () => {
        fetchDashboardData();
        intervalId = setInterval(fetchDashboardData, pollInterval);
      };
      
      fetchWithInterval();
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [user, loading, startDate, endDate, pollInterval, isAllowedAdmin, fetchDashboardData]);

  // CSV export function: Exports dashboard metrics as CSV
  const exportCSV = () => {
    try {
      if (!dashboardData) return;

      const escapeCsvValue = (value: any) => {
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      const csvRows = [
        ['Metric', 'Value'],
        ['Total Tokens Issued', dashboardData.tokenUsage.totalIssued],
        ['Total Tokens Used', dashboardData.tokenUsage.totalUsed],
        ['Remaining Tokens', dashboardData.tokenUsage.remaining],
        ['Total Whisper Blocks', dashboardData.whisperBlocks.totalCreated],
        ['Whisper Blocks Created Today', dashboardData.whisperBlocks.createdToday],
        ['Total Revenue', dashboardData.billing.totalRevenue],
        ['Recent Transactions', dashboardData.billing.recentTransactionsCount],
        ['Total Users', dashboardData.users.total],
        ['Users Signed Up Today', dashboardData.users.today],
        ['Database Status', dashboardData.database.status],
        ['Database Uptime', dashboardData.database.uptime],
        ['Active Crawlers', dashboardData.crawler.active],
        ['Pending Crawlers', dashboardData.crawler.pending],
      ];

      const csvContent = csvRows
        .map(row => row.map(escapeCsvValue).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export failed:', error);
      setNotification('Failed to export CSV. Please try again.');
    }
  };

  // Memoize chart data
  const tokenChartData = useMemo(() => ({
    labels: dashboardData?.tokenUsageHistory?.map((d) => d.date) || [],
    datasets: [{
      label: "Total Tokens Used",
      data: dashboardData?.tokenUsageHistory?.map((d) => d.totalUsed) || [],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    }],
  }), [dashboardData?.tokenUsageHistory]);

  return (
    <ErrorBoundary context="Admin Dashboard">
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
        {!dashboardData && (
          <div role="status" className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        )}

        {dashboardData && (
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
            <table className="min-w-full border" role="grid" aria-label="Error Logs">
              <thead>
                <tr role="row" className="bg-gray-100">
                  <th role="columnheader" className="px-4 py-2 border">Timestamp</th>
                  <th role="columnheader" className="px-4 py-2 border">Message</th>
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
    </ErrorBoundary>
  );
} 