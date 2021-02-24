import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ExchangeModalTypes } from '@rainbow-me/helpers';
import { AppState } from '@rainbow-me/redux/store';
import { greaterThanOrEqualTo } from '@rainbow-me/utilities';
import { ethereumUtils } from '@rainbow-me/utils';

export default function useSwapIsSufficientBalance() {
  const inputCurrencyAddress = useSelector(
    (state: AppState) => state.swap.inputCurrency?.address
  );
  const assets = useSelector((state: AppState) => state.data.assets);
  const inputAmount = useSelector(
    (state: AppState) => state.swap.inputAmount?.value
  );
  const type = useSelector((state: AppState) => state.swap.type);
  const typeSpecificParameters = useSelector(
    (state: AppState) => state.swap.typeSpecificParameters
  );

  const isSufficientBalance = useMemo(() => {
    if (!inputAmount) return true;

    const maxInputBalance =
      ethereumUtils.getAsset(assets, inputCurrencyAddress)?.balance?.amount ??
      0;

    const isWithdrawal = type === ExchangeModalTypes.withdrawal;
    const { supplyBalanceUnderlying } = typeSpecificParameters;

    return isWithdrawal
      ? greaterThanOrEqualTo(supplyBalanceUnderlying, inputAmount)
      : greaterThanOrEqualTo(maxInputBalance, inputAmount);
  }, [assets, inputAmount, inputCurrencyAddress, type, typeSpecificParameters]);

  return isSufficientBalance;
}
