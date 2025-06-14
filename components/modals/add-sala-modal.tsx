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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface Sala {
  nome: string
  capacidade: number
  tipo: string
  recursos: string[]
  localizacao: string
  status: string
  observacoes?: string
}

interface AddSalaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (sala: Sala) => void
}

export function AddSalaModal({ open, onOpenChange, onAdd }: AddSalaModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    capacidade: "",
    tipo: "",
    recursos: [] as string[],
    localizacao: "",
    observacoes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tiposSala = ["Sala de Aula", "Laboratório", "Auditório", "Biblioteca", "Sala de Reunião", "Quadra Esportiva"]

  const recursosDisponiveis = [
    "Projetor",
    "Ar-condicionado",
    "Computadores",
    "Sistema de Som",
    "Lousa Digital",
    "Equipamentos de Laboratório",
    "Wi-Fi",
    "Televisão",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.capacidade || !formData.tipo) {
      alert("Por favor, preencha todos os campos obrigatórios!")
      return
    }

    setIsSubmitting(true)

    try {
      // Simular delay de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const novaSala: Sala = {
        nome: formData.nome,
        capacidade: Number.parseInt(formData.capacidade),
        tipo: formData.tipo,
        recursos: formData.recursos,
        localizacao: formData.localizacao || "A definir",
        status: "Disponível",
        observacoes: formData.observacoes,
      }

      onAdd(novaSala)
      onOpenChange(false)

      // Reset form
      setFormData({
        nome: "",
        capacidade: "",
        tipo: "",
        recursos: [],
        localizacao: "",
        observacoes: "",
      })

      alert(`Sala "${formData.nome}" adicionada com sucesso!`)
    } catch (error) {
      alert("Erro ao adicionar sala. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRecursoChange = (recurso: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        recursos: [...prev.recursos, recurso],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        recursos: prev.recursos.filter((r) => r !== recurso),
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Sala</DialogTitle>
          <DialogDescription>Preencha os dados da nova sala</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Sala *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Sala 1, Lab. Informática"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade *</Label>
              <Input
                id="capacidade"
                type="number"
                value={formData.capacidade}
                onChange={(e) => setFormData((prev) => ({ ...prev, capacidade: e.target.value }))}
                placeholder="30"
                min="1"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Sala *</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {tiposSala.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                value={formData.localizacao}
                onChange={(e) => setFormData((prev) => ({ ...prev, localizacao: e.target.value }))}
                placeholder="Ex: Bloco A - 1º Andar"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Recursos Disponíveis ({formData.recursos.length} selecionados)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
              {recursosDisponiveis.map((recurso) => (
                <div key={recurso} className="flex items-center space-x-2">
                  <Checkbox
                    id={recurso}
                    checked={formData.recursos.includes(recurso)}
                    onCheckedChange={(checked) => handleRecursoChange(recurso, checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={recurso} className="text-sm">
                    {recurso}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Informações adicionais sobre a sala..."
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-brand-blue-500 hover:bg-brand-blue-600" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Adicionar Sala"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
