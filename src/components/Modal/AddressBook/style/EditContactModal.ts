import { ThemeTypes } from 'styles/themes';
import { StyleSheet } from 'react-native';

export default (theme: ThemeTypes) =>
  StyleSheet.create({
    formContainer: {
      width: '100%',
      gap: theme.sizeSM,
    },
    buttonGroupContainer: {
      flexDirection: 'row',
      gap: theme.sizeSM,
    },
    button: {
      flex: 1,
    },
  });
