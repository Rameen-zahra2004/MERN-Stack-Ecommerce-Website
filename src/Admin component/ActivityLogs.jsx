import { useSelector } from "react-redux";
import { selectAllActivity } from "../AdminSlices/activitySlice";

// ✅ FIX: removed useDispatch + useEffect + fetchActivity dispatch
// AdminSetting.jsx already fetches all data once on mount
// ActivityLogs just reads from Redux state

export default function ActivityLogs() {
  const activities = useSelector(selectAllActivity);
  const loading = useSelector((state) => state.activity.loading);
  const error = useSelector((state) => state.activity.error);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Activity Logs</h2>
      <ul>
        {activities.map((act) => (
          <li key={act.id}>{act.action}</li>
        ))}
      </ul>
    </div>
  );
}