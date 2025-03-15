export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  points: number
  role?: string
}

export interface Script {
  _id: string
  title: string
  resourceName: string
  pointsPrice: number
  status: string
}

export interface ServerIp {
  _id: string
  userId: string
  resourceName: string
  ipAddress: string
  isActive: boolean
  lastActive?: Date
}

export interface Purchase {
  _id: string
  userId: string
  scriptId: string
  script: Script
  serverIp?: ServerIp
  createdAt: Date
}

export interface DashboardProps {
  user: User
  purchases: Purchase[]
} 