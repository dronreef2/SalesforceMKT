<script runat="server">
  Platform.Load("Core", "1");

  /*
    ================================================================
    SCRIPT SSJS PARA EXECUÇÃO DE QUERY DINÂMICA (v1.0)
    ================================================================
    Objetivo: Substituir a SQL Query Activity padrão para permitir
    que o período de inatividade seja configurado via Data Extension.
  */

  // --- Nomes dos artefatos (para fácil manutenção) ---
  var configDE = "DE_MRV_Configuracao";
  var configKey = "PeriodoInatividadeDias";
  var targetDE = "DE_MRV_Inativos";
  var sourceDE = "DE_MRV_Base_Principal";

  // --- Variáveis ---
  var periodoDias, sqlQuery;
  var fallbackPeriodoDias = "90"; // Valor padrão caso o lookup falhe

  try {
    // 1. Buscar o período de inatividade da DE de Configuração
    var configDERows = DataExtension.Init(configDE).Rows.Retrieve({
      Property: "Chave",
      SimpleOperator: "equals",
      Value: configKey
    });

    if (configDERows && configDERows.length > 0) {
      periodoDias = configDERows[0].Valor;
    } else {
      periodoDias = fallbackPeriodoDias;
      // Opcional: Logar que o valor de fallback foi usado
      // Write("WARN: Chave de configuração '" + configKey + "' não encontrada. Usando valor de fallback: " + fallbackPeriodoDias);
    }

    // 2. Construir a string da Query SQL dinamicamente
    sqlQuery = "SELECT ";
    sqlQuery += "Email, ";
    sqlQuery += "Nome, ";
    sqlQuery += "Telefone, ";
    sqlQuery += "Data_Ultima_Interacao ";
    sqlQuery += "FROM " + sourceDE + " ";
    sqlQuery += "WHERE DATEDIFF(day, Data_Ultima_Interacao, GETDATE()) > " + periodoDias;

    // 3. Criar e executar a Query Definition
    var qd = QueryDefinition.Init();
    qd.Name = "Auto_Reengajamento_MRV_DynamicQuery"; // Nome único para a definição da query
    qd.CustomerKey = "Auto_Reengajamento_MRV_DynamicQuery"; // Chave única
    qd.Description = "Query dinâmica executada via SSJS para segmentar inativos.";
    qd.QueryText = sqlQuery;
    qd.TargetType = "DE";
    qd.DataExtensionTarget = DataExtension.Init(targetDE);
    qd.TargetUpdateType = "Overwrite";

    var status = qd.Perform(); // Executa a query

    // Opcional: Logar o status da execução
    // Write("INFO: Execução da query concluída com status: " + status);

  } catch (e) {
    // Em caso de erro, loga a exceção.
    // Isso é visível no log do Automation Studio se a atividade falhar.
    Write("ERROR: Falha na execução do script de query dinâmica. Erro: " + Stringify(e));
    // Para notificação, a "Verification Activity" na automação ainda é recomendada.
  }

</script>
