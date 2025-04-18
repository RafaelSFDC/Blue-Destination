import Link from "next/link"
import { Edit, Trash2, Plus, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Dados mockados para usuários
const mockUsers = [
  {
    id: "user-001",
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "+55 (11) 98765-4321",
    address: "São Paulo, SP",
    role: "customer",
    status: "active",
    lastLogin: "2023-05-15T10:30:00Z",
    createdAt: "2023-01-10T08:15:00Z",
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
  },
  {
    id: "user-002",
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    phone: "+55 (21) 97654-3210",
    address: "Rio de Janeiro, RJ",
    role: "customer",
    status: "active",
    lastLogin: "2023-05-14T14:45:00Z",
    createdAt: "2023-02-05T11:20:00Z",
    avatar: "/placeholder.svg?height=40&width=40&text=MO",
  },
  {
    id: "user-003",
    name: "Carlos Santos",
    email: "carlos.santos@example.com",
    phone: "+55 (31) 96543-2109",
    address: "Belo Horizonte, MG",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-15T09:10:00Z",
    createdAt: "2023-01-15T10:30:00Z",
    avatar: "/placeholder.svg?height=40&width=40&text=CS",
  },
  {
    id: "user-004",
    name: "Ana Pereira",
    email: "ana.pereira@example.com",
    phone: "+55 (41) 95432-1098",
    address: "Curitiba, PR",
    role: "customer",
    status: "inactive",
    lastLogin: "2023-04-20T16:25:00Z",
    createdAt: "2023-03-01T09:45:00Z",
    avatar: "/placeholder.svg?height=40&width=40&text=AP",
  },
  {
    id: "user-005",
    name: "Pedro Costa",
    email: "pedro.costa@example.com",
    phone: "+55 (51) 94321-0987",
    address: "Porto Alegre, RS",
    role: "customer",
    status: "active",
    lastLogin: "2023-05-13T11:50:00Z",
    createdAt: "2023-02-20T14:15:00Z",
    avatar: "/placeholder.svg?height=40&width=40&text=PC",
  },
]

export default function AdminUsersPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Administrador
          </Badge>
        )
      case "staff":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Funcionário
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Cliente
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Ativo
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Inativo
          </Badge>
        )
      case "blocked":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Bloqueado
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Desconhecido
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">Gerencie os usuários cadastrados no sistema.</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuários</CardTitle>
          <CardDescription>
            Total de {mockUsers.length} usuário{mockUsers.length !== 1 && "s"} cadastrado
            {mockUsers.length !== 1 && "s"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{user.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{formatDate(user.createdAt)}</div>
                        <div className="text-xs text-muted-foreground">Último acesso: {formatDate(user.lastLogin)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Usuários</CardTitle>
            <CardDescription>Usuários cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockUsers.filter((user) => user.status === "active").length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Administradores</CardTitle>
            <CardDescription>Usuários com privilégios administrativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockUsers.filter((user) => user.role === "admin").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockUsers.filter((user) => user.role === "admin").length / mockUsers.length) * 100)}% do
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Usuários Ativos</CardTitle>
            <CardDescription>Usuários com status ativo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockUsers.filter((user) => user.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockUsers.filter((user) => user.status === "active").length / mockUsers.length) * 100)}% do
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Novos Usuários</CardTitle>
            <CardDescription>Usuários cadastrados nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                mockUsers.filter(
                  (user) => new Date(user.createdAt).getTime() > new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Nos últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
