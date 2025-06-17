import React, { useEffect, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { NetworkAndTokenToggleItem } from 'components/NetworkAndTokenToggleItem';
import { FlatListScreen } from 'components/FlatListScreen';
import { ListChecks, Plus } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProps, NetworksSettingProps } from 'routes/index';
import { updateChainActiveState } from 'messaging/index';
import {
  _isChainEvmCompatible,
} from '@subwallet/extension-base/services/chain-service/utils';
import { EmptyList } from 'components/EmptyList';
import i18n from 'utils/i18n/i18n';
import useChainInfoWithStateAndStatus, {
  ChainInfoWithStateAnhStatus,
} from 'hooks/chain/useChainInfoWithStateAndStatus';

let chainKeys: Array<string> | undefined;
let cachePendingChainMap: Record<string, boolean> = {};

const searchFunction = (items: ChainInfoWithStateAnhStatus[], searchString: string) => {
  if (!searchString) return items;

  return items.filter(network => network && network.name.toLowerCase().includes(searchString.toLowerCase()));
};

const processChainMap = (
  chainInfoMap: Record<string, ChainInfoWithStateAnhStatus>,
  pendingKeys = Object.keys(cachePendingChainMap),
  updateKeys = false,
): ChainInfoWithStateAnhStatus[] => {
  if (!chainKeys || updateKeys) {
    chainKeys = Object.keys(chainInfoMap)
      .filter(key => {
        const chain = chainInfoMap[key];
        return (
          Object.keys(chain.providers).length > 0 &&
          _isChainEvmCompatible(chain) // ✅ Only EVM-compatible
        );
      })
      .sort((a, b) => {
        const aActive = pendingKeys.includes(a) ? cachePendingChainMap[a] : chainInfoMap[a].active;
        const bActive = pendingKeys.includes(b) ? cachePendingChainMap[b] : chainInfoMap[b].active;

        return aActive === bActive ? 0 : aActive ? -1 : 1;
      });
  }

  return chainKeys.map(key => chainInfoMap[key]);
};

export const NetworksSetting = ({ route: { params } }: NetworksSettingProps) => {
  const defaultSearchString = params?.chainName;
  const navigation = useNavigation<RootNavigationProps>();
  const chainInfoMap = useChainInfoWithStateAndStatus();
  const [isToggleItem, setToggleItem] = useState(false);
  const [pendingChainMap, setPendingChainMap] = useState<Record<string, boolean>>(cachePendingChainMap);
  const [currentChainList, setCurrentChainList] = useState(processChainMap(chainInfoMap));

  useEffect(() => {
    setPendingChainMap(prevPendingChainMap => {
      const _prev = { ...prevPendingChainMap };
      Object.entries(_prev).forEach(([key, val]) => {
        if (chainInfoMap[key].active === val) {
          delete _prev[key];
        }
      });
      return _prev;
    });
  }, [chainInfoMap]);

  useEffect(() => {
    setCurrentChainList(processChainMap(chainInfoMap, Object.keys(pendingChainMap), !isToggleItem));
  }, [chainInfoMap, isToggleItem, pendingChainMap]);

  useEffect(() => {
    cachePendingChainMap = pendingChainMap;
  }, [pendingChainMap]);

  const onToggleItem = (item: ChainInfoWithStateAnhStatus) => {
    setToggleItem(true);
    setPendingChainMap({ ...pendingChainMap, [item.slug]: !item.active });

    const reject = () => {
      console.warn('Toggle network request failed!');
      // @ts-ignore
      delete pendingNetworkMap[item.key];
      setPendingChainMap({ ...pendingChainMap });
    };

    updateChainActiveState(item.slug, !item.active)
      .then(result => {
        if (!result) reject();
      })
      .catch(reject);
  };

  const renderItem = ({ item }: ListRenderItemInfo<ChainInfoWithStateAnhStatus>) => (
    <NetworkAndTokenToggleItem
      isDisableSwitching={Object.keys(pendingChainMap).includes(item.slug)}
      key={`${item.slug}-${item.name}`}
      itemName={item.name}
      itemKey={item.slug}
      connectionStatus={item.connectionStatus}
      // @ts-ignore
      isEnabled={
        Object.keys(pendingChainMap).includes(item.slug)
          ? pendingChainMap[item.slug]
          : chainInfoMap[item.slug]?.active || false
      }
      onValueChange={() => onToggleItem(item)}
      showEditButton
      onPressEditBtn={() => {
        navigation.navigate('NetworkSettingDetail', { chainSlug: item.slug });
        setToggleItem(false);
      }}
    />
  );

  const renderListEmptyComponent = () => (
    <EmptyList
      icon={ListChecks}
      title={i18n.emptyScreen.networkSettingsTitle}
      message={i18n.emptyScreen.networkSettingsMessage}
      addBtnLabel={i18n.header.importNetwork}
      onPressAddBtn={() => {
        navigation.navigate('ImportNetwork');
      }}
    />
  );

  return (
    <FlatListScreen
      rightIconOption={{
        icon: Plus,
        onPress: () => {
          navigation.navigate('ImportNetwork');
          setToggleItem(false);
        },
      }}
      defaultSearchString={defaultSearchString}
      onPressBack={() => navigation.goBack()}
      items={currentChainList}
      title={i18n.header.manageNetworks}
      placeholder={i18n.placeholder.searchNetwork}
      autoFocus={false}
      renderListEmptyComponent={renderListEmptyComponent}
      searchFunction={searchFunction}
      renderItem={renderItem}
      isShowListWrapper={true}
      isShowFilterBtn={false} // ✅ Hiding filter button
    />
  );
};
