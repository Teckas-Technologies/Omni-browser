import { NominationPoolInfo, StakingType, ValidatorInfo } from '@subwallet/extension-base/background/KoniTypes';
import { _getChainNativeTokenBasicInfo } from '@subwallet/extension-base/services/chain-service/utils';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'stores/index';
import useFetchChainInfo from 'hooks/screen/useFetchChainInfo';

export type NominationPoolDataType = NominationPoolInfo & {
  symbol: string;
  decimals: number;
  idStr: string;
};

export type ValidatorDataType = ValidatorInfo & {
  symbol: string;
  decimals: number;
};

const useGetValidatorList = (chain: string, type: StakingType): NominationPoolDataType[] | ValidatorDataType[] => {
  const { nominationPoolInfoMap, validatorInfoMap } = useSelector((state: RootState) => state.bonding);
  const chainInfo = useFetchChainInfo(chain);

  return useMemo(() => {
    if (!chainInfo) {
      return [];
    }

    const { decimals, symbol } = _getChainNativeTokenBasicInfo(chainInfo);

    if (type === StakingType.POOLED) {
      const nominationPoolList = nominationPoolInfoMap[chain];
      const result: NominationPoolDataType[] = [];

      if (nominationPoolList) {
        nominationPoolList.forEach(item => {
          const nominationPoolItem: NominationPoolDataType = {
            ...item,
            decimals,
            symbol,
            idStr: item.id.toString(),
          };

          result.push(nominationPoolItem);
        });
      }

      return result;
    } else if (type === StakingType.NOMINATED) {
      const validatorList = validatorInfoMap[chain];
      const result: ValidatorDataType[] = [];

      if (validatorList) {
        validatorList.forEach(item => {
          const validatorItem: ValidatorDataType = {
            ...item,
            decimals,
            symbol,
          };

          result.push(validatorItem);
        });
      }

      return result;
    }

    return [];
  }, [chain, chainInfo, nominationPoolInfoMap, type, validatorInfoMap]);
};

export default useGetValidatorList;
