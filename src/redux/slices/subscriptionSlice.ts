import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subscription } from '@/types';

interface SubscriptionState {
    subscription: Subscription | null;
    isPaymentModalOpen: boolean;
    isPaymentProcessing: boolean;
    paymentError: string | null;
    paymentSuccess: boolean;
    isLoadingSubscription: boolean;
}

const initialState: SubscriptionState = {
    subscription: null,
    isPaymentModalOpen: false,
    isPaymentProcessing: false,
    paymentError: null,
    paymentSuccess: false,
    isLoadingSubscription: false,
};

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        setSubscription: (state, action: PayloadAction<Subscription | null>) => {
            state.subscription = action.payload;
        },
        openPaymentModal: (state) => {
            state.isPaymentModalOpen = true;
            state.paymentError = null;
            state.paymentSuccess = false;
        },
        closePaymentModal: (state) => {
            state.isPaymentModalOpen = false;
        },
        setPaymentProcessing: (state, action: PayloadAction<boolean>) => {
            state.isPaymentProcessing = action.payload;
        },
        setPaymentError: (state, action: PayloadAction<string | null>) => {
            state.paymentError = action.payload;
            state.isPaymentProcessing = false;
        },
        setPaymentSuccess: (state, action: PayloadAction<boolean>) => {
            state.paymentSuccess = action.payload;
        },
        resetPaymentState: (state) => {
            state.isPaymentModalOpen = false;
            state.isPaymentProcessing = false;
            state.paymentError = null;
            state.paymentSuccess = false;
        },
        setLoadingSubscription: (state, action: PayloadAction<boolean>) => {
            state.isLoadingSubscription = action.payload;
        },
    },
});

export const {
    setSubscription,
    openPaymentModal,
    closePaymentModal,
    setPaymentProcessing,
    setPaymentError,
    setPaymentSuccess,
    resetPaymentState,
    setLoadingSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
