"use client"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface SaveButtonProps {
  onSave: () => void
}

export function SaveButton({ onSave }: SaveButtonProps) {
  return (
    <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg" size="sm">
      <Save className="w-4 h-4 mr-2" />
      Save Changes
    </Button>
  )
}
