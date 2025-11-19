"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Laptop, Printer, Server, Smartphone, Trash2, Edit, Plus, Search, Download, Filter } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Dados de exemplo
const initialHardwareData = [
  {
    id: 1,
    tipo: "Laptop",
    modelo: "Dell XPS 15",
    serial: "XPS159876",
    status: "Ativo",
    departamento: "TI",
    aquisicao: "15/03/2023",
  },
  {
    id: 2,
    tipo: "Desktop",
    modelo: "HP EliteDesk 800",
    serial: "ELT8001234",
    status: "Ativo",
    departamento: "Financeiro",
    aquisicao: "10/01/2023",
  },
  {
    id: 3,
    tipo: "Servidor",
    modelo: "Dell PowerEdge R740",
    serial: "PE7405678",
    status: "Manutenção",
    departamento: "TI",
    aquisicao: "05/11/2022",
  },
  {
    id: 4,
    tipo: "Impressora",
    modelo: "HP LaserJet Pro",
    serial: "LJP2022",
    status: "Ativo",
    departamento: "RH",
    aquisicao: "20/06/2023",
  },
  {
    id: 5,
    tipo: "Smartphone",
    modelo: "Samsung Galaxy S22",
    serial: "SGS22987",
    status: "Ativo",
    departamento: "Diretoria",
    aquisicao: "12/04/2023",
  },
  // Desktops - Custo-Benefício Excelente
  {
    id: 6,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 3090",
    serial: "OPT3090001",
    status: "Ativo",
    departamento: "Financeiro",
    aquisicao: "2024-01-15",
  },
  {
    id: 7,
    tipo: "Desktop",
    modelo: "HP EliteDesk 800 G9",
    serial: "ELT800G901",
    status: "Ativo",
    departamento: "RH",
    aquisicao: "2024-01-20",
  },
  {
    id: 8,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M75q",
    serial: "TCM75Q001",
    status: "Ativo",
    departamento: "Vendas",
    aquisicao: "2024-02-01",
  },
  {
    id: 9,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 5090",
    serial: "OPT5090001",
    status: "Ativo",
    departamento: "Marketing",
    aquisicao: "2024-02-05",
  },
  {
    id: 10,
    tipo: "Desktop",
    modelo: "HP EliteDesk 705 G5",
    serial: "ELT705G501",
    status: "Ativo",
    departamento: "Design",
    aquisicao: "2024-02-10",
  },
  {
    id: 11,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M720q",
    serial: "TCM720Q001",
    status: "Ativo",
    departamento: "Operações",
    aquisicao: "2024-02-15",
  },
  {
    id: 12,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 3090",
    serial: "OPT3090002",
    status: "Ativo",
    departamento: "Suporte",
    aquisicao: "2024-02-20",
  },
  {
    id: 13,
    tipo: "Desktop",
    modelo: "HP EliteDesk 800 G9",
    serial: "ELT800G902",
    status: "Manutenção",
    departamento: "Desenvolvimento",
    aquisicao: "2024-02-25",
  },
  {
    id: 14,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M75q",
    serial: "TCM75Q002",
    status: "Ativo",
    departamento: "TI",
    aquisicao: "2024-03-01",
  },
  {
    id: 15,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 5090",
    serial: "OPT5090002",
    status: "Ativo",
    departamento: "Financeiro",
    aquisicao: "2024-03-05",
  },
  {
    id: 16,
    tipo: "Desktop",
    modelo: "HP EliteDesk 705 G5",
    serial: "ELT705G502",
    status: "Ativo",
    departamento: "RH",
    aquisicao: "2024-03-10",
  },
  {
    id: 17,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M720q",
    serial: "TCM720Q002",
    status: "Ativo",
    departamento: "Vendas",
    aquisicao: "2024-03-15",
  },
  {
    id: 18,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 3090",
    serial: "OPT3090003",
    status: "Ativo",
    departamento: "Marketing",
    aquisicao: "2024-03-20",
  },
  {
    id: 19,
    tipo: "Desktop",
    modelo: "HP EliteDesk 800 G9",
    serial: "ELT800G903",
    status: "Ativo",
    departamento: "Design",
    aquisicao: "2024-03-25",
  },
  {
    id: 20,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M75q",
    serial: "TCM75Q003",
    status: "Ativo",
    departamento: "Operações",
    aquisicao: "2024-04-01",
  },
  {
    id: 21,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 5090",
    serial: "OPT5090003",
    status: "Ativo",
    departamento: "Suporte",
    aquisicao: "2024-04-05",
  },
  {
    id: 22,
    tipo: "Desktop",
    modelo: "HP EliteDesk 705 G5",
    serial: "ELT705G503",
    status: "Ativo",
    departamento: "Desenvolvimento",
    aquisicao: "2024-04-10",
  },
  {
    id: 23,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M720q",
    serial: "TCM720Q003",
    status: "Manutenção",
    departamento: "TI",
    aquisicao: "2024-04-15",
  },
  {
    id: 24,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 3090",
    serial: "OPT3090004",
    status: "Ativo",
    departamento: "Financeiro",
    aquisicao: "2024-04-20",
  },
  {
    id: 25,
    tipo: "Desktop",
    modelo: "HP EliteDesk 800 G9",
    serial: "ELT800G904",
    status: "Ativo",
    departamento: "RH",
    aquisicao: "2024-04-25",
  },
  {
    id: 26,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M75q",
    serial: "TCM75Q004",
    status: "Ativo",
    departamento: "Vendas",
    aquisicao: "2024-05-01",
  },
  {
    id: 27,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 5090",
    serial: "OPT5090004",
    status: "Ativo",
    departamento: "Marketing",
    aquisicao: "2024-05-05",
  },
  {
    id: 28,
    tipo: "Desktop",
    modelo: "HP EliteDesk 705 G5",
    serial: "ELT705G504",
    status: "Ativo",
    departamento: "Design",
    aquisicao: "2024-05-10",
  },
  {
    id: 29,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M720q",
    serial: "TCM720Q004",
    status: "Ativo",
    departamento: "Operações",
    aquisicao: "2024-05-15",
  },
  {
    id: 30,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 3090",
    serial: "OPT3090005",
    status: "Ativo",
    departamento: "Suporte",
    aquisicao: "2024-05-20",
  },
  {
    id: 31,
    tipo: "Desktop",
    modelo: "HP EliteDesk 800 G9",
    serial: "ELT800G905",
    status: "Ativo",
    departamento: "Desenvolvimento",
    aquisicao: "2024-05-25",
  },
  {
    id: 32,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M75q",
    serial: "TCM75Q005",
    status: "Ativo",
    departamento: "TI",
    aquisicao: "2024-06-01",
  },
  {
    id: 33,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 5090",
    serial: "OPT5090005",
    status: "Ativo",
    departamento: "Financeiro",
    aquisicao: "2024-06-05",
  },
  {
    id: 34,
    tipo: "Desktop",
    modelo: "HP EliteDesk 705 G5",
    serial: "ELT705G505",
    status: "Ativo",
    departamento: "RH",
    aquisicao: "2024-06-10",
  },
  {
    id: 35,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M720q",
    serial: "TCM720Q005",
    status: "Ativo",
    departamento: "Vendas",
    aquisicao: "2024-06-15",
  },
  {
    id: 36,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 3090",
    serial: "OPT3090006",
    status: "Ativo",
    departamento: "Marketing",
    aquisicao: "2024-06-20",
  },
  {
    id: 37,
    tipo: "Desktop",
    modelo: "HP EliteDesk 800 G9",
    serial: "ELT800G906",
    status: "Manutenção",
    departamento: "Design",
    aquisicao: "2024-06-25",
  },
  {
    id: 38,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M75q",
    serial: "TCM75Q006",
    status: "Ativo",
    departamento: "Operações",
    aquisicao: "2024-07-01",
  },
  {
    id: 39,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 5090",
    serial: "OPT5090006",
    status: "Ativo",
    departamento: "Suporte",
    aquisicao: "2024-07-05",
  },
  {
    id: 40,
    tipo: "Desktop",
    modelo: "HP EliteDesk 705 G5",
    serial: "ELT705G506",
    status: "Ativo",
    departamento: "Desenvolvimento",
    aquisicao: "2024-07-10",
  },
  {
    id: 41,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M720q",
    serial: "TCM720Q006",
    status: "Ativo",
    departamento: "TI",
    aquisicao: "2024-07-15",
  },
  {
    id: 42,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 3090",
    serial: "OPT3090007",
    status: "Ativo",
    departamento: "Financeiro",
    aquisicao: "2024-07-20",
  },
  {
    id: 43,
    tipo: "Desktop",
    modelo: "HP EliteDesk 800 G9",
    serial: "ELT800G907",
    status: "Ativo",
    departamento: "RH",
    aquisicao: "2024-07-25",
  },
  {
    id: 44,
    tipo: "Desktop",
    modelo: "Lenovo ThinkCentre M75q",
    serial: "TCM75Q007",
    status: "Ativo",
    departamento: "Vendas",
    aquisicao: "2024-08-01",
  },
  {
    id: 45,
    tipo: "Desktop",
    modelo: "Dell OptiPlex 5090",
    serial: "OPT5090007",
    status: "Ativo",
    departamento: "Marketing",
    aquisicao: "2024-08-05",
  },

  // Laptops - Custo-Benefício Excelente
  {
    id: 46,
    tipo: "Laptop",
    modelo: "Dell Latitude 3520",
    serial: "LAT3520001",
    status: "Ativo",
    departamento: "Vendas",
    aquisicao: "2024-01-10",
  },
  {
    id: 47,
    tipo: "Laptop",
    modelo: "HP ProBook 450 G9",
    serial: "PB450G901",
    status: "Ativo",
    departamento: "Marketing",
    aquisicao: "2024-01-15",
  },
  {
    id: 48,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E15",
    serial: "TPE15001",
    status: "Ativo",
    departamento: "Design",
    aquisicao: "2024-01-20",
  },
  {
    id: 49,
    tipo: "Laptop",
    modelo: "Dell Latitude 5520",
    serial: "LAT5520001",
    status: "Ativo",
    departamento: "Diretoria",
    aquisicao: "2024-01-25",
  },
  {
    id: 50,
    tipo: "Laptop",
    modelo: "HP ProBook 650 G8",
    serial: "PB650G801",
    status: "Ativo",
    departamento: "TI",
    aquisicao: "2024-02-01",
  },
  {
    id: 51,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E14",
    serial: "TPE14001",
    status: "Ativo",
    departamento: "Financeiro",
    aquisicao: "2024-02-05",
  },
  {
    id: 52,
    tipo: "Laptop",
    modelo: "Dell Latitude 3520",
    serial: "LAT3520002",
    status: "Manutenção",
    departamento: "RH",
    aquisicao: "2024-02-10",
  },
  {
    id: 53,
    tipo: "Laptop",
    modelo: "HP ProBook 450 G9",
    serial: "PB450G902",
    status: "Ativo",
    departamento: "Operações",
    aquisicao: "2024-02-15",
  },
  {
    id: 54,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E15",
    serial: "TPE15002",
    status: "Ativo",
    departamento: "Suporte",
    aquisicao: "2024-02-20",
  },
  {
    id: 55,
    tipo: "Laptop",
    modelo: "Dell Latitude 5520",
    serial: "LAT5520002",
    status: "Ativo",
    departamento: "Desenvolvimento",
    aquisicao: "2024-02-25",
  },
  {
    id: 56,
    tipo: "Laptop",
    modelo: "HP ProBook 650 G8",
    serial: "PB650G802",
    status: "Ativo",
    departamento: "Vendas",
    aquisicao: "2024-03-01",
  },
  {
    id: 57,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E14",
    serial: "TPE14002",
    status: "Ativo",
    departamento: "Marketing",
    aquisicao: "2024-03-05",
  },
  {
    id: 58,
    tipo: "Laptop",
    modelo: "Dell Latitude 3520",
    serial: "LAT3520003",
    status: "Ativo",
    departamento: "Design",
    aquisicao: "2024-03-10",
  },
  {
    id: 59,
    tipo: "Laptop",
    modelo: "HP ProBook 450 G9",
    serial: "PB450G903",
    status: "Ativo",
    departamento: "Diretoria",
    aquisicao: "2024-03-15",
  },
  {
    id: 60,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E15",
    serial: "TPE15003",
    status: "Ativo",
    departamento: "TI",
    aquisicao: "2024-03-20",
  },
  {
    id: 61,
    tipo: "Laptop",
    modelo: "Dell Latitude 5520",
    serial: "LAT5520003",
    status: "Ativo",
    departamento: "Financeiro",
    aquisicao: "2024-03-25",
  },
  {
    id: 62,
    tipo: "Laptop",
    modelo: "HP ProBook 650 G8",
    serial: "PB650G803",
    status: "Ativo",
    departamento: "RH",
    aquisicao: "2024-04-01",
  },
  {
    id: 63,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E14",
    serial: "TPE14003",
    status: "Manutenção",
    departamento: "Operações",
    aquisicao: "2024-04-05",
  },
  {
    id: 64,
    tipo: "Laptop",
    modelo: "Dell Latitude 3520",
    serial: "LAT3520004",
    status: "Ativo",
    departamento: "Suporte",
    aquisicao: "2024-04-10",
  },
  {
    id: 65,
    tipo: "Laptop",
    modelo: "HP ProBook 450 G9",
    serial: "PB450G904",
    status: "Ativo",
    departamento: "Desenvolvimento",
    aquisicao: "2024-04-15",
  },
  {
    id: 66,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E15",
    serial: "TPE15004",
    status: "Ativo",
    departamento: "Vendas",
    aquisicao: "2024-04-20",
  },
  {
    id: 67,
    tipo: "Laptop",
    modelo: "Dell Latitude 5520",
    serial: "LAT5520004",
    status: "Ativo",
    departamento: "Marketing",
    aquisicao: "2024-04-25",
  },
  {
    id: 68,
    tipo: "Laptop",
    modelo: "HP ProBook 650 G8",
    serial: "PB650G804",
    status: "Ativo",
    departamento: "Design",
    aquisicao: "2024-05-01",
  },
  {
    id: 69,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E14",
    serial: "TPE14004",
    status: "Ativo",
    departamento: "Diretoria",
    aquisicao: "2024-05-05",
  },
  {
    id: 70,
    tipo: "Laptop",
    modelo: "Dell Latitude 3520",
    serial: "LAT3520005",
    status: "Ativo",
    departamento: "TI",
    aquisicao: "2024-05-10",
  },
  {
    id: 71,
    tipo: "Laptop",
    modelo: "HP ProBook 450 G9",
    serial: "PB450G905",
    status: "Ativo",
    departamento: "Financeiro",
    aquisicao: "2024-05-15",
  },
  {
    id: 72,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E15",
    serial: "TPE15005",
    status: "Ativo",
    departamento: "RH",
    aquisicao: "2024-05-20",
  },
  {
    id: 73,
    tipo: "Laptop",
    modelo: "Dell Latitude 5520",
    serial: "LAT5520005",
    status: "Ativo",
    departamento: "Operações",
    aquisicao: "2024-05-25",
  },
  {
    id: 74,
    tipo: "Laptop",
    modelo: "HP ProBook 650 G8",
    serial: "PB650G805",
    status: "Ativo",
    departamento: "Suporte",
    aquisicao: "2024-06-01",
  },
  {
    id: 75,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E14",
    serial: "TPE14005",
    status: "Ativo",
    departamento: "Desenvolvimento",
    aquisicao: "2024-06-05",
  },
  {
    id: 76,
    tipo: "Laptop",
    modelo: "Dell Latitude 3520",
    serial: "LAT3520006",
    status: "Ativo",
    departamento: "Vendas",
    aquisicao: "2024-06-10",
  },
  {
    id: 77,
    tipo: "Laptop",
    modelo: "HP ProBook 450 G9",
    serial: "PB450G906",
    status: "Manutenção",
    departamento: "Marketing",
    aquisicao: "2024-06-15",
  },
  {
    id: 78,
    tipo: "Laptop",
    modelo: "Lenovo ThinkPad E15",
    serial: "TPE15006",
    status: "Ativo",
    departamento: "Design",
    aquisicao: "2024-06-20",
  },
  {
    id: 79,
    tipo: "Laptop",
    modelo: "Dell Latitude 5520",
    serial: "LAT5520006",
    status: "Ativo",
    departamento: "Diretoria",
    aquisicao: "2024-06-25",
  },
  {
    id: 80,
    tipo: "Laptop",
    modelo: "HP ProBook 650 G8",
    serial: "PB650G806",
    status: "Ativo",
    departamento: "TI",
    aquisicao: "2024-07-01",
  },

  // Workstations - Alto Desempenho com Custo-Benefício
  {
    id: 81,
    tipo: "Workstation",
    modelo: "Dell Precision 3660",
    serial: "PRE3660001",
    status: "Ativo",
    departamento: "Design",
    aquisicao: "2024-01-05",
  },
  {
    id: 82,
    tipo: "Workstation",
    modelo: "HP ZBook Fury 15 G8",
    serial: "ZBF15G801",
    status: "Ativo",
    departamento: "Desenvolvimento",
    aquisicao: "2024-01-10",
  },
  {
    id: 83,
    tipo: "Workstation",
    modelo: "Dell Precision 5570",
    serial: "PRE5570001",
    status: "Ativo",
    departamento: "Design",
    aquisicao: "2024-02-01",
  },
  {
    id: 84,
    tipo: "Workstation",
    modelo: "HP ZBook Studio G8",
    serial: "ZBSG8001",
    status: "Ativo",
    departamento: "Desenvolvimento",
    aquisicao: "2024-02-15",
  },
  {
    id: 85,
    tipo: "Workstation",
    modelo: "Dell Precision 3660",
    serial: "PRE3660002",
    status: "Ativo",
    departamento: "TI",
    aquisicao: "2024-03-01",
  },
  {
    id: 86,
    tipo: "Workstation",
    modelo: "HP ZBook Fury 17 G8",
    serial: "ZBF17G801",
    status: "Manutenção",
    departamento: "Design",
    aquisicao: "2024-03-15",
  },
  {
    id: 87,
    tipo: "Workstation",
    modelo: "Dell Precision 5570",
    serial: "PRE5570002",
    status: "Ativo",
    departamento: "Desenvolvimento",
    aquisicao: "2024-04-01",
  },
  {
    id: 88,
    tipo: "Workstation",
    modelo: "HP ZBook Studio G8",
    serial: "ZBSG8002",
    status: "Ativo",
    departamento: "TI",
    aquisicao: "2024-04-15",
  },
]

