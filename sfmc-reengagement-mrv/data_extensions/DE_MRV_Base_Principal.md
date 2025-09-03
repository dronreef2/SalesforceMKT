# Data Extension: DE_MRV_Base_Principal

**Função:** Armazenar o conjunto completo de dados dos clientes da MRV. Esta é a fonte de dados principal.

**Campos:**

| Nome do Campo         | Tipo      | Propriedades      |
|-----------------------|-----------|-------------------|
| Email                 | Text      | Primary Key       |
| Nome                  | Text      | Nullable          |
| Telefone              | Phone     | Nullable          |
| Data_Ultima_Interacao | Date      | Nullable          |
