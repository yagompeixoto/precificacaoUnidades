public class PrecoTipoUnidadeSelector {
    public static List<PrecoTipoUnidade__c> getPriceTypes() {
        return [SELECT Id, TipoUnidade__c, TabelaVendas__c 
                FROM PrecoTipoUnidade__c];
    }

    public static List<PrecoTipoUnidade__c> getPriceTypesBySalesTable(List<Id> salesTables) {
        return [SELECT Id, TabelaVendas__r.Empreendimento__r.Name, TipoUnidade__r.Name, TabelaVendas__r.Name, PrecoAtual__c, TipoUnidade__c, TabelaVendas__c
                FROM PrecoTipoUnidade__c
                WHERE TabelaVendas__c in :salesTables];
    }

    public static Boolean verifyUnitType(List<Id> unitTypes) {
        List<PrecoTipoUnidade__c> result = [SELECT TipoUnidade__c FROM PrecoTipoUnidade__c WHERE TipoUnidade__c IN :unitTypes];
        if(result.size() > 0) {
            return false;
        } else {
            return true;
        }
    }
}