'use client'

import { motion } from 'motion/react'

interface NumpadProps {
  onDigit: (d: string) => void
  onDelete: () => void
  /** Key height in px and gap between keys/rows in px — defaults match the
   *  original standalone numpad; AudioInputSheet's manual mode passes a
   *  smaller size so the whole pad fits its fixed-height sheet without
   *  scrolling. */
  keySize?: number
  gap?: number
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

export default function Numpad({ onDigit, onDelete, keySize = 60, gap = 14 }: NumpadProps) {
  const keyClass =
    'flex-1 rounded-card bg-white border border-hairline text-black font-semibold flex items-center justify-center active:bg-gray-100 transition-colors'
  const keyStyle = { height: keySize, fontSize: Math.round(keySize * 0.4) }
  const gapStyle = { gap }

  return (
    <div className="flex flex-col" style={gapStyle}>
      {ROWS.map((row) => (
        <div key={row.join('')} className="flex" style={gapStyle}>
          {row.map((d) => (
            <motion.button
              key={d}
              onClick={() => onDigit(d)}
              className={keyClass}
              style={keyStyle}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {d}
            </motion.button>
          ))}
        </div>
      ))}

      {/* Last row: empty · 0 · delete */}
      <div className="flex" style={gapStyle}>
        <div className="flex-1" style={{ height: keySize }} />
        <motion.button
          onClick={() => onDigit('0')}
          className={keyClass}
          style={keyStyle}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          0
        </motion.button>
        <motion.button
          onClick={onDelete}
          className="flex-1 rounded-card bg-white border border-hairline flex items-center justify-center active:bg-gray-100 transition-colors"
          style={{ height: keySize }}
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
