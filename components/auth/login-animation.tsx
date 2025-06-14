"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Shield, Lock, User } from "lucide-react"

interface LoginAnimationProps {
  isVisible: boolean
  onComplete: () => void
}

export function LoginAnimation({ isVisible, onComplete }: LoginAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const steps = [
    { icon: User, text: "Verificando credenciais...", color: "text-blue-500" },
    { icon: Shield, text: "Validando permissões...", color: "text-green-500" },
    { icon: Lock, text: "Estabelecendo sessão segura...", color: "text-purple-500" },
    { icon: CheckCircle, text: "Login realizado com sucesso!", color: "text-emerald-500" },
  ]

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0)
      setIsComplete(false)
      return
    }

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        } else {
          setIsComplete(true)
          setTimeout(() => {
            onComplete()
          }, 1000)
          return prev
        }
      })
    }, 800)

    return () => clearInterval(timer)
  }, [isVisible, onComplete, steps.length])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-500 scale-100">
        <div className="text-center">
          {/* Logo animado */}
          <div className="mb-6 relative">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white animate-pulse" />
            </div>
            {/* Círculos animados ao redor do logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-2 border-red-200 rounded-full animate-spin opacity-30"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-orange-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8">Autenticando...</h2>

          {/* Steps de autenticação */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                    isActive || isCompleted ? "bg-gray-50 transform scale-105" : "opacity-30 transform scale-95"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isCompleted ? "bg-green-100" : isActive ? "bg-blue-100 animate-pulse" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-all duration-500 ${
                        isCompleted ? "text-green-600" : isActive ? step.color : "text-gray-400"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium transition-all duration-500 ${
                      isActive || isCompleted ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {step.text}
                  </span>
                  {isCurrent && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="ml-auto">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Barra de progresso */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% concluído
            </p>
          </div>

          {/* Mensagem de sucesso */}
          {isComplete && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 animate-bounce">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-green-800 font-medium">Redirecionando para o dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
