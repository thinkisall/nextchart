import { useState, useCallback } from 'react';

export interface ChartTheme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  text: string;
}

const themes: Record<string, ChartTheme> = {
  light: {
    primary: 'rgb(59, 130, 246)',
    secondary: 'rgb(16, 185, 129)',
    success: 'rgb(34, 197, 94)',
    warning: 'rgb(245, 158, 11)',
    error: 'rgb(239, 68, 68)',
    background: 'rgb(255, 255, 255)',
    text: 'rgb(17, 24, 39)'
  },
  dark: {
    primary: 'rgb(96, 165, 250)',
    secondary: 'rgb(52, 211, 153)',
    success: 'rgb(74, 222, 128)',
    warning: 'rgb(251, 191, 36)',
    error: 'rgb(248, 113, 113)',
    background: 'rgb(17, 24, 39)',
    text: 'rgb(243, 244, 246)'
  },
  crypto: {
    primary: 'rgb(255, 193, 7)',
    secondary: 'rgb(0, 123, 255)',
    success: 'rgb(40, 167, 69)',
    warning: 'rgb(255, 159, 64)',
    error: 'rgb(220, 53, 69)',
    background: 'rgb(18, 18, 18)',
    text: 'rgb(255, 255, 255)'
  }
};

export function useChartTheme(initialTheme: string = 'light') {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const theme = themes[currentTheme] || themes.light;

  const changeTheme = useCallback((newTheme: string) => {
    if (themes[newTheme]) {
      setCurrentTheme(newTheme);
    }
  }, []);

  const getThemeColors = useCallback((count: number) => {
    const colors = [
      theme.primary,
      theme.secondary,
      theme.success,
      theme.warning,
      theme.error,
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  }, [theme]);

  const getGradientColors = useCallback((baseColor: string, opacity: number = 0.2) => {
    return {
      borderColor: baseColor,
      backgroundColor: baseColor.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`)
    };
  }, []);

  return {
    theme,
    currentTheme,
    changeTheme,
    getThemeColors,
    getGradientColors,
    availableThemes: Object.keys(themes)
  };
}