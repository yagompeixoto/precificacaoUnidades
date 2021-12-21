import { LightningElement , api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getSalesTablesByEnterprise from '@salesforce/apex/TabelaVendasController.getSalesTablesByEnterprise';
import getPriceTypesBySalesTable from '@salesforce/apex/PrecoTipoUnidadeController.getPriceTypesBySalesTable';
import transferDataAndUpdate from '@salesforce/apex/PrecoTipoUnidadeController.transferDataAndUpdate';

export default class AtualizacaoPrecificacao extends LightningElement {
  @api recordId;
  
  disableSave = true;

  activeTables = true;
  futureTables = true;

  salesTables = [];

  priceValues = [];

  selectedPriceTables;
  selectedPriceTablesSize = 0;

  priceUpdatePercent;
  priceUptadeNumber;

  columns = [
    {label: 'Tabela de Vendas', fieldName: 'TabelaVendas'},
    {label: 'Tipo de Unidade', fieldName: 'TipoUnidade'},
    {label: 'Preço Tipo de Unidade', fieldName: 'ValorAtual', type: 'number'},
    {label: 'Índice Atualização', fieldName: 'IndiceAtualizacao', type: 'percent'},
    {label: 'Valor Adicional', fieldName: 'ValorAdicional', type: 'number'},    
    {label: 'Valor Após Atualização', fieldName: 'ValorAposAtualizacao', type: 'number'}
  ];

  connectedCallback() {
    this.getSalesTables();
  }

  storePriceNumber(event) {
    this.priceUptadeNumber = event.detail.value;
  }

  storePricePercent(event) {
    this.priceUpdatePercent = event.detail.value;
  }
  
  verifyActiveTablesChange() {
    this.activeTables = !this.activeTables;
    this.getSalesTables();
  }

  verifyFutureTablesChange() {
    this.futureTables = !this.futureTables;
    this.getSalesTables();
  }

  handleSelectedPriceTables(event) {
    this.selectedPriceTables = event.detail.value;
    this.handleDataTableCreation();
  }

  clearValues() {
    this.priceValues = [];
    this.priceUptadeNumber = null;
    this.priceUpdatePercent = null;
    this.selectedPriceTablesSize = 0;    
  }

  handleDataTableCreation() {
    getPriceTypesBySalesTable({salesTables: this.selectedPriceTables})
      .then(data => {
        let tableValues = [];
        data.forEach((table) => {
          if(this.priceUpdatePercent > 0) {
            tableValues.push({
              Id: table.Id,
              TabelaVendas: table.TabelaVendas__r.Name,
              TipoUnidade: table.TipoUnidade__r.Name,
              IndiceAtualizacao: this.priceUpdatePercent/100,
              ValorAtual: table.PrecoAtual__c,
              ValorAdicional: table.PrecoAtual__c * (this.priceUpdatePercent/100),
              ValorAposAtualizacao: table.PrecoAtual__c + (table.PrecoAtual__c * (this.priceUpdatePercent/100)),
              TabelaVendasId: table.TabelaVendas__c,
              TipoUnidadeId: table.TipoUnidade__c
            });
            this.disableSave = false;
          } else if (this.priceUptadeNumber > 0) {
            tableValues.push({
              Id: table.Id,
              TabelaVendas: table.TabelaVendas__r.Name,
              TipoUnidade: table.TipoUnidade__r.Name,
              TipoUnidadePreco: table.TipoUnidade__r.Name,
              IndiceAtualizacao: this.priceUpdatePercent/100,
              ValorAtual: table.PrecoAtual__c,
              ValorAdicional: this.priceUptadeNumber,
              ValorAposAtualizacao: parseInt(table.PrecoAtual__c,10) + parseInt(this.priceUptadeNumber,10),
              TabelaVendasId: table.TabelaVendas__c,
              TipoUnidadeId: table.TipoUnidade__c
            });
            this.disableSave = false;
          } else {
            tableValues.push({
              Id: table.Id,
              TabelaVendas: table.TabelaVendas__r.Name,
              TipoUnidade: table.TipoUnidade__r.Name,
              TipoUnidadePreco: table.TipoUnidade__r.Name,
              IndiceAtualizacao: this.priceUpdatePercent/100,
              ValorAtual: table.PrecoAtual__c
            })
          }
        })
        this.priceValues = tableValues;
      })
      .catch(error => {
        console.log('Erro: ', error);
      })
      this.selectedPriceTablesSize = this.selectedPriceTables.length;
    }

  getSalesTables() {
    getSalesTablesByEnterprise({enterprises: this.recordId, isActive: this.activeTables, isFuture: this.futureTables})
      .then(result => {
          let tables = [];
          result.forEach((item) => {
            tables.push({
              label: item.Name,
              value: item.Id
            })
          })
          this.salesTables = tables;
      })
      .catch(error => {
        console.log(error);
      })
  }

  updatePriceTables() {
    transferDataAndUpdate({pricesToUpdate: JSON.stringify(this.priceValues)})
      .then(() => {
        const msg = new ShowToastEvent({
          title: 'Sucesso ao salvar',
          variant: 'success'
        })
        this.dispatchEvent(msg);
      })
      .catch(error => {
        const msg = new ShowToastEvent({
          title: 'Erro ao salvar',
          message: error.body.message,
          variant: 'error'
        })
        this.dispatchEvent(msg);
      })
  }
}