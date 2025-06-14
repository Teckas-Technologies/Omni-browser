import { NominationPoolInfo } from '@subwallet/extension-base/types';
import { FieldBase, FieldBaseProps } from 'components/Field/Base';
import React from 'react';
import { StyleProp, Text, View } from 'react-native';
import { FontSemiBold } from 'styles/sharedStyles';
import { Book, Lightning } from 'phosphor-react-native';
import { ActivityIndicator, Avatar, Button, Icon, Typography } from 'components/design-system-ui';
import { useSubWalletTheme } from 'hooks/useSubWalletTheme';
import { toShort } from 'utils/index';
import i18n from 'utils/i18n/i18n';

interface Props extends FieldBaseProps {
  outerStyle?: StyleProp<any>;
  item?: NominationPoolInfo;
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onPressBookBtn?: () => void;
  onPressLightningBtn?: () => void;
  showLightingBtn?: boolean;
  recommendIds?: number[];
}

const accountNameTextStyle: StyleProp<any> = {
  fontSize: 14,
  lineHeight: 22,
  ...FontSemiBold,
  color: 'rgba(255, 255, 255, 0.85)',
  maxWidth: 180,
};

const blockContentStyle: StyleProp<any> = {
  position: 'relative',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 16,
  paddingRight: 6,
  paddingBottom: 4,
};

export const PoolSelectorField = ({
  outerStyle,
  item,
  label,
  loading,
  placeholder = i18n.stakingScreen.selectedPool,
  disabled,
  onPressBookBtn,
  onPressLightningBtn,
  showLightingBtn = true,
  recommendIds,
  ...fieldBase
}: Props) => {
  const theme = useSubWalletTheme().swThemes;

  return (
    <FieldBase label={label} {...fieldBase} outerStyle={outerStyle}>
      <View style={[blockContentStyle, !label && { paddingTop: 12 }]}>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          {item && item.address && (
            <View style={{ paddingRight: 8 }}>
              <Avatar value={item?.address || ''} size={24} />
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text numberOfLines={1} style={accountNameTextStyle}>
              {item ? item.name || toShort(item.address) : placeholder}
            </Text>
            {item && recommendIds && recommendIds.length && recommendIds.includes(item.id) && (
              <Typography.Text numberOfLines={1} size={'sm'} style={{ color: theme.colorTextLight4 }}>
                {'  (Recommended)'}
              </Typography.Text>
            )}
          </View>
        </View>

        {loading ? (
          <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={20} indicatorColor={theme.colorWhite} />
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <Button
              disabled={disabled}
              size={'xs'}
              type={'ghost'}
              icon={
                <Icon
                  phosphorIcon={Book}
                  size={'sm'}
                  iconColor={disabled ? theme.colorTextLight5 : theme.colorTextLight3}
                />
              }
              onPress={onPressBookBtn}
            />
            {showLightingBtn && (
              <Button
                disabled={disabled}
                size={'xs'}
                type={'ghost'}
                icon={
                  <Icon
                    phosphorIcon={Lightning}
                    size={'sm'}
                    iconColor={disabled ? theme.colorTextLight5 : theme.colorTextLight3}
                  />
                }
                onPress={onPressLightningBtn}
              />
            )}
          </View>
        )}
      </View>
    </FieldBase>
  );
};
