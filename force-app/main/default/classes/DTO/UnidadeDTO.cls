public class UnidadeDTO {
        @AuraEnabled
        public string Name{get;set;}
        @AuraEnabled
        public string Status{get;set;}
        @AuraEnabled
        public id TipoUnidade{get;set;}
        @AuraEnabled
        public string TipoUnidadeName{get;set;}
        @AuraEnabled
        public Integer AndarExibicao{get;set;}
        @AuraEnabled
        public string FinalUnidade{get;set;}
        @AuraEnabled
        public Integer AreaComum{get;set;}
        @AuraEnabled
        public Integer AreaTotal{get;set;}
        @AuraEnabled
        public Decimal FracaoIdeal{get;set;}
        @AuraEnabled
        public Integer Dormitorios{get;set;}
        @AuraEnabled
        public Integer Suites{get;set;}
        @AuraEnabled
        public Integer VagasCarros{get;set;}
        @AuraEnabled
        public id Torre{get;set;}
        @AuraEnabled
        public id Empreendimento{get;set;}
        @AuraEnabled
        public string TipoRegistroUnidade{get;set;}
        @AuraEnabled
        public Integer VagasDeficientes{get;set;}
        @AuraEnabled
        public Integer VagasMotos{get;set;}
        @AuraEnabled
        public Integer Banheiros{get;set;}

        public Unidade__c getUnit() {
            return new Unidade__c(
                    Name = this.Name,
                    Status__c = this.Status,
                    TipoUnidade__c = this.TipoUnidade,
                    AndarExibicao__c = this.AndarExibicao,
                    FinalUnidade__c = this.FinalUnidade,
                    AreaComum__c = this.AreaComum,
                    AreaTotal__c = this.AreaTotal,
                    FracaoIdeal__c = this.FracaoIdeal,
                    Dormitorios__c = this.Dormitorios,
                    Suites__c = this.Suites,
                    VagasCarros__c = this.VagasCarros,
                    Torre__c = this.Torre,
                    Empreendimento__c = this.Empreendimento,
                    VagasDeficientes__c = this.VagasDeficientes,
                    VagasMotos__c = this.VagasMotos,
                    Banheiros__c = this.Banheiros
                );
        }
}