import {
  MenuView,
  MenuComponentProps,
  MenuAction,
  MenuComponentRef,
} from '@react-native-menu/menu'
import { PropsWithChildren, forwardRef, useMemo } from 'react'

type MenuViewWrappedProps = Omit<
  MenuComponentProps,
  'actions' | 'onPressAction'
> & {
  actions: Array<Omit<MenuAction, 'id'> & { fn: () => void }>
}

export const MenuViewWrapped = forwardRef<
  MenuComponentRef,
  PropsWithChildren<MenuViewWrappedProps>
>(({ children, actions, ...props }, ref) => {
  const convertedActions = useMemo<MenuAction[]>(
    () =>
      actions.map(action => ({
        id: action.title,
        title: action.title,
      })),
    [actions]
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
