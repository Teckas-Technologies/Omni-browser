import { Warning } from 'components/Warning';
import useHandlerHardwareBackPress from 'hooks/screen/useHandlerHardwareBackPress';
import React, { useCallback, useMemo, useState } from 'react';
import { ContainerWithSubHeader } from 'components/ContainerWithSubHeader';
import { Alert, Keyboard, Linking, ScrollView, Text, View } from 'react-native';
import { ArrowCircleRight, CheckCircle, Info } from 'phosphor-react-native';
import { Button, Icon, Typography } from 'components/design-system-ui';
import { useSubWalletTheme } from 'hooks/useSubWalletTheme';
import useFormControl from 'hooks/screen/useFormControl';
import { PasswordField } from 'components/Field/Password';
import { validatePassword, validatePasswordMatched } from 'screens/Shared/AccountNamePasswordCreation';
import { keyringChangeMasterPassword, keyringUnlock } from 'messaging/index';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProps } from 'routes/index';
import ChangeMasterPasswordStyle from './style';
import i18n from 'utils/i18n/i18n';
import { FontSemiBold } from 'styles/sharedStyles';
import { useSelector } from 'react-redux';
import { RootState } from 'stores/index';
import { createKeychainPassword } from 'utils/account';
import InputCheckBox from 'components/Input/InputCheckBox';

function checkValidateForm(isValidated: Record<string, boolean>) {
  return isValidated.password && isValidated.repeatPassword;
}

type PageStep = 'OldPassword' | 'NewPassword';

