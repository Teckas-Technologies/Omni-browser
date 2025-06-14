import BigNumber from 'bignumber.js';
import BigN from 'bignumber.js';
import { AmountData } from '@subwallet/extension-base/background/KoniTypes';

// 1000.12345 -> 1,000; 1000,654321 -> 1,001
export const formatLocaleNumber = (number: number, digits?: number): string => {
  return number.toLocaleString('en-UK', { maximumFractionDigits: digits || 0 });
};

const prefixArray = ['a', 'n', 'µ', 'm', '', 'K', 'M', 'B', 'T'];

export const convertToSimpleNumber = (value: number, decimals: number): string => {
  if (!value) {
    return '0 ';
  }

  let prefixIndex = prefixArray.indexOf('');
  const a = new BigNumber(10).pow(decimals);
  let val = new BigNumber(value).dividedBy(a);
  let diff = Math.log10(val.toNumber());

  // > 10,000 || < 0,01
  while (diff >= 5 || diff < -2) {
    if (diff > 0) {
      val = val.dividedBy(1000);
      prefixIndex++;
    } else {
      val = val.multipliedBy(1000);
      prefixIndex--;
    }

    diff = Math.log10(val.toNumber());
  }

  return `${val.toFormat()} ${prefixArray[prefixIndex]}`;
};

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Number from @subwallet-react-ui
export const BN_TEN = new BigNumber(10);
export interface NumberFormatter {
  (input: string, metadata?: Record<string, number>): string;
}

// Clear zero from end, use with decimal only
const clearZero = (result: string): string => {
  let index = result.length - 1;
  while (result[index] === '0') {
    result = result.slice(0, index);
    index--;
  }

  return result;
};

const NUM_1T = new BigNumber(1e12);
const TLIM = new BigNumber(1e17);
const NUM_1B = new BigNumber(1e9);
const BLIM = new BigNumber(1e14);
const NUM_1M = new BigNumber(1e6);
const NUM_100M = new BigNumber(1e8);
export const balanceFormatter: NumberFormatter = (input: string, metadata?: Record<string, number>): string => {
  const absGteOne = new BigNumber(input).abs().gte(1);
  const minNumberFormat = metadata?.minNumberFormat || 2;
  const maxNumberFormat = metadata?.maxNumberFormat || 6;

  const [int, decimal = '0'] = input.split('.');
  let _decimal = '';

  if (absGteOne) {
    const intNumber = new BigNumber(int);
    const max = BN_TEN.pow(maxNumberFormat);

    // If count of number in integer part greater or equal maxNumberFormat, do not show decimal
    if (intNumber.gte(max)) {
      if (intNumber.gte(NUM_100M)) {
        if (intNumber.gte(BLIM)) {
          if (intNumber.gte(TLIM)) {
            return `${intNumber.dividedBy(NUM_1T).toFixed(2)} T`;
          }
          return `${intNumber.dividedBy(NUM_1B).toFixed(2)} B`;
        }
        return `${intNumber.dividedBy(NUM_1M).toFixed(2)} M`;
      }

      return int;
    }

    // Get only minNumberFormat number at decimal
    if (decimal.length <= minNumberFormat) {
      _decimal = decimal;
    } else {
      _decimal = decimal.slice(0, minNumberFormat);
    }

    // Clear zero number for decimal
    _decimal = clearZero(_decimal);
  } else {
    // Index of cursor
    let index = 0;

    // Count of not zero number in decimal
    let current = 0;

    // Find a not zero number in decimal
    let metNotZero = false;

    // Get at least minNumberFormat number not 0 from index 0
    // If count of 0 number at prefix greater or equal maxNumberFormat should stop and return 0

    // current === minNumberFormat: get enough number
    // index === decimal.length: end of decimal
    // index === maxNumberFormat: reach limit of 0 number at prefix
    while (current < minNumberFormat && index < decimal.length && (index < maxNumberFormat || metNotZero)) {
      const _char = decimal[index];
      _decimal += _char;
      index++;
      if (_char !== '0') {
        metNotZero = true;
      }

      if (metNotZero) {
        current++;
      }
    }

    // Clear zero number for decimal
    _decimal = clearZero(_decimal);
  }

  if (_decimal) {
    return `${int}.${_decimal}`;
  }

  return int;
};

export const PREDEFINED_FORMATTER: Record<string, NumberFormatter> = {
  balance: balanceFormatter,
};

export const toBNString = (input: string | number | BigNumber, decimal: number): string => {
  const raw = new BigNumber(input);
  return raw.multipliedBy(BN_TEN.pow(decimal)).toFixed();
};

export const formatNumber = (
  input: string | number | BigNumber,
  decimal: number,
  formatter: NumberFormatter,
  metadata?: Record<string, number>,
): string => {
  const raw = new BigNumber(input).dividedBy(BN_TEN.pow(decimal)).toFixed();

  return formatter(raw, metadata);
};

export const formatBalance = (value: string | number | BigN, decimals: number) => {
  return formatNumber(value, decimals, balanceFormatter);
};

export const formatAmount = (amountData?: AmountData): string => {
  if (!amountData) {
    return '';
  }

  const { decimals, symbol, value } = amountData;
  const displayValue = formatBalance(value, decimals);

  return `${displayValue} ${symbol}`;
};
