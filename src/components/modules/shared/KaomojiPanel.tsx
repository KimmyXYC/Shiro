'use client'

import { useEffect, useState } from 'react'
import markdownEscape from 'markdown-escape'
import type { FC, PropsWithChildren } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { ScrollArea } from '~/components/ui/scroll-area'
import { PresentSheet } from '~/components/ui/sheet'

import { KAOMOJI_LIST } from '../dashboard/comments/kaomoji'

export const KaomojiPanel: FC<
  {
    to?: HTMLElement
    inputRef:
      | React.RefObject<HTMLTextAreaElement>
      | React.RefObject<HTMLInputElement>

    open?: boolean
    onOpenChange?: (open: boolean) => void
  } & PropsWithChildren
> = ({ to, inputRef, onOpenChange, open, children }) => {
  const KaomojiContentEl = (
    <ScrollArea.ScrollArea rootClassName="pointer-events-auto h-[250px] w-auto lg:h-[200px] lg:w-[400px]">
      <div className="grid grid-cols-4 gap-4">
        {KAOMOJI_LIST.map((kamoji) => {
          return (
            <MotionButtonBase
              key={kamoji}
              onClick={() => {
                const $ta = inputRef.current!
                $ta.focus()

                requestAnimationFrame(() => {
                  const start = $ta.selectionStart as number
                  const end = $ta.selectionEnd as number
                  const escapeKaomoji = markdownEscape(kamoji)
                  $ta.value = `${$ta.value.substring(
                    0,
                    start,
                  )} ${escapeKaomoji} ${$ta.value.substring(
                    end,
                    $ta.value.length,
                  )}`

                  requestAnimationFrame(() => {
                    const shouldMoveToPos = start + escapeKaomoji.length + 2
                    $ta.selectionStart = shouldMoveToPos
                    $ta.selectionEnd = shouldMoveToPos

                    $ta.focus()
                  })
                })
              }}
            >
              {kamoji}
            </MotionButtonBase>
          )
        })}
      </div>
    </ScrollArea.ScrollArea>
  )

  const [kaomojiPanelOpen, setKaomojiPanelOpen] = useState(open || false)

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(kaomojiPanelOpen)
    }
  }, [kaomojiPanelOpen, onOpenChange])

  const KaomojiButton = children ?? (
    <MotionButtonBase>
      <i className="icon-[mingcute--emoji-line]" />
    </MotionButtonBase>
  )

  const isMobile = useIsMobile()

  return (
    <>
      {isMobile ? (
        <PresentSheet
          onOpenChange={setKaomojiPanelOpen}
          content={KaomojiContentEl}
          zIndex={1002}
        >
          {KaomojiButton}
        </PresentSheet>
      ) : (
        <FloatPopover
          onClose={() => {
            setKaomojiPanelOpen(false)
          }}
          onOpen={() => {
            setKaomojiPanelOpen(true)
          }}
          placement="left-end"
          trigger="click"
          to={to}
          triggerElement={KaomojiButton as any}
        >
          {KaomojiContentEl}
        </FloatPopover>
      )}
    </>
  )
}
