public class EmpreendimentoSelector {
    public static List<Empreendimento__c> getAllEnterprises() {
        return [SELECT Id, Name 
                FROM Empreendimento__c];
    }
}
