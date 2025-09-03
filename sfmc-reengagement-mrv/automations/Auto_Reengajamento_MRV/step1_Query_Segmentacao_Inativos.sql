-- Nome da Query: Query_Segmentacao_Inativos
-- Função: Seleciona contatos da DE_MRV_Base_Principal cuja última interação foi há mais de 90 dias.
-- DE de Destino: DE_MRV_Inativos (Ação: Overwrite)

SELECT
    Email,
    Nome,
    Telefone,
    Data_Ultima_Interacao
FROM
    DE_MRV_Base_Principal
WHERE
    DATEDIFF(day, Data_Ultima_Interacao, GETDATE()) > 90
