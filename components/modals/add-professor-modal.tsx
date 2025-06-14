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

interface Professor {
  nome: string
  email: string
  telefone?: string
  disciplinas: string[]
  cargaHoraria: number
  disponibilidade: string
  status: string
  observacoes?: string
}

interface AddProfessorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (professor: Professor) => void
}

export function AddProfessorModal({ open, onOpenChange, onAdd }: AddProfessorModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    disciplinas: [] as string[],
    cargaHoraria: "",
    disponibilidade: [] as string[],
    observacoes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const disciplinasDisponiveis = [
    "Matemática",
    "Português",
    "História",
    "Geografia",
    "Ciências",
    "Física",
    "Química",
    "Biologia",
    "Inglês",
    "Educação Física",
    "Arte",
    "Filosofia",
    "Sociologia",
    "Literatura",
  ]

  const turnosDisponiveis = ["Manhã", "Tarde", "Noite"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.email || formData.disciplinas.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios!")
      return
    }

    setIsSubmitting(true)

    try {
      // Simular delay de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const novoProfessor: Professor = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        disciplinas: formData.disciplinas,
        cargaHoraria: formData.cargaHoraria ? Number.parseInt(formData.cargaHoraria) : 20,
        disponibilidade: formData.disponibilidade.join("/"),
        status: "Ativo",
        observacoes: formData.observacoes,
      }

      onAdd(novoProfessor)
      onOpenChange(false)

      // Reset form
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        disciplinas: [],
        cargaHoraria: "",
        disponibilidade: [],
        observacoes: "",
      })

      alert(`Professor "${formData.nome}" adicionado com sucesso!`)
    } catch (error) {
      alert("Erro ao adicionar professor. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDisciplinaChange = (disciplina: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        disciplinas: [...prev.disciplinas, disciplina],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        disciplinas: prev.disciplinas.filter((d) => d !== disciplina),
      }))
    }
  }

  const handleDisponibilidadeChange = (turno: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        disponibilidade: [...prev.disponibilidade, turno],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        disponibilidade: prev.disponibilidade.filter((d) => d !== turno),
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Professor</DialogTitle>
          <DialogDescription>Preencha os dados do novo professor</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                placeholder="(11) 99999-9999"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargaHoraria">Carga Horária Semanal</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, cargaHoraria: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20 horas</SelectItem>
                  <SelectItem value="30">30 horas</SelectItem>
                  <SelectItem value="40">40 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Disciplinas que Leciona * ({formData.disciplinas.length} selecionadas)</Label>
            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-2">
              {disciplinasDisponiveis.map((disciplina) => (
                <div key={disciplina} className="flex items-center space-x-2">
                  <Checkbox
                    id={disciplina}
                    checked={formData.disciplinas.includes(disciplina)}
                    onCheckedChange={(checked) => handleDisciplinaChange(disciplina, checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={disciplina} className="text-sm">
                    {disciplina}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Disponibilidade de Turnos * ({formData.disponibilidade.length} selecionados)</Label>
            <div className="flex gap-4">
              {turnosDisponiveis.map((turno) => (
                <div key={turno} className="flex items-center space-x-2">
                  <Checkbox
                    id={turno}
                    checked={formData.disponibilidade.includes(turno)}
                    onCheckedChange={(checked) => handleDisponibilidadeChange(turno, checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={turno}>{turno}</Label>
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
              placeholder="Informações adicionais sobre o professor..."
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-brand-red-500 hover:bg-brand-red-600" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Adicionar Professor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
