public class PrecoTipoUnidadeService {
    public static void checkPriceTypeLookups(List<PrecoTipoUnidade__c> newPriceTypes) {
        PrecoTipoUnidadeDomain pd = new PrecoTipoUnidadeDomain(newPriceTypes);
        pd.checkPriceTypeLookups();
    }

    public static List<PrecoTipoUnidade__c> getPriceTypesBySalesTable(List<Id> salesTables) {
        return PrecoTipoUnidadeSelector.getPriceTypesBySalesTable(salesTables);
    }

    public static Boolean transferDataAndUpdate(String pricesToUpdate) {
        PrecoTipoUnidadeDomain pd = new PrecoTipoUnidadeDomain();
        pd.transferDataForUpdate(pricesToUpdate);
        return pd.updatePriceType();
    }

    public static Boolean verifyUnitType(List<Id> unitTypes) {
        return PrecoTipoUnidadeSelector.verifyUnitType(unitTypes);
    }

    public static Boolean transferDataAndInsert(String pricesToInsert) {
        PrecoTipoUnidadeDomain pd = new PrecoTipoUnidadeDomain();
        pd.transferDataForInsert(pricesToInsert);
        return pd.insertPriceType();
    }
}