# Jornada: Jornada_Reengajamento_WhatsApp

**Função:** Automatizar a jornada de comunicação via WhatsApp para reengajar clientes inativos.

---

### Fonte de Entrada (Entry Source)
- **Tipo:** Data Extension
- **Nome da DE:** `DE_MRV_Inativos`
- **Configuração:** A opção "Re-entry anytime" deve ser ativada para permitir que um contato possa entrar na jornada novamente se ficar inativo no futuro.

---

### Passos da Jornada (Journey Steps)

1.  **Espera (Wait)**
    - **Duração:** 1 hora.
    - **Motivo:** Opcional, para permitir um período de validação ou processamento antes do envio da mensagem.

2.  **Envio de Mensagem WhatsApp (WhatsApp Message)**
    - **Canal:** WhatsApp
    - **Conteúdo da Mensagem (Refatorado com AMPScript e Lookup):**
      Este é o bloco de código completo e refatorado. Ele agora busca as configurações da `DE_MRV_Configuracao`.

      **Nota de Engenharia:** Este bloco de código deve ser salvo como um **Code Snippet** no Content Builder (ex: com a chave `snippet_gerador_link_whatsapp`). Nas jornadas, em vez de colar o código todo, você inseriria apenas `%%=ContentBlockByKey("snippet_gerador_link_whatsapp")=%%`. Isso centraliza a lógica e facilita futuras manutenções.

      ```html
      %%[
      /*
        ================================================================
        SCRIPT REUTILIZÁVEL PARA LINK DE WHATSAPP (v2.0)
        ================================================================
        Objetivo: Construir um link de WhatsApp seguro, rastreável e configurável
        de forma centralizada via Data Extension.
      */

      // --- VARIÁVEIS ---
      VAR @whatsapp_mrv, @mensagem_pre_preenchida, @mensagem_codificada, @link_whatsapp

      // --- LÓGICA ---
      // Busca os valores da DE de Configuração.
      SET @whatsapp_mrv = Lookup("DE_MRV_Configuracao", "Valor", "Chave", "NumeroWhatsAppVendas")
      SET @mensagem_pre_preenchida = Lookup("DE_MRV_Configuracao", "Valor", "Chave", "MensagemPadraoWhatsApp")

      // Fallback: Se o lookup falhar, define valores padrão para evitar erros.
      IF Empty(@whatsapp_mrv) THEN
        SET @whatsapp_mrv = "5511000000000" // Número de fallback
      ENDIF
      IF Empty(@mensagem_pre_preenchida) THEN
        SET @mensagem_pre_preenchida = "Olá!"
      ENDIF

      // Codifica a mensagem para ser usada em uma URL.
      SET @mensagem_codificada = URLEncode(@mensagem_pre_preenchida, 1)

      // Constrói o link final do WhatsApp.
      SET @link_whatsapp = Concat("https://wa.me/", @whatsapp_mrv, "?text=", @mensagem_codificada)

      ]%%
      Olá, %%Nome%%! Notei que você não interage conosco há um tempo. Que tal descobrir os novos lançamentos da MRV via WhatsApp?

      <br><br>

      <a href="%%=RedirectTo(@link_whatsapp)=%%" alias="whatsapp_reengagement_link" title="Falar com MRV no WhatsApp"><b>Clique aqui para falar com um de nossos consultores!</b></a>
      ```
    - **Personalização:** O `%%Nome%%` é preenchido pelo Journey Builder. O link do WhatsApp é construído dinamicamente pelo AMPScript, que busca as configurações da `DE_MRV_Configuracao` e garante o rastreamento de cliques com `RedirectTo()`.

3.  **Espera (Wait)**
    - **Duração:** 3 dias.
    - **Motivo:** Aguardar uma resposta ou interação do cliente com a mensagem enviada.

4.  **Decisão de Divisão (Decision Split)**
    - **Critério:** Verificar se o contato interagiu (clicou no link) com a mensagem de WhatsApp.
    - **Branch 1: Sim (Interagiu)**
        - **Ação:** Sair da jornada (Exit). O objetivo de reengajamento foi atingido.
    - **Branch 2: Não (Não interagiu)**
        - **Ação:** Seguir para uma próxima etapa.
        - **Sugestão de Próxima Etapa:** Enviar uma segunda mensagem de lembrete ou adicionar o contato a uma DE para recontato manual pela equipe de vendas.

---

### Diagrama Lógico

`[Entrada: DE_MRV_Inativos] -> [Espera: 1 hora] -> [Mensagem WhatsApp] -> [Espera: 3 dias] -> [Divisão por Interação?]`
- `[Sim] -> [Sair da Jornada]`
- `[Não] -> [Próxima Ação / Sair da Jornada]`
