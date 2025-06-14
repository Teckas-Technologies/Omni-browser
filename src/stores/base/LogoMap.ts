// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createSlice, PayloadAction } from '@reduxjs/toolkit/dist';
import { AllLogoMap } from '@subwallet/extension-base/background/KoniTypes';
import { AssetLogoMap, ChainLogoMap } from '@subwallet/chain-list';
import { ImageLogosMap } from 'assets/logo';

const initialState: AllLogoMap = {
  chainLogoMap: ChainLogoMap,
  assetLogoMap: AssetLogoMap,
};

const settingsSlice = createSlice({
  initialState,
  name: 'logoMaps',
  reducers: {
    updateChainLogoMaps(state, action: PayloadAction<Record<string, string>>) {
      const payload = action.payload;
      payload.stellaswap = ImageLogosMap.stellaswap;
      payload.chain_flip_mainnet = ImageLogosMap.chain_flip_mainnet;
      payload.chain_flip_testnet = ImageLogosMap.chain_flip_testnet;
      payload.hydradx_mainnet = ImageLogosMap.hydradx_mainnet;
      payload.hydradx_testnet = ImageLogosMap.hydradx_testnet;

      return {
        ...state,
        chainLogoMap: payload,
      };
    },
    updateAssetLogoMaps(state, action: PayloadAction<Record<string, string>>) {
      const payload = action.payload;

      return {
        ...state,
        assetLogoMap: payload,
      };
    },
  },
});

export const { updateChainLogoMaps, updateAssetLogoMaps } = settingsSlice.actions;
export default settingsSlice.reducer;
