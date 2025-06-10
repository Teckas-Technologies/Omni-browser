import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button } from 'components/design-system-ui';
import Text from 'components/Text';
import { DownloadSimple, CopySimple, WarningCircle } from 'phosphor-react-native';
import { DownloadSeedPhraseModal } from 'components/common/DownloadSeedPhraseModal';
import Clipboard from '@react-native-clipboard/clipboard';
import Svg, { Path } from 'react-native-svg';

interface Props {
  onPressSubmit: () => void;
  seed: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 30,
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
    backgroundColor: '#70befa',
    borderRadius: 6,
    paddingVertical: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  wordText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    marginLeft: 6,
    color: '#4399E0',
    fontWeight: '500',
    fontSize: 14,
  },
  warningText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  warningLabel: {
    color: '#aaa',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  continueButton: {
    marginTop: 'auto',
    marginBottom: 16,
    alignSelf: 'center',
    width: '100%',
  },
});

export const InitSecretPhrase = ({ seed, onPressSubmit }: Props) => {
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  // const onPressDownloadText = useCallback(() => {
  //   setShowDownloadConfirm(true);
  // }, []);
  const onPressDownloadText = useCallback(() => {
  Share.share({ title: 'Secret phrase', message: seed }).catch(e => {
    console.log('Share secret phrase error', e);
  });
}, [seed]);


  const onPressDownloadButton = useCallback(() => {
    setShowDownloadConfirm(false);
    Share.share({ title: 'Secret phrase', message: seed }).catch(e => {
      console.log('Share secret phrase error', e);
    });
  }, [seed]);

  const onCopyPhrase = useCallback(() => {
    Clipboard.setString(seed);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [seed]);

  const onCloseDownloadConfirmation = useCallback(() => {
    setShowDownloadConfirm(false);
  }, []);

  const words = seed.trim().split(' ');

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your recovery phrase</Text>
        <Text style={styles.description}>
          Download or copy these words in the right order and save them somewhere safe
        </Text>

        <View style={styles.wordGrid}>
          {words.map((word, index) => (
            <View key={`${index}-${word}`} style={styles.wordButton}>
              <Text style={styles.wordText}>{`${index + 1}. ${word}`}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={onCopyPhrase}>
            <Text style={styles.actionText}>{copied ? 'Copied!' : 'Copy'}</Text>
            <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
              <Path d="M12.75 14H11.75V15H3.5V4.75H4.5V3.75H2.5V16H12.75V14Z" fill="#70BEFA" />
              <Path
                d="M5.5 1V13H15.5V5.29291L11.2071 1H5.5ZM14.5 12H6.5V2H9.75V6.75H14.5V12ZM14.5 5.75H10.75V2H10.7929L14.5 5.70709V5.75Z"
                fill="#70BEFA"
              />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onPressDownloadText}>
            <Text style={styles.actionText}>Download</Text>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 15.577L8.461 12.039L9.169 11.319L11.5 13.65V5H12.5V13.65L14.83 11.32L15.539 12.039L12 15.577ZM6.616 19C6.15533 19 5.771 18.846 5.463 18.538C5.155 18.23 5.00067 17.8453 5 17.384V14.961H6V17.384C6 17.538 6.064 17.6793 6.192 17.808C6.32 17.9367 6.461 18.0007 6.615 18H17.385C17.5383 18 17.6793 17.936 17.808 17.808C17.9367 17.68 18.0007 17.5387 18 17.384V14.961H19V17.384C19 17.8447 18.846 18.229 18.538 18.537C18.23 18.845 17.8453 18.9993 17.384 19H6.616Z"
                fill="#70BEFA"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={styles.warningText}>
          <Svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <Path
              d="M9.36612 2.59863L15.1221 12.568C15.2099 12.72 15.2561 12.8924 15.2561 13.068C15.2561 13.2435 15.2099 13.4159 15.1221 13.568C15.0344 13.72 14.9081 13.8462 14.7561 13.934C14.6041 14.0218 14.4317 14.068 14.2561 14.068H2.74412C2.56858 14.068 2.39614 14.0218 2.24412 13.934C2.09211 13.8462 1.96587 13.72 1.87811 13.568C1.79034 13.4159 1.74414 13.2435 1.74414 13.068C1.74414 12.8924 1.79035 12.72 1.87812 12.568L7.63412 2.59863C8.01878 1.93197 8.98078 1.93197 9.36612 2.59863ZM8.50012 10.5C8.3233 10.5 8.15374 10.5702 8.02871 10.6952C7.90369 10.8203 7.83345 10.9898 7.83345 11.1666C7.83345 11.3434 7.90369 11.513 8.02871 11.638C8.15374 11.7631 8.3233 11.8333 8.50012 11.8333C8.67693 11.8333 8.8465 11.7631 8.97152 11.638C9.09654 11.513 9.16678 11.3434 9.16678 11.1666C9.16678 10.9898 9.09654 10.8203 8.97152 10.6952C8.8465 10.5702 8.67693 10.5 8.50012 10.5ZM8.50012 5.8333C8.33683 5.83332 8.17922 5.89327 8.0572 6.00178C7.93518 6.11028 7.85722 6.2598 7.83812 6.42197L7.83345 6.49997V9.16663C7.83364 9.33655 7.8987 9.49999 8.01535 9.62354C8.13199 9.7471 8.29142 9.82146 8.46105 9.83141C8.63067 9.84137 8.7977 9.78618 8.928 9.67712C9.05831 9.56806 9.14205 9.41336 9.16212 9.24463L9.16678 9.16663V6.49997C9.16678 6.32315 9.09654 6.15359 8.97152 6.02856C8.8465 5.90354 8.67693 5.8333 8.50012 5.8333Z"
              fill="#70BEFA"
            />
          </Svg>
          <Text style={styles.warningLabel}>Never forget your phrase</Text>
        </View>

        <Button style={styles.continueButton} onPress={onPressSubmit}>
          Continue
        </Button>
      </ScrollView>

      {/* <DownloadSeedPhraseModal
        modalVisible={showDownloadConfirm}
        onCloseModalVisible={onCloseDownloadConfirmation}
        setVisible={setShowDownloadConfirm}
        onPressDownloadBtn={onPressDownloadButton}
      /> */}
    </>
  );
};
