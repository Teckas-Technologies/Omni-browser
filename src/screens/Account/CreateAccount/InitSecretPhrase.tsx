import React, { useCallback, useState } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { Button } from 'components/design-system-ui';
import Text from 'components/Text';
import WordPhrase from 'components/common/WordPhrase';
import { ColorMap } from 'styles/color';
import i18n from 'utils/i18n/i18n';
import { DownloadSimple } from 'phosphor-react-native';
import { DownloadSeedPhraseModal } from 'components/common/DownloadSeedPhraseModal';

interface Props {
  onPressSubmit: () => void;
  seed: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: ColorMap.light,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: ColorMap.disabled,
    marginBottom: 24,
  },
  wordContainer: {
    backgroundColor: ColorMap.dark2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginLeft: 8,
    color: ColorMap.primary,
    fontWeight: '500',
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    color: ColorMap.disabled,
    marginBottom: 24,
    fontWeight: '500',
  },
  continueButton: {
    marginTop: 'auto',
    marginBottom: 16,
  },
});

export const InitSecretPhrase = ({ seed, onPressSubmit }: Props) => {
  const [showDownloadConfirm, setShowDownloadConfirm] = useState<boolean>(false);

  const onPressDownloadText = useCallback(() => {
    setShowDownloadConfirm(true);
  }, []);

  const onPressDownloadButton = useCallback(() => {
    setShowDownloadConfirm(false);
    Share.share({ title: 'Secret phrase', message: seed }).catch(e => {
      console.log('Share secret phrase error', e);
    });
  }, [seed]);

  const onCloseDownloadConfirmation = useCallback(() => {
    setShowDownloadConfirm(false);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Your recovery phrase</Text>
        <Text style={styles.description}>
          Download or copy these words in the right order and save them somewhere safe
        </Text>

        <View style={styles.wordContainer}>
          <WordPhrase seedPhrase={seed} />
        </View>

        <View style={styles.actionRow}>
          <Button
            type="ghost"
            style={styles.actionButton}
            onPress={() => {/* Implement copy functionality */}}
          >
            <DownloadSimple size={20} color={ColorMap.primary} />
            <Text style={styles.actionText}>Copy</Text>
          </Button>

          <Button
            type="ghost"
            style={styles.actionButton}
            onPress={onPressDownloadText}
          >
            <DownloadSimple size={20} color={ColorMap.primary} />
            <Text style={styles.actionText}>Download</Text>
          </Button>
        </View>

        <Text style={styles.warningText}>Never forget your phrase</Text>

        <Button
          style={styles.continueButton}
          onPress={onPressSubmit}
        >
          Continue
        </Button>
      </View>

      <DownloadSeedPhraseModal
        modalVisible={showDownloadConfirm}
        onCloseModalVisible={onCloseDownloadConfirmation}
        setVisible={setShowDownloadConfirm}
        onPressDownloadBtn={onPressDownloadButton}
      />
    </>
  );
};