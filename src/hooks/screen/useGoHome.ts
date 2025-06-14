import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { RootNavigationProps } from 'routes/index';
import { HomeStackParamList } from 'routes/home';

export default function useGoHome(
  params: NavigatorScreenParams<HomeStackParamList> = { screen: 'Tokens', params: { screen: 'TokenGroups' } },
) {
  const navigation = useNavigation<RootNavigationProps>();

  return useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params }],
    });
  }, [navigation, params]);
}
