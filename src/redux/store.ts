import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authApi } from './api/authApi';
import { subscriptionApi } from './api/subscriptionApi';
import { userApi } from './api/userApi';
import { analyticsApi } from './api/analyticsApi';
import { checkinApi } from './api/checkinApi';
import { reportsApi } from './api/reportsApi';
import { uiReducer, userReducer, agencyReducer } from './slices';
import { agencyApi } from './api/agencyApi';
import { managerApi } from './api/managerApi';

const rootReducer = combineReducers({
    user: userReducer,
    ui: uiReducer,
    agency: agencyReducer,
    [authApi.reducerPath]: authApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [checkinApi.reducerPath]: checkinApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [agencyApi.reducerPath]: agencyApi.reducer,
    [managerApi.reducerPath]: managerApi.reducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'agency'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'user/setSession'],
                ignoredActionPaths: ['payload.session'],
                ignoredPaths: ['user.session'],
            },
        })
            .concat(
                authApi.middleware,
                subscriptionApi.middleware,
                userApi.middleware,
                analyticsApi.middleware,
                checkinApi.middleware,
                reportsApi.middleware,
                agencyApi.middleware,
                managerApi.middleware,
            )
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Pre-typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
