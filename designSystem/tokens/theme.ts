import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from 'react-native-paper'
import { MD3Theme } from 'react-native-paper/lib/typescript/types'
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'

// Generated with https://material-foundation.github.io/material-theme-builder/
/*
https://material-foundation.github.io/material-theme-builder/?primary=%23A277ED&secondary=%239689A8&colorMatch=true
+ extra palletes from 
https://material-foundation.github.io/material-theme-builder/?primary=%23FF5449&secondary=%23F4C002&tertiary=%2352C169&colorMatch=true

*/

export const palettes = {
  primary: {
    '0': '#000000',
    '5': '#19003E',
    '10': '#270058',
    '15': '#340071',
    '20': '#410687',
    '25': '#4C1B92',
    '30': '#582B9E',
    '35': '#6438AB',
    '40': '#7146B8',
    '50': '#8A60D3',
    '60': '#A57AEF',
    '70': '#BE98FF',
    '80': '#D5BBFF',
    '90': '#ECDCFF',
    '95': '#F7EDFF',
    '98': '#FEF7FF',
    '99': '#FFFBFF',
    '100': '#FFFFFF',
  },
  secondary: {
    '0': '#000000',
    '5': '#150C24',
    '10': '#20172F',
    '15': '#2A213A',
    '20': '#352C45',
    '25': '#413751',
    '30': '#4C425C',
    '35': '#584E69',
    '40': '#645A75',
    '50': '#7E728F',
    '60': '#988BA9',
    '70': '#B3A6C5',
    '80': '#CFC1E1',
    '90': '#EBDDFE',
    '95': '#F7EDFF',
    '98': '#FEF7FF',
    '99': '#FFFBFF',
    '100': '#FFFFFF',
  },
  tertiary: {
    '0': '#000000',
    '5': '#28030F',
    '10': '#360C1A',
    '15': '#431724',
    '20': '#50212F',
    '25': '#5D2C3A',
    '30': '#6A3745',
    '35': '#784250',
    '40': '#864E5C',
    '50': '#A26675',
    '60': '#BF7F8E',
    '70': '#DC99A8',
    '80': '#FAB3C3',
    '90': '#FFD9E0',
    '95': '#FFECEF',
    '98': '#FFF8F7',
    '99': '#FFFBFF',
    '100': '#FFFFFF',
  },
  neutral: {
    '0': '#000000',
    '5': '#121014',
    '10': '#1D1B1E',
    '15': '#272529',
    '20': '#323033',
    '25': '#3D3A3E',
    '30': '#48464A',
    '35': '#545155',
    '40': '#605D61',
    '50': '#79767A',
    '60': '#938F94',
    '70': '#AEAAAE',
    '80': '#CAC5CA',
    '90': '#E6E1E6',
    '95': '#F5EFF4',
    '98': '#FEF8FC',
    '99': '#FFFBFF',
    '100': '#FFFFFF',
  },
  neutralVariant: {
    '0': '#000000',
    '5': '#131017',
    '10': '#1D1A22',
    '15': '#28242C',
    '20': '#332F37',
    '25': '#3E3A42',
    '30': '#49454E',
    '35': '#55515A',
    '40': '#615C66',
    '50': '#7A757F',
    '60': '#948E99',
    '70': '#AFA9B4',
    '80': '#CBC4CF',
    '90': '#E8E0EB',
    '95': '#F6EEFA',
    '98': '#FEF7FF',
    '99': '#FFFBFF',
    '100': '#FFFFFF',
  },
  error: {
    '0': '#000000',
    '5': '#2D0001',
    '10': '#410002',
    '15': '#540003',
    '20': '#690005',
    '25': '#7E0007',
    '30': '#93000A',
    '35': '#A60F13',
    '40': '#B81F1E',
    '50': '#DB3A33',
    '60': '#FF5449',
    '70': '#FF897D',
    '80': '#FFB4AB',
    '90': '#FFDAD6',
    '95': '#FFEDEA',
    '98': '#FFF8F7',
    '99': '#FFFBFF',
    '100': '#FFFFFF',
  },
  gold: {
    '0': '#000000',
    '5': '#171000',
    '10': '#241A00',
    '15': '#312400',
    '20': '#3D2E00',
    '25': '#4B3900',
    '30': '#594400',
    '35': '#674F00',
    '40': '#755B00',
    '50': '#937300',
    '60': '#B28C00',
    '70': '#D2A500',
    '80': '#F4C001',
    '90': '#FFDF91',
    '95': '#FFEFCF',
    '98': '#FFF8F1',
    '99': '#FFFBFF',
    '100': '#FFFFFF',
  },
  green: {
    '0': '#000000',
    '5': '#001504',
    '10': '#002108',
    '15': '#002D0E',
    '20': '#003913',
    '25': '#004619',
    '30': '#00531F',
    '35': '#006026',
    '40': '#006E2C',
    '50': '#078A3A',
    '60': '#34A551',
    '70': '#52C069',
    '80': '#6FDD82',
    '90': '#B1F2B5',
    '95': '#C6FFC7',
    '98': '#EBFFE7',
    '99': '#F6FFF1',
    '100': '#FFFFFF',
  },
  //
  coral: {
    hue900: '#CC574E', // Darker version
    hue800: '#D86156',
    hue700: '#E36B5F',
    hue600: '#FF6F61', // Default
    hue500: '#FF8C7A',
    hue400: '#FFB09F',
    hue300: '#FFC8B7',
    hue200: '#FFDAC6', // Light
    hue100: '#FFE5E0', // Lighter
  },
  darkGreen: {
    hue900: '#004D00', // Darker version
    hue800: '#005B00',
    hue700: '#006400', // Default
    hue600: '#33966D',
    hue500: '#66B699',
    hue400: '#85C0B6',
    hue300: '#A2D8CE', // Light
    hue200: '#C2E8E2',
    hue100: '#E0F4F2', // Lighter
  },
  blue: {
    hue900: '#1976D2', // Darker version
    hue800: '#1E88E5',
    hue700: '#2196F3', // Default
    hue600: '#42A5F5',
    hue500: '#64B5F6',
    hue400: '#90CAF9',
    hue300: '#BBDEFB', // Light
    hue200: '#CFE3FC',
    hue100: '#D6E8FD', // Lighter
  },
  teal: {
    hue900: '#006666', // Darker version
    hue800: '#007373',
    hue700: '#008080', // Default
    hue600: '#009999',
    hue500: '#00B3B3',
    hue400: '#4DB6AC',
    hue300: '#80CBC4',
    hue200: '#B2DFDB', // Light
    hue100: '#D0F4F2', // Lighter
  },
  pink: {
    hue900: '#AD1850', // Darker version
    hue800: '#C2185B',
    hue700: '#D81B60',
    hue600: '#E91E63', // Default
    hue500: '#F06292',
    hue400: '#F48FB1',
    hue300: '#F8BBD0', // Light
    hue200: '#FBE4E8',
    hue100: '#FCE9ED', // Lighter
  },
  amber: {
    hue900: '#CC8C00', // Darker version
    hue800: '#D69500',
    hue700: '#FFC107', // Default
    hue600: '#FFB300',
    hue500: '#FFCA28',
    hue400: '#FFDA4D',
    hue300: '#FFECB3', // Light
    hue200: '#FFF1C5',
    hue100: '#FFF6E1', // Lighter
  },
  coolMintGreen: {
    hue900: '#378B85', // Darker version
    hue800: '#42A097',
    hue700: '#4DB6AC', // Default
    hue600: '#73C4BC',
    hue500: '#A1D9D5',
    hue400: '#BBE1E9', // Light
    hue300: '#CDEEF1',
    hue200: '#E6F8F6', // Lighter
    hue100: '#F1FCFA',
  },
  coolSlateBlue: {
    hue900: '#4F4998', // Darker version
    hue800: '#6154A9',
    hue700: '#6A5ACD', // Default
    hue600: '#857ECD',
    hue500: '#9A90D9',
    hue400: '#C5CAE9', // Light
    hue300: '#D2D6F1',
    hue200: '#E3E8F3', // Lighter
    hue100: '#F0F3FA',
  },
}

