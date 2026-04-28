import type { AppDispatch } from '../store';
import type { User } from '@/types';
import { setCredentials, logout } from '../slices/userSlice';
import { clearSelectedAgency } from '../slices/agencySlice';

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

export const loginSuccess =
  (payload: { user: User; accessToken: string; refreshToken: string }) =>
  (dispatch: AppDispatch) => {
    resetAllApiCaches(dispatch);
    dispatch(clearSelectedAgency());
    dispatch(setCredentials(payload));
  };

export const signOutLocally = () => (dispatch: AppDispatch) => {
  dispatch(logout());
  dispatch(clearSelectedAgency());
  resetAllApiCaches(dispatch);
};
