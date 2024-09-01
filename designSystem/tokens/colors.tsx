export const colorSchemas = {
  purple: { default: '#764abc', light: '#AB9FCF', lighter: '#E7E0EC' },
  coral: { default: '#FF6F61', light: '#FFCCC7', lighter: '#FFE5E0' },
  green: { default: '#4CAF50', light: '#8BC68A', lighter: '#C8E6CB' },
  darkGreen: { default: '#006400', light: '#228B22', lighter: '#66CDAA' },
  gold: { default: '#FFA726', light: '#FFB95A', lighter: '#FFE0B2' },
  blue: { default: '#2196F3', light: '#64B5F6', lighter: '#BBDEFB' },
  teal: { default: '#008080', light: '#4DB6AC', lighter: '#B2DFDB' },
  pink: { default: '#E91E63', light: '#F06292', lighter: '#F8BBD0' },
  amber: { default: '#FFC107', light: '#FFD54F', lighter: '#FFECB3' },
  coolMintGreen: { default: '#4DB6AC', light: '#80CBC4', lighter: '#D0F0EB' },
  coolSlateBlue: { default: '#6A5ACD', light: '#8A6BCC', lighter: '#C5CAE9' },
}

export const colors = {
  primary: colorSchemas.purple.default,
  primaryLight: colorSchemas.purple.light,
  primaryLighter: colorSchemas.purple.lighter,

  secondary: colorSchemas.coral.default,
  secondaryLight: colorSchemas.coral.light,
  secondaryLighter: colorSchemas.coral.lighter,

  neutralDark: '#626262',
  neutral: '#F7F3F9',
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
