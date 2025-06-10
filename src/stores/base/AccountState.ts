// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddressBookInfo, KeyringState } from '@subwallet/extension-base/background/KoniTypes';
import { AccountJson, AccountsContext } from '@subwallet/extension-base/background/types';
import { AccountState, ReduxStatus } from 'stores/types';
import { isAccountAll } from '@subwallet/extension-base/utils';
import { isNoAccount } from 'utils/account';

const initialState: AccountState = {
  // CurrentAccount
  currentAccount: null,
  isAllAccount: false,
  isNoAccount: true,
  // KeyringState
  isReady: false,
  hasMasterPassword: false,
  isLocked: true,
  username: '', // ✅ added

  // AccountsContext
  accounts: [],
  contacts: [],
  hierarchy: [],
  recent: [],
  master: undefined,

  reduxStatus: ReduxStatus.INIT,
};

const accountStateSlice = createSlice({
  initialState,
  name: 'accountState',
  reducers: {
    updateKeyringState(state, action: PayloadAction<KeyringState>) {
      const payload = action.payload;

      return {
        ...state,
        ...payload,
        reduxStatus: ReduxStatus.READY,
      };
    },
    updateAccountsContext(state, action: PayloadAction<AccountsContext>) {
      const payload = action.payload;

      return {
        ...state,
        ...payload,
        isNoAccount: isNoAccount(payload.accounts),
        reduxStatus: ReduxStatus.READY,
      };
    },
    updateCurrentAccount(state, action: PayloadAction<AccountJson>) {
      const payload = action.payload;

      return {
        ...state,
        currentAccount: payload,
        isAllAccount: isAccountAll(payload?.address),
        reduxStatus: ReduxStatus.READY,
      };
    },
    updateAddressBook(state, action: PayloadAction<AddressBookInfo>) {
      const { addresses } = action.payload;

      const contacts = addresses.filter(value => !value.isRecent);
      const recent = addresses.filter(value => value.isRecent);

      return {
        ...state,
        contacts: contacts,
        recent: recent,
        reduxStatus: ReduxStatus.READY,
      };
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
  },
});

export const { updateAccountsContext, updateCurrentAccount, updateKeyringState,setUsername } = accountStateSlice.actions;
export default accountStateSlice.reducer;
