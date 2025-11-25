import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRevenue, setPeriod } from "../Slices/dashBoardSlice";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function RevenueCard() {
  const dispatch = useDispatch();
  const { revenue, selectedPeriod, loading } = useSelector(
    (state) => state.dashboard
  );

  // Fetch revenue whenever "selectedPeriod" changes
  useEffect(() => {
    dispatch(fetchRevenue(selectedPeriod));
  }, [selectedPeriod, dispatch]);

  const handlePeriodChange = (e) => {
    dispatch(setPeriod(e.target.value));
  };

  // Memoized chart data for performance
  const chartData = useMemo(() => {
    if (!revenue?.trend) return [];
    return revenue.trend.map((value, index) => ({
      name: `Week ${index + 1}`,
      value,
    }));
  }, [revenue]);

  const growth = revenue?.growthPercent || 0;
  const total = revenue?.totalRevenue || 0;

  return (
    <div className="bg-white mt-8 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
          Revenue Overview
        </h3>

        <select
          value={selectedPeriod}
          onChange={handlePeriodChange}
          className="border border-gray-300 rounded-lg text-sm p-2 bg-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="month">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-32 mb-4" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      ) : (
        <>
          {/* Revenue & Growth */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                ${total.toLocaleString()}
              </h2>

              <p
                className={`text-sm mt-1 flex items-center gap-1 font-medium ${
                  growth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {growth >= 0 ? (
                  <FaArrowUp className="text-green-600" />
                ) : (
                  <FaArrowDown className="text-red-600" />
                )}
                {growth}% vs last period
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="gradientRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="10%" stopColor="#4F46E5" stopOpacity={0.5} />
                    <stop offset="90%" stopColor="#4F46E5" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    borderColor: "#e5e7eb",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#gradientRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
