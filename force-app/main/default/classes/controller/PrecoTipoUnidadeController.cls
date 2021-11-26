public class PrecoTipoUnidadeController {
    @AuraEnabled(cacheable = true)
    public static List<PrecoTipoUnidade__c> getPriceTypesBySalesTable(List<Id> salesTables) {
        return PrecoTipoUnidadeSelector.getPriceTypesBySalesTable(salesTables);
    }

    @AuraEnabled
    public static Boolean transferDataAndUpdate(String pricesToUpdate) {
        return PrecoTipoUnidadeService.transferDataAndUpdate(pricesToUpdate);
    }

    @AuraEnabled
    public static Boolean verifyUnitType(List<Id> unitTypes) {
        return PrecoTipoUnidadeService.verifyUnitType(unitTypes);
    }

    @AuraEnabled
    public static Boolean transferDataAndInsert(String pricesToInsert) {
        return PrecoTipoUnidadeService.transferDataAndInsert(pricesToInsert);
    }
}