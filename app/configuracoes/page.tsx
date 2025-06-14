import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

export default function Configuracoes() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <Button>Salvar Alterações</Button>
      </div>

      <Tabs defaultValue="geral">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="remanejamento">Remanejamento</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        </TabsList>
        <TabsContent value="geral" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Escola</CardTitle>
              <CardDescription>Configurações gerais da instituição</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome-escola">Nome da Escola</Label>
                  <Input id="nome-escola" defaultValue="Escola Municipal Exemplo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diretor">Diretor(a)</Label>
                  <Input id="diretor" defaultValue="Roberto Almeida" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contato</Label>
                  <Input id="email" type="email" defaultValue="contato@escola.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" defaultValue="(11) 3333-4444" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" defaultValue="Rua das Escolas, 123" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Personalize a aparência do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="tema">Tema Escuro</Label>
                  <p className="text-sm text-muted-foreground">Ativar modo escuro</p>
                </div>
                <Switch id="tema" />
              </div>
              <div className="space-y-2">
                <Label>Cor Principal</Label>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer border-2 border-blue-600" />
                  <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer" />
                  <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer" />
                  <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer" />
                  <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remanejamento" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Algoritmos de Remanejamento</CardTitle>
              <CardDescription>Configure os algoritmos utilizados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="algoritmo-padrao">Algoritmo Padrão</Label>
                <Select defaultValue="genetico">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um algoritmo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="genetico">Algoritmo Genético</SelectItem>
                    <SelectItem value="otimizacao">Otimização de Recursos</SelectItem>
                    <SelectItem value="balanceamento">Balanceamento de Carga</SelectItem>
                    <SelectItem value="prioridade">Prioridade de Disciplinas</SelectItem>
                    <SelectItem value="quantum">Otimização Quântica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Pesos dos Critérios</Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="peso-disponibilidade">Disponibilidade do Professor</Label>
                      <span className="text-sm">80%</span>
                    </div>
                    <Slider defaultValue={[80]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="peso-especialidade">Especialidade na Disciplina</Label>
                      <span className="text-sm">70%</span>
                    </div>
                    <Slider defaultValue={[70]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="peso-continuidade">Continuidade Pedagógica</Label>
                      <span className="text-sm">60%</span>
                    </div>
                    <Slider defaultValue={[60]} max={100} step={1} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Configurações Avançadas</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="otimizacao-automatica" />
                    <label
                      htmlFor="otimizacao-automatica"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Otimização automática diária
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="machine-learning" defaultChecked />
                    <label
                      htmlFor="machine-learning"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Usar previsões de Machine Learning
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="quantum-computing" />
                    <label
                      htmlFor="quantum-computing"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Habilitar otimização quântica (experimental)
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Gerencie como as notificações são enviadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>WhatsApp</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações por WhatsApp</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações push no navegador</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações por SMS</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Eventos para Notificação</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notif-ausencia" defaultChecked />
                    <label
                      htmlFor="notif-ausencia"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ausência de professor
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notif-remanejamento" defaultChecked />
                    <label
                      htmlFor="notif-remanejamento"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remanejamento realizado
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notif-relatorio" defaultChecked />
                    <label
                      htmlFor="notif-relatorio"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Relatórios gerados
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notif-previsao" />
                    <label
                      htmlFor="notif-previsao"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Previsões de ausência
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Configure permissões e acesso ao sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="autenticacao">Método de Autenticação</Label>
                <Select defaultValue="email">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email e Senha</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="microsoft">Microsoft</SelectItem>
                    <SelectItem value="biometrico">Biométrico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Segurança</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="two-factor" />
                    <label
                      htmlFor="two-factor"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Autenticação de dois fatores
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="session-timeout" defaultChecked />
                    <label
                      htmlFor="session-timeout"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Timeout de sessão após 30 minutos
                    </label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Níveis de Acesso</Label>
                  <Button variant="outline" size="sm">
                    Gerenciar Perfis
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">Administrador</p>
                      <p className="text-sm text-muted-foreground">Acesso completo ao sistema</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">Coordenador</p>
                      <p className="text-sm text-muted-foreground">Gerencia remanejamentos e professores</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">Professor</p>
                      <p className="text-sm text-muted-foreground">Visualiza horários e remanejamentos</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
