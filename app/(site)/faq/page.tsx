import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Reservas e Pagamentos",
      items: [
        {
          question: "Como posso fazer uma reserva?",
          answer:
            "Você pode fazer uma reserva diretamente pelo nosso site, selecionando o pacote desejado e seguindo as instruções de pagamento. Também é possível entrar em contato por telefone ou email para realizar sua reserva com um de nossos atendentes.",
        },
        {
          question: "Quais formas de pagamento são aceitas?",
          answer:
            "Aceitamos pagamentos via cartão de crédito (parcelamento em até 12x), PIX, boleto bancário e transferência bancária. Para pacotes internacionais, também oferecemos a opção de pagamento em dólar.",
        },
        {
          question: "Qual é a política de cancelamento?",
          answer:
            "Nossa política de cancelamento varia de acordo com o pacote. Em geral, cancelamentos feitos com mais de 30 dias de antecedência recebem reembolso total. Entre 30 e 15 dias, o reembolso é de 70%. Entre 14 e 7 dias, o reembolso é de 50%. Cancelamentos com menos de 7 dias não são reembolsáveis. Consulte os termos específicos do seu pacote.",
        },
        {
          question: "É possível alterar a data da minha viagem?",
          answer:
            "Sim, alterações de data são possíveis, sujeitas à disponibilidade e possíveis diferenças de tarifa. Alterações devem ser solicitadas com pelo menos 15 dias de antecedência da data original da viagem.",
        },
      ],
    },
    {
      title: "Pacotes e Destinos",
      items: [
        {
          question: "Os pacotes incluem passagens aéreas?",
          answer:
            "A maioria dos nossos pacotes inclui passagens aéreas, mas também oferecemos opções sem passagem para quem prefere adquiri-las separadamente. Na descrição de cada pacote, você encontrará informações detalhadas sobre o que está incluído.",
        },
        {
          question: "É possível personalizar um pacote?",
          answer:
            "Sim, oferecemos a opção de personalizar pacotes de acordo com suas preferências. Entre em contato com nossa equipe para discutir suas necessidades específicas e criaremos um roteiro sob medida para você.",
        },
        {
          question: "Vocês oferecem pacotes para grupos?",
          answer:
            "Sim, temos opções especiais para grupos a partir de 10 pessoas, com descontos progressivos de acordo com o tamanho do grupo. Entre em contato para mais informações.",
        },
        {
          question: "Quais são os destinos mais populares?",
          answer:
            "Nossos destinos mais populares incluem Maldivas, Santorini, Tóquio, Machu Picchu e Veneza. No entanto, oferecemos pacotes para diversos destinos ao redor do mundo. Consulte nosso catálogo completo na seção de Destinos.",
        },
      ],
    },
    {
      title: "Documentação e Segurança",
      items: [
        {
          question: "Quais documentos são necessários para viajar?",
          answer:
            "Para viagens nacionais, é necessário documento de identidade com foto (RG ou CNH). Para viagens internacionais, é necessário passaporte válido por pelo menos 6 meses após a data de retorno e, dependendo do destino, visto. Recomendamos verificar os requisitos específicos de cada país antes de viajar.",
        },
        {
          question: "Vocês oferecem seguro viagem?",
          answer:
            "Sim, oferecemos diferentes opções de seguro viagem que podem ser adicionadas à sua reserva. Para viagens internacionais, o seguro viagem é obrigatório em muitos destinos. Recomendamos fortemente a contratação para garantir sua tranquilidade durante a viagem.",
        },
        {
          question: "O que fazer em caso de emergência durante a viagem?",
          answer:
            "Todos os nossos pacotes incluem assistência 24 horas. Em caso de emergência, entre em contato com o número fornecido em seus documentos de viagem. Além disso, recomendamos sempre ter o contato da embaixada ou consulado brasileiro no país visitado.",
        },
      ],
    },
    {
      title: "Hospedagem e Transporte",
      items: [
        {
          question: "Qual é a categoria dos hotéis incluídos nos pacotes?",
          answer:
            "Trabalhamos com hotéis de 3 a 5 estrelas, dependendo do pacote escolhido. Todos os hotéis são cuidadosamente selecionados para garantir conforto e qualidade. Na descrição de cada pacote, você encontrará informações sobre a categoria do hotel.",
        },
        {
          question: "É possível solicitar acomodações especiais?",
          answer:
            "Sim, podemos atender a solicitações especiais como quartos para não fumantes, camas extras, berços, quartos adaptados para pessoas com mobilidade reduzida, entre outros. Informe suas necessidades no momento da reserva.",
        },
        {
          question: "Como funciona o transporte durante a viagem?",
          answer:
            "Nossos pacotes incluem todos os traslados (aeroporto-hotel-aeroporto) e transporte para os passeios incluídos no roteiro. Para deslocamentos adicionais, oferecemos opções de aluguel de veículos ou serviços de transporte privativo.",
        },
      ],
    },
    {
      title: "Conta e Perfil",
      items: [
        {
          question: "Como criar uma conta no site?",
          answer:
            "Para criar uma conta, clique em 'Cadastrar' no canto superior direito do site e preencha o formulário com seus dados. Após a confirmação por email, sua conta estará ativa e você poderá acessar todas as funcionalidades do site.",
        },
        {
          question: "Esqueci minha senha. O que fazer?",
          answer:
            "Na página de login, clique em 'Esqueceu a senha?' e siga as instruções para redefinir sua senha. Você receberá um email com um link para criar uma nova senha.",
        },
        {
          question: "Como atualizar meus dados pessoais?",
          answer:
            "Após fazer login, acesse 'Meu Perfil' no menu do usuário. Lá você poderá atualizar seus dados pessoais, preferências de viagem e informações de contato.",
        },
        {
          question: "Como visualizar minhas reservas anteriores?",
          answer:
            "Após fazer login, acesse 'Minhas Reservas' no menu do usuário. Lá você encontrará um histórico de todas as suas reservas, incluindo detalhes e documentos relacionados.",
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container text-center">
            <h1 className="mb-4 text-4xl font-bold">Perguntas Frequentes</h1>
            <p className="mx-auto max-w-2xl text-lg">
              Encontre respostas para as dúvidas mais comuns sobre nossos serviços, reservas, pacotes e muito mais.
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="container py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {faqCategories.map((category, index) => (
              <div key={index} className="rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-bold">{category.title}</h2>
                <p className="mb-4 text-muted-foreground">{category.items.length} perguntas nesta categoria</p>
                <Button asChild variant="outline" className="w-full">
                  <a href={`#category-${index}`}>Ver Perguntas</a>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Content */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} id={`category-${categoryIndex}`} className="mb-12">
                <h2 className="mb-6 text-2xl font-bold">{category.title}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="container py-16">
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Não encontrou o que procurava?</h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Nossa equipe está pronta para responder a todas as suas dúvidas. Entre em contato conosco e teremos prazer
              em ajudar.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/contact">Fale Conosco</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="tel:+551199999999">Ligar Agora</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
