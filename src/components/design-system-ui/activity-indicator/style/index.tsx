import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ThemeTypes } from 'styles/themes';

export interface ActivityIndicatorStyle {
  container: ViewStyle;
  innerContainer: ViewStyle;
  wrapper: ViewStyle;
  tip: TextStyle;
  toast: TextStyle;
  spinner: ViewStyle;
}

export default (theme: ThemeTypes) =>
  StyleSheet.create<ActivityIndicatorStyle>({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    innerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    wrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 89,
      height: 89,
      borderRadius: theme.radius_md,
      backgroundColor: theme.toast_fill,
    },
    tip: {
      color: theme.color_text_base,
      fontSize: theme.font_size_base,
      marginLeft: theme.h_spacing_md,
    },
    toast: {
      color: theme.color_text_base_inverse,
      fontSize: theme.font_size_base,
      marginTop: theme.v_spacing_sm,
    },
    spinner: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
