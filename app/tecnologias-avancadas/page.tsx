"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Cpu,
  Eye,
  MessageSquare,
  Shield,
  Smartphone,
  Camera,
  Navigation,
  QrCode,
  Bot,
  Brain,
  Lock,
  MapPin,
  Users,
} from "lucide-react"
import { IoTDashboard } from "@/components/iot/iot-dashboard"
import { arService, type ARScene, type ARMarker, type NavigationRoute } from "@/lib/ar/ar-service"
import { conversationalAI } from "@/lib/ai/conversational-ai"
import { blockchainService } from "@/lib/blockchain/blockchain-service"

export default function TecnologiasAvancadas() {
  const [arSupported, setArSupported] = useState(false)
  const [arSessionActive, setArSessionActive] = useState(false)
  const [currentScene, setCurrentScene] = useState<ARScene | null>(null)
  const [arMarkers, setArMarkers] = useState<ARMarker[]>([])
  const [navigationRoute, setNavigationRoute] = useState<NavigationRoute | null>(null)
  const [qrScanResult, setQrScanResult] = useState<any>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [blockchainStats, setBlockchainStats] = useState(blockchainService.getBlockchainStats())

  useEffect(() => {
    // Verificar suporte AR ao carregar
    checkARSupport()
  }, [])

  const checkARSupport = async () => {
    const capabilities = arService.getARCapabilities()
    setArSupported(capabilities.isSupported)
  }

  const handleStartAR = async () => {
    const success = await arService.startARSession("school_map")
    if (success) {
      setArSessionActive(true)
      const scene = arService.getScene("school_map")
      if (scene) {
        setCurrentScene(scene)
        setArMarkers(scene.markers)
      }
    }
  }

  const handleStopAR = () => {
    arService.stopARSession()
    setArSessionActive(false)
    setCurrentScene(null)
    setArMarkers([])
    setNavigationRoute(null)
  }

  const handleStartNavigation = () => {
    const route = arService.generateNavigationRoute("entrada", "sala_101")
    setNavigationRoute(route)

    // Adicionar marcadores de navegação à cena
    if (currentScene) {
      route.steps.forEach((step, index) => {
        if (step.marker) {
          arService.addMarker(currentScene.id, step.marker)
        }
      })

      // Atualizar marcadores exibidos
      const updatedScene = arService.getScene(currentScene.id)
      if (updatedScene) {
        setArMarkers(updatedScene.markers)
      }
    }
  }

  const handleScanQR = async () => {
    const result = await arService.scanQRCode()
    setQrScanResult(result)
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return

    const response = await conversationalAI.processMessage("user_demo", chatMessage)
    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: chatMessage },
      { role: "assistant", content: response.content, suggestions: response.metadata?.suggestions },
    ])
    setChatMessage("")
  }

  const handleCreateBlockchainTransaction = async () => {
    await blockchainService.createTransaction("remanejamento", "user_demo", {
      professor: "João Silva",
      disciplina: "Matemática",
      sala: "101",
      horario: "14:00",
      motivo: "Demonstração Blockchain",
    })
    setBlockchainStats(blockchainService.getBlockchainStats())
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tecnologias Avançadas</h1>
          <p className="text-muted-foreground">IoT, Realidade Aumentada, IA Conversacional e Blockchain</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          🚀 Fase 3 - Vanguarda Tecnológica
        </Badge>
      </div>

      <Tabs defaultValue="iot" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="iot" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            IoT
          </TabsTrigger>
          <TabsTrigger value="ar" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Realidade Aumentada
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            IA Conversacional
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Blockchain
          </TabsTrigger>
        </TabsList>

        <TabsContent value="iot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Internet das Coisas (IoT)
              </CardTitle>
              <CardDescription>Monitoramento em tempo real de salas de aula com sensores inteligentes</CardDescription>
            </CardHeader>
          </Card>
          <IoTDashboard />
        </TabsContent>

        <TabsContent value="ar" className="space-y-4">
          {/* Status e Controles AR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Realidade Aumentada
                </CardTitle>
                <CardDescription>Navegação e visualização 3D da escola</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status AR:</span>
                    <Badge variant={arSessionActive ? "default" : "secondary"}>
                      {arSessionActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Suporte AR:</span>
                    <Badge variant={arSupported ? "default" : "destructive"}>
                      {arSupported ? "Suportado" : "Não Suportado"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={arSessionActive ? handleStopAR : handleStartAR}
                      variant={arSessionActive ? "destructive" : "default"}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {arSessionActive ? "Parar AR" : "Iniciar AR"}
                    </Button>

                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={handleStartNavigation}
                      disabled={!arSessionActive}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Navegação AR
                    </Button>

                    <Button className="w-full" variant="outline" onClick={handleScanQR} disabled={!arSessionActive}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Escanear QR Code
                    </Button>
                  </div>
                </div>

                {/* Informações da Sessão AR */}
                {arSessionActive && currentScene && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Sessão Ativa:</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>• Cena: {currentScene.name}</p>
                      <p>• Marcadores: {arMarkers.length}</p>
                      <p>• Navegação: {navigationRoute ? "Ativa" : "Inativa"}</p>
                    </div>
                  </div>
                )}

                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-medium mb-2">Funcionalidades AR:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Visualização 3D de salas</li>
                    <li>• Navegação com setas AR</li>
                    <li>• Informações em tempo real</li>
                    <li>• Escaneamento de QR Codes</li>
                    <li>• Marcadores interativos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Visualização AR */}
            <Card>
              <CardHeader>
                <CardTitle>Visualização AR</CardTitle>
                <CardDescription>Mapa da escola em realidade aumentada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200 relative overflow-hidden">
                  {arSessionActive ? (
                    <div className="w-full h-full relative">
                      {/* Simulação da câmera AR */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-50"></div>

                      {/* Marcadores AR */}
                      {arMarkers.map((marker, index) => (
                        <div
                          key={marker.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                          style={{
                            left: `${50 + marker.position.x * 10}%`,
                            top: `${50 + marker.position.z * 10}%`,
                          }}
                        >
                          <div className="bg-white rounded-lg shadow-lg p-2 border-2 border-blue-500 min-w-[120px]">
                            <div className="text-center">
                              <div className="text-lg mb-1">{marker.content.icon}</div>
                              <div className="text-xs font-medium">{marker.content.title}</div>
                              <div className="text-xs text-muted-foreground">{marker.type}</div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Indicador de sessão ativa */}
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                        🔴 AR ATIVO
                      </div>

                      {/* Controles AR */}
                      <div className="absolute bottom-2 right-2 space-x-2">
                        <Button size="sm" variant="secondary">
                          <MapPin className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Users className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <Smartphone className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="text-sm text-muted-foreground">Inicie uma sessão AR</p>
                      <p className="text-xs text-muted-foreground">Aponte a câmera para o ambiente</p>
                    </div>
                  )}
                </div>

                {/* Resultado do QR Code */}
                {qrScanResult && (
                  <Alert className="mt-4">
                    <QrCode className="h-4 w-4" />
                    <AlertDescription>
                      <strong>QR Code Detectado:</strong> {qrScanResult.data.name}
                      <br />
                      <span className="text-sm text-muted-foreground">
                        Capacidade: {qrScanResult.data.capacity} | Temperatura: {qrScanResult.data.iotData.temperature}
                        °C
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navegação e Marcadores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rota de Navegação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Navegação AR
                </CardTitle>
                <CardDescription>Rota ativa e instruções</CardDescription>
              </CardHeader>
              <CardContent>
                {navigationRoute ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">De: {navigationRoute.from}</span>
                      <span className="text-sm font-medium">Para: {navigationRoute.to}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Distância: {navigationRoute.totalDistance}m</span>
                      <span>Tempo: {navigationRoute.estimatedTime}s</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Instruções:</h4>
                      {navigationRoute.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded">
                          <div className="text-lg">{step.marker?.content.icon}</div>
                          <div className="flex-1">
                            <div className="text-sm">{step.instruction}</div>
                            <div className="text-xs text-muted-foreground">{step.distance}m</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" className="w-full" onClick={() => setNavigationRoute(null)}>
                      Finalizar Navegação
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Navigation className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Nenhuma rota ativa</p>
                    <p className="text-xs text-muted-foreground">Inicie a navegação AR para ver as instruções</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Marcadores Detectados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Marcadores AR
                </CardTitle>
                <CardDescription>Objetos detectados na cena</CardDescription>
              </CardHeader>
              <CardContent>
                {arMarkers.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {arMarkers.map((marker, index) => (
                      <div key={marker.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{marker.content.icon}</span>
                            <span className="font-medium text-sm">{marker.content.title}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {marker.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {marker.content.description.split("\n")[0]}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Posição: ({marker.position.x}, {marker.position.y}, {marker.position.z})
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Nenhum marcador detectado</p>
                    <p className="text-xs text-muted-foreground">Inicie uma sessão AR para ver os marcadores</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  IA Conversacional
                </CardTitle>
                <CardDescription>Assistente inteligente para gestão escolar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 border rounded-lg p-4 overflow-y-auto bg-muted/20">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="h-8 w-8 mx-auto mb-2" />
                      <p>Olá! Como posso ajudar você hoje?</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.role === "user" ? "bg-blue-500 text-white" : "bg-white border"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            {msg.suggestions && (
                              <div className="mt-2 space-y-1">
                                {msg.suggestions.map((suggestion: string, i: number) => (
                                  <Button
                                    key={i}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-6"
                                    onClick={() => setChatMessage(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Capacidades da IA
                </CardTitle>
                <CardDescription>Funcionalidades disponíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversationalAI.getCapabilities().map((capability, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{capability.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(capability.confidence * 100)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{capability.description}</p>
                      <div className="space-y-1">
                        {capability.examples.map((example, i) => (
                          <Button
                            key={i}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6 justify-start w-full"
                            onClick={() => setChatMessage(example)}
                          >
                            💡 {example}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Blockchain & Auditoria
                </CardTitle>
                <CardDescription>Sistema imutável de auditoria e transparência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{blockchainStats.totalBlocks}</p>
                    <p className="text-xs text-muted-foreground">Blocos</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{blockchainStats.totalTransactions}</p>
                    <p className="text-xs text-muted-foreground">Transações</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{blockchainStats.pendingTransactions}</p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{blockchainStats.averageBlockTime}s</p>
                    <p className="text-xs text-muted-foreground">Tempo Médio</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Integridade da Chain:</span>
                    <Badge variant={blockchainStats.chainValid ? "default" : "destructive"}>
                      {blockchainStats.chainValid ? "✓ Válida" : "✗ Inválida"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Último Bloco:</span>
                    <span className="text-muted-foreground">{blockchainStats.lastBlockTime.toLocaleTimeString()}</span>
                  </div>
                </div>

                <Button className="w-full" onClick={handleCreateBlockchainTransaction}>
                  <Lock className="h-4 w-4 mr-2" />
                  Criar Transação Demo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trilha de Auditoria</CardTitle>
                <CardDescription>Últimas transações registradas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {blockchainService
                    .getAuditTrail()
                    .slice(0, 5)
                    .map((audit, index) => (
                      <div key={index} className="border rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{audit.action}</span>
                          <Badge variant={audit.verified ? "default" : "destructive"} className="text-xs">
                            {audit.verified ? "✓" : "✗"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Usuário: {audit.user}</p>
                          <p>Bloco: #{audit.blockIndex}</p>
                          <p>{audit.timestamp.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
