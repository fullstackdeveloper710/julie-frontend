import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AgencyState {
    selectedAgencyId: string | null;
}

const initialState: AgencyState = {
    selectedAgencyId: null,
};

const agencySlice = createSlice({
    name: 'agency',
    initialState,
    reducers: {
        setSelectedAgencyId: (state, action: PayloadAction<string | null>) => {
            state.selectedAgencyId = action.payload;
        },
        clearSelectedAgency: (state) => {
            state.selectedAgencyId = null;
        },
    },
});

export const { setSelectedAgencyId, clearSelectedAgency } = agencySlice.actions;
export default agencySlice.reducer;
