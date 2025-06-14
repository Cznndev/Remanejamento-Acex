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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Evento {
  id: string
  titulo: string
  descricao: string
  tipo: string
  dataInicio: Date
  dataFim: Date
  cor: string
  turmas?: string[]
  todosDias: boolean
}

interface AddEventoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (evento: Evento) => void
}

export function AddEventoModal({ open, onOpenChange, onAdd }: AddEventoModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "",
    dataInicio: "",
    dataFim: "",
    horaInicio: "",
    horaFim: "",
    cor: "#3B82F6",
    turmas: [] as string[],
    todosDias: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tiposEvento = ["aula", "prova", "reuniao", "evento", "feriado", "recesso"]

  const turmasDisponiveis = [
    "6º Ano A",
    "6º Ano B",
    "7º Ano A",
    "7º Ano B",
    "8º Ano A",
    "8º Ano B",
    "9º Ano A",
    "9º Ano B",
    "1º Ano EM",
    "2º Ano EM",
    "3º Ano EM",
  ]

  const coresDisponiveis = [
    { nome: "Azul", valor: "#3B82F6" },
    { nome: "Verde", valor: "#10B981" },
    { nome: "Vermelho", valor: "#EF4444" },
    { nome: "Amarelo", valor: "#F59E0B" },
    { nome: "Roxo", valor: "#8B5CF6" },
    { nome: "Rosa", valor: "#EC4899" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titulo || !formData.tipo || !formData.dataInicio) {
      alert("Por favor, preencha todos os campos obrigatórios!")
      return
    }

    setIsSubmitting(true)

    try {
      // Simular delay de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const dataInicio = new Date(formData.dataInicio)
      const dataFim = formData.dataFim ? new Date(formData.dataFim) : dataInicio

      // Adicionar horários se especificados
      if (formData.horaInicio && !formData.todosDias) {
        const [hora, minuto] = formData.horaInicio.split(":")
        dataInicio.setHours(Number.parseInt(hora), Number.parseInt(minuto))
      }

      if (formData.horaFim && !formData.todosDias) {
        const [hora, minuto] = formData.horaFim.split(":")
        dataFim.setHours(Number.parseInt(hora), Number.parseInt(minuto))
      }

      const novoEvento: Evento = {
        id: `evento_${Date.now()}`,
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: formData.tipo,
        dataInicio,
        dataFim,
        cor: formData.cor,
        turmas: formData.turmas,
        todosDias: formData.todosDias,
      }

      onAdd(novoEvento)
      onOpenChange(false)

      // Reset form
      setFormData({
        titulo: "",
        descricao: "",
        tipo: "",
        dataInicio: "",
        dataFim: "",
        horaInicio: "",
        horaFim: "",
        cor: "#3B82F6",
        turmas: [],
        todosDias: false,
      })

      alert(`Evento "${formData.titulo}" adicionado com sucesso!`)
    } catch (error) {
      alert("Erro ao adicionar evento. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTurmaChange = (turma: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        turmas: [...prev.turmas, turma],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        turmas: prev.turmas.filter((t) => t !== turma),
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Evento</DialogTitle>
          <DialogDescription>Preencha os dados do novo evento do calendário</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Evento *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
                placeholder="Ex: Prova de Matemática"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Evento *</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {tiposEvento.map((tipo) => (
                    <SelectItem key={tipo} value={tipo} className="capitalize">
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição do evento..."
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início *</Label>
              <Input
                id="dataInicio"
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData((prev) => ({ ...prev, dataInicio: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data de Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData((prev) => ({ ...prev, dataFim: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {!formData.todosDias && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horaInicio">Hora de Início</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, horaInicio: e.target.value }))}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaFim">Hora de Fim</Label>
                <Input
                  id="horaFim"
                  type="time"
                  value={formData.horaFim}
                  onChange={(e) => setFormData((prev) => ({ ...prev, horaFim: e.target.value }))}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Cor do Evento</Label>
            <div className="flex gap-2">
              {coresDisponiveis.map((cor) => (
                <button
                  key={cor.valor}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.cor === cor.valor ? "border-gray-800" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: cor.valor }}
                  onClick={() => setFormData((prev) => ({ ...prev, cor: cor.valor }))}
                  title={cor.nome}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="todosDias"
                checked={formData.todosDias}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, todosDias: checked as boolean }))}
                disabled={isSubmitting}
              />
              <Label htmlFor="todosDias">Evento de dia inteiro</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Turmas Envolvidas ({formData.turmas.length} selecionadas)</Label>
            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-2">
              {turmasDisponiveis.map((turma) => (
                <div key={turma} className="flex items-center space-x-2">
                  <Checkbox
                    id={turma}
                    checked={formData.turmas.includes(turma)}
                    onCheckedChange={(checked) => handleTurmaChange(turma, checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={turma} className="text-sm">
                    {turma}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-brand-blue-500 hover:bg-brand-blue-600" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Adicionar Evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
