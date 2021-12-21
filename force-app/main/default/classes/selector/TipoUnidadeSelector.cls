public class TipoUnidadeSelector {
    public static List<TipoUnidade__c> getUnitTypeData() {
        return [SELECT Id, Name
                FROM TipoUnidade__c];
    }

    public static List<TipoUnidade__c> getUnitTypeByName(List<String> unitTypeNames) {
        return [SELECT Id, Name, AreaTotal__c, Banheiros__c, Dormitorios__c, Suites__c, 
                VagasCarros__c, VagasMotos__c, VagasDeficientes__c, Empreendimento__c, 
                UnidadesPorAndar__c, TipoRegistroUnidades__c 
                FROM TipoUnidade__c
                WHERE Name in :unitTypeNames];
    }

    public static List<TipoUnidade__c> getUnitTypeWithoutPrice(List<Id> enterprises) {
        List<PrecoTipoUnidade__c> unitWithPrices = [SELECT TipoUnidade__c, Id FROM PrecoTipoUnidade__c WHERE TipoUnidade__r.Empreendimento__c IN :enterprises];
        List<TipoUnidade__c> unitTypes = [SELECT Id, Name FROM TipoUnidade__c WHERE Empreendimento__c in :enterprises];

        Map<Id, String> newMap = new Map<Id, String>();

        for(PrecoTipoUnidade__c p : unitWithPrices) {
            newMap.put(p.TipoUnidade__c, p.Id);
        }

        List<TipoUnidade__c> checkedUnitTypes = new List<TipoUnidade__c>();
        for(TipoUnidade__c u : unitTypes) {
            if(!newMap.containsKey(u.Id)){
                checkedUnitTypes.add(u);
            }
        }
        return checkedUnitTypes;
    }
}