'use client'

import { Download } from "lucide-react"
import { exportToCsv } from "@/utils/export-csv"
import { Button } from "@/components/ui/button"

export default function ExportCsvButton({ data, filename = "data.csv" }: { data: any[], filename?: string }) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => exportToCsv(filename, data)}
      className="flex items-center gap-2 font-bold text-slate-700 bg-white hover:bg-slate-50 border-slate-200"
    >
      <Download className="w-4 h-4" />
      Export Data
    </Button>
  )
}
