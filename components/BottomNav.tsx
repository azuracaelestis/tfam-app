const ITEMS = [
  {
    label: 'Home',
    path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  },
  {
    label: 'Map',
    path: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z',
  },
  {
    label: 'Events',
    path: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z',
  },
  {
    label: 'Route',
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  },
  {
    label: 'Tour',
    path: 'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 3.75.4 5 1.5 1.35-1.1 3.45-1.5 5.5-1.5 1.55 0 3.15.35 4.5 1.15.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-1-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-2.05 0-4.15.4-5.5 1.5V8c1.35-1.1 3.45-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z',
  },
]

export default function BottomNav({ active = 0 }: { active?: number }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-tfam-border flex z-40">
      {ITEMS.map((item, i) => (
        <div
          key={item.label}
          className="flex-1 flex flex-col items-center py-2 gap-0.5"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill={i === active ? '#D62027' : '#9CA3AF'}
            aria-hidden="true"
          >
            <path d={item.path} />
          </svg>
          <span
            className={`text-[10px] leading-tight ${
              i === active ? 'text-tfam-red font-medium' : 'text-gray-400'
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  )
}
