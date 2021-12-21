public class PrecoTipoUnidadeDomain {
    List<PrecoTipoUnidade__c> newPriceType;
    public PrecoTipoUnidadeDomain(List<PrecoTipoUnidade__c> p) {
        this.newPriceType = p;
    }

    public PrecoTipoUnidadeDomain() {
        this.newPriceType = new List<PrecoTipoUnidade__c>();
    }

    public void checkPriceTypeLookups() {
        Map<Id, Map<Id, PrecoTipoUnidade__c>> itemTypeAndPriceTableMap = new Map<Id, Map<Id, PrecoTipoUnidade__c>>();
        List<PrecoTipoUnidade__c> selectedTypes = PrecoTipoUnidadeSelector.getPriceTypes();

        for(PrecoTipoUnidade__c p : selectedTypes) {
            if(itemTypeAndPriceTableMap.containsKey(p.TipoUnidade__c)) {
                itemTypeAndPriceTableMap.get(p.TipoUnidade__c).put(p.TabelaVendas__c, p);
            } else {
                itemTypeAndPriceTableMap.put(p.TipoUnidade__c, new Map<Id, PrecoTipoUnidade__c>{p.TabelaVendas__c => p});
            }
        }
        for(PrecoTipoUnidade__c p : this.newPriceType) {
            if(itemTypeAndPriceTableMap.containsKey(p.TipoUnidade__c) && itemTypeAndPriceTableMap.get(p.TipoUnidade__c).containsKey(p.TabelaVendas__c)) {
                p.addError(System.Label.MensagemTipoPrecoDuplicado);
            }
        }
    }

    public void transferDataForUpdate(String pricesToTransfer) {
        try{
            List<PrecoTipoUnidadeDTO> typesList = (List<PrecoTipoUnidadeDTO>)JSON.deserialize(pricesToTransfer, List<PrecoTipoUnidadeDTO>.class);
            for(PrecoTipoUnidadeDTO dto : typesList) {
                this.newPriceType.add(dto.getPriceType());
            }
        } catch(Exception e) {
            system.debug(e);
        }
    }

    public void transferDataForInsert(String pricesToTransfer) {
        try{
            List<PrecoTipoUnidadeDTO> typesList = (List<PrecoTipoUnidadeDTO>)JSON.deserialize(pricesToTransfer, List<PrecoTipoUnidadeDTO>.class);
            for(PrecoTipoUnidadeDTO dto : typesList) {
                this.newPriceType.add(dto.getPriceTypeWithLookup());
            }
        } catch(Exception e) {
            system.debug(e);
        }
    }

    public Boolean insertPriceType() {
        system.debug('Fez algo');
        system.debug(this.newPriceType);
        if(!this.newPriceType.isEmpty()) {
            insert this.newPriceType;
            return true;
        }
        return false;
    }

    public Boolean updatePriceType() {
        system.debug('Fez algo');
        system.debug(this.newPriceType);
        if(!this.newPriceType.isEmpty()) {
            update this.newPriceType;
            return true;
        }
        return false;
    }
}