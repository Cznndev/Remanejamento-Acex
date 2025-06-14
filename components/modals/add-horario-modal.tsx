"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

interface Periodo {
  periodo: string
  inicio: string
  fim: string
  duracao: number
}

interface Horario {
  turno: string
  periodos: Periodo[]
}

interface AddHorarioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (horario: Horario) => void
}

export function AddHorarioModal({ open, onOpenChange, onAdd }: AddHorarioModalProps) {
  const [formData, setFormData] = useState({
    turno: "",
    periodos: [] as Periodo[],
  })
  const [novoPeriodo, setNovoPeriodo] = useState({
    periodo: "",
    inicio: "",
    fim: "",
    duracao: "50",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const turnos = ["Manhã", "Tarde", "Noite", "Integral"]
  const tiposPeriodo = [
    "1º Período",
    "2º Período",
    "3º Período",
    "4º Período",
    "5º Período",
    "6º Período",
    "Intervalo",
    "Almoço",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.turno || formData.periodos.length === 0) {
      alert("Por favor, selecione um turno e adicione pelo menos um período!")
      return
    }

    setIsSubmitting(true)

    try {
      // Simular delay de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const novoHorario: Horario = {
        turno: formData.turno,
        periodos: formData.periodos,
      }

      onAdd(novoHorario)
      onOpenChange(false)

      // Reset form
      setFormData({
        turno: "",
        periodos: [],
      })
      setNovoPeriodo({
        periodo: "",
        inicio: "",
        fim: "",
        duracao: "50",
      })

      alert(`Horário do turno "${formData.turno}" adicionado com sucesso!`)
    } catch (error) {
      alert("Erro ao adicionar horário. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const adicionarPeriodo = () => {
    if (!novoPeriodo.periodo || !novoPeriodo.inicio || !novoPeriodo.fim) {
      alert("Por favor, preencha todos os campos do período!")
      return
    }

    const periodo: Periodo = {
      periodo: novoPeriodo.periodo,
      inicio: novoPeriodo.inicio,
      fim: novoPeriodo.fim,
      duracao: Number.parseInt(novoPeriodo.duracao),
    }

    setFormData((prev) => ({
      ...prev,
      periodos: [...prev.periodos, periodo],
    }))

    // Reset novo período
    setNovoPeriodo({
      periodo: "",
      inicio: "",
      fim: "",
      duracao: "50",
    })
  }

  const removerPeriodo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      periodos: prev.periodos.filter((_, i) => i !== index),
    }))
  }

  const calcularDuracao = () => {
    if (novoPeriodo.inicio && novoPeriodo.fim) {
      const [horaInicio, minutoInicio] = novoPeriodo.inicio.split(":").map(Number)
      const [horaFim, minutoFim] = novoPeriodo.fim.split(":").map(Number)

      const inicioMinutos = horaInicio * 60 + minutoInicio
      const fimMinutos = horaFim * 60 + minutoFim

      const duracao = fimMinutos - inicioMinutos

      if (duracao > 0) {
        setNovoPeriodo((prev) => ({ ...prev, duracao: duracao.toString() }))
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Horário</DialogTitle>
          <DialogDescription>Configure os períodos de aula para um turno</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="turno">Turno *</Label>
            <Select
              onValueChange={(value) => setFormData((prev) => ({ ...prev, turno: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o turno" />
              </SelectTrigger>
              <SelectContent>
                {turnos.map((turno) => (
                  <SelectItem key={turno} value={turno}>
                    {turno}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Adicionar Novo Período */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Adicionar Período</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodo">Período</Label>
                <Select
                  value={novoPeriodo.periodo}
                  onValueChange={(value) => setNovoPeriodo((prev) => ({ ...prev, periodo: value }))}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposPeriodo.map((periodo) => (
                      <SelectItem key={periodo} value={periodo}>
                        {periodo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (min)</Label>
                <Input
                  id="duracao"
                  type="number"
                  value={novoPeriodo.duracao}
                  onChange={(e) => setNovoPeriodo((prev) => ({ ...prev, duracao: e.target.value }))}
                  min="10"
                  max="120"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inicio">Início</Label>
                <Input
                  id="inicio"
                  type="time"
                  value={novoPeriodo.inicio}
                  onChange={(e) => {
                    setNovoPeriodo((prev) => ({ ...prev, inicio: e.target.value }))
                    setTimeout(calcularDuracao, 100)
                  }}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fim">Fim</Label>
                <Input
                  id="fim"
                  type="time"
                  value={novoPeriodo.fim}
                  onChange={(e) => {
                    setNovoPeriodo((prev) => ({ ...prev, fim: e.target.value }))
                    setTimeout(calcularDuracao, 100)
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={adicionarPeriodo}
              className="w-full"
              variant="outline"
              disabled={isSubmitting}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Período
            </Button>
          </div>

          {/* Lista de Períodos Adicionados */}
          {formData.periodos.length > 0 && (
            <div className="space-y-2">
              <Label>Períodos Configurados ({formData.periodos.length})</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2">
                {formData.periodos.map((periodo, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      periodo.periodo === "Intervalo" || periodo.periodo === "Almoço"
                        ? "bg-green-50 border border-green-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{periodo.periodo}</span>
                      <Badge variant="outline" className="text-xs">
                        {periodo.duracao}min
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">
                        {periodo.inicio} - {periodo.fim}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerPeriodo(index)}
                        className="text-red-600 hover:text-red-700"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-brand-red-500 hover:bg-brand-red-600" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Adicionar Horário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
