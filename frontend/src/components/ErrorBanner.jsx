/**
 * ErrorBanner – dismissible error message strip.
 */
export default function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-red-600 bg-red-50 animate-fade-in"
         style={{ boxShadow: '3px 3px 0 0 #dc2626' }}
         role="alert">
      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none"
           stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <p className="text-sm font-bold text-red-700 flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 font-black text-lg leading-none
                     transition-colors duration-150 flex-shrink-0 ml-2"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  )
}
