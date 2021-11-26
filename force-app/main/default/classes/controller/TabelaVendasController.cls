public class TabelaVendasController {
    @AuraEnabled(cacheable = true)
    public static List<TabelaVendas__c> getSalesTablesByEnterprise(List<Id> enterprises, Boolean isActive, Boolean isFuture) {
        return TabelaVendasSelector.getSalesTablesByEnterprise(enterprises, isActive, isFuture);
    }

    @AuraEnaBled(cacheable = true)
    public static List<TabelaVendas__c> getSalesTableEnterprise(List<Id> salesTable) {
        return TabelaVendasSelector.getSalesTableEnterprise(salesTable);
    }
}