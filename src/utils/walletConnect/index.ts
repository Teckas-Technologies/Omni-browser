import { _ChainInfo } from '@subwallet/chain-list/types';
import { AbstractAddressJson, AccountJson } from '@subwallet/extension-base/background/types';
import {
  findChainInfoByChainId,
  findChainInfoByHalfGenesisHash,
} from '@subwallet/extension-base/services/chain-service/utils';
import {
  WALLET_CONNECT_EIP155_NAMESPACE,
  WALLET_CONNECT_POLKADOT_NAMESPACE,
} from '@subwallet/extension-base/services/wallet-connect-service/constants';
import { SessionTypes } from '@walletconnect/types';

import { findAccountByAddress } from '../account';
import { WalletConnectChainInfo } from 'types/walletConnect';
import { validWalletConnectUri } from 'utils/scanner/walletConnect';
import { addConnection } from 'messaging/index';
import { ToastType } from 'react-native-toast-notifications';
import i18n from 'utils/i18n/i18n';

/**
 * Only include EVM chains (eip155)
 */
export const chainsToWalletConnectChainInfos = (
  chainMap: Record<string, _ChainInfo>,
  chains: string[],
): Array<WalletConnectChainInfo> => {
  return chains
    .filter(chain => chain.startsWith(WALLET_CONNECT_EIP155_NAMESPACE)) // ✅ Only EVM
    .map(chain => {
      const [, info] = chain.split(':');
      const chainInfo = findChainInfoByChainId(chainMap, parseInt(info));

      return {
        chainInfo,
        slug: chainInfo?.slug || chain,
        supported: !!chainInfo,
      };
    });
};

export const getWCAccountList = (
  accounts: AccountJson[],
  namespaces: SessionTypes.Namespaces,
): AbstractAddressJson[] => {
  const rawMap: Record<string, string> = {};
  const rawList = Object.values(namespaces)
    .map(namespace => namespace.accounts || [])
    .flat();

  rawList.forEach(info => {
    const [, , address] = info.split(':');
    rawMap[address] = address;
  });

  const convertMap: Record<string, AbstractAddressJson> = {};
  const convertList = Object.keys(rawMap).map((address): AbstractAddressJson | null => {
    const account = findAccountByAddress(accounts, address);

    if (account) {
      return {
        address: account.address,
        name: account.name,
      };
    } else {
      return null;
    }
  });

  convertList.forEach(info => {
    if (info) {
      convertMap[info.address] = info;
    }
  });

  return Object.values(convertMap);
};

/**
 * Only allow WalletConnect URIs that include eip155 (EVM)
 */
export const isValidUri = (uri: string) => {
  if (!validWalletConnectUri(uri)) return false;

  try {
    const decoded = decodeURIComponent(uri);
    return decoded.includes(WALLET_CONNECT_EIP155_NAMESPACE); // ✅ Ensure only EVM
  } catch (e) {
    return false;
  }
};

const runned: Record<string, boolean> = {};

/**
 * Initiate WalletConnect pairing only if it's a valid EVM URI
 */
export const connectWalletConnect = (wcUrl: string, toast?: ToastType) => {
  if (isValidUri(wcUrl)) {
    if (!runned[wcUrl]) {
      runned[wcUrl] = true;
      addConnection({ uri: wcUrl }).catch(e => {
        const errMessage = (e as Error).message;
        const message = errMessage.includes('Pairing already exists')
          ? i18n.errorMessage.connectionAlreadyExist
          : i18n.errorMessage.failToAddConnection;
        toast?.show(message, { type: 'danger' });
      });
    }
  } else {
    toast?.show('Invalid or non-EVM WalletConnect URI');
  }
};
