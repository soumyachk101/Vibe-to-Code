import { create } from 'zustand'
import type { DesignSystem } from '@vibe-to-code/shared'

interface State {
  current: DesignSystem | null
  isGenerating: boolean
  error: string | null
  setSystem: (s: DesignSystem) => void
  setGenerating: (v: boolean) => void
  setError: (e: string | null) => void
}

export const useDesignSystemStore = create<State>((set) => ({
  current: null,
  isGenerating: false,
  error: null,
  setSystem: (system) => set({ current: system, isGenerating: false, error: null }),
  setGenerating: (v) => set({ isGenerating: v }),
  setError: (e) => set({ error: e, isGenerating: false }),
}))
