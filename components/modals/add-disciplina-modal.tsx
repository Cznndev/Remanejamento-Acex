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

interface Disciplina {
  id: number
  nome: string
  codigo: string
  cargaHoraria: number
  professores: string[]
  turmas: string[]
  descricao: string
  status: string
}

interface AddDisciplinaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (disciplina: Disciplina) => void
}

export function AddDisciplinaModal({ open, onOpenChange, onAdd }: AddDisciplinaModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    cargaHoraria: "",
    professores: [] as string[],
    turmas: [] as string[],
    descricao: "",
    status: "Ativa",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const professoresDisponiveis = [
    "Maria Silva",
    "João Santos",
    "Ana Costa",
    "João Pereira",
    "Carlos Lima",
    "Fernanda Oliveira",
    "Roberto Santos",
    "Juliana Ferreira",
  ]

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.nome ||
      !formData.codigo ||
      !formData.cargaHoraria ||
      formData.professores.length === 0 ||
      formData.turmas.length === 0
    ) {
      alert("Por favor, preencha todos os campos obrigatórios!")
      return
    }

    setIsSubmitting(true)

    try {
      // Simular delay de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const novaDisciplina: Disciplina = {
        id: Date.now(), // ID temporário baseado no timestamp
        nome: formData.nome,
        codigo: formData.codigo,
        cargaHoraria: Number.parseInt(formData.cargaHoraria),
        professores: formData.professores,
        turmas: formData.turmas,
        descricao: formData.descricao,
        status: formData.status,
      }

      onAdd(novaDisciplina)
      onOpenChange(false)

      // Reset form
      setFormData({
        nome: "",
        codigo: "",
        cargaHoraria: "",
        professores: [],
        turmas: [],
        descricao: "",
        status: "Ativa",
      })

      alert(`Disciplina "${formData.nome}" adicionada com sucesso!`)
    } catch (error) {
      alert("Erro ao adicionar disciplina. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProfessorChange = (professor: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        professores: [...prev.professores, professor],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        professores: prev.professores.filter((p) => p !== professor),
      }))
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
          <DialogTitle>Adicionar Nova Disciplina</DialogTitle>
          <DialogDescription>Preencha os dados da nova disciplina</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Disciplina *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Matemática"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData((prev) => ({ ...prev, codigo: e.target.value }))}
                placeholder="Ex: MAT001"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cargaHoraria">Carga Horária Semanal *</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, cargaHoraria: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 horas</SelectItem>
                  <SelectItem value="3">3 horas</SelectItem>
                  <SelectItem value="4">4 horas</SelectItem>
                  <SelectItem value="5">5 horas</SelectItem>
                  <SelectItem value="6">6 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Inativa">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Professores * ({formData.professores.length} selecionados)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
              {professoresDisponiveis.map((professor) => (
                <div key={professor} className="flex items-center space-x-2">
                  <Checkbox
                    id={professor}
                    checked={formData.professores.includes(professor)}
                    onCheckedChange={(checked) => handleProfessorChange(professor, checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={professor} className="text-sm">
                    {professor}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Turmas * ({formData.turmas.length} selecionadas)</Label>
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

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição da disciplina..."
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-brand-red-500 hover:bg-brand-red-600" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Adicionar Disciplina"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
