import { useLanguage } from "@/contexts/language-context"

export function AnalyzingLoader() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 border-r-green-600 animate-spin"
            style={{ animation: "spin 2s linear infinite" }}
          />
          {/* Middle pulsing ring */}
          <div className="absolute inset-2 rounded-full border-2 border-green-200 animate-pulse" />
          {/* Inner leaf icon */}
          <div className="relative w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 text-center">{t.analyzing.title}</h3>
        <p className="text-gray-600 text-center mt-2 max-w-sm">
          {t.analyzing.description}
        </p>

        {/* Progress indicators */}
        <div className="mt-8 space-y-3 w-full max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <p className="text-sm text-gray-600">{t.analyzing.step1}</p>
          </div>
          <div className="flex items-center gap-3 animation-delay-100">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: "0.33s" }} />
            <p className="text-sm text-gray-600">{t.analyzing.step2}</p>
          </div>
          <div className="flex items-center gap-3 animation-delay-200">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: "0.66s" }} />
            <p className="text-sm text-gray-600">{t.analyzing.step3}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
