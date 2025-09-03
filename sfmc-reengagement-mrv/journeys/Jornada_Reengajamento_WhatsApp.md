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
    - **Conteúdo da Mensagem (com AMPScript):**
      Este é o bloco de código completo para ser inserido no conteúdo HTML da mensagem no Journey Builder.
      ```html
      %%[
      /*
        ================================================================
        SCRIPT DE PERSONALIZAÇÃO PARA MENSAGEM DE WHATSAPP - REENGAGAMENTO MRV
        ================================================================
        Objetivo: Construir um link de WhatsApp seguro e rastreável.
      */

      // --- CONFIGURAÇÃO ---
      // IMPORTANTE: Substitua o número abaixo pelo da equipe de vendas MRV.
      // Formato: Código do país + DDD + Número (tudo junto). Ex: 5511999998888
      VAR @whatsapp_mrv, @mensagem_pre_preenchida, @mensagem_codificada, @link_whatsapp

      SET @whatsapp_mrv = "5511999998888" // <<< SUBSTITUA ESTE NÚMERO

      // --- LÓGICA ---
      // Mensagem que aparecerá pré-preenchida no WhatsApp do usuário.
      SET @mensagem_pre_preenchida = "Olá, MRV! Gostaria de saber mais sobre os lançamentos."

      // Codifica a mensagem para ser usada em uma URL.
      SET @mensagem_codificada = URLEncode(@mensagem_pre_preenchida, 1)

      // Constrói o link final do WhatsApp.
      SET @link_whatsapp = Concat("https://wa.me/", @whatsapp_mrv, "?text=", @mensagem_codificada)

      ]%%
      Olá, %%Nome%%! Notei que você não interage conosco há um tempo. Que tal descobrir os novos lançamentos da MRV via WhatsApp?

      <br><br>

      <a href="%%=RedirectTo(@link_whatsapp)=%%" alias="whatsapp_reengagement_link" title="Falar com MRV no WhatsApp"><b>Clique aqui para falar com um de nossos consultores!</b></a>
      ```
    - **Personalização:** O `%%Nome%%` é preenchido pela engine do Journey Builder. O link do WhatsApp é construído dinamicamente pelo AMPScript, que também garante o rastreamento de cliques através da função `RedirectTo()`.

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
