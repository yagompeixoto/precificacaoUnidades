public class TipoUnidadeController {
    @AuraEnabled(cacheable = true)
    public static List<TipoUnidade__c> getUnitTypeData() {
        return TipoUnidadeSelector.getUnitTypeData();
    }

    @AuraEnabled(cacheable = true)
    public static List<TipoUnidade__c> getUnitTypeByName(List<String> unitTypeNames) {
        return TipoUnidadeSelector.getUnitTypeByName(unitTypeNames);
    }

    @AuraEnabled(cacheable = true)
    public static List<TipoUnidade__c> getUnitTypeWithoutPrice(List<Id> enterprises) {
        return TipoUnidadeSelector.getUnitTypeWithoutPrice(enterprises);
    }
}