public class UnidadeDomain {
    List<Unidade__c> unitList;

    public UnidadeDomain() {
        this.unitList = new List<Unidade__c>();
    }

    public UnidadeDomain(List<Unidade__c> u) {
        this.unitList = u;
    }

    public Boolean insertUnit() {
        if(!this.unitList.isEmpty()) {
            insert this.unitList;
            return true;
        }
        return false;
    }

    public void transferData(String data) {
        try{
            List<UnidadeDTO> test = (List<UnidadeDTO>)JSON.deserialize(data, List<UnidadeDTO>.class);
            for(UnidadeDTO ud : test) {
                this.unitList.add(ud.getUnit());
            }
        } catch(Exception e) {
            system.debug(e);
        }
    }
}