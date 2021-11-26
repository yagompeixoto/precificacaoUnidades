import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getSalesTableEnterprise from '@salesforce/apex/TabelaVendasController.getSalesTableEnterprise';
import getUnitTypeWithoutPrice from '@salesforce/apex/TipoUnidadeController.getUnitTypeWithoutPrice'
import transferDataAndInsert from '@salesforce/apex/PrecoTipoUnidadeController.transferDataAndInsert';
import getUnitTypeByName from '@salesforce/apex/TipoUnidadeController.getUnitTypeByName';
import getPriceTypesBySalesTable from '@salesforce/apex/PrecoTipoUnidadeController.getPriceTypesBySalesTable';
import transferDataAndUpdate from '@salesforce/apex/PrecoTipoUnidadeController.transferDataAndUpdate';

export default class AtualizacaoPrecificacaoCadastrar extends LightningElement {
  @api recordId;
  
  createUnitPrices = true;
  disableSave = true;

  priceUptadeValue; 
  unitTypes = [];
  currentEnterprise = [];
  selectedUnitTypes = [];
  unitPriceType = [];

  insertColumns = [
    {label: 'Tipo de Unidade', fieldName: 'TipoUnidade'},
    {label: 'Preço do Tipo de Unidade', fieldName: 'ValorAposAtualizacao', type: 'currency'}
  ];

  priceUptadeNumber
  priceUpdatePercent
  updatePrices = [];

  updateColumns = [
    {label: 'Tipo de Unidade', fieldName: 'TipoUnidade'},
    {label: 'Preço Tipo de Unidade', fieldName: 'ValorAtual', type: 'number'},
    {label: 'Índice Atualização', fieldName: 'IndiceAtualizacao', type: 'percent'},
    {label: 'Valor Adicional', fieldName: 'ValorAdicional', type: 'number'},    
    {label: 'Valor Após Atualização', fieldName: 'ValorAposAtualizacao', type: 'number'}
  ]

  connectedCallback() {
    this.getEnterprise();
    this.getUnitTypes();
  }

  changePage() {
    this.createUnitPrices = !this.createUnitPrices;
    this.clearFields();
    this.disableSave = true;
  }

  getEnterprise() {
    getSalesTableEnterprise({salesTable: this.recordId})
      .then(data => {
        let values = [];
        data.forEach(item => {
          values.push(item.Empreendimento__c);
        })
        this.currentEnterprise = values;
        this.getUnitTypes();
      })
      .catch(error => {
        console.log(error)
      })
  }

  getUnitTypes() {
    getUnitTypeWithoutPrice({enterprises: this.currentEnterprise})
      .then(data => {
        let values = [];
        data.forEach(item => {
          values.push({
            label: item.Name,
            value: item.Name
          })          
        })
        this.unitTypes = values;
      })
      .catch(error => {
        console.log(error)
      })
  }

  clearFields() {
    this.selectedUnitTypes = [];
    this.priceUptadeValue = '';
    this.unitPriceType = [];
    this.priceUptadeNumber = '';
    this.priceUpdatePercent = '';
    this.updatePrices = []
  }

  //Métodos da página de cadastro de preços
  handleSelectedUnitTypes(event) {
    this.selectedUnitTypes = event.detail.value;
  }

  storePriceValue(event) {
    this.priceUptadeValue = event.detail.value;
  }

  createDisplayData() {
    let tempList = [];
    let nameList = [];
    this.selectedUnitTypes.forEach(unit => {
      nameList.push(unit);
    })
    getUnitTypeByName({unitTypeNames: nameList})
      .then(data => {
        data.forEach(item => {
          tempList.push({
            TabelaVendasId: this.recordId,
            TipoUnidadeId: item.Id,
            TipoUnidade: item.Name,
            ValorAposAtualizacao: this.priceUptadeValue
          })
        })
        this.disableSave = false;
        this.unitPriceType = tempList
      })
      .catch(error => {
        console.log(error);
      })
  }

  savePrices() {
    transferDataAndInsert({pricesToInsert: JSON.stringify(this.unitPriceType)})
      .then(() => {
        const msg = new ShowToastEvent({
          title: 'Salvo com sucesso',
          variant: 'success'
        })
        this.dispatchEvent(msg);
        this.clearFields();
        
      })
      .catch(error => {
        const msg = new ShowToastEvent({
          title: 'Ocorreu um erro',
          message: error.body.pageErrors[0].message,
          variant: 'error'
        })
        console.log(error);
        this.dispatchEvent(msg);
      })
  }
  //Métodos da página de atualização de preços
  storePriceNumber(event) {
    this.priceUptadeNumber = event.detail.value;
  }

  storePricePercent(event) {
    this.priceUpdatePercent = event.detail.value;
  }

  handleUnitTypesPriceUpdate() {
    getPriceTypesBySalesTable({salesTables: this.recordId})
      .then(data => {
        let tableValues = [];
        data.forEach((table) => {
          if(this.priceUpdatePercent > 0) {
            tableValues.push({
              Id: table.Id,
              TipoUnidade: table.TipoUnidade__r.Name,
              IndiceAtualizacao: this.priceUpdatePercent/100,
              ValorAtual: table.PrecoAtual__c,
              ValorAdicional: table.PrecoAtual__c * (this.priceUpdatePercent/100),
              ValorAposAtualizacao: table.PrecoAtual__c + (table.PrecoAtual__c * (this.priceUpdatePercent/100)),
              TabelaVendasId: this.recordId,
              TipoUnidadeId: table.TipoUnidade__c
            });
            this.disableSave = false;
          } else if (this.priceUptadeNumber > 0) {
            tableValues.push({
              Id: table.Id,
              TipoUnidade: table.TipoUnidade__r.Name,
              ValorAtual: table.PrecoAtual__c,
              IndiceAtualizacao: '',
              ValorAdicional: this.priceUptadeNumber,
              ValorAposAtualizacao: parseInt(table.PrecoAtual__c,10) + parseInt(this.priceUptadeNumber,10),
              TabelaVendasId: this.recordId,
              TipoUnidadeId: table.TipoUnidade__c
            });
            this.disableSave = false;
          }
        })
        this.updatePrices = tableValues;
      })
      .catch(error => {
        console.log('Erro: ', error);
      })
  }

  updatePriceTables() {
    transferDataAndUpdate({pricesToUpdate: JSON.stringify(this.updatePrices)})
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