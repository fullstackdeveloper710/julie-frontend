export { default as userReducer, setCredentials, setUser, setAccessToken, logout } from './userSlice';
export {
  default as uiReducer,
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
} from './uiSlice';
export { default as agencyReducer, setSelectedAgencyId, clearSelectedAgency } from './agencySlice';
export {
  default as subscriptionReducer,
  setSubscription,
  openPaymentModal,
  closePaymentModal,
  setPaymentProcessing,
  setPaymentError,
  setPaymentSuccess,
  resetPaymentState,
  setLoadingSubscription,
} from './subscriptionSlice';

// Backwards-compatible alias for code paths that still import `setSession`.
export { setCredentials as setSession } from './userSlice';
