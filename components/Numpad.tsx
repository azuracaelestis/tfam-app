'use client'

interface NumpadProps {
  onDigit: (d: string) => void
  onDelete: () => void
  onQR: () => void
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
]

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-tfam-dark" aria-hidden="true">
      <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z" />
    </svg>
  )
}

function QRIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-tfam-mid" aria-hidden="true">
      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zm2 2h2v2h-2zm2-2h2v2h-2zm-2 4h2v2h-2zm2 0h2v2h-2zm2-2h2v2h-2zm-4 2h-2v2h2v-2zm2 2v2h2v-2h-2z" />
    </svg>
  )
}

export default function Numpad({ onDigit, onDelete, onQR }: NumpadProps) {
  return (
    <div className="flex flex-col gap-2">
      {ROWS.map((row) => (
        <div key={row.join('')} className="flex gap-2">
          {row.map((d) => (
            <button
              key={d}
              onClick={() => onDigit(d)}
              className="flex-1 h-14 rounded-2xl bg-tfam-light text-tfam-dark text-xl font-medium active:bg-gray-200 transition-colors"
            >
              {d}
            </button>
          ))}
        </div>
      ))}
      <div className="flex gap-2">
        <button
          onClick={onQR}
          className="flex-1 h-14 rounded-2xl bg-tfam-light flex items-center justify-center active:bg-gray-200 transition-colors"
          aria-label="Scan QR code"
        >
          <QRIcon />
        </button>
        <button
          onClick={() => onDigit('0')}
          className="flex-1 h-14 rounded-2xl bg-tfam-light text-tfam-dark text-xl font-medium active:bg-gray-200 transition-colors"
        >
          0
        </button>
        <button
          onClick={onDelete}
          className="flex-1 h-14 rounded-2xl bg-tfam-light flex items-center justify-center active:bg-gray-200 transition-colors"
          aria-label="Delete digit"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  )
}
