public class UnidadeService {
    @AuraEnabled
    public static Boolean insertUnit(List<Unidade__c> unitList) {
        UnidadeDomain ud = new UnidadeDomain(unitList);
        return ud.insertUnit();
    }
}