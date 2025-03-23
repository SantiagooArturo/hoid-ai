"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart } from "lucide-react"

export default function AnalysisResults() {
  // This would be populated with real data in the actual implementation
  const [analysisData, setAnalysisData] = useState({
    transcription:
      "This is a placeholder for the transcribed audio content. In the actual implementation, this would contain the text converted from the recorded audio.",
    sentiment: {
      positive: 65,
      neutral: 25,
      negative: 10,
    },
    keywords: ["music", "conversation", "important", "meeting", "decision", "agreement"],
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transcription">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>

          <TabsContent value="transcription" className="mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md h-64 overflow-y-auto">
              <p className="text-gray-700 dark:text-gray-300">{analysisData.transcription}</p>
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md h-64 flex flex-col items-center justify-center">
              <PieChart className="h-24 w-24 mb-4 text-gray-400" />
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center">
                  <div className="text-green-500 font-bold text-xl">{analysisData.sentiment.positive}%</div>
                  <div className="text-sm text-gray-500">Positive</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-gray-500 font-bold text-xl">{analysisData.sentiment.neutral}%</div>
                  <div className="text-sm text-gray-500">Neutral</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-red-500 font-bold text-xl">{analysisData.sentiment.negative}%</div>
                  <div className="text-sm text-gray-500">Negative</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md h-64 flex flex-col items-center justify-center">
              <div className="flex flex-wrap gap-2 justify-center">
                {analysisData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

