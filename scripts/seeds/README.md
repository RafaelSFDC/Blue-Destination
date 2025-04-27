# Scripts de Seed para o Travel Website

Este diretório contém scripts para popular o banco de dados Appwrite com dados de exemplo para o site de viagens. Os scripts criam dados realistas para simular uma aplicação em produção.

## Pré-requisitos

- Node.js instalado
- Projeto Appwrite configurado
- Arquivo `.env.local` com as variáveis de ambiente necessárias
- Coleções criadas no Appwrite (execute `scripts/setup-basic-collections.ts` primeiro)

## Variáveis de Ambiente Necessárias

Certifique-se de que seu arquivo `.env.local` contém as seguintes variáveis:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=seu-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=seu-database-id
APPWRITE_API_KEY=sua-api-key
NEXT_PUBLIC_COLLECTION_USERS=id-da-colecao-users
NEXT_PUBLIC_COLLECTION_DESTINATIONS=id-da-colecao-destinations
...
```

## Executando os Scripts

### Executar Todos os Scripts

Para executar todos os scripts de seed em sequência:

```bash
npx ts-node scripts/seeds/run-all-seeds.ts
```

### Executar Scripts Individualmente

Os scripts devem ser executados na seguinte ordem:

1. Tags:
```bash
npx ts-node scripts/seeds/01-seed-tags.ts
```

2. Usuários:
```bash
npx ts-node scripts/seeds/02-seed-users.ts
```

3. Destinos:
```bash
npx ts-node scripts/seeds/03-seed-destinations.ts
```

4. Pacotes:
```bash
npx ts-node scripts/seeds/04-seed-packages.ts
```

5. Itinerários:
```bash
npx ts-node scripts/seeds/05-seed-itineraries.ts
```

6. Depoimentos:
```bash
npx ts-node scripts/seeds/06-seed-testimonials.ts
```

7. Reservas:
```bash
npx ts-node scripts/seeds/07-seed-bookings.ts
```

## Descrição dos Scripts

- **01-seed-tags.ts**: Cria tags para categorizar destinos e pacotes
- **02-seed-users.ts**: Cria usuários, endereços e preferências de usuário
- **03-seed-destinations.ts**: Cria destinos turísticos com detalhes realistas
- **04-seed-packages.ts**: Cria pacotes de viagem, inclusões e descontos
- **05-seed-itineraries.ts**: Cria itinerários detalhados para os pacotes, incluindo atividades, refeições e acomodações
- **06-seed-testimonials.ts**: Cria depoimentos de usuários sobre destinos e pacotes
- **07-seed-bookings.ts**: Cria reservas, pagamentos e passageiros

## Arquivos Gerados

Os scripts geram arquivos JSON com IDs das entidades criadas:

- `scripts/tag-ids.json`: IDs das tags
- `scripts/destination-ids.json`: IDs dos destinos
- `scripts/package-ids.json`: IDs dos pacotes

## Utilitários

O arquivo `utils.ts` contém funções auxiliares utilizadas pelos scripts de seed, incluindo:

- Funções para criar documentos no Appwrite
- Funções para verificar se documentos já existem
- Funções para gerar dados aleatórios com Faker.js
- Funções para manipulação de datas

## Observações

- Os scripts são idempotentes e verificam se os dados já existem antes de criar novos
- As relações entre entidades são criadas automaticamente
- Imagens são geradas usando URLs do Unsplash
- Os dados gerados são realistas e adequados para demonstração e testes
