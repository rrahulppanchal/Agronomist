"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Trash2, Plus } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ImageUploadProps {
  images: File[]
  setImages: (images: File[]) => void
}

export function ImageUpload({ images, setImages }: ImageUploadProps) {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    if (files.length > 0) {
      setImages([...images, ...files].slice(0, 3))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages([...images, ...files].slice(0, 3))
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Camera className="w-10 h-10 mx-auto mb-3 text-gray-400" />
        <p className="font-semibold text-gray-900">{t.imageUpload.title}</p>
        <p className="text-sm text-gray-600 mt-1">
          {t.imageUpload.dragDrop}{" "}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-green-600 font-semibold hover:underline"
          >
            {t.imageUpload.clickSelect}
          </button>
        </p>
        <p className="text-xs text-gray-500 mt-2">{t.imageUpload.limit}</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, idx) => (
            <div key={idx} className="relative group">
              <img
                src={URL.createObjectURL(image) || "/placeholder.svg"}
                alt={`Upload ${idx + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-600 mt-1 text-center">{image.name}</p>
            </div>
          ))}
          {images.length < 3 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-24 hover:border-green-500 hover:bg-green-50 transition"
            >
              <Plus className="w-6 h-6 text-gray-400" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
