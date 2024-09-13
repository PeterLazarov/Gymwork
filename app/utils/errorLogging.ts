import { Client, ConfigurationOptions, LogArgument } from 'rollbar-react-native'

export const useLogging = () => {
  let errorLogger: Client | undefined = undefined
  function initLogging () {
    if (!errorLogger){
      const config: ConfigurationOptions = {
        accessToken: 'cc891cfefa254592a6b1437e6b5ff6f2',
        captureUncaught: true,
        captureUnhandledRejections: true,
        captureDeviceInfo: true
      };
      errorLogger = new Client(config);
    }
  }

  function log(data: LogArgument) {
    errorLogger?.log(data)
  }

  initLogging()

  return {
    log,
    errorLogger: errorLogger!
  }
}