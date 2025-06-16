import React from 'react';
import { ScrollView, View } from 'react-native';
import SectionHeader from './SectionHeader';
import i18n from 'utils/i18n/i18n';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProps } from 'routes/index';
import { useCallback, useMemo } from 'react';
import { DAppInfo } from 'types/browser';
import { BrowserItem } from 'components/Browser/BrowserItem';
import createStylesheet from '../styles/BrowserHome';
import { getHostName } from 'utils/browser';
import { EVM_DAPPS } from 'constants/evmDApps';

interface SectionListProps {
  data: RecommendedListType[];
  renderItem: (item: DAppInfo) => JSX.Element;
}

type RecommendedListType = {
  data: DAppInfo[];
};
const SectionList: React.FC<SectionListProps> = ({ data, renderItem }): JSX.Element => {
  const stylesheet = createStylesheet();
  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={stylesheet.recommendListContentContainer}>
      {data.map(item => (
        <View key={Math.random()} style={stylesheet.recommendListSeparator}>
          {item.data.map(item2 => renderItem(item2))}
        </View>
      ))}
    </ScrollView>
  );
};
interface RecommendSectionProps {
  onPressSectionItem: (item: DAppInfo) => void;
}
const RecommendSection: React.FC<RecommendSectionProps> = ({ onPressSectionItem }) => {

  const navigation = useNavigation<RootNavigationProps>();
  const stylesheet = createStylesheet();

  const renderSectionItem = useCallback(
    (item: DAppInfo) => {
      return (
        <BrowserItem
          key={item.id}
          style={stylesheet.browserItem}
          title={item.title}
          subtitle={getHostName(item.url)}
          url={item.url}
          logo={item.icon}
          tags={item.categories}
          onPress={() => onPressSectionItem(item)}
        />
      );
    },
    [onPressSectionItem, stylesheet.browserItem],
  );

  const recommendedList = useMemo((): RecommendedListType[] => {
  const sectionData: RecommendedListType[] = [];
  for (let i = 0; i < EVM_DAPPS.length; i += 4) {
    sectionData.push({ data: EVM_DAPPS.slice(i, i + 4) });
  }
  return sectionData;
}, []);


  return (
    <>
      <SectionHeader
        // title={i18n.browser.recommended}
        title='Featured dApps'
        actionTitle={i18n.browser.seeAll}
        onPress={() => navigation.navigate('BrowserListByTabview', { type: 'RECOMMENDED' })}
      />
      <SectionList data={recommendedList} renderItem={renderSectionItem} />
    </>
  );
};

export default RecommendSection;
