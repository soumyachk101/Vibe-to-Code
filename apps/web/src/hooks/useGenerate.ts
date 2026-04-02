import { useNavigate } from 'react-router-dom'
import { generateAPI } from '../api/client'
import { useDesignSystemStore } from '../store/designSystem.store'

export function useGenerate() {
  const { setSystem, setGenerating, setError } = useDesignSystemStore()
  const navigate = useNavigate()

  return {
    generate: async (input: { vibe: string; tags?: string[]; theme?: string; industry?: string }) => {
      setGenerating(true)
      try {
        const data = await generateAPI(input)
        setSystem(data.design_system)
        navigate('/result')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Generation failed')
      }
    },
    isLoading: useDesignSystemStore(s => s.isGenerating),
    error: useDesignSystemStore(s => s.error),
  }
}
