export interface BlockchainTransaction {
  id: string
  type: "remanejamento" | "aprovacao" | "cancelamento" | "configuracao"
  timestamp: Date
  userId: string
  data: any
  hash: string
  previousHash: string
  signature: string
  status: "pending" | "confirmed" | "failed"
}

export interface Block {
  index: number
  timestamp: Date
  transactions: BlockchainTransaction[]
  previousHash: string
  hash: string
  nonce: number
  merkleRoot: string
}

export interface AuditTrail {
  transactionId: string
  action: string
  user: string
  timestamp: Date
  details: any
  verified: boolean
  blockIndex: number
}

class BlockchainService {
  private chain: Block[] = []
  private pendingTransactions: BlockchainTransaction[] = []
  private miningReward = 1
  private difficulty = 2

  constructor() {
    this.createGenesisBlock()
  }

  private createGenesisBlock(): void {
    const genesisBlock: Block = {
      index: 0,
      timestamp: new Date(),
      transactions: [],
      previousHash: "0",
      hash: this.calculateHash({
        index: 0,
        timestamp: new Date(),
        transactions: [],
        previousHash: "0",
        nonce: 0,
        merkleRoot: "",
      }),
      nonce: 0,
      merkleRoot: "",
    }

    this.chain.push(genesisBlock)
  }

  private calculateHash(block: Omit<Block, "hash">): string {
    const data = JSON.stringify(block)
    // Simulação de hash SHA-256
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  }

