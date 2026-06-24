const CARDS = [
  {
    label: 'Floor Map',
    path: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    label: "What's On",
    path: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z',
    bg: 'bg-amber-50',
    color: 'text-amber-600',
  },
  {
    label: 'Suggested Route',
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    bg: 'bg-green-50',
    color: 'text-green-600',
  },
  {
    label: 'Book Tour',
    path: 'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 3.75.4 5 1.5 1.35-1.1 3.45-1.5 5.5-1.5 1.55 0 3.15.35 4.5 1.15.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-1-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-2.05 0-4.15.4-5.5 1.5V8c1.35-1.1 3.45-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z',
    bg: 'bg-purple-50',
    color: 'text-purple-600',
  },
]

export default function HomeCards() {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {CARDS.map((card) => (
        <div key={card.label} className={`${card.bg} rounded-2xl p-4 flex flex-col gap-3`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white`}>
            <svg viewBox="0 0 24 24" className={`w-5 h-5 ${card.color}`} fill="currentColor">
              <path d={card.path} />
            </svg>
          </div>
          <span className="text-sm font-medium text-tfam-dark leading-tight">{card.label}</span>
        </div>
      ))}
    </div>
  )
}
