public class EmpreendimentoController {
    @AuraEnabled(cacheable = true)
    public static List<Empreendimento__c> getAllEnterprises() {
        system.debug('Entrou no controller');
        return EmpreendimentoSelector.getAllEnterprises();
    }
}
