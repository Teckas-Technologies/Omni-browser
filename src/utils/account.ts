import { decodeAddress, encodeAddress, isAddress, isEthereumAddress } from '@polkadot/util-crypto';
import { AbstractAddressJson, AccountJson, AccountWithChildren } from '@subwallet/extension-base/background/types';
import { ALL_ACCOUNT_KEY } from '@subwallet/extension-base/constants';
import {
  _getChainSubstrateAddressPrefix,
  _isChainEvmCompatible,
} from '@subwallet/extension-base/services/chain-service/utils';
import { isAccountAll, reformatAddress } from '@subwallet/extension-base/utils';
import { MODE_CAN_SIGN } from 'constants/signer';
import { AccountSignMode } from 'types/signer';
import { AccountAddressType } from 'types/index';
import { _ChainInfo } from '@subwallet/chain-list/types';
import { Recoded } from 'types/ui-types';
import SInfo, { RNSensitiveInfoOptions } from 'react-native-sensitive-info';
import { Alert } from 'react-native';
import i18n from './i18n/i18n';

export const findAccountByAddress = (accounts: AccountJson[], address?: string): AccountJson | null => {
  try {
    if (!address) {
      return null;
    }

    if (address === ALL_ACCOUNT_KEY) {
      const result = accounts.find(account => account.address.toLowerCase() === address.toLowerCase());

      return result || null;
    }

    const originAddress = isEthereumAddress(address) ? address : encodeAddress(decodeAddress(address));
    const result = accounts.find(account => account.address.toLowerCase() === originAddress.toLowerCase());

    return result || null;
  } catch (e) {
    console.error('Fail to detect address', e);

    return null;
  }
};

export const getAccountSignMode = (account: AccountJson | null | undefined): AccountSignMode => {
  if (!account) {
    return AccountSignMode.UNKNOWN;
  } else {
    if (account.address === ALL_ACCOUNT_KEY) {
      return AccountSignMode.ALL_ACCOUNT;
    } else {
      if (account.isExternal) {
        if (account.isHardware) {
          return AccountSignMode.LEDGER;
        } else if (account.isReadOnly) {
          return AccountSignMode.READ_ONLY;
        } else {
          return AccountSignMode.QR;
        }
      } else {
        return AccountSignMode.PASSWORD;
      }
    }
  }
};

export const accountCanSign = (signMode: AccountSignMode): boolean => {
  return MODE_CAN_SIGN.includes(signMode);
};

export const filterNotReadOnlyAccount = (accounts: AccountJson[]): AccountJson[] => {
  return accounts.filter(acc => !acc.isReadOnly);
};

export const getAccountAddressType = (address?: string): AccountAddressType => {
  if (!address) {
    return AccountAddressType.UNKNOWN;
  }

  if (address === ALL_ACCOUNT_KEY) {
    return AccountAddressType.ALL;
  }

  if (isEthereumAddress(address)) {
    return AccountAddressType.ETHEREUM;
  }

  try {
    decodeAddress(address);

    return AccountAddressType.SUBSTRATE;
  } catch (e) {
    return AccountAddressType.UNKNOWN;
  }
};

export const getSignMode = (account: AccountJson | null | undefined): AccountSignMode => {
  if (!account) {
    return AccountSignMode.UNKNOWN;
  } else {
    if (account.address === ALL_ACCOUNT_KEY) {
      return AccountSignMode.ALL_ACCOUNT;
    } else {
      if (account.isExternal) {
        if (account.isHardware) {
          return AccountSignMode.LEDGER;
        } else if (account.isReadOnly) {
          return AccountSignMode.READ_ONLY;
        } else {
          return AccountSignMode.QR;
        }
      } else {
        return AccountSignMode.PASSWORD;
      }
    }
  }
};

export const isNoAccount = (accounts: AccountJson[] | null): boolean => {
  return accounts ? !accounts.filter(acc => acc.address !== ALL_ACCOUNT_KEY).length : false;
};

export const defaultRecoded: Recoded = { account: null, formatted: null, prefix: 42, isEthereum: false };

export const accountAllRecoded: Recoded = {
  account: {
    address: ALL_ACCOUNT_KEY,
  },
  formatted: ALL_ACCOUNT_KEY,
  prefix: 42,
  isEthereum: false,
};

