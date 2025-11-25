import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivity, selectAllActivity } from "../AdminSlices/activitySlice";

export default function ActivityLogs() {
  const dispatch = useDispatch();
  const activities = useSelector(selectAllActivity);
  const loading = useSelector((state) => state.activity.loading);
  const error = useSelector((state) => state.activity.error);

  useEffect(() => {
    dispatch(fetchActivity());
  }, [dispatch]);

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
