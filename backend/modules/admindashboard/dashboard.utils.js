// Reusable, dashboard-specific helper. Distinct from revenue.utils.js's
// formatDateRange (single start/end for one aggregation) — this one builds
// the array of {start, end, label} buckets needed for 12-month chart series,
// which the revenue module has no equivalent for.

export const getTrailingMonthBuckets = (monthsBack) => {
  const buckets = [];
  const now = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const start = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1,
      0,
      0,
      0,
      0,
    );
    const end = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      0,
      23,
      59,
      59,
      999,
    );

    buckets.push({
      start,
      end,
      label: start.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      year: start.getFullYear(),
      month: start.getMonth() + 1, // 1-indexed, matches $month in aggregation
    });
  }

  return buckets;
};

export const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getWeekRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);

  return { start, end };
};

export const getYearRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  return { start, end };
};

// Growth % between two comparable numbers. Handles zero-previous-period
// safely instead of returning Infinity/NaN to the frontend.
export const calculateGrowthPercent = (current, previous) => {
  if (!previous || previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(2));
};
