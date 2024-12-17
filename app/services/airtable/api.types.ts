export type AirtableFeedback = {
  date: string
  user: string
  comments: string
  createdAt: string
}

export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
