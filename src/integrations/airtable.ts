import { ApisauceInstance, create } from 'apisauce'
import Config from "react-native-config";

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
  

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.AIRTABLE_URL!,
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
        Authorization: `Bearer ${Config.AIRTABLE_SECRET}`,
        Accept: 'application/json',
      },
    })
  }

  async sendFeedback(feedback: AirtableFeedback): Promise<any> {
    return this.apisauce.post('', {
      records: [{
        fields: {
          User: feedback.user,
          Comments: feedback.comments,
          Date: feedback.date,
          CreatedAt: feedback.createdAt
        }
      }]
    })
  }
}

export const airtableApi = new AirtableApi()
