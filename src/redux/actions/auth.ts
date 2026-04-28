import type { AppDispatch } from '../store';
import type { User } from '@/types';
import { setCredentials, logout } from '../slices/userSlice';
import { clearSelectedAgency } from '../slices/agencySlice';

// Reducer paths of every RTK Query api. Listed by name (string) on purpose:
// importing the api modules here would extend the existing
//   api → axiosBaseQuery → axiosInstance → store → api
// cycle and cause TDZ errors like "Cannot access 'axiosBaseQuery' before
// initialization" at module evaluation time. RTK Query's resetApiState is a
// plain action with a stable type, so dispatching by string is safe.
const API_REDUCER_PATHS = [
    'authApi',
    'agencyApi',
    'managerApi',
    'subscriptionApi',
    'analyticsApi',
    'checkinApi',
    'reportsApi',
] as const;

const resetAllApiCaches = (dispatch: AppDispatch) => {
    for (const reducerPath of API_REDUCER_PATHS) {
        dispatch({ type: `${reducerPath}/resetApiState` });
    }
};

/**
 * Apply credentials AND reset every per-user RTK Query cache. Without the
 * reset, signing in as user B would still serve user A's cached `getCurrentUser`,
 * `listMyAgencies`, etc. (cache key is unchanged because none of those queries
 * take user-specific arguments).
 */
export const loginSuccess =
    (payload: { user: User; accessToken: string; refreshToken: string }) =>
    (dispatch: AppDispatch) => {
        // Reset before setting credentials so any in-flight queries from the
        // previous identity are cancelled cleanly.
        resetAllApiCaches(dispatch);
        dispatch(clearSelectedAgency());
        dispatch(setCredentials(payload));
    };

/**
 * Clear local credentials AND every per-user RTK Query cache.
 */
export const signOutLocally = () => (dispatch: AppDispatch) => {
    dispatch(logout());
    dispatch(clearSelectedAgency());
    resetAllApiCaches(dispatch);
};
