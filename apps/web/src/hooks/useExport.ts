import { useState } from 'react'
import { exportAPI } from '../api/client'
import { saveAs } from 'file-saver'

const EXTS: Record<string, string> = { css: '.css', tailwind: '.js', tokens: '.json', figma: '.json', react: '.tsx' }

export function useExport() {
  const [isExporting, setIsExporting] = useState(false)

  return {
    isExporting,
    download: async (system: unknown, format: string, title: string) => {
      setIsExporting(true)
      try {
        const { code, filename } = await exportAPI(system, format)
        const name = `vibe-${title.toLowerCase().replace(/\s/g, '-')}${EXTS[format] || '.txt'}`
        saveAs(new Blob([code], { type: 'text/plain' }), name)
      } finally {
        setIsExporting(false)
      }
    },
  }
}
