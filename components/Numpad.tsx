'use client'

import { motion } from 'motion/react'

interface NumpadProps {
  onDigit: (d: string) => void
  onDelete: () => void
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
]

function DeleteIcon() {
  return (
    <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8.5 1H21C21.5523 1 22 1.44772 22 2V15C22 15.5523 21.5523 16 21 16H8.5L1.5 8.5L8.5 1Z" stroke="#111111" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M14 5.5L10 11.5M10 5.5L14 11.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function Numpad({ onDigit, onDelete }: NumpadProps) {
  const keyClass =
    'flex-1 h-[60px] rounded-2xl bg-white border border-[#d9d9d9] text-black text-[24px] font-semibold flex items-center justify-center active:bg-gray-100 transition-colors'

  return (
    <div className="flex flex-col gap-[14px]">
      {ROWS.map((row) => (
        <div key={row.join('')} className="flex gap-[14px]">
          {row.map((d) => (
            <motion.button
              key={d}
              onClick={() => onDigit(d)}
              className={keyClass}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {d}
            </motion.button>
          ))}
        </div>
      ))}

      {/* Last row: empty · 0 · delete */}
      <div className="flex gap-[14px]">
        <div className="flex-1 h-[60px]" />
        <motion.button
          onClick={() => onDigit('0')}
          className={keyClass}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          0
        </motion.button>
        <motion.button
          onClick={onDelete}
          className="flex-1 h-[60px] rounded-2xl bg-white border border-[#d9d9d9] flex items-center justify-center active:bg-gray-100 transition-colors"
          aria-label="Delete digit"
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <DeleteIcon />
        </motion.button>
      </div>
    </div>
  )
}
