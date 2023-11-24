import { EventHandler } from '@create-figma-plugin/utilities'

export interface ResizeWindowHandlerInterface extends EventHandler {
  name: 'RESIZE_WINDOW'
  handler: (windowSize: { width: number; height: number }) => void
}

export type ResizeWindowHandler = ResizeWindowHandlerInterface