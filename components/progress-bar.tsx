interface ProgressBarProps {
  value: number
  label?: string
  color?: "green" | "yellow" | "red"
}

export function ProgressBar({ value, label, color = "green" }: ProgressBarProps) {
  const colorClasses = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className={`${colorClasses[color]} h-3 rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
      <p className="text-sm text-gray-600 text-right">{value}%</p>
    </div>
  )
}
