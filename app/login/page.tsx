"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthService } from "@/lib/auth/auth-service"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, GraduationCap, Users, BookOpen, Award } from "lucide-react"
import { LoginAnimation } from "@/components/auth/login-animation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const authService = AuthService.getInstance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setShowAnimation(true)

    try {
      await authService.login({ email, password, rememberMe })
      // A animação vai lidar com o redirecionamento
    } catch (error) {
      setShowAnimation(false)
      setIsLoading(false)
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Credenciais inválidas",
        variant: "destructive",
      })
    }
  }

  const handleAnimationComplete = () => {
    toast({
      title: "Login realizado com sucesso!",
      description: "Bem-vindo ao sistema de gestão escolar!",
    })
    router.push("/")
  }

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <>
      <div className="min-h-screen flex">
        {/* Lado Esquerdo - Informações */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-500 via-red-600 to-orange-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            {/* Logo */}
            <div className="mb-12">
              <Image
                src="/images/colegio-plus-logo.png"
                alt="Colégio Plus"
                width={180}
                height={180}
                className="object-contain drop-shadow-lg"
              />
            </div>

            {/* Título Principal */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6">Sistema de Gestão Escolar</h1>
              <p className="text-xl opacity-90 leading-relaxed">Transformando a educação através da tecnologia</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-8 text-center">
              <div className="flex flex-col items-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <GraduationCap className="w-12 h-12 mb-4" />
                <span className="text-lg font-semibold">Gestão Acadêmica</span>
                <span className="text-sm opacity-80 mt-2">Controle completo do ambiente escolar</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <Users className="w-12 h-12 mb-4" />
                <span className="text-lg font-semibold">Controle de Turmas</span>
                <span className="text-sm opacity-80 mt-2">Organização eficiente de estudantes</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <BookOpen className="w-12 h-12 mb-4" />
                <span className="text-lg font-semibold">Horários Inteligentes</span>
                <span className="text-sm opacity-80 mt-2">Otimização automática de cronogramas</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <Award className="w-12 h-12 mb-4" />
                <span className="text-lg font-semibold">Relatórios Avançados</span>
                <span className="text-sm opacity-80 mt-2">Analytics e insights educacionais</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário de Login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Logo Mobile */}
            <div className="lg:hidden text-center mb-8">
              <Image
                src="/images/colegio-plus-logo.png"
                alt="Colégio Plus"
                width={100}
                height={100}
                className="object-contain mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-800">Sistema de Gestão</h1>
            </div>

            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800">Bem-vindo de volta!</CardTitle>
                <CardDescription className="text-gray-600">
                  Faça login para acessar o sistema de gestão escolar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pr-12 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-200"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-600">
                        Lembrar de mim
                      </Label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                      disabled={isLoading}
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Autenticando...</span>
                      </div>
                    ) : (
                      "Entrar no Sistema"
                    )}
                  </Button>
                </form>

                {/* Contas de Teste */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Contas de Demonstração
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("admin@escola.edu", "admin123")}
                      className="flex justify-between items-center p-2 bg-white rounded border hover:bg-gray-50 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      <span className="font-medium text-gray-700">👨‍💼 Admin</span>
                      <span className="text-gray-600">admin@escola.edu / admin123</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("coordenador@escola.edu", "coord123")}
                      className="flex justify-between items-center p-2 bg-white rounded border hover:bg-gray-50 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      <span className="font-medium text-gray-700">👩‍🏫 Coordenadora</span>
                      <span className="text-gray-600">coordenador@escola.edu / coord123</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("maria.silva@escola.edu", "prof123")}
                      className="flex justify-between items-center p-2 bg-white rounded border hover:bg-gray-50 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      <span className="font-medium text-gray-700">👨‍🏫 Professor</span>
                      <span className="text-gray-600">maria.silva@escola.edu / prof123</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-500">
              <p>© 2024 Colégio Plus. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animação de Login */}
      <LoginAnimation isVisible={showAnimation} onComplete={handleAnimationComplete} />
    </>
  )
}
