public class PrecoTipoUnidadeDTO {
    @AuraEnabled
    public String Empreendimento{get;set;}
    @AuraEnabled
    public String TabelaVendas{get;set;}
    @AuraEnabled
    public String TipoUnidade{get;set;}
    @AuraEnabled
    public Decimal IndiceAtualizacao{get;set;}
    @AuraEnabled
    public Decimal ValorAtualizacao{get;set;}
    @AuraEnabled
    public Decimal ValorAdicional{get;set;}
    @AuraEnabled
    public Decimal ValorAposAtualizacao{get;set;}
    @AuraEnabled
    public Decimal ValorAtual{get;set;}
    @AuraEnabled
    public Id Id{get;set;}
    @AuraEnabled
    public Id TabelaVendasId{get;set;}
    @AuraEnabled
    public Id TipoUnidadeId{get;set;}

    public PrecoTipoUnidade__c getPriceType() { 
        return new PrecoTipoUnidade__c(
            Id = this.Id,
            PrecoAnterior__c = this.ValorAtual,
            PrecoAtual__c = this.ValorAposAtualizacao,
            ValorAtualizacaoPercentual__c = this.IndiceAtualizacao*100,
            ValorAtualizaNominal__c = this.ValorAdicional
        );
    }

    public PrecoTipoUnidade__c getPriceTypeWithLookup() { 
        return new PrecoTipoUnidade__c(
            Id = this.Id,
            PrecoAnterior__c = this.ValorAtual,
            PrecoAtual__c = this.ValorAposAtualizacao,
            ValorAtualizacaoPercentual__c = this.IndiceAtualizacao,
            ValorAtualizaNominal__c = this.ValorAdicional,
            TipoUnidade__c = this.TipoUnidadeId,
            TabelaVendas__c = this.TabelaVendasId
        );
    }
}