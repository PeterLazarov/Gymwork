const colorSchemas = {
  purple: { default: '#764abc', light: '#AB9FCF', lighter: '#E7E0EC' },
  tomatoRed: { default: '#FF6347', light: '#FF9987', lighter: '#FFD4C4' },
  green: { default: '#4CAF50', light: '#8BC68A', lighter: '#C8E6CB' },
  gold: { default: '#FFA726', light: '#FFB95A', lighter: '#FFE0B2' },
  indigo: { default: '#3F51B5', light: '#7986CB', lighter: '#C5CAE9' },
  blue: { default: '#2196F3', light: '#64B5F6', lighter: '#BBDEFB' },
  lightBlue: { default: '#03A9F4', light: '#4FC3F7', lighter: '#B3E5FC' },
}

export default {
  primary: colorSchemas.purple.default,
  primaryLight: colorSchemas.purple.light,
  primaryLighter: colorSchemas.purple.lighter,

  secondary: colorSchemas.tomatoRed.default,
  secondaryLight: colorSchemas.tomatoRed.light,
  secondaryLighter: colorSchemas.tomatoRed.lighter,

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
  tealDark: '#008080',
  red: '#F44336',
  green: '#4CAF50',
  yellow: '#FFEB3B',
  disabled: '#C0C0C0',
  white: '#ffffff',
}
