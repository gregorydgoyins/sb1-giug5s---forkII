import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Add custom render method that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      // Add providers here if needed
      wrapper: ({ children }) => children,
      ...options,
    }),
  };
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { userEvent };