  private calculateMerkleRoot(transactions: BlockchainTransaction[]): string {
    if (transactions.length === 0) return "0"

    const hashes = transactions.map((tx) => tx.hash)

    while (hashes.length > 1) {
      const newHashes = []
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i]
        const right = hashes[i + 1] || hashes[i]
        const combined = left + right
        newHashes.push(this.hashString(combined))
      }
      hashes.splice(0, hashes.length, ...newHashes)
    }

    return hashes[0]
  }

  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }

  private mineBlock(block: Omit<Block, "hash" | "nonce">): Block {
    let nonce = 0
    let hash = ""

    do {
      nonce++
      const blockWithNonce = { ...block, nonce }
      hash = this.calculateHash(blockWithNonce)
    } while (!hash.startsWith("0".repeat(this.difficulty)))

    return { ...block, nonce, hash }
  }

  async createTransaction(type: BlockchainTransaction["type"], userId: string, data: any): Promise<string> {
    const transaction: BlockchainTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      userId,
      data,
      hash: "",
      previousHash: this.getLatestBlock().hash,
      signature: this.signTransaction(userId, data),
      status: "pending",
    }

    // Calcular hash da transação
    transaction.hash = this.hashString(
      JSON.stringify({
        id: transaction.id,
        type: transaction.type,
        timestamp: transaction.timestamp,
        userId: transaction.userId,
        data: transaction.data,
        previousHash: transaction.previousHash,
      }),
    )

    this.pendingTransactions.push(transaction)

    // Auto-mine se houver transações suficientes
    if (this.pendingTransactions.length >= 3) {
      await this.minePendingTransactions()
    }

    return transaction.id
  }

  private signTransaction(userId: string, data: any): string {
    // Simulação de assinatura digital
    const payload = JSON.stringify({ userId, data, timestamp: Date.now() })
    return this.hashString(payload + "secret_key")
  }

  async minePendingTransactions(): Promise<void> {
    if (this.pendingTransactions.length === 0) return

    const block: Omit<Block, "hash" | "nonce"> = {
      index: this.chain.length,
      timestamp: new Date(),
      transactions: [...this.pendingTransactions],
      previousHash: this.getLatestBlock().hash,
      merkleRoot: this.calculateMerkleRoot(this.pendingTransactions),
    }

    // Simular mineração (em produção seria mais complexo)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const minedBlock = this.mineBlock(block)
    this.chain.push(minedBlock)

    // Marcar transações como confirmadas
    this.pendingTransactions.forEach((tx) => {
      tx.status = "confirmed"
    })

    this.pendingTransactions = []
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  getChain(): Block[] {
    return [...this.chain]
  }

  getTransaction(transactionId: string): BlockchainTransaction | null {
    for (const block of this.chain) {
      const transaction = block.transactions.find((tx) => tx.id === transactionId)
      if (transaction) return transaction
    }

    const pendingTx = this.pendingTransactions.find((tx) => tx.id === transactionId)
    return pendingTx || null
  }

  getAuditTrail(filters?: {
    userId?: string
    type?: string
    dateFrom?: Date
    dateTo?: Date
  }): AuditTrail[] {
    const auditTrail: AuditTrail[] = []

    this.chain.forEach((block, blockIndex) => {
      block.transactions.forEach((tx) => {
        // Aplicar filtros
        if (filters?.userId && tx.userId !== filters.userId) return
        if (filters?.type && tx.type !== filters.type) return
        if (filters?.dateFrom && tx.timestamp < filters.dateFrom) return
        if (filters?.dateTo && tx.timestamp > filters.dateTo) return

        auditTrail.push({
          transactionId: tx.id,
          action: this.getActionDescription(tx),
          user: tx.userId,
          timestamp: tx.timestamp,
          details: tx.data,
          verified: this.verifyTransaction(tx),
          blockIndex,
        })
      })
    })

    return auditTrail.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  private getActionDescription(tx: BlockchainTransaction): string {
    switch (tx.type) {
      case "remanejamento":
        return `Remanejamento criado: ${tx.data.professor} - ${tx.data.disciplina}`
      case "aprovacao":
        return `Aprovação de remanejamento: ${tx.data.remanejamentoId}`
      case "cancelamento":
        return `Cancelamento de remanejamento: ${tx.data.remanejamentoId}`
      case "configuracao":
        return `Alteração de configuração: ${tx.data.setting}`
      default:
        return "Ação desconhecida"
    }
  }

  private verifyTransaction(tx: BlockchainTransaction): boolean {
    // Verificar assinatura
    const expectedSignature = this.signTransaction(tx.userId, tx.data)
    return tx.signature === expectedSignature
  }

  validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      // Verificar hash do bloco atual
      const calculatedHash = this.calculateHash({
        index: currentBlock.index,
        timestamp: currentBlock.timestamp,
        transactions: currentBlock.transactions,
        previousHash: currentBlock.previousHash,
        nonce: currentBlock.nonce,
        merkleRoot: currentBlock.merkleRoot,
      })

      if (currentBlock.hash !== calculatedHash) {
        return false
      }

      // Verificar ligação com bloco anterior
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }

      // Verificar merkle root
      const calculatedMerkleRoot = this.calculateMerkleRoot(currentBlock.transactions)
      if (currentBlock.merkleRoot !== calculatedMerkleRoot) {
        return false
      }
    }

    return true
  }

  getBlockchainStats(): {
    totalBlocks: number
    totalTransactions: number
    pendingTransactions: number
    chainValid: boolean
    lastBlockTime: Date
    averageBlockTime: number
  } {
    const totalTransactions = this.chain.reduce((sum, block) => sum + block.transactions.length, 0)

    let averageBlockTime = 0
    if (this.chain.length > 1) {
      const timeDiffs = []
      for (let i = 1; i < this.chain.length; i++) {
        const diff = this.chain[i].timestamp.getTime() - this.chain[i - 1].timestamp.getTime()
        timeDiffs.push(diff)
      }
      averageBlockTime = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length
    }

    return {
      totalBlocks: this.chain.length,
      totalTransactions,
      pendingTransactions: this.pendingTransactions.length,
      chainValid: this.validateChain(),
      lastBlockTime: this.getLatestBlock().timestamp,
      averageBlockTime: Math.round(averageBlockTime / 1000), // em segundos
    }
  }

  async exportAuditReport(format: "json" | "csv" = "json"): Promise<string> {
    const auditTrail = this.getAuditTrail()

    if (format === "csv") {
      const headers = ["Transaction ID", "Action", "User", "Timestamp", "Verified", "Block Index"]
      const rows = auditTrail.map((item) => [
        item.transactionId,
        item.action,
        item.user,
        item.timestamp.toISOString(),
        item.verified.toString(),
        item.blockIndex.toString(),
      ])

      return [headers, ...rows].map((row) => row.join(",")).join("\n")
    }

    return JSON.stringify(auditTrail, null, 2)
  }
}

export const blockchainService = new BlockchainService()