export const schemes = {
  light: {
    primary: palettes.primary[40],
    surfaceTint: palettes.primary[40],
    onPrimary: palettes.primary[100],
    primaryContainer: palettes.primary[80],
    onPrimaryContainer: palettes.primary[10],
    secondary: palettes.secondary[40],
    onSecondary: palettes.secondary[100],
    secondaryContainer: palettes.secondary[90],
    onSecondaryContainer: palettes.secondary[30],
    tertiary: palettes.tertiary[50],
    onTertiary: palettes.tertiary[100],
    tertiaryContainer: palettes.tertiary[80],
    onTertiaryContainer: palettes.tertiary[10],
    error: palettes.error[40],
    onError: palettes.error[100],
    errorContainer: palettes.error[90],
    onErrorContainer: palettes.error[10],
    background: palettes.neutral[98],
    onBackground: palettes.neutral[10],
    surface: palettes.neutral[98],
    onSurface: palettes.neutral[10],
    surfaceVariant: palettes.neutralVariant[90],
    onSurfaceVariant: palettes.neutralVariant[30],
    outline: palettes.neutralVariant[50],
    outlineVariant: palettes.neutralVariant[80],
    shadow: palettes.neutral[0],
    scrim: palettes.neutral[0],
    inverseSurface: palettes.neutralVariant[30],
    inverseOnSurface: palettes.neutral[95],
    inversePrimary: palettes.primary[80],
    primaryFixed: palettes.primary[90],
    onPrimaryFixed: palettes.primary[10],
    primaryFixedDim: palettes.primary[80],
    onPrimaryFixedVariant: palettes.primary[30],
    secondaryFixed: palettes.secondary[90],
    onSecondaryFixed: palettes.secondary[20],
    secondaryFixedDim: palettes.secondary[80],
    onSecondaryFixedVariant: palettes.secondary[30],
    tertiaryFixed: palettes.tertiary[90],
    onTertiaryFixed: palettes.tertiary[20],
    tertiaryFixedDim: palettes.tertiary[80],
    onTertiaryFixedVariant: palettes.tertiary[35],
    surfaceDim: palettes.neutral[80],
    surfaceBright: palettes.neutral[98],
    surfaceContainerLowest: palettes.neutral[100],
    surfaceContainerLow: palettes.neutral[95],
    surfaceContainer: palettes.neutral[90],
    surfaceContainerHigh: palettes.neutral[80],
    surfaceContainerHighest: palettes.neutral[70],
  },
  dark: {
    primary: palettes.primary[80],
    surfaceTint: palettes.primary[80],
    onPrimary: palettes.primary[10],
    primaryContainer: palettes.primary[50],
    onPrimaryContainer: palettes.primary[100],
    secondary: palettes.secondary[80],
    onSecondary: palettes.secondary[30],
    secondaryContainer: palettes.secondary[50],
    onSecondaryContainer: palettes.secondary[90],
    tertiary: palettes.tertiary[80],
    onTertiary: palettes.tertiary[20],
    tertiaryContainer: palettes.tertiary[50],
    onTertiaryContainer: palettes.tertiary[100],
    error: palettes.error[80],
    onError: palettes.error[20],
    errorContainer: palettes.error[30],
    onErrorContainer: palettes.error[90],
    background: palettes.neutral[10],
    onBackground: palettes.neutral[90],
    surface: palettes.neutral[10],
    onSurface: palettes.neutral[90],
    surfaceVariant: palettes.neutralVariant[30],
    onSurfaceVariant: palettes.neutralVariant[80],
    outline: palettes.neutralVariant[50],
    outlineVariant: palettes.neutralVariant[30],
    shadow: palettes.neutral[0],
    scrim: palettes.neutral[0],
    inverseSurface: palettes.neutral[90],
    inverseOnSurface: palettes.neutral[30],
    inversePrimary: palettes.primary[40],
    primaryFixed: palettes.primary[90],
    onPrimaryFixed: palettes.primary[10],
    primaryFixedDim: palettes.primary[80],
    onPrimaryFixedVariant: palettes.primary[30],
    secondaryFixed: palettes.secondary[90],
    onSecondaryFixed: palettes.secondary[20],
    secondaryFixedDim: palettes.secondary[80],
    onSecondaryFixedVariant: palettes.secondary[30],
    tertiaryFixed: palettes.tertiary[90],
    onTertiaryFixed: palettes.tertiary[20],
    tertiaryFixedDim: palettes.tertiary[80],
    onTertiaryFixedVariant: palettes.tertiary[35],
    surfaceDim: palettes.neutral[10],
    surfaceBright: palettes.neutral[35],
    surfaceContainerLowest: palettes.neutral[5],
    surfaceContainerLow: palettes.neutral[10],
    surfaceContainer: palettes.neutral[15],
    surfaceContainerHigh: palettes.neutral[25],
    surfaceContainerHighest: palettes.neutral[30],
  },
}

function getPaperTheme(theme: 'light' | 'dark'): MD3Theme {
  const matTheme = schemes[theme]
  const defaultPaperTheme = theme === 'light' ? MD3LightTheme : MD3DarkTheme

  return {
    ...defaultPaperTheme,
    colors: {
      ...defaultPaperTheme.colors,
      ...matTheme,
      elevation: {
        level0: 'transparent',
        level1: matTheme.surfaceContainerLowest,
        level2: matTheme.surfaceContainerLow,
        level3: matTheme.surfaceContainer,
        level4: matTheme.surfaceContainerHigh,
        level5: matTheme.surfaceContainerHighest,
      },
    },
  }
}

export const paperThemes = {
  light: getPaperTheme('light'),
  dark: getPaperTheme('dark'),
}

export const navThemes = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: paperThemes.light,
  materialDark: paperThemes.dark,
})
