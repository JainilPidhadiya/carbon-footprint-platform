/**
 * @file store/slices/themeSlice.ts
 * @description Theme state slice managing the light/dark mode display properties.
 */

import type { StateCreator } from 'zustand';
import type { AppState } from '../index';

/**
 * Interface representing the Theme slice of the application store.
 */
export interface ThemeSlice {
  /** The current active visual mode theme ('light' or 'dark'). */
  theme: 'light' | 'dark';
  /** Toggles the UI visual theme and sets the class list on the document body. */
  toggleTheme: () => void;
}

/**
 * Slice creator function for the Theme state section.
 */
export const createThemeSlice: StateCreator<AppState, [], [], ThemeSlice> = (set) => ({
  theme: 'light',

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    const bodyClass = document.body.classList;
    if (nextTheme === 'dark') {
      bodyClass.add('dark');
    } else {
      bodyClass.remove('dark');
    }
    return { theme: nextTheme };
  }),
});