export function HardwareTab() {
  const [hardwareData, setHardwareData] = useState(initialHardwareData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [openDialog, setOpenDialog] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Estados do formulário
  const [formData, setFormData] = useState({
    tipo: "",
    modelo: "",
    serial: "",
    departamento: "",
    aquisicao: "",
    status: "Ativo",
  })

  // Filtrar dados com base na pesquisa e filtro
  const filteredData = hardwareData.filter((item) => {
    const matchesSearch =
      item.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.departamento.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || item.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Função para resetar formulário
  const resetForm = () => {
    setFormData({
      tipo: "",
      modelo: "",
      serial: "",
      departamento: "",
      aquisicao: "",
      status: "Ativo",
    })
    setEditingItem(null)
  }

  // Função para abrir dialog de edição
  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      tipo: item.tipo,
      modelo: item.modelo,
      serial: item.serial,
      departamento: item.departamento,
      aquisicao: item.aquisicao,
      status: item.status,
    })
    setOpenDialog(true)
  }

  // Função para deletar item
  const handleDelete = (id) => {
    setHardwareData(hardwareData.filter((item) => item.id !== id))
    toast({
      title: "Hardware removido",
      description: "O equipamento foi removido com sucesso.",
    })
  }

  // Função para salvar (adicionar ou editar)
  const handleSave = () => {
    if (!formData.tipo || !formData.modelo || !formData.serial) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    if (editingItem) {
      // Editar item existente
      setHardwareData(hardwareData.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item)))
      toast({
        title: "Hardware atualizado",
        description: "As informações do equipamento foram atualizadas.",
      })
    } else {
      // Adicionar novo item
      const newItem = {
        id: Math.max(...hardwareData.map((item) => item.id)) + 1,
        ...formData,
      }
      setHardwareData([...hardwareData, newItem])
      toast({
        title: "Hardware adicionado",
        description: "Novo equipamento foi adicionado com sucesso.",
      })
    }

    setOpenDialog(false)
    resetForm()
  }

  // Função para exportar dados
  const handleExport = () => {
    const csvContent = [
      ["Tipo", "Modelo", "Serial", "Status", "Departamento", "Data Aquisição"],
      ...filteredData.map((item) => [
        item.tipo,
        item.modelo,
        item.serial,
        item.status,
        item.departamento,
        item.aquisicao,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "hardware-et-wicca.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Exportação concluída",
      description: "Os dados foram exportados com sucesso.",
    })
  }

  // Função para renderizar o ícone com base no tipo
  const renderIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "laptop":
      case "desktop":
        return <Laptop className="h-4 w-4" />
      case "servidor":
        return <Server className="h-4 w-4" />
      case "smartphone":
      case "tablet":
        return <Smartphone className="h-4 w-4" />
      case "impressora":
        return <Printer className="h-4 w-4" />
      default:
        return <Laptop className="h-4 w-4" />
    }
  }

  // Função para renderizar o badge de status
  const renderStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        )
      case "inativo":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Inativo
          </Badge>
        )
      case "manutenção":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Manutenção
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Função para abrir detalhes do item
  const handleViewDetails = (item) => {
    setSelectedItem(item)
    setDetailsDialog(true)
  }

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Gerenciamento de Hardware - ET & WICCA</CardTitle>
          <CardDescription>Gerencie todos os equipamentos físicos da empresa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por modelo, serial ou departamento..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="manutenção">Manutenção</SelectItem>
                </SelectContent>
              </Select>
              <Dialog
                open={openDialog}
                onOpenChange={(open) => {
                  setOpenDialog(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Hardware
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Editar Hardware" : "Adicionar Novo Hardware"}</DialogTitle>
                    <DialogDescription>
                      {editingItem
                        ? "Edite as informações do equipamento."
                        : "Preencha os detalhes do novo equipamento."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tipo" className="text-right">
                        Tipo *
                      </Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laptop">Laptop</SelectItem>
                          <SelectItem value="Desktop">Desktop</SelectItem>
                          <SelectItem value="Servidor">Servidor</SelectItem>
                          <SelectItem value="Impressora">Impressora</SelectItem>
                          <SelectItem value="Smartphone">Smartphone</SelectItem>
                          <SelectItem value="Tablet">Tablet</SelectItem>
                          <SelectItem value="Monitor">Monitor</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="modelo" className="text-right">
                        Modelo *
                      </Label>
                      <Input
                        id="modelo"
                        className="col-span-3"
                        value={formData.modelo}
                        onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                        placeholder="Ex: Dell XPS 15"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="serial" className="text-right">
                        Nº Serial *
                      </Label>
                      <Input
                        id="serial"
                        className="col-span-3"
                        value={formData.serial}
                        onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                        placeholder="Ex: XPS159876"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="departamento" className="text-right">
                        Departamento
                      </Label>
                      <Select
                        value={formData.departamento}
                        onValueChange={(value) => setFormData({ ...formData, departamento: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TI">TI</SelectItem>
                          <SelectItem value="Financeiro">Financeiro</SelectItem>
                          <SelectItem value="RH">RH</SelectItem>
                          <SelectItem value="Vendas">Vendas</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Diretoria">Diretoria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="aquisicao" className="text-right">
                        Data Aquisição
                      </Label>
                      <Input
                        id="aquisicao"
                        type="date"
                        className="col-span-3"
                        value={formData.aquisicao}
                        onChange={(e) => setFormData({ ...formData, aquisicao: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>{editingItem ? "Atualizar" : "Salvar"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Nº Serial</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Data Aquisição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="flex items-center gap-2 text-left hover:text-primary transition-colors"
                      >
                        {renderIcon(item.tipo)}
                        {item.tipo}
                      </button>
                    </TableCell>
                    <TableCell>{item.modelo}</TableCell>
                    <TableCell>{item.serial}</TableCell>
                    <TableCell>{renderStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.departamento}</TableCell>
                    <TableCell>{item.aquisicao}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredData.length} de {hardwareData.length} itens
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próximo
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedItem && renderIcon(selectedItem.tipo)}
              Detalhes do Hardware
            </DialogTitle>
            <DialogDescription>Especificações completas do equipamento selecionado.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-6 py-4">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                    <p className="text-sm">{selectedItem.tipo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Modelo</Label>
                    <p className="text-sm">{selectedItem.modelo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Número Serial</Label>
                    <p className="text-sm font-mono">{selectedItem.serial}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="mt-1">{renderStatusBadge(selectedItem.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Departamento</Label>
                    <p className="text-sm">{selectedItem.departamento}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Data de Aquisição</Label>
                    <p className="text-sm">{selectedItem.aquisicao}</p>
                  </div>
                </div>
              </div>

              {/* Especificações Técnicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Especificações Técnicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Processador</Label>
                    <p className="text-sm">Intel Core i7-12700H</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Memória RAM</Label>
                    <p className="text-sm">16 GB DDR4</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Armazenamento</Label>
                    <p className="text-sm">512 GB SSD NVMe</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Sistema Operacional</Label>
                    <p className="text-sm">Windows 11 Pro</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Garantia</Label>
                    <p className="text-sm">3 anos (até 15/03/2026)</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Localização</Label>
                    <p className="text-sm">Sala 201 - Andar 2</p>
                  </div>
                </div>
              </div>

              {/* Histórico de Manutenção */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Histórico de Manutenção</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="text-sm font-medium">Limpeza preventiva</p>
                      <p className="text-xs text-muted-foreground">15/01/2024</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Concluída
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="text-sm font-medium">Atualização de drivers</p>
                      <p className="text-xs text-muted-foreground">10/12/2023</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Concluída
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialog(false)}>
              Fechar
            </Button>
            <Button
              onClick={() => {
                setDetailsDialog(false)
                handleEdit(selectedItem)
              }}
            >
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-primary" />
                  <span className="text-sm">Laptops/Desktops</span>
                </div>
                <span className="font-medium">42%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  <span className="text-sm">Servidores</span>
                </div>
                <span className="font-medium">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span className="text-sm">Dispositivos Móveis</span>
                </div>
                <span className="font-medium">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="h-4 w-4 text-primary" />
                  <span className="text-sm">Outros</span>
                </div>
                <span className="font-medium">15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status dos Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ativos</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">85%</span>
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-green-500 w-[85%]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Inativos</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">8%</span>
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gray-500 w-[8%]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Em Manutenção</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">7%</span>
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 w-[7%]" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Manutenções Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Server className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Servidor Dell PowerEdge</p>
                  <p className="text-xs text-muted-foreground">Amanhã, 10:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Printer className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Impressora HP LaserJet</p>
                  <p className="text-xs text-muted-foreground">18/05, 14:30</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-xs">
              Ver todas as manutenções
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
