import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import Text from 'components/Text';
import { SeedWord } from 'components/SeedWord';
import { Button, Icon } from 'components/design-system-ui';
import { CheckCircle } from 'phosphor-react-native';
import {
  sharedStyles,
  FontMedium,
  ContainerHorizontalPadding,
  MarginBottomForSubmitButton,
} from 'styles/sharedStyles';
import { ColorMap } from 'styles/color';
import { shuffleArray } from 'utils/index';
import { useSubWalletTheme } from 'hooks/useSubWalletTheme';
import { getWordKey } from 'components/SeedPhraseArea';
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

// Adjust this array to control which indexes (0-based) are blank/missing
const missingIndexes = [0, 7, 10]; // i.e., positions 1, 8, and 11

export const VerifySecretPhrase = ({ onPressSubmit, seed, isBusy, navigation }: Props) => {
  const seedWords = seed.trim().split(' ');
  const [filledWords, setFilledWords] = useState<(string | null)[]>([]);
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [usedWordKeys, setUsedWordKeys] = useState<string[]>([]);
  const theme = useSubWalletTheme().swThemes;
  const { onPress: onSubmit } = useUnlockModal(navigation);

  useEffect(() => {
    const initial = seedWords.map((word, idx) => (missingIndexes.includes(idx) ? null : word));
    setFilledWords(initial);

    const missingWords = missingIndexes.map(index => seedWords[index]);
    const shuffled = shuffleArray([...missingWords]);
    setWordOptions(shuffled);
  }, [seed]);

  const onSelectWord = (word: string) => {
    const indexToFill = filledWords.findIndex(
      (w, i) => missingIndexes.includes(i) && w === null
    );
    if (indexToFill === -1) return;

    const updated = [...filledWords];
    updated[indexToFill] = word;
    setFilledWords(updated);
    setUsedWordKeys(prev => [...prev, getWordKey(word, indexToFill)]);
  };

  const isAllCorrect = filledWords.every((word, i) => word === seedWords[i]);

  const renderSeedSlots = () => {
    return seedWords.map((_, index) => {
      const word = filledWords[index];
      const isMissing = missingIndexes.includes(index);
      const title = word ? `${index + 1}. ${word}` : `${index + 1}. `;

      return (
        <SeedWord
          key={`slot-${index}`}
          style={{ margin: 4, minWidth: 120 }}
          title={title}
          disabled={!isMissing}
          onPress={() => {}}
        />
      );
    });
  };

  const renderWordOptions = () => {
    return wordOptions.map((word, i) => {
      const wordKey = getWordKey(word, i);
      const isUsed = usedWordKeys.includes(wordKey);
      return (
        <SeedWord
          key={wordKey}
          style={{ margin: 4 }}
          title={word}
          disabled={isUsed}
          onPress={() => onSelectWord(word)}
        />
      );
    });
  };

  const getIcon = (color: string) => (
    <Icon phosphorIcon={CheckCircle} size="lg" iconColor={color} weight="fill" />
  );

  return (
    <View style={sharedStyles.layoutContainer}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ ...ContainerHorizontalPadding, marginBottom: 24 }}>
          <Text style={{ ...sharedStyles.mainText, ...FontMedium, color: ColorMap.disabled, textAlign: 'center' }}>
            {i18n.warningMessage.initSecretPhrase}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 14, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
          {renderSeedSlots()}
        </View>

        <View style={{ paddingHorizontal: 14, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {renderWordOptions()}
        </View>
      </ScrollView>

      <View style={{ ...MarginBottomForSubmitButton, paddingTop: 16 }}>
        <Button
          icon={getIcon(!isAllCorrect || isBusy ? theme.colorTextLight5 : theme.colorWhite)}
          disabled={!isAllCorrect || isBusy}
          onPress={onSubmit(onPressSubmit)}
          loading={isBusy}
        >
          {i18n.common.finish}
        </Button>
      </View>
    </View>
  );
};
