import { Header } from "@/components/header"
import { DiagnosisHistoryList } from "@/components/diagnosis-history-list"

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Diagnosis History</h1>
          <p className="text-gray-600">View all your crop diagnosis records and treatment recommendations</p>
        </div>
        <DiagnosisHistoryList />
      </main>
    </div>
  )
}
