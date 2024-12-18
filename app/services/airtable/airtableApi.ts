import { ApisauceInstance, create } from 'apisauce'

import type { ApiConfig, AirtableFeedback } from './api.types'

const AIRTABLE_TOKEN =
  'patMKFyWfJGp0hEeg.433e2363cef9deb628914ddef22f1f0e0905ec6ed37bb79eb80a500fb4b8d44f'

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: 'https://api.airtable.com/v0/apptjrsE1Tt08pG4n/Feedback',
  timeout: 10000,
}

export class AirtableApi {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        Accept: 'application/json',
      },
    })
  }

  async sendFeedback(feedback: AirtableFeedback): Promise<any> {
    return this.apisauce.post('', {
      records: [
        {
          fields: {
            User: feedback.user,
            Comments: feedback.comments,
            Date: feedback.date,
            CreatedAt: feedback.createdAt,
          },
        },
      ],
    })
  }
}

export const airtableApi = new AirtableApi()
