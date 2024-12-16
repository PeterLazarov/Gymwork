import { observer } from 'mobx-react-lite'
import { Menu, MenuProps } from 'react-native-paper'
import { useStores } from 'app/db/helpers/useStores'
import useBenchmark from 'app/utils/useBenchmark'
import { translate } from 'app/i18n'

export type HeaderMenuItemsProps = {
  onClose(): void
} & Partial<MenuProps>

const HomeMenuItems: React.FC<HeaderMenuItemsProps> = ({ onClose }) => {
  const { performBenchmark } = useBenchmark()

  const {
    navStore: { navigate, activeRoute },
  } = useStores()

  function goToSettings() {
    onClose()
    navigate('Settings')
  }

  function goToFeedback() {
    onClose()
    navigate('UserFeedback', { referrerPage: activeRoute ?? '?' })
  }

  return (
    <>
      <Menu.Item
        onPress={goToSettings}
        title={translate('settings')}
      />
      <Menu.Item
        onPress={goToFeedback}
        title={translate('giveFeedback')}
      />

      {__DEV__ && (
        <Menu.Item
          onPress={performBenchmark}
          title="Perform benchmark"
        />
      )}
    </>
  )
}

export default observer(HomeMenuItems)
