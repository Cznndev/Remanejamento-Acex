"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Lock,
  Key,
  Shield,
  Database,
  FileText,
  RefreshCw,
  XCircle,
  AlertTriangle,
  Eye,
  Plus,
  Download,
  Upload,
  Settings,
  Copy,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface EncryptionKey {
  id: string
  name: string
  type: "aes" | "rsa" | "ecc" | "pgp"
  strength: number
  algorithm: string
  created: string
  expires?: string
  status: "active" | "expired" | "revoked" | "rotating"
  usedBy: string[]
  lastRotated?: string
  autoRotate: boolean
}

interface EncryptedAsset {
  id: string
  name: string
  type: "database" | "file" | "api" | "communication" | "backup"
  encryptionMethod: string
  keyId: string
  status: "encrypted" | "decrypted" | "partial"
  lastEncrypted: string
  size: string
  location: string
}

interface CertificateInfo {
  id: string
  name: string
  issuer: string
  subject: string
  validFrom: string
  validTo: string
  status: "valid" | "expired" | "revoked" | "warning"
  type: "ssl" | "code_signing" | "client" | "ca"
  usedBy: string[]
  fingerprint: string
}

export function EncryptionManager() {
  const [keys, setKeys] = useState<EncryptionKey[]>([])
  const [assets, setAssets] = useState<EncryptedAsset[]>([])
  const [certificates, setCertificates] = useState<CertificateInfo[]>([])
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false)

  // Dados de exemplo
  useEffect(() => {
    const sampleKeys: EncryptionKey[] = [
      {
        id: "1",
        name: "Chave Principal AES",
        type: "aes",
        strength: 256,
        algorithm: "AES-256-GCM",
        created: "2024-01-01T10:00:00Z",
        status: "active",
        usedBy: ["database_encryption", "file_encryption"],
        lastRotated: "2024-01-01T10:00:00Z",
        autoRotate: true,
      },
      {
        id: "2",
        name: "Chave RSA API",
        type: "rsa",
        strength: 4096,
        algorithm: "RSA-4096",
        created: "2024-01-05T14:30:00Z",
        status: "active",
        usedBy: ["api_authentication", "jwt_signing"],
        lastRotated: "2024-01-05T14:30:00Z",
        autoRotate: false,
      },
      {
        id: "3",
        name: "Chave ECC Comunicações",
        type: "ecc",
        strength: 384,
        algorithm: "ECDSA P-384",
        created: "2024-01-10T09:15:00Z",
        status: "active",
        usedBy: ["secure_communications"],
        lastRotated: "2024-01-10T09:15:00Z",
        autoRotate: true,
      },
      {
        id: "4",
        name: "Chave PGP Backup",
        type: "pgp",
        strength: 4096,
        algorithm: "RSA-4096 (PGP)",
        created: "2023-12-15T11:45:00Z",
        expires: "2025-12-15T11:45:00Z",
        status: "active",
        usedBy: ["backup_encryption"],
        lastRotated: "2023-12-15T11:45:00Z",
        autoRotate: false,
      },
      {
        id: "5",
        name: "Chave AES Antiga",
        type: "aes",
        strength: 128,
        algorithm: "AES-128-CBC",
        created: "2022-06-10T08:30:00Z",
        expires: "2024-06-10T08:30:00Z",
        status: "rotating",
        usedBy: ["legacy_systems"],
        lastRotated: "2023-06-10T08:30:00Z",
        autoRotate: true,
      },
    ]

    const sampleAssets: EncryptedAsset[] = [
      {
        id: "1",
        name: "Banco de Dados Principal",
        type: "database",
        encryptionMethod: "AES-256-GCM",
        keyId: "1",
        status: "encrypted",
        lastEncrypted: "2024-01-15T08:00:00Z",
        size: "1.2 TB",
        location: "db.etwicca.com",
      },
      {
        id: "2",
        name: "Arquivos de Usuários",
        type: "file",
        encryptionMethod: "AES-256-GCM",
        keyId: "1",
        status: "encrypted",
        lastEncrypted: "2024-01-15T09:30:00Z",
        size: "450 GB",
        location: "/storage/user_files",
      },
      {
        id: "3",
        name: "API de Pagamentos",
        type: "api",
        encryptionMethod: "RSA-4096",
        keyId: "2",
        status: "encrypted",
        lastEncrypted: "2024-01-15T10:15:00Z",
        size: "N/A",
        location: "api.payments.etwicca.com",
      },
      {
        id: "4",
        name: "Comunicações Internas",
        type: "communication",
        encryptionMethod: "ECDSA P-384",
        keyId: "3",
        status: "encrypted",
        lastEncrypted: "2024-01-15T11:00:00Z",
        size: "N/A",
        location: "internal.etwicca.com",
      },
      {
        id: "5",
        name: "Backup Semanal",
        type: "backup",
        encryptionMethod: "RSA-4096 (PGP)",
        keyId: "4",
        status: "encrypted",
        lastEncrypted: "2024-01-14T01:00:00Z",
        size: "2.1 TB",
        location: "backup.etwicca.com",
      },
    ]

    const sampleCertificates: CertificateInfo[] = [
      {
        id: "1",
        name: "etwicca.com Wildcard",
        issuer: "DigiCert Inc",
        subject: "*.etwicca.com",
        validFrom: "2024-01-01T00:00:00Z",
        validTo: "2025-01-01T00:00:00Z",
        status: "valid",
        type: "ssl",
        usedBy: ["web_server", "api_gateway"],
        fingerprint: "SHA256:3a:e2:f1:5b:c3:d4:e5:f6:7a:8b:9c:0d:1e:2f:3a:4b",
      },
      {
        id: "2",
        name: "Certificado de Assinatura de Código",
        issuer: "DigiCert Inc",
        subject: "ET & WICCA Software",
        validFrom: "2023-06-15T00:00:00Z",
        validTo: "2025-06-15T00:00:00Z",
        status: "valid",
        type: "code_signing",
        usedBy: ["software_releases", "updates"],
        fingerprint: "SHA256:4b:5c:6d:7e:8f:9a:0b:1c:2d:3e:4f:5a:6b:7c:8d:9e",
      },
      {
        id: "3",
        name: "Certificado Cliente VPN",
        issuer: "ET & WICCA CA",
        subject: "VPN Clients",
        validFrom: "2023-12-01T00:00:00Z",
        validTo: "2024-12-01T00:00:00Z",
        status: "valid",
        type: "client",
        usedBy: ["vpn_authentication"],
        fingerprint: "SHA256:5c:6d:7e:8f:9a:0b:1c:2d:3e:4f:5a:6b:7c:8d:9e:0f",
      },
      {
        id: "4",
        name: "ET & WICCA Root CA",
        issuer: "ET & WICCA Root CA",
        subject: "ET & WICCA Root CA",
        validFrom: "2020-01-01T00:00:00Z",
        validTo: "2030-01-01T00:00:00Z",
        status: "valid",
        type: "ca",
        usedBy: ["internal_pki"],
        fingerprint: "SHA256:6d:7e:8f:9a:0b:1c:2d:3e:4f:5a:6b:7c:8d:9e:0f:1a",
      },
      {
        id: "5",
        name: "Certificado API Legado",
        issuer: "DigiCert Inc",
        subject: "api-legacy.etwicca.com",
        validFrom: "2023-01-01T00:00:00Z",
        validTo: "2024-02-01T00:00:00Z",
        status: "warning",
        type: "ssl",
        usedBy: ["legacy_api"],
        fingerprint: "SHA256:7e:8f:9a:0b:1c:2d:3e:4f:5a:6b:7c:8d:9e:0f:1a:2b",
      },
    ]

    setKeys(sampleKeys)
    setAssets(sampleAssets)
    setCertificates(sampleCertificates)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
      case "expired":
        return <Badge className="bg-red-500 hover:bg-red-600">Expirado</Badge>
      case "revoked":
        return <Badge className="bg-red-500 hover:bg-red-600">Revogado</Badge>
      case "rotating":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Rotacionando</Badge>
      case "encrypted":
        return <Badge className="bg-green-500 hover:bg-green-600">Criptografado</Badge>
      case "decrypted":
        return <Badge className="bg-red-500 hover:bg-red-600">Descriptografado</Badge>
      case "partial":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Parcial</Badge>
      case "valid":
        return <Badge className="bg-green-500 hover:bg-green-600">Válido</Badge>
      case "warning":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Atenção</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getKeyTypeIcon = (type: string) => {
    switch (type) {
      case "aes":
        return <Key className="h-4 w-4 text-blue-500" />
      case "rsa":
        return <Lock className="h-4 w-4 text-purple-500" />
      case "ecc":
        return <Shield className="h-4 w-4 text-green-500" />
      case "pgp":
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <Key className="h-4 w-4 text-gray-500" />
    }
  }

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case "database":
        return <Database className="h-4 w-4 text-blue-500" />
      case "file":
        return <FileText className="h-4 w-4 text-green-500" />
      case "api":
        return <Shield className="h-4 w-4 text-purple-500" />
      case "communication":
        return <RefreshCw className="h-4 w-4 text-orange-500" />
      case "backup":
        return <Database className="h-4 w-4 text-amber-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getCertificateTypeIcon = (type: string) => {
    switch (type) {
      case "ssl":
        return <Lock className="h-4 w-4 text-green-500" />
      case "code_signing":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "client":
        return <Shield className="h-4 w-4 text-purple-500" />
      case "ca":
        return <Key className="h-4 w-4 text-orange-500" />
      default:
        return <Lock className="h-4 w-4 text-gray-500" />
    }
  }

  const rotateKey = (keyId: string) => {
    setKeys((prev) =>
      prev.map((key) =>
        key.id === keyId
          ? {
              ...key,
              status: "rotating",
              lastRotated: new Date().toISOString(),
            }
          : key,
      ),
    )

    toast({
      title: "Rotação de Chave Iniciada",
      description: "A chave está sendo rotacionada. Este processo pode levar alguns minutos.",
    })

    // Simular conclusão da rotação
    setTimeout(() => {
      setKeys((prev) =>
        prev.map((key) =>
          key.id === keyId
            ? {
                ...key,
                status: "active",
              }
            : key,
        ),
      )

      toast({
        title: "Rotação de Chave Concluída",
        description: "A chave foi rotacionada com sucesso.",
      })
    }, 3000)
  }

  const generateKey = () => {
    setIsGeneratingKey(true)
    setIsKeyDialogOpen(false)

    toast({
      title: "Gerando Nova Chave",
      description: "Gerando chave criptográfica segura...",
    })

    // Simular geração de chave
    setTimeout(() => {
      const newKey: EncryptionKey = {
        id: (keys.length + 1).toString(),
        name: "Nova Chave AES",
        type: "aes",
        strength: 256,
        algorithm: "AES-256-GCM",
        created: new Date().toISOString(),
        status: "active",
        usedBy: [],
        autoRotate: true,
      }

      setKeys((prev) => [newKey, ...prev])
      setIsGeneratingKey(false)

      toast({
        title: "Chave Gerada",
        description: "Nova chave criptográfica gerada com sucesso.",
      })
    }, 2000)
  }

  const toggleAutoRotate = (keyId: string) => {
    setKeys((prev) =>
      prev.map((key) =>
        key.id === keyId
          ? {
              ...key,
              autoRotate: !key.autoRotate,
            }
          : key,
      ),
    )

    toast({
      title: "Configuração Atualizada",
      description: "A configuração de rotação automática foi alterada.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-800">Gerenciador de Criptografia - ET & WICCA</CardTitle>
                <CardDescription>Gerenciamento de chaves, certificados e ativos criptografados</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Chave
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-blue-800">Gerar Nova Chave</DialogTitle>
                    <DialogDescription>Configure os parâmetros da nova chave criptográfica</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="key-name">Nome da Chave</Label>
                      <Input id="key-name" placeholder="Digite o nome da chave" className="border-blue-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="key-type">Tipo de Chave</Label>
                      <Select>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aes">AES</SelectItem>
                          <SelectItem value="rsa">RSA</SelectItem>
                          <SelectItem value="ecc">ECC</SelectItem>
                          <SelectItem value="pgp">PGP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="key-strength">Força da Chave</Label>
                      <Select>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Selecione a força" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="128">128 bits</SelectItem>
                          <SelectItem value="256">256 bits</SelectItem>
                          <SelectItem value="2048">2048 bits (RSA/PGP)</SelectItem>
                          <SelectItem value="4096">4096 bits (RSA/PGP)</SelectItem>
                          <SelectItem value="256">P-256 (ECC)</SelectItem>
                          <SelectItem value="384">P-384 (ECC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-rotate" defaultChecked />
                      <Label htmlFor="auto-rotate">Rotação Automática</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsKeyDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={generateKey} disabled={isGeneratingKey}>
                      {isGeneratingKey ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Key className="h-4 w-4 mr-2" />
                          Gerar Chave
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Key className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Chaves Ativas</p>
                <p className="text-2xl font-bold text-blue-600">{keys.filter((k) => k.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Lock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Ativos Criptografados</p>
                <p className="text-2xl font-bold text-green-600">
                  {assets.filter((a) => a.status === "encrypted").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Certificados Válidos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {certificates.filter((c) => c.status === "valid").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Requer Atenção</p>
                <p className="text-2xl font-bold text-amber-600">
                  {keys.filter((k) => k.status === "rotating" || k.status === "expired").length +
                    certificates.filter((c) => c.status === "warning" || c.status === "expired").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keys">Chaves</TabsTrigger>
          <TabsTrigger value="assets">Ativos</TabsTrigger>
          <TabsTrigger value="certificates">Certificados</TabsTrigger>
          <TabsTrigger value="policies">Políticas</TabsTrigger>
        </TabsList>

        {/* Chaves */}
        <TabsContent value="keys">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Chaves Criptográficas</CardTitle>
              <CardDescription>Gerenciamento de chaves de criptografia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Algoritmo</TableHead>
                      <TableHead>Criado</TableHead>
                      <TableHead>Última Rotação</TableHead>
                      <TableHead>Auto-Rotação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getKeyTypeIcon(key.type)}
                            <span className="font-medium text-blue-800">{key.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="uppercase">{key.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{key.algorithm}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{new Date(key.created).toLocaleDateString()}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {key.lastRotated ? new Date(key.lastRotated).toLocaleDateString() : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Switch checked={key.autoRotate} onCheckedChange={() => toggleAutoRotate(key.id)} />
                        </TableCell>
                        <TableCell>{getStatusBadge(key.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => rotateKey(key.id)}
                              disabled={key.status === "rotating"}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <RefreshCw className={`h-4 w-4 ${key.status === "rotating" ? "animate-spin" : ""}`} />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <KeyDetailsDialog keyInfo={key} />
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ativos */}
        <TabsContent value="assets">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Ativos Criptografados</CardTitle>
              <CardDescription>Gerenciamento de dados e sistemas criptografados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getAssetTypeIcon(asset.type)}
                            <span className="font-medium text-blue-800">{asset.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{asset.type.replace("_", " ")}</TableCell>
                        <TableCell>
                          <span className="text-sm">{asset.encryptionMethod}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono">{asset.location}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{asset.size}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{new Date(asset.lastEncrypted).toLocaleDateString()}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(asset.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificados */}
        <TabsContent value="certificates">
          <Card className="border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-800">Certificados</CardTitle>
                  <CardDescription>Gerenciamento de certificados SSL/TLS e outros</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-blue-200 text-blue-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Certificado
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Emissor</TableHead>
                      <TableHead>Sujeito</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCertificateTypeIcon(cert.type)}
                            <span className="font-medium text-blue-800">{cert.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{cert.type.replace("_", " ")}</TableCell>
                        <TableCell>
                          <span className="text-sm">{cert.issuer}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono">{cert.subject}</span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>De: {new Date(cert.validFrom).toLocaleDateString()}</div>
                            <div>Até: {new Date(cert.validTo).toLocaleDateString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cert.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Políticas */}
        <TabsContent value="policies">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Política de Rotação de Chaves</CardTitle>
                <CardDescription>Configurações para rotação automática de chaves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Rotação Automática</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rotation-interval">Intervalo de Rotação</Label>
                    <Select defaultValue="90">
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecione o intervalo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 dias</SelectItem>
                        <SelectItem value="60">60 dias</SelectItem>
                        <SelectItem value="90">90 dias</SelectItem>
                        <SelectItem value="180">180 dias</SelectItem>
                        <SelectItem value="365">365 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">Notificação de Expiração</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-days">Dias Antes da Expiração</Label>
                    <Select defaultValue="30">
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecione os dias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 dias</SelectItem>
                        <SelectItem value="14">14 dias</SelectItem>
                        <SelectItem value="30">30 dias</SelectItem>
                        <SelectItem value="60">60 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Política de Certificados</CardTitle>
                <CardDescription>Configurações para gerenciamento de certificados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Renovação Automática</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="renewal-days">Dias Antes da Expiração</Label>
                    <Select defaultValue="30">
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecione os dias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 dias</SelectItem>
                        <SelectItem value="30">30 dias</SelectItem>
                        <SelectItem value="45">45 dias</SelectItem>
                        <SelectItem value="60">60 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Verificação de Revogação</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cert-strength">Força Mínima de Certificado</Label>
                    <Select defaultValue="2048">
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecione a força" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024">1024 bits (Legado)</SelectItem>
                        <SelectItem value="2048">2048 bits</SelectItem>
                        <SelectItem value="4096">4096 bits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Política de Criptografia</CardTitle>
                <CardDescription>Configurações para algoritmos e métodos de criptografia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="symmetric-algorithm">Algoritmo Simétrico Padrão</Label>
                    <Select defaultValue="aes-256-gcm">
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecione o algoritmo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aes-128-cbc">AES-128-CBC</SelectItem>
                        <SelectItem value="aes-256-cbc">AES-256-CBC</SelectItem>
                        <SelectItem value="aes-128-gcm">AES-128-GCM</SelectItem>
                        <SelectItem value="aes-256-gcm">AES-256-GCM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asymmetric-algorithm">Algoritmo Assimétrico Padrão</Label>
                    <Select defaultValue="rsa-4096">
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecione o algoritmo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rsa-2048">RSA-2048</SelectItem>
                        <SelectItem value="rsa-4096">RSA-4096</SelectItem>
                        <SelectItem value="ecc-p256">ECC P-256</SelectItem>
                        <SelectItem value="ecc-p384">ECC P-384</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Bloquear Algoritmos Inseguros</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Backup de Chaves</CardTitle>
                <CardDescription>Configurações para backup seguro de chaves criptográficas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Backup Automático</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Frequência de Backup</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-location">Local de Backup</Label>
                    <Select defaultValue="secure-storage">
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecione o local" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="secure-storage">Armazenamento Seguro</SelectItem>
                        <SelectItem value="hsm">Hardware Security Module</SelectItem>
                        <SelectItem value="cloud">Nuvem Criptografada</SelectItem>
                        <SelectItem value="offline">Dispositivo Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" className="border-blue-200 text-blue-600">
                      <Download className="h-4 w-4 mr-2" />
                      Backup Manual
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para detalhes da chave
function KeyDetailsDialog({ keyInfo }: { keyInfo: EncryptionKey }) {
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle className="text-blue-800">{keyInfo.name}</DialogTitle>
        <DialogDescription>Detalhes da chave criptográfica</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {getKeyTypeIcon(keyInfo.type)}
          <Badge
            className={
              keyInfo.status === "active"
                ? "bg-green-500"
                : keyInfo.status === "rotating"
                  ? "bg-amber-500"
                  : "bg-red-500"
            }
          >
            {keyInfo.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium mb-2">Informações da Chave</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="uppercase">{keyInfo.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Algoritmo:</span>
                <span>{keyInfo.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Força:</span>
                <span>{keyInfo.strength} bits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Criado:</span>
                <span>{new Date(keyInfo.created).toLocaleString()}</span>
              </div>
              {keyInfo.expires && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Expira:</span>
                  <span>{new Date(keyInfo.expires).toLocaleString()}</span>
                </div>
              )}
              {keyInfo.lastRotated && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Última Rotação:</span>
                  <span>{new Date(keyInfo.lastRotated).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Rotação Automática:</span>
                <span>{keyInfo.autoRotate ? "Ativada" : "Desativada"}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Usado Por</h3>
            <div className="space-y-1">
              {keyInfo.usedBy.map((usage, index) => (
                <div key={index} className="text-xs bg-blue-50 px-2 py-1 rounded border">
                  {usage}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Fingerprint</h3>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
              SHA256:3a:e2:f1:5b:c3:d4:e5:f6:7a:8b:9c:0d:1e:2f:3a:4b
            </code>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

function getKeyTypeIcon(type: string) {
  switch (type) {
    case "aes":
      return <Key className="h-4 w-4 text-blue-500" />
    case "rsa":
      return <Lock className="h-4 w-4 text-purple-500" />
    case "ecc":
      return <Shield className="h-4 w-4 text-green-500" />
    case "pgp":
      return <FileText className="h-4 w-4 text-orange-500" />
    default:
      return <Key className="h-4 w-4 text-gray-500" />
  }
}
