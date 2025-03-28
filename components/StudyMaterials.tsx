"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  Loader2, 
  Network, 
  ScrollText, 
  ListTree,
  Share2,
  Download,
  Lightbulb,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Copy
} from "lucide-react"

interface StudyMaterialsProps {
  transcription: string
  summary: string
}

interface Flashcard {
  id: number
  question: string
  answer: string
}

export default function StudyMaterials({ transcription, summary }: StudyMaterialsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mindMapContent, setMindMapContent] = useState("")
  const [flashcardsContent, setFlashcardsContent] = useState("")
  const [error, setError] = useState("")
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])

  const parseFlashcards = (content: string): Flashcard[] => {
    const cards = content.split('TARJETA').filter(card => card.trim())
    return cards.map((card, index) => {
      const [question, answer] = card.split('Respuesta:').map(str => str.replace('Pregunta:', '').trim())
      return {
        id: index + 1,
        question,
        answer: answer || ''
      }
    })
  }

  const generateContent = async (type: 'mindMap' | 'flashcards' | 'keyPoints' | 'diagrams' | 'memes') => {
    if (!transcription || !summary) {
      setError("Necesitas grabar y analizar una clase primero")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      setIsFlipped(false)
      setCurrentFlashcardIndex(0)

      const response = await fetch('/api/generate-study-material', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type,
          transcription,
          summary 
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al generar el contenido')
      }

      const data = await response.json()
      
      if (type === 'mindMap') {
        setMindMapContent(data.content)
      } else if (type === 'flashcards') {
        setFlashcardsContent(data.content)
        setFlashcards(parseFlashcards(data.content))
      } else {
        setFlashcardsContent(data.content)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar el contenido. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const nextFlashcard = () => {
    setIsFlipped(false)
    setCurrentFlashcardIndex((prev) => (prev + 1) % flashcards.length)
  }

  const prevFlashcard = () => {
    setIsFlipped(false)
    setCurrentFlashcardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const copyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // Podrías agregar un toast o notificación aquí
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  return (
    <Card className={`w-full ${isFullscreen ? 'fixed inset-4 z-50 overflow-auto' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-purple-500" />
          Materiales de Estudio Interactivos
          {(mindMapContent || flashcardsContent) && (
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="ml-auto">
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mindMap" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mindMap" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Mapas Mentales
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <ScrollText className="h-4 w-4" />
              Formatos de Estudio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mindMap" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualiza los conceptos clave de la clase en un mapa mental interactivo.
              </p>
              <div className="flex justify-between items-center gap-4">
                <Button
                  onClick={() => generateContent('mindMap')}
                  disabled={isLoading || !transcription}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando Mapa...
                    </>
                  ) : (
                    <>
                      <Network className="mr-2 h-4 w-4" />
                      Generar Mapa Mental
                    </>
                  )}
                </Button>
                {mindMapContent && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Copiar"
                      onClick={() => copyContent(mindMapContent)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" title="Compartir">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" title="Descargar">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {mindMapContent ? (
                <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-900/50 hover:shadow-lg transition-shadow">
                  <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">{mindMapContent}</pre>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {!transcription 
                    ? "Graba una clase primero para generar el mapa mental"
                    : "Genera un mapa mental para visualizar los conceptos"}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="flashcards" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                  onClick={() => generateContent('flashcards')}
                  disabled={isLoading || !transcription}
                >
                  <ScrollText className="h-6 w-6" />
                  <span className="font-medium">Fichas de Estudio</span>
                  <span className="text-xs text-gray-500">Estilo Anki</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                  onClick={() => generateContent('keyPoints')}
                  disabled={isLoading || !transcription}
                >
                  <ListTree className="h-6 w-6" />
                  <span className="font-medium">Puntos Clave</span>
                  <span className="text-xs text-gray-500">Lista organizada</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                  onClick={() => generateContent('diagrams')}
                  disabled={isLoading || !transcription}
                >
                  <Network className="h-6 w-6" />
                  <span className="font-medium">Diagramas</span>
                  <span className="text-xs text-gray-500">Visualización gráfica</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors"
                  onClick={() => generateContent('memes')}
                  disabled={isLoading || !transcription}
                >
                  <Sparkles className="h-6 w-6" />
                  <span className="font-medium">Memes Educativos</span>
                  <span className="text-xs text-gray-500">Aprendizaje divertido</span>
                </Button>
              </div>

              {flashcards.length > 0 && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Fichas de Estudio</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" title="Copiar" onClick={() => copyContent(flashcardsContent)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Compartir">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Descargar">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <div 
                      className={`min-h-[200px] p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-lg cursor-pointer transform transition-all duration-500 ${
                        isFlipped ? 'rotate-y-180' : ''
                      }`}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <div className={`absolute inset-0 backface-hidden ${!isFlipped ? '' : 'hidden'}`}>
                        <div className="p-6">
                          <div className="text-sm text-gray-500 mb-2">Pregunta {currentFlashcardIndex + 1} de {flashcards.length}</div>
                          <div className="text-lg font-medium">{flashcards[currentFlashcardIndex]?.question}</div>
                          <div className="text-sm text-gray-500 mt-4">Click para ver la respuesta</div>
                        </div>
                      </div>
                      <div className={`absolute inset-0 backface-hidden ${isFlipped ? '' : 'hidden'}`}>
                        <div className="p-6">
                          <div className="text-sm text-gray-500 mb-2">Respuesta {currentFlashcardIndex + 1} de {flashcards.length}</div>
                          <div className="text-lg">{flashcards[currentFlashcardIndex]?.answer}</div>
                          <div className="text-sm text-gray-500 mt-4">Click para ver la pregunta</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button onClick={prevFlashcard} variant="outline">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Anterior
                      </Button>
                      <Button onClick={nextFlashcard} variant="outline">
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {flashcardsContent && !flashcards.length && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Material Generado</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" title="Copiar" onClick={() => copyContent(flashcardsContent)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Compartir">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Descargar">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-900/50 hover:shadow-lg transition-shadow">
                    <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">{flashcardsContent}</pre>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 