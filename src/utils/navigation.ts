import { NavigateFunction } from 'react-router-dom';

export const navigateToCreator = (navigate: NavigateFunction, symbol: string): void => {
  navigate(`/creator/${symbol}`);
};

export const navigateToCreatorPortfolio = (navigate: NavigateFunction, symbol: string): void => {
  navigate(`/creator/${symbol}/portfolio`);
};

export const navigateToCreatorBonds = (navigate: NavigateFunction, symbol: string): void => {
  navigate(`/creator/${symbol}/bonds`);
};

export const navigateToCreatorOptions = (navigate: NavigateFunction, symbol: string): void => {
  navigate(`/creator/${symbol}/options`);
};