"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Thermometer,
  Users,
  Volume2,
  Wind,
  Lightbulb,
  Battery,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react"
import { iotService } from "@/lib/iot/iot-service"

export function IoTDashboard() {
  const [devices, setDevices] = useState(iotService.getDevices())
  const [classrooms, setClassrooms] = useState(iotService.getSmartClassrooms())
  const [systemHealth, setSystemHealth] = useState(iotService.getSystemHealth())
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(iotService.getDevices())
      setClassrooms(iotService.getSmartClassrooms())
      setSystemHealth(iotService.getSystemHealth())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <Thermometer className="h-4 w-4" />
      case "occupancy":
        return <Users className="h-4 w-4" />
      case "noise":
        return <Volume2 className="h-4 w-4" />
      case "air_quality":
        return <Wind className="h-4 w-4" />
      case "lighting":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getQualityColor = (isOptimal: boolean) => {
    return isOptimal ? "text-green-600" : "text-red-600"
  }

  const handleOptimizeClassroom = async (classroomId: string) => {
    setSelectedClassroom(classroomId)
    const success = await iotService.optimizeClassroom(classroomId)
    if (success) {
      setClassrooms(iotService.getSmartClassrooms())
    }
    setSelectedClassroom(null)
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dispositivos Online</p>
                <p className="text-2xl font-bold">
                  {systemHealth.onlineDevices}/{systemHealth.totalDevices}
                </p>
              </div>
              <Wifi className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas Críticos</p>
                <p className="text-2xl font-bold text-red-600">{systemHealth.criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bateria Baixa</p>
                <p className="text-2xl font-bold text-yellow-600">{systemHealth.batteryLow}</p>
              </div>
              <Battery className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold text-green-600">{systemHealth.uptime}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classrooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classrooms">Salas Inteligentes</TabsTrigger>
          <TabsTrigger value="devices">Dispositivos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="classrooms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.map((classroom) => (
              <Card key={classroom.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{classroom.name}</CardTitle>
                    <Badge variant={classroom.isOptimal ? "default" : "destructive"}>
                      {classroom.isOptimal ? "Ótimo" : "Atenção"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {classroom.currentOccupancy}/{classroom.capacity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      <span>{classroom.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <span>{classroom.noiseLevel.toFixed(0)} dB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4" />
                      <span>{classroom.airQuality.toFixed(0)} ppm</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ocupação</span>
                      <span>{Math.round((classroom.currentOccupancy / classroom.capacity) * 100)}%</span>
                    </div>
                    <Progress value={(classroom.currentOccupancy / classroom.capacity) * 100} />
                  </div>

                  {classroom.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Recomendações:</p>
                      <ul className="text-xs space-y-1">
                        {classroom.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handleOptimizeClassroom(classroom.id)}
                    disabled={selectedClassroom === classroom.id}
                  >
                    {selectedClassroom === classroom.id ? "Otimizando..." : "Otimizar Ambiente"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <Card key={device.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <CardTitle className="text-base">{device.location}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
                      <span className="text-xs text-muted-foreground capitalize">{device.status}</span>
                    </div>
                  </div>
                  <CardDescription className="capitalize">{device.type.replace("_", " ")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {device.lastReading.toFixed(device.type === "occupancy" ? 0 : 1)}
                    </span>
                    <span className="text-sm text-muted-foreground">{device.unit}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: {device.threshold.min}</span>
                      <span>Max: {device.threshold.max}</span>
                    </div>
                    <Progress
                      value={
                        ((device.lastReading - device.threshold.min) / (device.threshold.max - device.threshold.min)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  {device.battery && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4" />
                        <span>Bateria</span>
                      </div>
                      <span className={device.battery < 20 ? "text-red-600" : "text-green-600"}>{device.battery}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics IoT</CardTitle>
              <CardDescription>Análise detalhada dos dados dos sensores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4" />
                <p>Analytics avançados em desenvolvimento</p>
                <p className="text-sm">Gráficos históricos, tendências e previsões</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
