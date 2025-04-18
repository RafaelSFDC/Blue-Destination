"use client"

import Link from "next/link"
import { Archive, Check, Filter, MessageSquare, Plus, Search, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Dados mockados para mensagens
const mockMessages = [
  {
    id: "msg-001",
    subject: "Dúvida sobre pacote para Maldivas",
    sender: {
      id: "user-001",
      name: "João Silva",
      email: "joao.silva@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=JS",
    },
    content: "Olá, gostaria de saber se o pacote para Maldivas inclui seguro viagem. Obrigado!",
    status: "unread",
    priority: "normal",
    category: "inquiry",
    date: "2023-05-15T10:30:00Z",
    isStarred: false,
  },
  {
    id: "msg-002",
    subject: "Solicitação de reembolso",
    sender: {
      id: "user-002",
      name: "Maria Oliveira",
      email: "maria.oliveira@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=MO",
    },
    content: "Preciso cancelar minha reserva e solicitar reembolso devido a problemas de saúde.",
    status: "read",
    priority: "high",
    category: "refund",
    date: "2023-05-14T14:45:00Z",
    isStarred: true,
  },
  {
    id: "msg-003",
    subject: "Alteração de data de viagem",
    sender: {
      id: "user-003",
      name: "Carlos Santos",
      email: "carlos.santos@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=CS",
    },
    content: "Gostaria de verificar a possibilidade de alterar a data da minha viagem para o próximo mês.",
    status: "unread",
    priority: "normal",
    category: "change",
    date: "2023-05-15T09:10:00Z",
    isStarred: false,
  },
  {
    id: "msg-004",
    subject: "Feedback sobre viagem a Santorini",
    sender: {
      id: "user-004",
      name: "Ana Pereira",
      email: "ana.pereira@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=AP",
    },
    content: "Quero agradecer pela incrível experiência em Santorini. O hotel e os passeios foram maravilhosos!",
    status: "read",
    priority: "low",
    category: "feedback",
    date: "2023-05-13T16:25:00Z",
    isStarred: false,
  },
  {
    id: "msg-005",
    subject: "Problema com reserva",
    sender: {
      id: "user-005",
      name: "Pedro Costa",
      email: "pedro.costa@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=PC",
    },
    content: "Estou tendo problemas para visualizar minha reserva no sistema. Podem me ajudar?",
    status: "unread",
    priority: "high",
    category: "support",
    date: "2023-05-15T11:50:00Z",
    isStarred: true,
  },
]

export default function MessagesPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "inquiry":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Dúvida
          </Badge>
        )
      case "refund":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Reembolso
          </Badge>
        )
      case "change":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Alteração
          </Badge>
        )
      case "feedback":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Feedback
          </Badge>
        )
      case "support":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Suporte
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Outro
          </Badge>
        )
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Alta
          </Badge>
        )
      case "normal":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Normal
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Baixa
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Normal
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mensagens</h2>
          <p className="text-muted-foreground">Gerencie as mensagens recebidas dos clientes.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button asChild>
            <Link href="/admin/messages/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova Mensagem
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar mensagens..." className="pl-8" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Mensagens</CardTitle>
          <CardDescription>
            Total de {mockMessages.length} mensagem{mockMessages.length !== 1 && "s"} recebida
            {mockMessages.length !== 1 && "s"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Remetente</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMessages.map((message) => (
                  <TableRow key={message.id} className={message.status === "unread" ? "font-medium" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Star
                            className={`h-4 w-4 ${message.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                          />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                          <AvatarFallback>
                            {message.sender.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{message.sender.name}</div>
                          <div className="text-xs text-muted-foreground">{message.sender.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="line-clamp-1">{message.subject}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{message.content}</div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(message.category)}</TableCell>
                    <TableCell>{getPriorityBadge(message.priority)}</TableCell>
                    <TableCell>{formatDate(message.date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/messages/${message.id}`}>
                            <MessageSquare className="h-4 w-4" />
                            <span className="sr-only">Responder</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Marcar como lida</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Archive className="h-4 w-4" />
                          <span className="sr-only">Arquivar</span>
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
            <CardTitle className="text-lg">Não Lidas</CardTitle>
            <CardDescription>Mensagens não lidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockMessages.filter((message) => message.status === "unread").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockMessages.filter((message) => message.status === "unread").length / mockMessages.length) * 100,
              )}
              % do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Alta Prioridade</CardTitle>
            <CardDescription>Mensagens com prioridade alta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockMessages.filter((message) => message.priority === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockMessages.filter((message) => message.priority === "high").length / mockMessages.length) * 100,
              )}
              % do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reembolsos</CardTitle>
            <CardDescription>Solicitações de reembolso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockMessages.filter((message) => message.category === "refund").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockMessages.filter((message) => message.category === "refund").length / mockMessages.length) * 100,
              )}
              % do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tempo de Resposta</CardTitle>
            <CardDescription>Tempo médio de resposta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">Nas últimas 24 horas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


