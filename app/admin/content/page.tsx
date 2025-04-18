import Link from "next/link"
import Image from "next/image"
import { Edit, FileText, Filter, Globe, Grid, ImageIcon, LayoutGrid, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Dados mockados para conteúdo
const mockPages = [
  {
    id: "page-001",
    title: "Página Inicial",
    slug: "home",
    status: "published",
    lastUpdated: "2023-05-10T14:30:00Z",
    author: "Admin",
  },
  {
    id: "page-002",
    title: "Sobre Nós",
    slug: "about",
    status: "published",
    lastUpdated: "2023-04-15T10:15:00Z",
    author: "Admin",
  },
  {
    id: "page-003",
    title: "Contato",
    slug: "contact",
    status: "published",
    lastUpdated: "2023-04-20T16:45:00Z",
    author: "Admin",
  },
  {
    id: "page-004",
    title: "Termos e Condições",
    slug: "terms",
    status: "published",
    lastUpdated: "2023-03-05T11:20:00Z",
    author: "Admin",
  },
  {
    id: "page-005",
    title: "Política de Privacidade",
    slug: "privacy",
    status: "draft",
    lastUpdated: "2023-05-15T09:30:00Z",
    author: "Admin",
  },
]

const mockBlogPosts = [
  {
    id: "post-001",
    title: "10 Destinos Imperdíveis para 2023",
    slug: "10-destinos-imperdiveis-2023",
    status: "published",
    category: "Dicas de Viagem",
    lastUpdated: "2023-05-12T14:30:00Z",
    author: "João Silva",
    featured: true,
    image: "/placeholder.svg?height=200&width=300&text=Destinos+2023",
  },
  {
    id: "post-002",
    title: "Como Economizar em sua Viagem Internacional",
    slug: "como-economizar-viagem-internacional",
    status: "published",
    category: "Economia",
    lastUpdated: "2023-05-05T10:15:00Z",
    author: "Maria Oliveira",
    featured: false,
    image: "/placeholder.svg?height=200&width=300&text=Economia",
  },
  {
    id: "post-003",
    title: "Guia Completo: Maldivas",
    slug: "guia-completo-maldivas",
    status: "published",
    category: "Destinos",
    lastUpdated: "2023-04-28T16:45:00Z",
    author: "Carlos Santos",
    featured: true,
    image: "/placeholder.svg?height=200&width=300&text=Maldivas",
  },
  {
    id: "post-004",
    title: "O que Levar na Mala: Lista Essencial",
    slug: "o-que-levar-na-mala",
    status: "draft",
    category: "Dicas de Viagem",
    lastUpdated: "2023-05-14T11:20:00Z",
    author: "Ana Pereira",
    featured: false,
    image: "/placeholder.svg?height=200&width=300&text=Mala",
  },
]

const mockMedia = [
  {
    id: "media-001",
    name: "banner-home.jpg",
    type: "image",
    size: "1.2 MB",
    dimensions: "1920x1080",
    uploadedAt: "2023-05-10T14:30:00Z",
    url: "/placeholder.svg?height=200&width=300&text=Banner",
  },
  {
    id: "media-002",
    name: "maldivas-hero.jpg",
    type: "image",
    size: "2.4 MB",
    dimensions: "2000x1200",
    uploadedAt: "2023-05-05T10:15:00Z",
    url: "/placeholder.svg?height=200&width=300&text=Maldivas",
  },
  {
    id: "media-003",
    name: "tokyo-gallery.jpg",
    type: "image",
    size: "1.8 MB",
    dimensions: "1800x1200",
    uploadedAt: "2023-04-28T16:45:00Z",
    url: "/placeholder.svg?height=200&width=300&text=Tokyo",
  },
  {
    id: "media-004",
    name: "santorini-view.jpg",
    type: "image",
    size: "3.2 MB",
    dimensions: "2400x1600",
    uploadedAt: "2023-05-14T11:20:00Z",
    url: "/placeholder.svg?height=200&width=300&text=Santorini",
  },
  {
    id: "media-005",
    name: "travel-guide.pdf",
    type: "document",
    size: "4.5 MB",
    uploadedAt: "2023-05-15T09:30:00Z",
    url: "/placeholder.svg?height=200&width=300&text=PDF",
  },
  {
    id: "media-006",
    name: "promo-video.mp4",
    type: "video",
    size: "24.8 MB",
    duration: "2:34",
    uploadedAt: "2023-05-08T13:45:00Z",
    url: "/placeholder.svg?height=200&width=300&text=Video",
  },
]

export default function ContentPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Publicado
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Rascunho
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Agendado
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

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      case "video":
        return <LayoutGrid className="h-5 w-5 text-red-500" />
      case "document":
        return <FileText className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Conteúdo</h2>
          <p className="text-muted-foreground">Gerencie páginas, blog e mídia do site.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button asChild>
            <Link href="/admin/content/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Conteúdo
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar conteúdo..." className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="pages">
        <TabsList>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="media">Mídia</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Páginas do Site</CardTitle>
              <CardDescription>
                Gerencie as páginas estáticas do site. Total de {mockPages.length} página{mockPages.length !== 1 && "s"}
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium">Título</th>
                      <th className="px-4 py-3 text-left font-medium">Slug</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Última Atualização</th>
                      <th className="px-4 py-3 text-left font-medium">Autor</th>
                      <th className="px-4 py-3 text-right font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPages.map((page) => (
                      <tr key={page.id} className="border-b">
                        <td className="px-4 py-3">
                          <div className="font-medium">{page.title}</div>
                        </td>
                        <td className="px-4 py-3">
                          <code className="rounded bg-muted px-1 py-0.5 text-sm">{page.slug}</code>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(page.status)}</td>
                        <td className="px-4 py-3">{formatDate(page.lastUpdated)}</td>
                        <td className="px-4 py-3">{page.author}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/content/pages/${page.id}/edit`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/${page.slug}`} target="_blank">
                                <Globe className="h-4 w-4" />
                                <span className="sr-only">Visualizar</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/admin/content/pages/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Página
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="blog" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Posts do Blog</CardTitle>
              <CardDescription>
                Gerencie os posts do blog. Total de {mockBlogPosts.length} post{mockBlogPosts.length !== 1 && "s"}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mockBlogPosts.map((post) => (
                  <Card key={post.id}>
                    <div className="relative aspect-video">
                      <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                      {post.featured && <Badge className="absolute left-2 top-2 bg-primary text-white">Destaque</Badge>}
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="outline">{post.category}</Badge>
                        {getStatusBadge(post.status)}
                      </div>
                      <h3 className="mb-2 line-clamp-1 text-lg font-bold">{post.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{post.author}</span>
                        <span>{formatDate(post.lastUpdated)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <div className="flex w-full justify-between">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Globe className="mr-2 h-4 w-4" />
                            Visualizar
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/content/blog/${post.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/admin/content/blog/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Post
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Biblioteca de Mídia</CardTitle>
                  <CardDescription>
                    Gerencie imagens, vídeos e documentos. Total de {mockMedia.length} arquivo
                    {mockMedia.length !== 1 && "s"}.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Grid className="mr-2 h-4 w-4" />
                    Grade
                  </Button>
                  <Button variant="outline" size="sm">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Lista
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {mockMedia.map((media) => (
                  <Card key={media.id} className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      {media.type === "image" ? (
                        <Image src={media.url || "/placeholder.svg"} alt={media.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">{getMediaTypeIcon(media.type)}</div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        {getMediaTypeIcon(media.type)}
                        <div className="line-clamp-1 font-medium">{media.name}</div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{media.size}</span>
                        <span>{formatDate(media.uploadedAt)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <div className="flex w-full justify-between">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Fazer Upload
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
