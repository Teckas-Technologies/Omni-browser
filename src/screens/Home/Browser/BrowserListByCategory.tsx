import React, { useMemo } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { RootStackParamList } from 'routes/index';
import browserHomeStyle from './styles/BrowserListByCategory';
import { useSelector } from 'react-redux';
import { RootState } from 'stores/index';
import { DAppInfo } from 'types/browser';
import { BrowserItem } from 'components/Browser/BrowserItem';
import { getHostName } from 'utils/browser';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSubWalletTheme } from 'hooks/useSubWalletTheme';
import { CategoryEmptyList } from 'screens/Home/Browser/Shared/CategoryEmptyList';
import { browserListItemHeight, browserListSeparator } from 'constants/itemHeight';
import { useGetDAppList } from 'hooks/static-content/useGetDAppList';
import { EVM_DAPPS } from 'constants/evmDApps';

export interface BrowserListByCategoryProps {
  searchString: string;
  navigationType: 'BOOKMARK' | 'RECOMMENDED';
}

const styles = browserHomeStyle();
const ITEM_HEIGHT = browserListItemHeight;
const ITEM_SEPARATOR = browserListSeparator;
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + ITEM_SEPARATOR;

const BrowserListByCategory: React.FC<NativeStackScreenProps<RootStackParamList>> = ({ route, navigation }) => {
  const { searchString, navigationType } = route.params as BrowserListByCategoryProps;
  const theme = useSubWalletTheme().swThemes;
  const {
    browserDApps: { dApps },
  } = useGetDAppList();
  const bookmarkedItems = useSelector((state: RootState) => state.browser.bookmarks);

  const listByCategory = useMemo((): DAppInfo[] => {
    if (!EVM_DAPPS || EVM_DAPPS.length === 0) {
      return [];
    }

    if (navigationType === 'BOOKMARK') {
      const bookmarkedData = bookmarkedItems.map(bookmarkedItem => {
        const bookmarkedDApp = EVM_DAPPS.find(
          dapp => bookmarkedItem.url.includes(dapp.url) && dapp.title.toLowerCase().includes(searchString),
        );

        if (bookmarkedDApp) {
          if (route.name === 'all' || bookmarkedDApp.categories.includes(route.name)) {
            return { ...bookmarkedDApp, url: bookmarkedItem.url, title: bookmarkedItem.name };
          }
          return undefined;
        }

        if (route.name === 'all') {
          return {
            title: bookmarkedItem.name,
            id: bookmarkedItem.id,
            url: bookmarkedItem.url,
            icon: '',
            categories: [],
          };
        }

        return undefined;
      });

      return bookmarkedData.filter(item => item !== undefined) as DAppInfo[];
    }

    if (navigationType === 'RECOMMENDED') {
      console.log('Route:', route.name);
      console.log(
        'Matching Categories:',
        EVM_DAPPS.map(d => d.categories),
      );

      if (route.name === 'all') {
        return EVM_DAPPS;
      }
      return EVM_DAPPS.filter(dapp =>
        dapp.categories.some(category => category.toLowerCase() === route.name.toLowerCase()),
      );
    }

    if (route.name === 'all') {
      if (searchString) {
        return EVM_DAPPS.filter(item => item.title.toLowerCase().includes(searchString));
      }
      return EVM_DAPPS;
    }

    return EVM_DAPPS.filter(
      item =>
        item.categories.some(category => category.toLowerCase() === route.name.toLowerCase()) &&
        item.title.toLowerCase().includes(searchString),
    );
  }, [searchString, bookmarkedItems, route.name, navigationType]);

  const getItemLayout = (data: DAppInfo[] | null | undefined, index: number) => ({
    index,
    length: TOTAL_ITEM_HEIGHT,
    offset: TOTAL_ITEM_HEIGHT * index,
  });
  const keyExtractor = (item: DAppInfo) => item.id + item.url;
  const onPressSectionItem = (item: DAppInfo) => {
    navigation.navigate('BrowserTabsManager', { url: item.url, name: item.title });
  };
  const renderBrowserItem: ListRenderItem<DAppInfo> = ({ item }) => {
    const dapp = dApps?.find(app => item.url.includes(app.url));

    return (
      <BrowserItem
        key={item.id}
        logo={dapp?.icon}
        tags={dapp?.categories}
        style={styles.listItem}
        title={dapp?.title || item.title}
        subtitle={navigationType === 'BOOKMARK' ? item.url : getHostName(item.url)}
        url={item.url}
        onPress={() => onPressSectionItem(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {listByCategory.length ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          maxToRenderPerBatch={12}
          initialNumToRender={12}
          removeClippedSubviews
          data={listByCategory}
          keyExtractor={keyExtractor}
          style={{ padding: theme.padding, paddingTop: theme.paddingSM }}
          renderItem={renderBrowserItem}
          getItemLayout={getItemLayout}
        />
      ) : (
        <CategoryEmptyList />
      )}
    </View>
  );
};

export default BrowserListByCategory;
