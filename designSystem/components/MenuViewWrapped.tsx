import {
  MenuView,
  MenuComponentProps,
  MenuAction,
  MenuComponentRef,
} from '@react-native-menu/menu'
import { PropsWithChildren, forwardRef, useMemo } from 'react'

import { useAppTheme } from '@/utils/useAppTheme'

type MenuViewWrappedProps = Omit<
  MenuComponentProps,
  'actions' | 'onPressAction'
> & { actions: Array<Omit<MenuAction, 'id'> & { fn: () => void }> }

export const MenuViewWrapped = forwardRef<
  MenuComponentRef,
  PropsWithChildren<MenuViewWrappedProps>
>(({ children, actions, ...props }, ref) => {
  const { theme } = useAppTheme()
  const convertedActions = useMemo<MenuAction[]>(
    () =>
      actions.map(
        (action): MenuAction => ({
          id: action.title,
          title: action.title,
          titleColor: theme.colors.onSurface,
        })
      ),
    [actions, theme]
  )

  return (
    <MenuView
      ref={ref}
      shouldOpenOnLongPress={false}
      actions={convertedActions}
      onPressAction={({ nativeEvent }) => {
        actions.find(a => a.title === nativeEvent.event)?.fn()
      }}
      {...props}
    >
      {children}
    </MenuView>
  )
})

// @ts-expect-error
MenuViewWrapped.displayName = 'MenuViewWrapped'
