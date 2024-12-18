export type SelectOption<T = unknown> =
  | string
  | {
      value: T
      label: string
    }
