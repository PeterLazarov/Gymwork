export const CHART_VIEWS = {
    "30D": "30D",
    "3M": "3M",
    "6M": "6M",
    "ALL": "ALL", // (Linear)
  } as const
export type CHART_VIEW_KEY = keyof typeof CHART_VIEWS
export type CHART_VIEW = (typeof CHART_VIEWS)[CHART_VIEW_KEY]