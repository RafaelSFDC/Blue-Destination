# Instruções para Configuração Manual de Relações no Appwrite

Este documento lista todas as relações que precisam ser configuradas manualmente no painel administrativo do Appwrite.

## Relações entre Coleções

### Users
- `address` → Relação Many-to-One com `Addresses`
- `preferences` → Relação One-to-One com `UserPreferences`
- `favorites` → Relação Many-to-Many com `Destinations` e `Packages`

### Reviews
- `userId` → Relação Many-to-One com `Users`
- `itemId` → Relação Many-to-One com `Destinations` ou `Packages` (dependendo do tipo)

### Notifications
- `userId` → Relação Many-to-One com `Users`

### Destinations
- `tags` → Relação Many-to-Many com `Tags`

### Packages
- `destinations` → Relação Many-to-Many com `Destinations`
- `tags` → Relação Many-to-Many com `Tags`

### Bookings
- `user` → Relação Many-to-One com `Users`
- `package` → Relação Many-to-One com `Packages`

### Testimonials
- `user` → Relação Many-to-One com `Users`
- `package` → Relação Many-to-One com `Packages`
- `destination` → Relação Many-to-One com `Destinations`

### Messages
- `user` → Relação Many-to-One com `Users`

### Itinerary
- `package` → Relação Many-to-One com `Packages`
- `activities` → Relação Many-to-Many com `Activities`
- `meals` → Relação One-to-One com `Meals`
- `accommodation` → Relação One-to-One com `Accommodations`

## Passos para Configuração

1. Acesse o Console do Appwrite
2. Navegue até Databases > Seu Database
3. Para cada coleção listada acima:
   - Clique na coleção
   - Vá para a aba "Attributes"
   - Clique em "Create Attribute"
   - Selecione "Relationship"
   - Configure conforme o tipo de relação especificado
   - Defina as permissões apropriadas

## Observações Importantes

- Certifique-se de que todas as coleções foram criadas antes de configurar as relações
- Mantenha as permissões consistentes entre as coleções relacionadas
- Após criar uma relação, aguarde a indexação ser concluída antes de criar a próxima
- Algumas relações podem exigir índices adicionais para melhor performance

## Verificação

Após configurar todas as relações, você pode verificar se estão funcionando corretamente:

1. Use a aba "Browse" para visualizar os documentos
2. Verifique se as relações aparecem corretamente nos documentos
3. Teste algumas queries que envolvam as relações
4. Confirme se os dados dos seeds estão sendo inseridos corretamente

## Troubleshooting

Se encontrar problemas:

1. Verifique se a coleção relacionada existe
2. Confirme se as permissões estão corretas
3. Verifique se os IDs das coleções no .env.local correspondem aos IDs reais
4. Certifique-se de que os índices foram criados corretamente