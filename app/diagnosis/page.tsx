import { Header } from "@/components/header"
import { DiagnosisForm } from "@/components/diagnosis-form"
import { RecentDiagnoses } from "@/components/recent-diagnoses"

export default function DiagnosisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            <DiagnosisForm />
          </div>
          {/* <aside className="lg:col-span-1">
            <RecentDiagnoses />
          </aside> */}
        </div>
      </main>
    </div>
  )
}
