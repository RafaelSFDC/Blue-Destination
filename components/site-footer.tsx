import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">Blue Destination</h3>
            <p className="mb-4 text-gray-400">
              Oferecendo experiências de viagem inesquecíveis desde 2010. Descubra o mundo conosco!
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Youtube size={20} />
                <span className="sr-only">Youtube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-primary">
                  Destinos
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-primary">
                  Pacotes
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Destinos Populares</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/destinations/dest-001" className="hover:text-primary">
                  Maldivas
                </Link>
              </li>
              <li>
                <Link href="/destinations/dest-002" className="hover:text-primary">
                  Tóquio
                </Link>
              </li>
              <li>
                <Link href="/destinations/dest-003" className="hover:text-primary">
                  Santorini
                </Link>
              </li>
              <li>
                <Link href="/destinations/dest-004" className="hover:text-primary">
                  Machu Picchu
                </Link>
              </li>
              <li>
                <Link href="/destinations/dest-006" className="hover:text-primary">
                  Veneza
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 shrink-0" />
                <span>Av. Paulista, 1000, São Paulo - SP, Brasil</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 shrink-0" />
                <span>+55 (11) 9999-9999</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 shrink-0" />
                <span>contato@bluedestination.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Blue Destination. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