const ChangeMasterPassword = () => {
  const navigation = useNavigation<RootNavigationProps>();
  const { isUseBiometric } = useSelector((state: RootState) => state.mobileSettings);
  const theme = useSubWalletTheme().swThemes;
  const _style = ChangeMasterPasswordStyle(theme);
  const [isBusy, setIsBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<PageStep>('OldPassword');
  const [checked, setChecked] = useState<boolean>(false);
  const formConfig = {
    curPassword: {
      name: i18n.inputLabel.currentPassword,
      value: '',
      validateFunc: validatePassword,
      require: true,
    },
    password: {
      name: i18n.inputLabel.newPassword,
      value: '',
      validateFunc: validatePassword,
      require: true,
    },
    repeatPassword: {
      name: i18n.inputLabel.confirmNewPassword,
      value: '',
      validateFunc: (value: string, formValue: Record<string, string>) => {
        return validatePasswordMatched(value, formValue.password);
      },
      require: true,
    },
  };

  useHandlerHardwareBackPress(isBusy);

  const _backToHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [navigation]);

  const onSubmit = () => {
    if (checkValidateForm(formState.isValidated)) {
      const password = formState.data.password;
      const oldPassword = formState.data.curPassword;

      if (password && oldPassword) {
        setIsBusy(true);
        if (isUseBiometric) {
          (async () => {
            try {
              const res = await createKeychainPassword(password);
              if (!res) {
                setIsBusy(false);
                return;
              }
              handleUnlock(password, oldPassword);
            } catch (e) {
              setIsBusy(false);
            }
          })();
        } else {
          handleUnlock(password, oldPassword);
        }
      }
    }
  };

  function handleUnlock(password: string, oldPassword: string) {
    keyringChangeMasterPassword({
      createNew: false,
      newPassword: password,
      oldPassword: oldPassword,
    })
      .then(res => {
        if (!res.status) {
          setErrors(res.errors);
          isUseBiometric && createKeychainPassword(password);
          return;
        }
        _backToHome();
      })
      .catch(e => {
        isUseBiometric && createKeychainPassword(password);
        setErrors([e.message]);
      })
      .finally(() => {
        setIsBusy(false);
      });
  }

  const { formState, onChangeValue, onUpdateErrors, onSubmitField } = useFormControl(formConfig, {
    onSubmitForm: onSubmit,
  });

  const showAlertWarning = () => {
    Alert.alert(i18n.title.tickTheCheckbox, i18n.message.masterPasswordWarning, [
      { text: i18n.buttonTitles.iUnderStand },
    ]);
  };

  const onNextStep = () => {
    const oldPassword = formState.data.curPassword;
    if (!oldPassword) {
      onUpdateErrors('curPassword')([i18n.warningMessage.requireMessage]);
      return;
    }
    setIsBusy(true);
    keyringUnlock({ password: oldPassword })
      .then(data => {
        if (!data.status) {
          onUpdateErrors('curPassword')([i18n.errorMessage.invalidMasterPassword]);
        } else {
          setStep('NewPassword');
        }
      })
      .catch((e: Error) => {
        onUpdateErrors('curPassword')([e.message]);
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  const onChangeField = useCallback(
    (fieldName: string) => {
      return (value: string) => {
        setErrors([]);
        onChangeValue(fieldName)(value);
      };
    },
    [onChangeValue],
  );

  const _onChangePasswordValue = (currentValue: string) => {
    if (formState.data.repeatPassword) {
      onChangeField('repeatPassword')('');
    }

    onChangeField('password')(currentValue);
  };

  const isDisabled = useMemo(() => {
    if (step === 'OldPassword') {
      return !formState.isValidated.curPassword || isBusy;
    } else {
      return (
        !checkValidateForm(formState.isValidated) ||
        (errors && errors.length > 0) ||
        isBusy ||
        !formState.data.password ||
        !formState.data.repeatPassword
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    step,
    errors,
    formState.isValidated.password,
    formState.isValidated.repeatPassword,
    formState.isValidated.curPassword,
    isBusy,
  ]);

  return (
    <ContainerWithSubHeader
      showLeftBtn={true}
      onPressBack={() => {
        if (step === 'OldPassword') {
          navigation.goBack();
        } else {
          onChangeValue('curPassword')('');
          onChangeValue('password')('');
          onChangeValue('repeatPassword')('');
          onUpdateErrors('curPassword')(undefined);
          onUpdateErrors('password')(undefined);
          onUpdateErrors('repeatPassword')(undefined);
          setStep('OldPassword');
        }
      }}
      rightIcon={Info}
      title={step === 'OldPassword' ? i18n.header.currentPassword : i18n.header.newPassword}
      style={{ width: '100%' }}
      disabled={isBusy}
      disableRightButton={isBusy}>
      <Typography.Text
        style={{
          fontSize: theme.fontSize,
          lineHeight: theme.fontSize * theme.lineHeight,
          color: theme.colorWarning,
          ...FontSemiBold,
          textAlign: 'center',
          paddingTop: theme.padding,
          paddingBottom: theme.paddingLG,
          paddingHorizontal: theme.padding,
        }}>
        {step === 'OldPassword' ? i18n.message.changeMasterPasswordMessage1 : i18n.createPassword.createPasswordMessage}
      </Typography.Text>

      <ScrollView style={_style.bodyWrapper} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        {step === 'OldPassword' && (
          <PasswordField
            ref={formState.refs.curPassword}
            label={formState.labels.curPassword}
            defaultValue={formState.data.curPassword}
            onChangeText={onChangeField('curPassword')}
            errorMessages={formState.errors.curPassword}
            onSubmitField={onNextStep}
            isBusy={isBusy}
            autoFocus
          />
        )}

        {step === 'NewPassword' && (
          <>
            <PasswordField
              ref={formState.refs.password}
              label={formState.labels.password}
              defaultValue={formState.data.password}
              onChangeText={_onChangePasswordValue}
              errorMessages={formState.errors.password}
              onSubmitField={onSubmitField('password')}
              isBusy={isBusy}
              autoFocus
            />

            <PasswordField
              ref={formState.refs.repeatPassword}
              label={formState.labels.repeatPassword}
              defaultValue={formState.data.repeatPassword}
              onChangeText={onChangeField('repeatPassword')}
              errorMessages={formState.errors.repeatPassword}
              onSubmitField={checked ? onSubmitField('repeatPassword') : () => Keyboard.dismiss()}
              isBusy={isBusy}
            />

            <Typography.Text size={'sm'} style={{ color: theme.colorTextLight4 }}>
              {i18n.warning.warningPasswordMessage}
            </Typography.Text>
          </>
        )}
        {errors.length > 0 &&
          errors.map((message, index) => <Warning isDanger message={message} key={index} style={_style.error} />)}
      </ScrollView>

      <View style={_style.footerAreaStyle}>
        {step === 'NewPassword' && (
          <InputCheckBox
            labelStyle={{ flex: 1 }}
            needFocusCheckBox
            checked={checked}
            label={
              <Typography.Text style={{ color: theme.colorWhite, marginLeft: theme.marginXS, flex: 1 }}>
                {i18n.buttonTitles.masterPasswordCheckbox}
                <Text
                  style={{
                    textDecorationStyle: 'solid',
                    textDecorationLine: 'underline',
                    color: theme.colorPrimary,
                    textDecorationColor: theme.colorPrimary,
                  }}
                  onPress={() =>
                    Linking.openURL(
                      'https://docs.subwallet.app/main/mobile-app-user-guide/getting-started/create-apply-change-and-what-to-do-when-forgot-password',
                    )
                  }>
                  {i18n.buttonTitles.learnMore}
                </Text>
              </Typography.Text>
            }
            onPress={() => setChecked(!checked)}
            checkBoxSize={20}
          />
        )}
        <Button
          disabled={isDisabled}
          showDisableStyle={step === 'OldPassword' ? false : !checked}
          loading={isBusy}
          icon={
            <Icon
              phosphorIcon={step === 'OldPassword' ? ArrowCircleRight : CheckCircle}
              size={'lg'}
              iconColor={
                isDisabled || (step === 'OldPassword' ? false : !checked)
                  ? theme.colorTextLight5
                  : theme.colorTextLight1
              }
              weight={'fill'}
            />
          }
          onPress={step === 'OldPassword' ? onNextStep : checked ? onSubmit : showAlertWarning}>
          {step === 'OldPassword' ? i18n.buttonTitles.next : i18n.buttonTitles.finish}
        </Button>
      </View>
    </ContainerWithSubHeader>
  );
};

export default ChangeMasterPassword;
