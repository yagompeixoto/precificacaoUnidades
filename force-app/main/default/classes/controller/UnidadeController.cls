public class UnidadeController {
    @AuraEnabled
    public static Boolean transferDataAndInsert(String json) {
        UnidadeDomain ud = new UnidadeDomain();
        ud.transferData(json);
        return ud.insertUnit();
    }
}