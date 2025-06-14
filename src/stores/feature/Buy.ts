import { createSlice, PayloadAction } from '@reduxjs/toolkit/dist';
import { BuyServiceStore, ReduxStatus } from 'stores/types';
import { BuyServiceInfo, BuyTokenInfo } from 'types/buy';

const initialState: BuyServiceStore = {
  tokens: {},
  services: {},
  reduxStatus: ReduxStatus.INIT,
};

const buyServiceSlice = createSlice({
  initialState,
  name: 'buyService',
  reducers: {
    updateBuyTokens(state, action: PayloadAction<Record<string, BuyTokenInfo>>): BuyServiceStore {
      return {
        ...state,
        tokens: action.payload,
        reduxStatus: ReduxStatus.READY,
      };
    },
    updateBuyServices(state, action: PayloadAction<Record<string, BuyServiceInfo>>): BuyServiceStore {
      return {
        ...state,
        services: action.payload,
        reduxStatus: ReduxStatus.READY,
      };
    },
  },
});

export const { updateBuyServices, updateBuyTokens } = buyServiceSlice.actions;
export default buyServiceSlice.reducer;
