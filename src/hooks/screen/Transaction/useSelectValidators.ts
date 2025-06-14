import React from 'react';
import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-notifications';
import i18n from 'utils/i18n/i18n';
import { getValidatorKey } from 'utils/transaction/stake';
import { autoSelectValidatorOptimally } from 'utils/earning';
import { ValidatorDataType } from 'hooks/screen/Staking/useGetValidatorList';

export function useSelectValidators(
  validatorList: ValidatorDataType[],
  maxCount: number,
  onChange?: (value: string) => void,
  isSingleSelect?: boolean,
  closeModal?: () => void,
  toastRef?: React.RefObject<Toast>,
) {
  // Current nominated at init
  const [defaultSelected, setDefaultSelected] = useState<string[]>([]);
  // Current selected validators
  const [selected, setSelected] = useState<string[]>([]);
  // Current chosen in modal
  const [changeValidators, setChangeValidators] = useState<string[]>([]);

  const onChangeSelectedValidator = useCallback(
    (changeVal: string) => {
      setChangeValidators(currentChangeValidators => {
        let result: string[];

        if (!currentChangeValidators.includes(changeVal)) {
          if (isSingleSelect) {
            if (defaultSelected.length >= maxCount) {
              if (!defaultSelected.includes(changeVal)) {
                if (toastRef && toastRef.current) {
                  toastRef.current.hideAll();
                  toastRef.current.show(
                    i18n.formatString(i18n.stakingScreen.maximumSelectableValidators, maxCount) as string,
                    {
                      type: 'normal',
                    },
                  );
                }

                return currentChangeValidators;
              }
            }

            result = [changeVal];
          } else {
            if (currentChangeValidators.length >= maxCount) {
              if (toastRef && toastRef.current) {
                toastRef.current.hideAll();
                toastRef.current.show(
                  i18n.formatString(i18n.stakingScreen.maximumSelectableValidators, maxCount) as string,
                  {
                    type: 'normal',
                  },
                );
              }

              return currentChangeValidators;
            }

            result = [...currentChangeValidators, changeVal];
          }
        } else {
          if (isSingleSelect) {
            result = [];
          } else {
            result = currentChangeValidators.filter(item => item !== changeVal);
          }
        }

        return result;
      });
    },
    [defaultSelected, isSingleSelect, maxCount, toastRef],
  );

  const _onApplyChangeValidators = useCallback(
    (_changeValidators: string[]) => {
      onChange && onChange(_changeValidators.join(','));

      setSelected(_changeValidators);
      closeModal && closeModal();
    },
    [closeModal, onChange],
  );

  const onApplyChangeValidators = useCallback(() => {
    _onApplyChangeValidators(changeValidators);
  }, [_onApplyChangeValidators, changeValidators]);

  const onCancelSelectValidator = useCallback(() => {
    setChangeValidators(selected);
    closeModal && closeModal();
  }, [selected, closeModal]);

  const onInitValidators = useCallback((defaultValue: string, _defaultSelected: string) => {
    const _selected = !_defaultSelected ? [] : _defaultSelected.split(',');
    const _default = !defaultValue ? [] : defaultValue.split(',');

    setChangeValidators(_selected);
    setDefaultSelected(_default);
    setSelected(_selected);
  }, []);

  const resetValidatorSelector = useCallback(() => {
    setSelected([]);
    setChangeValidators([]);
    onChange && onChange('');
  }, [onChange]);

  const onAutoSelectValidator = useCallback(() => {
    const validators = autoSelectValidatorOptimally(validatorList, maxCount);
    const validatorKeyList = validators.map(v => getValidatorKey(v.address, v.identity));

    setChangeValidators(validatorKeyList);
    _onApplyChangeValidators(validatorKeyList);
  }, [_onApplyChangeValidators, maxCount, validatorList]);

  return {
    resetValidatorSelector,
    onChangeSelectedValidator,
    changeValidators,
    onApplyChangeValidators,
    onCancelSelectValidator,
    onInitValidators,
    onAutoSelectValidator,
  };
}
