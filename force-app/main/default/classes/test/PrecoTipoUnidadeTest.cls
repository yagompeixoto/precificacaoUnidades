@isTest
public class PrecoTipoUnidadeTest {  
    @TestSetup
    static void makeData(){
        List<TipoUnidade__c> listUnitTypes = new List<TipoUnidade__c> {
            new TipoUnidade__c(Dormitorios__c = 2, Suites__c = 1),
            new TipoUnidade__c(Dormitorios__c = 4, VagasDeficientes__c = 1)
        };
        insert listUnitTypes;

        List<TabelaVendas__c> listSalesTables =  new List<TabelaVendas__c> {
            new TabelaVendas__c(DataInicioVigencia__c = Date.today(), DescontoPercentual__c = 5),
            new TabelaVendas__c(DataInicioVigencia__c = Date.today(), DescontoMoeda__c = 10)
        };
        insert listSalesTables;

        PrecoTipoUnidade__c pu = new PrecoTipoUnidade__c(
            TipoUnidade__c = listUnitTypes[0].id,
            TabelaVendas__c = listSalesTables[0].id
        );
        insert pu;
    }
    
    @isTest
    public static void testDuplicatePriceType() {
        List<TipoUnidade__c> listUnitTypes = [SELECT Id FROM TipoUnidade__c];
        List<TabelaVendas__c> listSalesTables = [SELECT Id FROM TabelaVendas__c];

        PrecoTipoUnidade__c p1 = new PrecoTipoUnidade__c(
            PrecoAtual__c = 20,
            TipoUnidade__c = listUnitTypes[1].id,
            TabelaVendas__c = listSalesTables[0].id
        );

        PrecoTipoUnidade__c p2 = new PrecoTipoUnidade__c(
            PrecoAtual__c = 20,
            TipoUnidade__c = listUnitTypes[0].id,
            TabelaVendas__c = listSalesTables[1].id
        );

        PrecoTipoUnidade__c p3 = new PrecoTipoUnidade__c(
            PrecoAtual__c = 20,
            TipoUnidade__c = listUnitTypes[1].id,
            TabelaVendas__c = listSalesTables[0].id
        );


        insert p1;
        insert p2;

        try{
            insert p3;
        } catch(Exception e){
            system.debug('Error ' + e);
        }        

        List<PrecoTipoUnidade__c> testList = [SELECT Id FROM PrecoTipoUnidade__c];
        system.assertEquals(3, testList.size());
    }
}