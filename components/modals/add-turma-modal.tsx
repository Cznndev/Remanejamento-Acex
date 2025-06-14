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

interface Turma {
  nome: string
  serie: string
  turno: string
  sala: string
  qtdAlunos: number
  anoLetivo: string
  status: string
  observacoes?: string
}

interface AddTurmaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (turma: Turma) => void
}

export function AddTurmaModal({ open, onOpenChange, onAdd }: AddTurmaModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    serie: "",
    turno: "",
    sala: "",
    qtdAlunos: "",
    anoLetivo: new Date().getFullYear().toString(),
    observacoes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const series = ["6º Ano", "7º Ano", "8º Ano", "9º Ano", "1º Ano EM", "2º Ano EM", "3º Ano EM"]
  const turnos = ["Manhã", "Tarde", "Noite"]
  const salas = [
    "Sala 1",
    "Sala 2",
    "Sala 3",
    "Sala 4",
    "Sala 5",
    "Laboratório de Informática",
    "Laboratório de Ciências",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.serie || !formData.turno) {
      alert("Por favor, preencha todos os campos obrigatórios!")
      return
    }

    setIsSubmitting(true)

    try {
      // Simular delay de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const novaTurma: Turma = {
        nome: formData.nome,
        serie: formData.serie,
        turno: formData.turno,
        sala: formData.sala || "A definir",
        qtdAlunos: formData.qtdAlunos ? Number.parseInt(formData.qtdAlunos) : 0,
        anoLetivo: formData.anoLetivo,
        status: "Ativa",
        observacoes: formData.observacoes,
      }

      onAdd(novaTurma)
      onOpenChange(false)

      // Reset form
      setFormData({
        nome: "",
        serie: "",
        turno: "",
        sala: "",
        qtdAlunos: "",
        anoLetivo: new Date().getFullYear().toString(),
        observacoes: "",
      })

      alert(`Turma "${formData.nome}" adicionada com sucesso!`)
    } catch (error) {
      alert("Erro ao adicionar turma. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Turma</DialogTitle>
          <DialogDescription>Preencha os dados da nova turma</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Turma *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: 6º Ano A"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serie">Série *</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, serie: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {series.map((serie) => (
                    <SelectItem key={serie} value={serie}>
                      {serie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="turno">Turno *</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, turno: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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
            <div className="space-y-2">
              <Label htmlFor="sala">Sala</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, sala: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {salas.map((sala) => (
                    <SelectItem key={sala} value={sala}>
                      {sala}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qtdAlunos">Quantidade de Alunos</Label>
              <Input
                id="qtdAlunos"
                type="number"
                value={formData.qtdAlunos}
                onChange={(e) => setFormData((prev) => ({ ...prev, qtdAlunos: e.target.value }))}
                placeholder="30"
                min="1"
                max="50"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anoLetivo">Ano Letivo</Label>
              <Input
                id="anoLetivo"
                value={formData.anoLetivo}
                onChange={(e) => setFormData((prev) => ({ ...prev, anoLetivo: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Informações adicionais sobre a turma..."
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Adicionar Turma"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
