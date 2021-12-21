trigger PrecoTipoUnidadeTrigger on PrecoTipoUnidade__c (before insert) {
  if(Trigger.isInsert) {
    if(Trigger.isBefore) {
      PrecoTipoUnidadeService.checkPriceTypeLookups(Trigger.new);
    }
  }
}