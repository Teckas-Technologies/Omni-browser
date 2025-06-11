import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Text from 'components/Text';
import { Button, Icon } from 'components/design-system-ui';
import { CheckCircle } from 'phosphor-react-native';
import { useSubWalletTheme } from 'hooks/useSubWalletTheme';
import i18n from 'utils/i18n/i18n';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'routes/index';
import useUnlockModal from 'hooks/modal/useUnlockModal';

interface Props {
  onPressSubmit: () => void;
  seed: string;
  isBusy: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const getRandomMissingIndexes = (): number[] => {
  const count = Math.floor(Math.random() * 2) + 3; // 3 or 4
  const indexes = new Set<number>();
  while (indexes.size < count) {
    const rand = Math.floor(Math.random() * 12); // between 0 and 11
    indexes.add(rand);
  }
  return Array.from(indexes).sort((a, b) => a - b);
};

export const VerifySecretPhrase = ({ onPressSubmit, seed, isBusy, navigation }: Props) => {
  const seedWords = seed.trim().split(' ');
  const [inputWords, setInputWords] = useState<string[]>([]);
  const theme = useSubWalletTheme().swThemes;
  const { onPress: onSubmit } = useUnlockModal(navigation);

  const missingIndexes = useMemo(() => getRandomMissingIndexes(), []);

  useEffect(() => {
    const initial = seedWords.map((word, idx) =>
      missingIndexes.includes(idx) ? '' : word
    );
    setInputWords(initial);
  }, [seed, missingIndexes]);

  const handleInputChange = (text: string, index: number) => {
    const updated = [...inputWords];
    updated[index] = text.trim();
    setInputWords(updated);
  };

  const isAllCorrect = inputWords.every((word, i) => word === seedWords[i]);

  const renderSeedFields = () => {
    return seedWords.map((_, index) => {
      const value = inputWords[index];
      const label = `${index + 1}. `;

      return (
        <View key={index} style={styles.wordButton}>
          {missingIndexes.includes(index) ? (
            <TextInput
              style={styles.wordInput}
              placeholder={`${label}`}
              placeholderTextColor="#ffffff90"
              value={value}
              onChangeText={(text) => handleInputChange(text, index)}
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.wordText}>{`${label}${value}`}</Text>
          )}
        </View>
      );
    });
  };

  const getIcon = (color: string) => (
    <Icon phosphorIcon={CheckCircle} size="lg" iconColor={color} weight="fill" />
  );

 return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
  >
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Confirm secret recovery phrase</Text>
      <Text style={styles.description}>
        Enter the missed phrase that you have already saved
      </Text>

      <View style={styles.wordGrid}>{renderSeedFields()}</View>

      <Button
        style={styles.continueButton}
        icon={getIcon(!isAllCorrect || isBusy ? theme.colorTextLight5 : theme.colorWhite)}
        disabled={!isAllCorrect || isBusy}
        onPress={onSubmit(onPressSubmit)}
        loading={isBusy}
      >
        {i18n.common.finish}
      </Button>
    </ScrollView>
  </KeyboardAvoidingView>
);

};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 35,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 24,
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
    wordButton: {
    width: '48%',
    height: 38, // fixed height for all boxes
    backgroundColor: '#70befa',
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  wordText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18, // matches fontSize, optional
  },
  wordInput: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: '100%', // make it fill the wordButton height
    width: '100%', // match the width of the container
  },

  continueButton: {
    marginTop: 'auto',
    marginBottom: 16,
    alignSelf: 'center',
    width: '100%',
  },
});
;