const findSubstrateAccount = (accounts: AccountJson[], publicKey: Uint8Array): AccountJson | null => {
  const pkStr = publicKey.toString();

  return (
    accounts
      .filter(a => !isAccountAll(a.address))
      .find(({ address }): boolean => decodeAddress(address).toString() === pkStr) || null
  );
};

export const recodeAddress = (
  address: string | undefined,
  accounts: AccountWithChildren[],
  networkInfo: _ChainInfo | null,
): Recoded => {
  if (!address) {
    return defaultRecoded;
  } else if (isAccountAll(address)) {
    return accountAllRecoded;
  }

  const publicKey = decodeAddress(address);
  const account = findAccountByAddress(accounts, address) || findSubstrateAccount(accounts, publicKey);
  const prefix =
    networkInfo && _getChainSubstrateAddressPrefix(networkInfo) !== -1
      ? _getChainSubstrateAddressPrefix(networkInfo)
      : 42;
  const isEthereum = isEthereumAddress(address) || (!!networkInfo && _isChainEvmCompatible(networkInfo));

  return {
    account,
    formatted: reformatAddress(address, prefix, isEthereum),
    genesisHash: account?.genesisHash,
    originGenesisHash: account?.originGenesisHash,
    prefix,
    isEthereum,
  };
};

export const funcSortByName = (a: AbstractAddressJson, b: AbstractAddressJson) => {
  if (isAccountAll(b.address)) {
    return 3;
  }

  return (a?.name || '').toLowerCase() > (b?.name || '').toLowerCase() ? 1 : -1;
};

export const findContactByAddress = (contacts: AbstractAddressJson[], address?: string): AbstractAddressJson | null => {
  try {
    const isAllAccount = address && isAccountAll(address);

    if (!isAddress(address) && !isAllAccount) {
      return null;
    }

    const originAddress = isAccountAll(address)
      ? address
      : isEthereumAddress(address)
      ? address
      : encodeAddress(decodeAddress(address));
    const result = contacts.find(contact => contact.address.toLowerCase() === originAddress.toLowerCase());

    return result || null;
  } catch (e) {
    console.error('Fail to detect address', e);

    return null;
  }
};

// Keychain configuration
const keychainConfig: RNSensitiveInfoOptions = {
  touchID: true,
  showModal: true,
  kSecAccessControl: 'kSecAccessControlBiometryCurrentSet',
  sharedPreferencesName: 'swSharedPrefs',
  keychainService: 'swKeychain',
  kSecAttrAccessible: 'kSecAttrAccessibleWhenUnlocked',
  kSecUseOperationPrompt: 'Unlock app using biometric',
};
const maxAttempsData = ['Biometry is locked out', 'Quá nhiều lần thử', 'Too many attempts'];
function alertFailedAttempts(e: any) {
  let isFailedAttemps = false;
  maxAttempsData.map(item => {
    if (JSON.stringify(e).includes(item)) {
      isFailedAttemps = true;
    }
  });
  if (isFailedAttemps) {
    Alert.alert(i18n.buttonTitles.unlockWithBiometric, i18n.common.tooManyAttemps);
  }
}
const username = 'sw-user';
export const createKeychainPassword = async (password: string) => {
  try {
    await SInfo.setItem(username, password, keychainConfig);
    return true;
  } catch (e) {
    alertFailedAttempts(e);
    console.warn('set keychain failed', e);
    return false;
  }
};

export const getKeychainPassword = async () => {
  try {
    const password = await SInfo.getItem(username, keychainConfig);
    return password;
  } catch (e) {
    alertFailedAttempts(e);
    throw e;
  }
};

export const resetKeychainPassword = async () => {
  try {
    // return await Keychain.resetGenericPassword();
    SInfo.deleteItem(username, keychainConfig);
    return true;
  } catch (e) {
    console.warn('reset keychain failed:', e);
    return false;
  }
};

export const getSupportedBiometryType = async () => {
  try {
    const result = await SInfo.isSensorAvailable();
    return result;
  } catch (e) {
    console.warn('Get failed!');
    return null;
  }
};
