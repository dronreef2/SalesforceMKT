# Guia de Monitoramento e Tratamento de Erros

Este documento detalha como implementar as melhorias de monitoramento para a automação de reengajamento da MRV.

---

## Parte 1: Monitoramento da Automação (Automation Studio)

O objetivo é garantir que a query SQL que popula a DE de inativos (`DE_MRV_Inativos`) seja executada com sucesso todos os dias. Faremos isso com uma **Atividade de Verificação (Verification Activity)**.

### **Como Configurar:**

1.  **Abra sua Automação:** No Automation Studio, vá para a automação `Auto_Reengajamento_MRV`.
2.  **Adicione a Atividade:** Arraste uma atividade de **Verification** do painel esquerdo para o canvas, logo *após* a sua "SQL Query Activity".
3.  **Configure a Condição:**
    *   Clique na atividade de verificação para configurá-la.
    *   **Condição:** "Data Extension Row Count".
    *   **Data Extension:** Selecione `DE_MRV_Inativos`.
    *   **Critério:** "is greater than" `0`.
4.  **Defina a Ação em Caso de Falha:**
    *   Esta é a condição que, se **NÃO** for atendida (ou seja, se a contagem de linhas for 0), acionará o alerta.
    *   Marque a opção **"Stop Automation"**. Isso impede que a automação continue se a query falhar em popular a DE.
    *   Marque a opção **"Send Email Notification"** e insira os endereços de e-mail dos administradores que devem ser notificados em caso de falha.
5.  **Salve a Automação.**

Com isso, se a sua query SQL falhar por qualquer motivo e não inserir nenhum registro na DE de inativos, a automação irá parar e enviará um e-mail de alerta.

---

## Parte 2: Log de Eventos da Jornada (Journey Builder)

O objetivo é registrar os passos de cada contato dentro da jornada para fins de auditoria e depuração. Usaremos a DE `DE_MRV_Log_Jornadas` que definimos.

### **Como Configurar:**

Você precisará adicionar uma atividade **Update Contact** em pontos estratégicos da sua `Jornada_Reengajamento_WhatsApp`.

#### **Ponto de Log 1: Entrada na Jornada**

1.  **Localização:** Logo no início da jornada, imediatamente após a Fonte de Entrada.
2.  **Ação:** Arraste uma atividade **Update Contact** para o canvas.
3.  **Configuração:**
    *   Selecione a Data Extension `DE_MRV_Log_Jornadas`.
    *   Mapeie os campos da seguinte forma:
        *   `LogID`: `GUID()`
        *   `ContactKey`: `Contact Key` (valor do sistema)
        *   `NomeJornada`: `Jornada_Reengajamento_WhatsApp` (texto fixo)
        *   `Etapa`: `Entrada na Jornada` (texto fixo)
        *   `Timestamp`: `Now()` (data e hora atuais do sistema)

#### **Ponto de Log 2: Após o Clique no Link**

1.  **Localização:** No caminho "Sim - Clicou no Link" da sua Decisão de Divisão, logo antes da atividade de "Exit".
2.  **Ação:** Adicione outra atividade **Update Contact**.
3.  **Configuração:**
    *   Selecione a DE `DE_MRV_Log_Jornadas`.
    *   Mapeie os campos:
        *   `LogID`: `GUID()`
        *   `ContactKey`: `Contact Key`
        *   `NomeJornada`: `Jornada_Reengajamento_WhatsApp`
        *   `Etapa`: `Clique no Link de Reengajamento`
        *   `Timestamp`: `Now()`

#### **Ponto de Log 3: Saída Sem Interação**

1.  **Localização:** No caminho "Não - Sem Interação" da sua Decisão de Divisão, logo antes da atividade de "Exit".
2.  **Ação:** Adicione uma terceira atividade **Update Contact**.
3.  **Configuração:**
    *   Selecione a DE `DE_MRV_Log_Jornadas`.
    *   Mapeie os campos:
        *   `LogID`: `GUID()`
        *   `ContactKey`: `Contact Key`
        *   `NomeJornada`: `Jornada_Reengajamento_WhatsApp`
        *   `Etapa`: `Saída da Jornada Sem Interação`
        *   `Timestamp`: `Now()`

Com estes três pontos de log, você terá um registro claro de quando cada contato entrou na jornada, se ele interagiu e quando ele saiu, fornecendo uma visibilidade completa do fluxo.

---

## Parte 3: Implementando a Query Dinâmica com SSJS (Opcional Avançado)

Esta seção descreve como substituir a "SQL Query Activity" padrão pela "Script Activity" que executa o script `dynamic_query.ssjs`. Isso torna o período de inatividade configurável.

### **Como Configurar:**

1.  **Abra sua Automação:** No Automation Studio, vá para a automação `Auto_Reengajamento_MRV`.
2.  **Remova a Atividade Antiga:** Exclua a "SQL Query Activity" que você havia configurado anteriormente.
3.  **Adicione a Nova Atividade:** Arraste uma atividade de **Script** do painel esquerdo para o canvas, no mesmo lugar onde a query estava.
4.  **Configure o Script:**
    *   Clique na atividade de script para configurá-la.
    *   Clique em **"Create New Script"**.
    *   **Nome:** Dê um nome claro, como `Executar Query Dinâmica de Inativos`.
    *   **Código:** Copie e cole **todo o conteúdo** do arquivo `automations/Auto_Reengajamento_MRV/dynamic_query.ssjs` no editor de código.
    *   Clique em **"Save"**.
5.  **Mantenha a Verificação:** A "Verification Activity" que você configurou na Parte 1 deste guia continuará funcionando normalmente após a "Script Activity". Ela verificará se o script executou a query e populou a `DE_MRV_Inativos` corretamente.
6.  **Salve a Automação.**

Com esta alteração, sua automação agora buscará o valor de `PeriodoInatividadeDias` da `DE_MRV_Configuracao` a cada execução, tornando o sistema totalmente dinâmico.
