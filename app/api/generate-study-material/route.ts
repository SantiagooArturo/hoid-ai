import { NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { type, transcription, summary } = await request.json()

    if (!type || !['mindMap', 'flashcards', 'keyPoints', 'diagrams', 'memes'].includes(type)) {
      return NextResponse.json(
        { error: 'Se requiere especificar un tipo válido de material' },
        { status: 400 }
      )
    }

    if (!transcription || !summary) {
      return NextResponse.json(
        { error: 'Se requiere la transcripción y el resumen de la clase' },
        { status: 400 }
      )
    }

    const prompts = {
      mindMap: `Basándote en esta transcripción de clase: "${transcription}"
         
         Y este resumen: "${summary}"

         Genera un mapa mental detallado que incluya:
         1. Tema central de la clase
         2. Conceptos principales (3-5)
         3. Subconceptos y detalles importantes para cada concepto principal
         4. Relaciones entre conceptos cuando sea relevante
         
         Formatea el mapa mental usando caracteres ASCII (─ │ ├ └ etc.) para crear una estructura visual clara.
         Usa sangría y símbolos para mostrar jerarquía y relaciones.`,

      flashcards: `Basándote en esta transcripción de clase: "${transcription}"
         
         Y este resumen: "${summary}"

         Genera un conjunto de 5-7 tarjetas de estudio estilo Anki que incluyan:
         1. Pregunta clara y concisa en el frente
         2. Respuesta completa pero concisa en el reverso
         3. Mezcla de preguntas conceptuales y prácticas
         
         Formatea cada tarjeta así:
         
         TARJETA #
         Pregunta: [pregunta]
         Respuesta: [respuesta]`,

      keyPoints: `Basándote en esta transcripción de clase: "${transcription}"
         
         Y este resumen: "${summary}"

         Genera una lista organizada de puntos clave que incluya:
         1. Conceptos fundamentales (3-4)
         2. Definiciones importantes (2-3)
         3. Ejemplos prácticos (2-3)
         4. Puntos a recordar (2-3)
         
         Usa viñetas y categorías claras para organizar la información.`,

      diagrams: `Basándote en esta transcripción de clase: "${transcription}"
         
         Y este resumen: "${summary}"

         Genera una representación visual usando ASCII art que incluya:
         1. Diagrama principal del concepto central
         2. Flechas y líneas para mostrar relaciones
         3. Etiquetas claras para cada elemento
         4. Notas explicativas breves
         
         Usa caracteres ASCII para crear diagramas claros y legibles.`,

      memes: `Basándote en esta transcripción de clase: "${transcription}"
         
         Y este resumen: "${summary}"

         Genera 3-4 conceptos de memes educativos que incluyan:
         1. Situación o formato del meme
         2. Texto superior e inferior
         3. Explicación del concepto que ilustra
         4. Por qué es memorable o divertido
         
         Mantén un tono educativo pero entretenido.
         Formatea cada meme claramente separado.`
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompts[type]
        }
      ]
    })

    return NextResponse.json({ content: message.content[0].text })
  } catch (error) {
    console.error('Error al generar el material de estudio:', error)
    return NextResponse.json(
      { error: 'Error al generar el material' },
      { status: 500 }
    )
  }
} 