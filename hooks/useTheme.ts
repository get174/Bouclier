import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export const useTheme = () => {
  const context = useThemeContext();

  return {
    ...context,
    colors: {
      background: useThemeColor({}, 'background'),
      text: useThemeColor({}, 'text'),
      tint: useThemeColor({}, 'tint'),
      surface: useThemeColor({}, 'surface'),
      surfaceSecondary: useThemeColor({}, 'surfaceSecondary'),
      border: useThemeColor({}, 'border'),
      borderLight: useThemeColor({}, 'borderLight'),
      primary: useThemeColor({}, 'primary'),
      primaryLight: useThemeColor({}, 'primaryLight'),
      secondary: useThemeColor({}, 'secondary'),
      textSecondary: useThemeColor({}, 'textSecondary'),
      textMuted: useThemeColor({}, 'textMuted'),
      success: useThemeColor({}, 'success'),
      warning: useThemeColor({}, 'warning'),
      error: useThemeColor({}, 'error'),
      card: useThemeColor({}, 'card'),
    },
  };
};
