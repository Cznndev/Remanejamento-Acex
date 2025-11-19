import { gql } from "@apollo/client"

// Definições de tipos GraphQL
export const typeDefs = gql`
  # Tipos básicos
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    department: String
    lastLogin: String
    active: Boolean!
  }

  type Hardware {
    id: ID!
    name: String!
    type: String!
    model: String!
    serialNumber: String
    status: String!
    department: String!
    purchaseDate: String
    specifications: HardwareSpecs
    maintenanceHistory: [Maintenance]
  }

  type HardwareSpecs {
    processor: String
    ram: String
    storage: String
    operatingSystem: String
    warranty: String
    location: String
  }

  type Software {
    id: ID!
    name: String!
    type: String!
    license: String!
    status: String!
    expirationDate: String
    users: Int
    version: String
    vendor: String
    productKey: String
    support: String
    cost: Float
    responsible: String
    activeUsers: [User]
  }

  type NetworkDevice {
    id: ID!
    name: String!
    type: String!
    ipAddress: String!
    status: String!
    location: String
    manufacturer: String
    model: String
    firmware: String
    ports: Int
    speed: String
    vlan: String
    poe: Boolean
    networkConfig: NetworkConfig
  }

  type NetworkConfig {
    gateway: String
    subnetMask: String
    dns: [String]
    dhcp: Boolean
    uptime: String
  }

  type Database {
    id: ID!
    name: String!
    type: String!
    server: String!
    status: String!
    version: String
    size: String
    serverConfig: DatabaseServerConfig
    backupHistory: [Backup]
    performance: DatabasePerformance
  }

  type DatabaseServerConfig {
    host: String
    port: Int
    charset: String
    engine: String
    connections: Int
    bufferSize: String
  }

  type Backup {
    id: ID!
    date: String!
    size: String
    status: String!
    location: String
  }

  type DatabasePerformance {
    cpu: Float
    memory: Float
    activeConnections: Int
    uptime: String
  }

  type Maintenance {
    id: ID!
    date: String!
    type: String!
    description: String
    technician: String
    cost: Float
    status: String!
  }

  type AuditLog {
    id: ID!
    timestamp: String!
    user: User
    action: String!
    resource: String!
    details: String
    ipAddress: String
    userAgent: String
  }

  type Alert {
    id: ID!
    timestamp: String!
    level: String!
    message: String!
    source: String!
    acknowledged: Boolean
    details: String
  }

  # Queries
  type Query {
    # Usuários
    users: [User]
    user(id: ID!): User
    
    # Hardware
    hardwareItems: [Hardware]
    hardware(id: ID!): Hardware
    
    # Software
    softwareItems: [Software]
    software(id: ID!): Software
    
    # Rede
    networkDevices: [NetworkDevice]
    networkDevice(id: ID!): NetworkDevice
    
    # Banco de dados
    databases: [Database]
    database(id: ID!): Database
    
    # Auditoria
    auditLogs(limit: Int, offset: Int): [AuditLog]
    auditLog(id: ID!): AuditLog
    
    # Alertas
    alerts(acknowledged: Boolean): [Alert]
    alert(id: ID!): Alert
  }

  # Mutations
  type Mutation {
    # Usuários
    createUser(name: String!, email: String!, role: String!, department: String): User
    updateUser(id: ID!, name: String, email: String, role: String, department: String, active: Boolean): User
    deleteUser(id: ID!): Boolean
    
    # Hardware
    createHardware(name: String!, type: String!, model: String!, serialNumber: String, status: String!, department: String!): Hardware
    updateHardware(id: ID!, name: String, type: String, model: String, serialNumber: String, status: String, department: String): Hardware
    deleteHardware(id: ID!): Boolean
    
    # Software
    createSoftware(name: String!, type: String!, license: String!, status: String!): Software
    updateSoftware(id: ID!, name: String, type: String, license: String, status: String): Software
    deleteSoftware(id: ID!): Boolean
    
    # Rede
    createNetworkDevice(name: String!, type: String!, ipAddress: String!, status: String!): NetworkDevice
    updateNetworkDevice(id: ID!, name: String, type: String, ipAddress: String, status: String): NetworkDevice
    deleteNetworkDevice(id: ID!): Boolean
    
    # Banco de dados
    createDatabase(name: String!, type: String!, server: String!, status: String!): Database
    updateDatabase(id: ID!, name: String, type: String, server: String, status: String): Database
    deleteDatabase(id: ID!): Boolean
    
    # Alertas
    acknowledgeAlert(id: ID!): Alert
  }

  # Subscriptions para atualizações em tempo real
  type Subscription {
    userAdded: User
    hardwareUpdated: Hardware
    softwareUpdated: Software
    networkDeviceUpdated: NetworkDevice
    databaseUpdated: Database
    newAlert: Alert
    newAuditLog: AuditLog
  }
`

// Exportar fragmentos comuns para reutilização
export const HARDWARE_FRAGMENT = gql`
  fragment HardwareDetails on Hardware {
    id
    name
    type
    model
    serialNumber
    status
    department
    purchaseDate
    specifications {
      processor
      ram
      storage
      operatingSystem
      warranty
      location
    }
  }
`

export const SOFTWARE_FRAGMENT = gql`
  fragment SoftwareDetails on Software {
    id
    name
    type
    license
    status
    expirationDate
    users
    version
    vendor
    productKey
    support
    cost
    responsible
  }
`

export const NETWORK_DEVICE_FRAGMENT = gql`
  fragment NetworkDeviceDetails on NetworkDevice {
    id
    name
    type
    ipAddress
    status
    location
    manufacturer
    model
    firmware
    ports
    speed
    vlan
    poe
    networkConfig {
      gateway
      subnetMask
      dns
      dhcp
      uptime
    }
  }
`

export const DATABASE_FRAGMENT = gql`
  fragment DatabaseDetails on Database {
    id
    name
    type
    server
    status
    version
    size
    serverConfig {
      host
      port
      charset
      engine
      connections
      bufferSize
    }
    performance {
      cpu
      memory
      activeConnections
      uptime
    }
  }
`
