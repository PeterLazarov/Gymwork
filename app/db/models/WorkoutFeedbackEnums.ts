// import { palettes } from 'designSystem'

export const feelingOptions = {
  sad: {
    icon: 'emoji-sad',
    label: 'Bad',
    color: 'coral',
    value: 'sad',
  },
  neutral: {
    icon: 'emoji-happy',
    label: 'Good',
    color: 'amber',
    value: 'neutral',
  },
  happy: {
    icon: 'grin-stars',
    label: 'Great',
    color: 'green',
    value: 'happy',
  },
} as const

export const discomfortOptions = {
  pain: {
    icon: 'alert-decagram-outline',
    label: 'Severe / Pain',
    color: 'coral',
    value: 'pain',
  },
  discomfort: {
    icon: 'warning-outline',
    label: 'Mild',
    color: 'amber',
    value: 'discomfort',
  },
  noPain: {
    icon: 'check',
    label: 'None',
    color: 'green',
    value: 'noPain',
  },
} as const
