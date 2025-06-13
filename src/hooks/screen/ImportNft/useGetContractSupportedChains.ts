import { useSelector } from 'react-redux';
import { RootState } from 'stores/index';
import { _isChainSupportEvmNft } from '@subwallet/extension-base/services/chain-service/utils';
import { _ChainInfo } from '@subwallet/chain-list/types';
import useChainAssets from 'hooks/chain/useChainAssets';

export default function useGetContractSupportedChains(): Record<string, _ChainInfo> {
  const chainInfoMap = useSelector((state: RootState) => state.chainStore.chainInfoMap);
  const availableChains = useChainAssets().availableChains;

  // 🧾 Log all chains before filtering
  const allSlugs = Object.values(chainInfoMap).map(chain => chain.slug);
  console.log('🌐 All Chains from chainInfoMap:', allSlugs);
  console.log('🎯 Available Chains:', availableChains);

  const filteredChainInfoMap: Record<string, _ChainInfo> = {};

  Object.values(chainInfoMap).forEach(chainInfo => {
    const slug = chainInfo.slug;

    if (
      availableChains.includes(slug) &&
      _isChainSupportEvmNft(chainInfo)
    ) {
      filteredChainInfoMap[slug] = chainInfo;
    }
  });

  // ✅ Log filtered EVM chains
  console.log('✅ EVM Chains:', Object.keys(filteredChainInfoMap));

  return filteredChainInfoMap;
}
