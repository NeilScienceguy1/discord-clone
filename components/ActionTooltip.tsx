"use client"
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

interface Props {
    label: string
    children: React.ReactNode
    side?: "top" | "bottom" | "left" | "right"
    align? : "start" | "center" | "end"
}

const ActionTooltip = (props: Props) => {
  return (
    <TooltipProvider>
        <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
                {props.children}
            </TooltipTrigger>
            <TooltipContent side={props.side} align={props.align}>
                <p className='font-semibold text-sm capitalize'>{props.label}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default ActionTooltip