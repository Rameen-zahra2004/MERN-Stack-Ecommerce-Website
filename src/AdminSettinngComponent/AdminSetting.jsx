import React, { useEffect, useRef, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../AdminSlices/profileSlice";
import { fetchLogins } from "../AdminSlices/adminLoginSlice";
import { fetchRoles } from "../AdminSlices/rolesSlice";
import { fetchSystem } from "../AdminSlices/systemSlice";
import { fetchActivity } from "../AdminSlices/activitySlice";

// Lazy load components
const ProfileForm = lazy(() => import("../AdminSettinngComponent/ProfileForm"));
const SecurityPanel = lazy(() => import("../AdminSettinngComponent/SecurityPanel"));
const ThemePanel = lazy(() => import("../AdminSettinngComponent/ThemePanel"));
const PermissionsPanel = lazy(() => import("../AdminSettinngComponent/PermissionPanel"));
const SystemSettingsPanel = lazy(() => import("../AdminSettinngComponent/SystemSettingPanel"));
const ActivityLogs = lazy(() => import("../Admin component/ActivityLogs"));
const ExportDeletePanel = lazy(() => import("../AdminSettinngComponent/ExportDeletePanel"));

// Skeleton loader
const SkeletonLoader = ({ className = "" }) => (
  <div className={`bg-white p-4 rounded shadow animate-pulse ${className}`}>
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-4/6" />
    </div>
  </div>
);

// Error fallback
const ErrorFallback = ({ error, retry }) => (
  <div className="bg-red-50 border border-red-300 rounded p-4 text-red-800">
    <p className="font-semibold">Failed to load component</p>
    <p className="text-sm mt-1">{error?.message || "Unexpected error"}</p>
    <button onClick={retry} className="mt-2 underline text-sm" type="button">
      Try Again
    </button>
  </div>
);

// Error boundary
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

const ComponentWrapper = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<SkeletonLoader />}>{children}</Suspense>
  </ErrorBoundary>
);

export default function AdminSettings() {
  const dispatch = useDispatch();

  // ✅ FIX: use a ref to track if we already fetched — survives re-renders
  const hasFetched = useRef(false);

  const { profile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
  const { logins, loading: loginsLoading, error: loginsError } = useSelector((state) => state.logins);
  const { roles, loading: rolesLoading, error: rolesError } = useSelector((state) => state.roles);
  const { system, loading: systemLoading, error: systemError } = useSelector((state) => state.system);
  const { activities, loading: activityLoading, error: activityError } = useSelector((state) => state.activity);

  const loading = profileLoading || loginsLoading || rolesLoading || systemLoading || activityLoading;
  const error = profileError || loginsError || rolesError || systemError || activityError;

  // ✅ FIX: empty deps [] — runs ONCE on mount only, never again
  // hasFetched ref prevents double-fire in React Strict Mode
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    dispatch(fetchProfile());
    dispatch(fetchLogins());
    dispatch(fetchRoles());
    dispatch(fetchSystem());
    dispatch(fetchActivity());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Manual retry — only called when user clicks Retry button
  const handleRetry = () => {
    hasFetched.current = false; // reset so retry works
    hasFetched.current = true;
    dispatch(fetchProfile());
    dispatch(fetchLogins());
    dispatch(fetchRoles());
    dispatch(fetchSystem());
    dispatch(fetchActivity());
  };

  const safeData = {
    profile: profile || null,
    logins: logins || [],
    roles: roles || [],
    system: system || null,
    activities: activities || [],
  };

  if (loading && !profile) {
    return (
      <div className="px-4 py-6 space-y-6">
        <div className="h-8 bg-gray-200 w-64 rounded animate-pulse" />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-3xl font-semibold">Admin Settings</h2>
        {error && (
          <button onClick={handleRetry} className="text-blue-600 underline text-sm">
            Retry
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-700">
          {error}
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content */}
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

        {/* Right Sidebar */}
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

      {/* Background Loader */}
      {loading && (
        <div className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded shadow flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Updating...</span>
        </div>
      )}
    </div>
  );
}