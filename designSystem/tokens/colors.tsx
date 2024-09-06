import { colorSchemas } from './colorSchemas'

export const colors = {
  primary: colorSchemas.purple.hue600,
  primaryLight: colorSchemas.purple.hue300,
  primaryLighter: colorSchemas.purple.hue100,

  accent: colorSchemas.coral.hue600,
  accentLight: colorSchemas.coral.hue300,
  accentLighter: colorSchemas.coral.hue200,

  neutralDark: colorSchemas.neutral.hue900,
  neutral: colorSchemas.neutral.hue700,
  neutralLight: colorSchemas.neutral.hue600,
  neutralLighter: colorSchemas.neutral.hue300,
  neutralLightest: colorSchemas.neutral.hue100,

  critical: colorSchemas.pink.hue900,
  tertiary: 'transparent',
  primaryText: colorSchemas.neutral.hue100,
  secondaryText: colorSchemas.neutral.hue100,
  criticalText: colorSchemas.neutral.hue100,
  neutralText: colorSchemas.neutral.hue900,
  tertiaryText: colorSchemas.neutral.hue900,
  disabled: colorSchemas.neutral.hue600,
} as const
