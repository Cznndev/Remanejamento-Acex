"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Save, RotateCcw, Trash2, Download } from "lucide-react"
import { BackupService } from "@/lib/backup/backup-service"
import type { BackupSnapshot } from "@/lib/backup/backup-service"
import { useToast } from "@/hooks/use-toast"

export function BackupManager() {
  const [snapshots, setSnapshots] = useState<BackupSnapshot[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [newSnapshotName, setNewSnapshotName] = useState("")
  const [newSnapshotDescription, setNewSnapshotDescription] = useState("")
  const backupService = BackupService.getInstance()
  const { toast } = useToast()

  useEffect(() => {
    loadSnapshots()
  }, [])

  const loadSnapshots = () => {
    const allSnapshots = backupService.getSnapshots()
    setSnapshots(allSnapshots)
  }

  const criarSnapshot = async () => {
    if (!newSnapshotName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do snapshot é obrigatório",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      await backupService.criarSnapshot(newSnapshotName, newSnapshotDescription, "manual", "admin")

      toast({
        title: "Snapshot criado",
        description: "Backup criado com sucesso",
      })

      setNewSnapshotName("")
      setNewSnapshotDescription("")
      loadSnapshots()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar snapshot",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const restaurarSnapshot = async (snapshotId: string) => {
    setIsRestoring(true)
    try {
      const sucesso = await backupService.restaurarSnapshot(snapshotId)

      if (sucesso) {
        toast({
          title: "Restauração concluída",
          description: "Sistema restaurado com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: "Erro ao restaurar snapshot",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao restaurar snapshot",
        variant: "destructive",
      })
    } finally {
      setIsRestoring(false)
    }
  }

  const excluirSnapshot = async (snapshotId: string) => {
    try {
      await backupService.excluirSnapshot(snapshotId)
      toast({
        title: "Snapshot excluído",
        description: "Backup removido com sucesso",
      })
      loadSnapshots()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir snapshot",
        variant: "destructive",
      })
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "manual":
        return "default"
      case "automatico":
        return "secondary"
      case "pre-remanejamento":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Backup</h2>
          <p className="text-muted-foreground">Crie e gerencie snapshots do sistema</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Criar Snapshot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Snapshot</DialogTitle>
              <DialogDescription>Crie um backup completo do estado atual do sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Snapshot</Label>
                <Input
                  id="name"
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                  placeholder="Ex: Backup antes da atualização"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newSnapshotDescription}
                  onChange={(e) => setNewSnapshotDescription(e.target.value)}
                  placeholder="Descreva o motivo deste backup..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={criarSnapshot} disabled={isCreating}>
                {isCreating ? "Criando..." : "Criar Snapshot"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Snapshots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshots.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Snapshots Manuais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshots.filter((s) => s.tipo === "manual").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {snapshots.length > 0 ? snapshots[0].criadoEm.toLocaleString("pt-BR") : "Nenhum backup"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Snapshots Disponíveis</CardTitle>
          <CardDescription>Lista de todos os backups criados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshots.map((snapshot) => (
                <TableRow key={snapshot.id}>
                  <TableCell className="font-medium">{snapshot.nome}</TableCell>
                  <TableCell>
                    <Badge variant={getTipoColor(snapshot.tipo)}>{snapshot.tipo}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{snapshot.descricao}</TableCell>
                  <TableCell>{snapshot.criadoPor}</TableCell>
                  <TableCell>{snapshot.criadoEm.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" disabled={isRestoring}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Restaurar Snapshot</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação irá restaurar o sistema para o estado do snapshot "{snapshot.nome}". Todos os
                              dados atuais serão substituídos. Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => restaurarSnapshot(snapshot.id)}>
                              Restaurar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Snapshot</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o snapshot "{snapshot.nome}"? Esta ação não pode ser
                              desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => excluirSnapshot(snapshot.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
