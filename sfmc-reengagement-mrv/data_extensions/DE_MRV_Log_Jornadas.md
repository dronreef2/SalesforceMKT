# Data Extension: DE_MRV_Log_Jornadas

**Função:** Armazenar um histórico de auditoria de eventos importantes que ocorrem nas jornadas. Isso é crucial para monitoramento, depuração e análise de performance.

**Tipo:** Não enviável (Non-Sendable).

---

### **Campos:**

| Nome do Campo  | Tipo   | Propriedades | Descrição                                                                 |
|----------------|--------|--------------|---------------------------------------------------------------------------|
| LogID          | Text   | Primary Key  | Um identificador único para cada registro de log (gerado via SSJS ou GUID). |
| ContactKey     | Text   | Requerido    | O `SubscriberKey` do contato que está passando pela jornada.              |
| NomeJornada    | Text   | Requerido    | O nome da jornada onde o evento ocorreu (ex: "Jornada_Reengajamento_WhatsApp"). |
| Etapa          | Text   | Requerido    | O nome da etapa ou evento que está sendo logado (ex: "Entrada na Jornada", "Clicou no Link"). |
| Mensagem       | Text   | Nulável      | Uma mensagem de log opcional com detalhes adicionais.                       |
| Timestamp      | Date   | Requerido    | A data e hora exatas em que o evento de log foi registrado.               |

---

### **Notas de Implementação:**

*   O campo `LogID` pode ser populado usando a função `GUID()` do AMPScript/SSJS para garantir a unicidade.
*   Esta DE será populada por atividades "Update Contact" inseridas em pontos estratégicos da jornada.
*   É recomendável criar uma Política de Retenção de Dados (Data Retention Policy) para esta DE (ex: reter dados por 180 dias) para evitar que ela cresça indefinidamente.
