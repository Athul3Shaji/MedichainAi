import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
  Cell,
} from "recharts";

const STATUS_COLORS = {
  approved: "#22C55E",   // green
  failed: "#EF4444",     // red
  pending: "#F59E0B",    // yellow
  progressing: "#3B82F6", // blue
};

const Analytics = () => {
  const [claims, setClaims] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("All");
  const [hospitalOptions, setHospitalOptions] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get("/claims");
        const result = response.data;

        if (result.success) {
          setClaims(result.data);

          // Extract hospital list
          const hospitals = [...new Set(result.data.map(claim => claim.hospital))];
          setHospitalOptions(["All", ...hospitals]);

          setChartData(transformData(result.data));
        } else {
          console.error("Failed to fetch claims data.");
        }
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };

    fetchClaims();
  }, []);

  const transformData = (claimsData) => {
    const filtered = selectedHospital === "All"
      ? claimsData
      : claimsData.filter(claim => claim.hospital === selectedHospital);

    const statusCounts = filtered.reduce((acc, claim) => {
      acc[claim.claimStatus] = (acc[claim.claimStatus] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([claimStatus, count]) => ({
      claimStatus,
      count,
      fill: STATUS_COLORS[claimStatus] || "#6366F1",
    }));
  };

  useEffect(() => {
    setChartData(transformData(claims));
  }, [selectedHospital]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Navbar />

        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-semibold">Claim Status Overview</h2>
          <select
            className="border rounded px-3 py-2 text-sm"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
          >
            {hospitalOptions.map((hospital) => (
              <option key={hospital} value={hospital}>
                {hospital}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full h-[420px] bg-white p-6 rounded-lg shadow mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              barSize={50}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="claimStatus"
                tick={{ fontSize: 14 }}
                label={{ value: "Status", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                allowDecimals={false}
                label={{
                  value: "Number of Claims",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
              />
              <Tooltip
                formatter={(value, name) => [`${value} claims`, name]}
                contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }}
              />
              <Legend />
              <Bar dataKey="count" name="Claims">
                <LabelList dataKey="count" position="top" />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
