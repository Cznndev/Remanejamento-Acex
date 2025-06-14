"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Brain, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { MLPredictionEngine } from "@/lib/ml/prediction-engine"
import { useToast } from "@/hooks/use-toast"

export function PredictionDashboard() {
  const [predictions, setPredictions] = useState<any[]>([])
  const [modelStatus, setModelStatus] = useState<any>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const mlEngine = MLPredictionEngine.getInstance()
  const { toast } = useToast()

  useEffect(() => {
    loadModelStatus()
    loadPredictions()
  }, [])

  const loadModelStatus = () => {
    const status = mlEngine.getModelStatus()
    setModelStatus(status)
  }

  const loadPredictions = async () => {
    setIsGenerating(true)
    try {
      const weeklyPredictions = await mlEngine.generateWeeklyPredictions()
      setPredictions(weeklyPredictions)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar predições",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const trainModel = async () => {
    setIsTraining(true)
    try {
      await mlEngine.trainModel()
      loadModelStatus()
      toast({
        title: "Modelo treinado!",
        description: "O modelo de IA foi retreinado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro no treinamento",
        description: "Erro ao treinar o modelo",
        variant: "destructive",
      })
    } finally {
      setIsTraining(false)
    }
  }

  const getRiskColor = (risco: string) => {
    switch (risco) {
      case "alto":
        return "destructive"
      case "medio":
        return "secondary"
      case "baixo":
        return "outline"
      default:
        return "outline"
    }
  }

  const getRiskIcon = (risco: string) => {
    switch (risco) {
      case "alto":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "medio":
        return <TrendingUp className="h-4 w-4 text-yellow-600" />
      case "baixo":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Predições de IA</h2>
          <p className="text-muted-foreground">Sistema de Machine Learning para prevenção de conflitos</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadPredictions} disabled={isGenerating} variant="outline">
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar Predições
              </>
            )}
          </Button>
          <Button onClick={trainModel} disabled={isTraining}>
            {isTraining ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Treinando...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Treinar Modelo
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status do Modelo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status do Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Ativo</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Padrões Analisados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelStatus?.patternsCount || 0}</div>
            <p className="text-xs text-muted-foreground">professores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Precisão Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {modelStatus ? (modelStatus.averageAccuracy * 100).toFixed(1) : 0}%
            </div>
            <Progress value={modelStatus ? modelStatus.averageAccuracy * 100 : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Último Treinamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {modelStatus?.lastTraining ? modelStatus.lastTraining.toLocaleDateString("pt-BR") : "Nunca"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predições da Semana */}
      <Card>
        <CardHeader>
          <CardTitle>Predições da Semana</CardTitle>
          <CardDescription>Professores com maior probabilidade de ausência nos próximos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Probabilidade</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((prediction, index) => (
                <TableRow key={index}>
                  <TableCell>{prediction.data}</TableCell>
                  <TableCell className="font-medium">{prediction.professor}</TableCell>
                  <TableCell>{prediction.disciplina}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{(prediction.probabilidade * 100).toFixed(1)}%</span>
                      <Progress value={prediction.probabilidade * 100} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskColor(prediction.risco)} className="flex items-center gap-1 w-fit">
                      {getRiskIcon(prediction.risco)}
                      {prediction.risco}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Prevenir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Insights da IA */}
      <Card>
        <CardHeader>
          <CardTitle>Insights da IA</CardTitle>
          <CardDescription>Padrões identificados pelo sistema de Machine Learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Padrões Identificados</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Sextas-feiras têm 40% mais ausências</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Dias chuvosos aumentam ausências em 25%</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Períodos matutinos são mais estáveis</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Recomendações</h4>
              <div className="space-y-2">
                <div className="p-2 border rounded text-sm">
                  💡 Considere ter professores substitutos sempre disponíveis às sextas-feiras
                </div>
                <div className="p-2 border rounded text-sm">
                  🌧️ Monitore previsão do tempo e prepare contingências para dias chuvosos
                </div>
                <div className="p-2 border rounded text-sm">⏰ Priorize aulas importantes no período matutino</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
