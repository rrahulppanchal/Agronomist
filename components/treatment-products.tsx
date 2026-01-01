"use client"

import { ShoppingCart } from "lucide-react"

interface TreatmentProductsProps {
  treatments: {
    organic: string[]
    chemical: string[]
  }
}

export function TreatmentProducts({ treatments }: TreatmentProductsProps) {
  const allProducts = [
    {
      name: "Neem Oil",
      category: "organic",
      icon: "🌿",
      description: "Natural insecticide and fungicide",
    },
    {
      name: "Sulfur Dust",
      category: "organic",
      icon: "💛",
      description: "Effective against mites and fungi",
    },
    {
      name: "Copper Fungicide",
      category: "chemical",
      icon: "🧪",
      description: "Broad-spectrum fungicide",
    },
    {
      name: "Systemic Pesticide",
      category: "chemical",
      icon: "💊",
      description: "Internal plant protection",
    },
  ]

  const relevantProducts = allProducts.filter((p) =>
    treatments.organic.concat(treatments.chemical).some((t) => t.toLowerCase().includes(p.name.toLowerCase())),
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {relevantProducts.length > 0
        ? relevantProducts.map((product) => (
            <div key={product.name} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{product.icon}</span>
                <button className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          ))
        : null}
    </div>
  )
}
