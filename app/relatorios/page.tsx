import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "lucide-react"

export default function Relatorios() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <Button>Gerar Relatório</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Remanejamentos por Motivo</CardTitle>
            <CardDescription>Distribuição dos motivos de remanejamento</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[200px] flex items-center justify-center">
              <PieChart className="h-32 w-32 text-muted-foreground" />
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                <div>Ausência do professor (45%)</div>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <div>Eventos escolares (30%)</div>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <div>Manutenção de salas (15%)</div>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div>Outros (10%)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Remanejamentos por Mês</CardTitle>
            <CardDescription>Evolução mensal de remanejamentos</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[200px] flex items-center justify-center">
              <LineChart className="h-32 w-32 text-muted-foreground" />
            </div>
            <div className="mt-4 text-xs text-center text-muted-foreground">Dados dos últimos 6 meses</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Remanejamentos por Disciplina</CardTitle>
            <CardDescription>Disciplinas mais remanejadas</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[200px] flex items-center justify-center">
              <BarChart className="h-32 w-32 text-muted-foreground" />
            </div>
            <div className="mt-4 text-xs text-center text-muted-foreground">
              Top 5 disciplinas com mais remanejamentos
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Detalhados</CardTitle>
          <CardDescription>Gere relatórios personalizados</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="remanejamentos">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="remanejamentos">Remanejamentos</TabsTrigger>
              <TabsTrigger value="professores">Professores</TabsTrigger>
              <TabsTrigger value="turmas">Turmas</TabsTrigger>
            </TabsList>
            <TabsContent value="remanejamentos" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Período</label>
                  <Select defaultValue="mes">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semana">Última semana</SelectItem>
                      <SelectItem value="mes">Último mês</SelectItem>
                      <SelectItem value="trimestre">Último trimestre</SelectItem>
                      <SelectItem value="semestre">Último semestre</SelectItem>
                      <SelectItem value="ano">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipo</label>
                  <Select defaultValue="todos">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="automaticos">Automáticos</SelectItem>
                      <SelectItem value="manuais">Manuais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">Gerar Relatório de Remanejamentos</Button>
            </TabsContent>
            <TabsContent value="professores" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Professor</label>
                  <Select defaultValue="todos">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o professor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="maria">Maria Silva</SelectItem>
                      <SelectItem value="joao">João Pereira</SelectItem>
                      <SelectItem value="ana">Ana Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Período</label>
                  <Select defaultValue="mes">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semana">Última semana</SelectItem>
                      <SelectItem value="mes">Último mês</SelectItem>
                      <SelectItem value="trimestre">Último trimestre</SelectItem>
                      <SelectItem value="semestre">Último semestre</SelectItem>
                      <SelectItem value="ano">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">Gerar Relatório de Professores</Button>
            </TabsContent>
            <TabsContent value="turmas" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Turma</label>
                  <Select defaultValue="todas">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="6a">6º Ano A</SelectItem>
                      <SelectItem value="7b">7º Ano B</SelectItem>
                      <SelectItem value="8c">8º Ano C</SelectItem>
                      <SelectItem value="9a">9º Ano A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Período</label>
                  <Select defaultValue="mes">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semana">Última semana</SelectItem>
                      <SelectItem value="mes">Último mês</SelectItem>
                      <SelectItem value="trimestre">Último trimestre</SelectItem>
                      <SelectItem value="semestre">Último semestre</SelectItem>
                      <SelectItem value="ano">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">Gerar Relatório de Turmas</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
