public class TabelaVendasSelector {
    public static List<TabelaVendas__c> getSalesTablesByEnterprise(List<Id> enterprises, Boolean isActive, Boolean isFuture) {
        if(isFuture) {
            if(isActive) {
                return [SELECT Id, Name 
                        FROM TabelaVendas__c 
                        WHERE Empreendimento__c IN :enterprises];
            } else {
                return [SELECT Id, Name 
                        FROM TabelaVendas__c 
                        WHERE Empreendimento__c IN :enterprises AND Ativa__c = false];
            }
        } else {
            if(isActive) {
                return [SELECT Id, Name 
                        FROM TabelaVendas__c 
                        WHERE Empreendimento__c IN :enterprises AND DataInicioVigencia__c < TODAY];
            } else {
                return [SELECT Id, Name 
                        FROM TabelaVendas__c 
                        WHERE Empreendimento__c IN :enterprises AND DataInicioVigencia__c < TODAY AND Ativa__c = false];
            }
        }
    }

    public static List<TabelaVendas__c> getSalesTableEnterprise(List<Id> salesTable) {
        return [SELECT Empreendimento__c
                FROM TabelaVendas__c
                WHERE ID IN :salesTable];
    }
}