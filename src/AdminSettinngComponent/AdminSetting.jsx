import React, { useEffect, useRef, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../AdminSlices/profileSlice";
import { fetchRoles } from "../AdminSlices/rolesSlice";
import { fetchSystem } from "../AdminSlices/systemSlice";
import { fetchActivity } from "../AdminSlices/activitySlice";

/* ---------- Lazy Components ---------- */
const ProfileForm = lazy(() => import("../AdminSettinngComponent/ProfileForm"));
const SecurityPanel = lazy(
  () => import("../AdminSettinngComponent/SecurityPanel"),
);
const ThemePanel = lazy(() => import("../AdminSettinngComponent/ThemePanel"));
const PermissionsPanel = lazy(
  () => import("../AdminSettinngComponent/PermissionPanel"),
);
const SystemSettingsPanel = lazy(
  () => import("../AdminSettinngComponent/SystemSettingPanel"),
);
const ActivityLogs = lazy(() => import("../Admin component/ActivityLogs"));
const ExportDeletePanel = lazy(
  () => import("../AdminSettinngComponent/ExportDeletePanel"),
);

/* ---------- Skeleton Loader ---------- */
const SkeletonLoader = ({ className = "" }) => (
  <div
    className={`bg-white/80 backdrop-blur-md p-4 rounded-xl border border-rose-100 shadow-sm animate-pulse ${className}`}
  >
    <div className="h-6 bg-rose-100 rounded w-1/3 mb-4" />
    <div className="space-y-3">
      <div className="h-4 bg-rose-100 rounded" />
      <div className="h-4 bg-rose-100 rounded w-5/6" />
      <div className="h-4 bg-rose-100 rounded w-4/6" />
    </div>
  </div>
);

/* ---------- Error UI ---------- */
const ErrorFallback = ({ error, retry }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 shadow-sm">
    <p className="font-semibold">Failed to load component</p>
    <p className="text-sm mt-1">{error?.message || "Unexpected error"}</p>
    <button
      onClick={retry}
      className="mt-2 text-rose-600 underline text-sm"
      type="button"
    >
      Try Again
    </button>
  </div>
);

/* ---------- Error Boundary ---------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("Component Error:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          retry={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}

/* ---------- Wrapper ---------- */
const ComponentWrapper = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<SkeletonLoader />}>{children}</Suspense>
  </ErrorBoundary>
);

/* ---------- MAIN ---------- */
export default function AdminSettings() {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  // ── Profile ──────────────────────────────────────────────
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useSelector((state) => state.profile);

  // ── Login logs (from adminLogin slice, localStorage only) ─
  const { logins } = useSelector((state) => state.adminLogin);

  // ── Roles ────────────────────────────────────────────────
  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
  } = useSelector((state) => state.roles);

  // ── System ───────────────────────────────────────────────
  const {
    system,
    loading: systemLoading,
    error: systemError,
  } = useSelector((state) => state.system);

  // ── Activity ─────────────────────────────────────────────
  const {
    activities,
    loading: activityLoading,
    error: activityError,
  } = useSelector((state) => state.activity);

  // ── Aggregated loading / error ────────────────────────────
  const loading =
    profileLoading || rolesLoading || systemLoading || activityLoading;

  const error = profileError || rolesError || systemError || activityError;

  // ── Fetch on mount (once) ─────────────────────────────────
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    dispatch(fetchProfile());
    dispatch(fetchRoles());
    dispatch(fetchSystem());
    dispatch(fetchActivity());
  }, [dispatch]);

  // ── Retry handler ─────────────────────────────────────────
  const handleRetry = () => {
    hasFetched.current = false;
    hasFetched.current = true;

    dispatch(fetchProfile());
    dispatch(fetchRoles());
    dispatch(fetchSystem());
    dispatch(fetchActivity());
  };

  // ── Safe data defaults ────────────────────────────────────
  const safeData = {
    profile: profile || null,
    logins: logins || [],
    roles: roles || [],
    system: system || null,
    activities: activities || [],
  };

  // ── Full page skeleton on first load ──────────────────────
  if (loading && !profile) {
    return (
      <div className="px-4 py-6 space-y-6 bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-50 min-h-screen">
        <div className="h-8 bg-rose-100 w-64 rounded animate-pulse" />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-3xl font-bold text-rose-900">Admin Settings</h2>
        {error && (
          <button
            onClick={handleRetry}
            className="text-rose-600 hover:text-rose-800 underline text-sm"
          >
            Retry
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 shadow-sm">
          {error}
        </div>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ComponentWrapper>
            <ProfileForm profile={safeData.profile} />
          </ComponentWrapper>

          <ComponentWrapper>
            <SecurityPanel />
          </ComponentWrapper>

          <ComponentWrapper>
            <PermissionsPanel roles={safeData.roles} />
          </ComponentWrapper>

          <ComponentWrapper>
            <SystemSettingsPanel system={safeData.system} />
          </ComponentWrapper>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ComponentWrapper>
            <ThemePanel profile={safeData.profile} />
          </ComponentWrapper>

          <ComponentWrapper>
            <ActivityLogs activity={safeData.activities} />
          </ComponentWrapper>

          <ComponentWrapper>
            <ExportDeletePanel />
          </ComponentWrapper>
        </div>
      </div>

      {/* Floating Loader */}
      {loading && (
        <div className="fixed bottom-5 right-5 bg-rose-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Updating...</span>
        </div>
      )}
    </div>
  );
}
