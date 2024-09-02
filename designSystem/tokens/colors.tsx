export const colorSchemas = {
  purple: { default: '#764abc', light: '#C3BCE6', lighter: '#E7E0EC' },
  coral: { default: '#FF6F61', light: '#FFDAC6', lighter: '#FFE5E0' },
  green: { default: '#4CAF50', light: '#8BC68A', lighter: '#C8E6CB' },
  darkGreen: { default: '#006400', light: '#A2D8CE', lighter: '#E0F4F2' },
  gold: { default: '#FFA726', light: '#FFB95A', lighter: '#FFE0B2' },
  blue: { default: '#2196F3', light: '#BBDEFB', lighter: '#D6E8FD' },
  teal: { default: '#008080', light: '#B2DFDB', lighter: '#D0F4F2' },
  pink: { default: '#E91E63', light: '#F8BBD0', lighter: '#FBE4E8' },
  amber: { default: '#FFC107', light: '#FFECB3', lighter: '#FFF6E1' },
  coolMintGreen: { default: '#4DB6AC', light: '#D0F0EB', lighter: '#E6F8F6' },
  coolSlateBlue: { default: '#6A5ACD', light: '#C5CAE9', lighter: '#E3E8F3' },
}

export const colors = {
  primary: colorSchemas.purple.default,
  primaryLight: colorSchemas.purple.light,
  primaryLighter: colorSchemas.purple.lighter,

  secondary: colorSchemas.coral.default,
  secondaryLight: colorSchemas.coral.light,
  secondaryLighter: colorSchemas.coral.lighter,

  neutralDark: '#626262',
  neutral: '#D6D7D6',
  neutralLight: '#E6E6E6',
  neutralLighter: '#F7F3F9',
  critical: '#B22222',
  tertiary: 'transparent',
  primaryText: 'white',
  secondaryText: 'white',
  neutralText: 'black',
  iconText: 'white',
  criticalText: 'white',
  tertiaryText: 'black',
  disabled: '#C0C0C0',
  white: '#ffffff',
}
