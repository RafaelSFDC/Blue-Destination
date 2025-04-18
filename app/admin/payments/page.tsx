import Link from "next/link"
import { CreditCard, Download, Eye, Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

// Dados mockados para pagamentos
const mockPayments = [
  {
    id: "payment-001",
    bookingId: "book-001",
    userId: "user-001",
    userName: "João Silva",
    amount: 12500,
    method: "credit_card",
    status: "completed",
    date: "2023-05-10T14:30:00Z",
    cardLast4: "4242",
  },
  {
    id: "payment-002",
    bookingId: "book-002",
    userId: "user-002",
    userName: "Maria Oliveira",
    amount: 15800,
    method: "pix",
    status: "completed",
    date: "2023-05-12T10:15:00Z",
  },
  {
    id: "payment-003",
    bookingId: "book-003",
    userId: "user-003",
    userName: "Carlos Santos",
    amount: 18200,
    method: "bank_transfer",
    status: "pending",
    date: "2023-05-14T16:45:00Z",
  },
  {
    id: "payment-004",
    bookingId: "book-004",
    userId: "user-004",
    userName: "Ana Pereira",
    amount: 9800,
    method: "credit_card",
    status: "refunded",
    date: "2023-05-08T11:20:00Z",
    cardLast4: "1234",
  },
  {
    id: "payment-005",
    bookingId: "book-005",
    userId: "user-005",
    userName: "Pedro Costa",
    amount: 11200,
    method: "pix",
    status: "completed",
    date: "2023-05-15T09:30:00Z",
  },
]

export default function PaymentsPage() {
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

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Cartão de Crédito"
      case "pix":
        return "PIX"
      case "bank_transfer":
        return "Transferência Bancária"
      default:
        return "Outro"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Concluído
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pendente
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Reembolsado
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Falhou
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
          <h2 className="text-3xl font-bold tracking-tight">Pagamentos</h2>
          <p className="text-muted-foreground">Gerencie os pagamentos recebidos.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button asChild>
            <Link href="/admin/payments/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Pagamento
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar pagamentos..." className="pl-8" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Pagamentos</CardTitle>
          <CardDescription>
            Total de {mockPayments.length} pagamento{mockPayments.length !== 1 && "s"} registrado
            {mockPayments.length !== 1 && "s"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-medium">#{payment.id}</div>
                      <div className="text-xs text-muted-foreground">Reserva: #{payment.bookingId}</div>
                    </TableCell>
                    <TableCell>{payment.userName}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {getMethodLabel(payment.method)}
                          {payment.cardLast4 && (
                            <span className="text-xs text-muted-foreground"> •••• {payment.cardLast4}</span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/payments/${payment.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Recibo</span>
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
            <CardTitle className="text-lg">Total Recebido</CardTitle>
            <CardDescription>Valor total de pagamentos concluídos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(
                mockPayments
                  .filter((payment) => payment.status === "completed")
                  .reduce((sum, payment) => sum + payment.amount, 0),
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockPayments.filter((payment) => payment.status === "completed").length} pagamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pendente</CardTitle>
            <CardDescription>Valor total de pagamentos pendentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(
                mockPayments
                  .filter((payment) => payment.status === "pending")
                  .reduce((sum, payment) => sum + payment.amount, 0),
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockPayments.filter((payment) => payment.status === "pending").length} pagamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reembolsado</CardTitle>
            <CardDescription>Valor total de reembolsos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(
                mockPayments
                  .filter((payment) => payment.status === "refunded")
                  .reduce((sum, payment) => sum + payment.amount, 0),
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockPayments.filter((payment) => payment.status === "refunded").length} pagamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
            <CardDescription>Distribuição por método</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Cartão de Crédito</span>
                <span className="text-sm font-medium">
                  {mockPayments.filter((payment) => payment.method === "credit_card").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">PIX</span>
                <span className="text-sm font-medium">
                  {mockPayments.filter((payment) => payment.method === "pix").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Transferência</span>
                <span className="text-sm font-medium">
                  {mockPayments.filter((payment) => payment.method === "bank_transfer").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
