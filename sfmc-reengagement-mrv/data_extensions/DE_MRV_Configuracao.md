# Data Extension: DE_MRV_Configuracao

**Função:** Armazenar de forma centralizada as variáveis de configuração para as automações e jornadas da MRV. Isso permite alterar a lógica de negócio sem precisar editar o código.

**Tipo:** Não enviável (Non-Sendable).

---

### **Campos:**

| Nome do Campo | Tipo   | Propriedades      | Descrição                                         |
|---------------|--------|-------------------|---------------------------------------------------|
| Chave         | Text   | Primary Key       | O nome único da variável de configuração.         |
| Valor         | Text   | Nullable          | O valor da variável de configuração.              |
| Descricao     | Text   | Nullable          | Uma breve descrição do que a variável controla.   |

---

### **Exemplos de Registros:**

| Chave                      | Valor                                                              | Descricao                                                              |
|----------------------------|--------------------------------------------------------------------|------------------------------------------------------------------------|
| `PeriodoInatividadeDias`   | `90`                                                               | Número de dias sem interação para considerar um contato inativo.       |
| `NumeroWhatsAppVendas`     | `5511999998888`                                                    | Número de destino para o clique do WhatsApp (formato internacional).   |
| `MensagemPadraoWhatsApp`   | `Olá, MRV! Gostaria de saber mais sobre os lançamentos.`           | Mensagem pré-preenchida que o usuário enviará ao clicar no link.       |
| `NomeSnippetLinkWhatsApp`  | `snippet_gerador_link_whatsapp`                                    | Chave do Code Snippet que gera o link do WhatsApp no Content Builder.  |
