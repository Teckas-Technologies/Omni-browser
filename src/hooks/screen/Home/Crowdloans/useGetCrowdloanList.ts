import { APIItemState, CrowdloanItem } from '@subwallet/extension-base/background/KoniTypes';
import {
  _getChainNativeTokenBasicInfo,
  _getSubstrateRelayParent,
} from '@subwallet/extension-base/services/chain-service/utils';

import { _ChainInfo } from '@subwallet/chain-list/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'stores/index';
import { BN_ZERO } from 'utils/chainBalances';
import { useEffect, useMemo } from 'react';
import { getBalanceValue, getConvertedBalanceValue } from 'hooks/screen/useAccountBalance';
import { _CrowdloanItemType } from 'types/index';
import { fetchStaticData } from 'utils/fetchStaticData';
import { updateChainInfoMap } from 'stores/feature/common/ChainInfoMap';

function getCrowdloanContributeList(
  crowdloanMap: Record<string, CrowdloanItem>,
  chainInfoMap: Record<string, _ChainInfo>,
  priceMap: Record<string, number>,
): _CrowdloanItemType[] {
  const result: _CrowdloanItemType[] = [];

  Object.keys(crowdloanMap).forEach(chain => {
    const chainInfo = chainInfoMap[chain];
    const crowdloanItem = crowdloanMap[chain];

    if (!chainInfo || !crowdloanItem || crowdloanItem.state.valueOf() !== APIItemState.READY.valueOf()) {
      return;
    }

    const relayParentKey = _getSubstrateRelayParent(chainInfo);
    const relayChainInfo = chainInfoMap[relayParentKey];

    if (!relayChainInfo) {
      return;
    }

    const { decimals, symbol } = _getChainNativeTokenBasicInfo(relayChainInfo);
    const price = priceMap[relayParentKey] || 0;
    const contributeValue = getBalanceValue(crowdloanItem.contribute, decimals);

    if (!BN_ZERO.lt(contributeValue)) {
      return;
    }

    const convertedContributeValue = getConvertedBalanceValue(contributeValue, price);

    result.push({
      fundId: crowdloanItem.fundId,
      chainSlug: chainInfo.slug,
      chainName: chainInfo.name,
      relayChainSlug: relayChainInfo.slug,
      relayChainName: relayChainInfo.name,
      contribution: {
        symbol,
        value: contributeValue,
        convertedValue: convertedContributeValue,
      },
      fundStatus: crowdloanItem.status,
      unlockTime: new Date(crowdloanItem.endTime).getTime(),
    });
  });

  return result.sort((a, b) => {
    if (a.unlockTime < b.unlockTime) {
      return -1;
    } else if (a.unlockTime > b.unlockTime) {
      return 1;
    } else {
      return a.chainName.localeCompare(b.chainName);
    }
  });
}

export default function useGetCrowdloanList() {
  const crowdloanMap = useSelector((state: RootState) => state.crowdloan.crowdloanMap);
  // chainInfoMap needs to be fetched from online for dynamic usage
  const chainInfoMap = useSelector((state: RootState) => state.chainInfoMap);
  const priceMap = useSelector((state: RootState) => state.price.priceMap);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchStaticData<_ChainInfo[]>('chains')
      .then(rs => {
        const result: Record<string, _ChainInfo> = {};

        rs.forEach(ci => {
          if (ci.slug) {
            result[ci.slug] = ci;
          }
        });

        dispatch(updateChainInfoMap(result));
      })
      .catch(e => {
        console.log('fetch _ChainInfo error:', e);
      });
  }, [dispatch]);

  return useMemo<_CrowdloanItemType[]>(() => {
    return getCrowdloanContributeList(crowdloanMap, chainInfoMap, priceMap);
  }, [crowdloanMap, chainInfoMap, priceMap]);
}
