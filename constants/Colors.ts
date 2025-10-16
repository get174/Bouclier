/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Extended colors for better theming
    surface: '#f8fafc',
    surfaceSecondary: '#ffffff',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    primary: '#0f766e',
    primaryLight: '#0d9488',
    secondary: '#0891b2',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    card: '#ffffff',
    shadow: '#000000',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Extended colors for dark mode
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    border: '#475569',
    borderLight: '#475569',
    primary: '#14b8a6',
    primaryLight: '#0d9488',
    secondary: '#0891b2',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#f87171',
    card: '#1e293b',
    shadow: '#000000',
  },
};
