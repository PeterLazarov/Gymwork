/**
 * Ignore some yellowbox warnings. Some of these are for deprecated functions
 * that we haven't gotten around to replacing yet.
 */
import { LogBox } from 'react-native'

export const defaultIgnoredWarnings = [
  'Require cycle:',
  'Overriding previous layout animation with new one before the first began:',

  'A props object containing a "key" prop is being spread into JSX',
]

// prettier-ignore
LogBox.ignoreLogs(defaultIgnoredWarnings)
