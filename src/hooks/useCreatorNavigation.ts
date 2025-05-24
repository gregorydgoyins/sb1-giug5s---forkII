import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToCreator } from '../utils/navigation';

export const useCreatorNavigation = () => {
  const navigate = useNavigate();

  const handleCreatorClick = useCallback((symbol: string): void => {
    navigateToCreator(navigate, symbol);
  }, [navigate]);

  return { handleCreatorClick };
};