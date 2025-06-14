"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PredictionDashboard } from "@/components/ml/prediction-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, Target } from "lucide-react"

export default function MachineLearning() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Machine Learning</h1>
        <Badge variant="secondary">Fase 2 - IA Avançada</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Modelo Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <p className="text-xs text-muted-foreground">Precisão atual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Predições Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground">Conflitos previstos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alto Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">Professores em risco</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Prevenções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground">Conflitos evitados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="predictions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Predições</TabsTrigger>
          <TabsTrigger value="training">Treinamento</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions">
          <PredictionDashboard />
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Treinamento do Modelo
              </CardTitle>
              <CardDescription>Configure e monitore o treinamento do modelo de Machine Learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-medium mb-2">Modelo em Produção</h3>
                <p className="text-muted-foreground">
                  O modelo está funcionando perfeitamente. Retreinamento automático agendado para toda segunda-feira.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Insights da IA
              </CardTitle>
              <CardDescription>Padrões e tendências identificados pelo sistema de Machine Learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-medium mb-2">Análise Contínua</h3>
                <p className="text-muted-foreground">
                  A IA está constantemente analisando padrões e gerando insights para otimizar o sistema.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
