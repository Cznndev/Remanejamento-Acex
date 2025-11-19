import * as OTPAuth from "otpauth"
import QRCode from "qrcode"

// Classe para gerenciar autenticação de dois fatores
export class MFAManager {
  // Gerar segredo para TOTP
  static generateSecret(username: string): string {
    const totp = new OTPAuth.TOTP({
      issuer: "Gestão de TI",
      label: username,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.generate(20), // 20 bytes
    })

    return totp.secret.base32
  }

  // Gerar URL para QR Code
  static generateTOTPUrl(username: string, secret: string): string {
    const totp = new OTPAuth.TOTP({
      issuer: "Gestão de TI",
      label: username,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    })

    return totp.toString()
  }

  // Gerar QR Code como data URL
  static async generateQRCode(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 200,
      })
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error)
      throw error
    }
  }

  // Verificar código TOTP
  static verifyTOTP(secret: string, token: string): boolean {
    try {
      const totp = new OTPAuth.TOTP({
        issuer: "Gestão de TI",
        label: "user",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret),
      })

      // Verificar token com uma janela de tempo pequena (1 período antes e depois)
      const delta = totp.validate({ token, window: 1 })

      return delta !== null
    } catch (error) {
      console.error("Erro ao verificar TOTP:", error)
      return false
    }
  }

  // Gerar códigos de backup
  static generateBackupCodes(count = 10): string[] {
    const codes: string[] = []
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    for (let i = 0; i < count; i++) {
      let code = ""
      for (let j = 0; j < 10; j++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      // Formato: XXXX-XXXX-XX
      code = `${code.substring(0, 4)}-${code.substring(4, 8)}-${code.substring(8, 10)}`
      codes.push(code)
    }

    return codes
  }
}

// Funções de utilidade para armazenamento local
export const MFAStorage = {
  // Salvar estado MFA
  saveMFAState: (userId: string, isEnabled: boolean, secret?: string) => {
    localStorage.setItem(`mfa_enabled_${userId}`, String(isEnabled))
    if (secret) {
      localStorage.setItem(`mfa_secret_${userId}`, secret)
    }
  },

  // Verificar se MFA está habilitado
  isMFAEnabled: (userId: string): boolean => {
    return localStorage.getItem(`mfa_enabled_${userId}`) === "true"
  },

  // Obter segredo MFA
  getMFASecret: (userId: string): string | null => {
    return localStorage.getItem(`mfa_secret_${userId}`)
  },

  // Salvar códigos de backup
  saveBackupCodes: (userId: string, codes: string[]) => {
    localStorage.setItem(`mfa_backup_codes_${userId}`, JSON.stringify(codes))
  },

  // Obter códigos de backup
  getBackupCodes: (userId: string): string[] => {
    const codes = localStorage.getItem(`mfa_backup_codes_${userId}`)
    return codes ? JSON.parse(codes) : []
  },

  // Verificar e usar código de backup
  useBackupCode: (userId: string, code: string): boolean => {
    const codes = MFAStorage.getBackupCodes(userId)
    const index = codes.indexOf(code)

    if (index !== -1) {
      // Remover código usado
      codes.splice(index, 1)
      MFAStorage.saveBackupCodes(userId, codes)
      return true
    }

    return false
  },

  // Limpar dados MFA
  clearMFAData: (userId: string) => {
    localStorage.removeItem(`mfa_enabled_${userId}`)
    localStorage.removeItem(`mfa_secret_${userId}`)
    localStorage.removeItem(`mfa_backup_codes_${userId}`)
  },
}
