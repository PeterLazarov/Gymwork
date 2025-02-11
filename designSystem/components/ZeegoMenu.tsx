// design-system/dropdown-menu.tsx
import React from 'react'
import * as DropdownMenu from 'zeego/dropdown-menu'
import { MenuItemProps } from 'zeego/lib/typescript/menu'
import { Text } from './Text'
import { Button } from 'react-native'

export const DropdownMenuRoot = DropdownMenu.Root
export const DropdownMenuTrigger = DropdownMenu.Trigger
export const DropdownMenuContent = DropdownMenu.Content

export const DropdownMenuItem = DropdownMenu.create(
  (props: MenuItemProps) => (
    <DropdownMenu.Item
      style={{ height: 34 }}
      {...props}
    />
  ),
  'Item'
)

// import {
//     DropdownMenuRoot,
//     DropdownMenuContent,
//     DropdownMenuTrigger,
//     DropdownMenuItem,
//     DropdownMenuItemTitle,
//   } from 'design-system/dropdown-menu'
export function ZeegoMenu() {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button title="Z T" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        color="dodgerblue"
        style={{ background: 'gray', color: 'white' }}
      >
        <DropdownMenuItem
          key="fernando rojo"
          color="blue"
          style={{ backgroundColor: 'teal', color: 'coral' }}
        >
          <DropdownMenu.ItemTitle
            color="purple"
            style={{ color: 'red', backgroundColor: 'greenyellow' }}
          >
            Fernando Rojo
          </DropdownMenu.ItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}
