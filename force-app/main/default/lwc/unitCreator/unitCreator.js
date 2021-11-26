import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getUnitTypeData from '@salesforce/apex/TipoUnidadeController.getUnitTypeData';
import getUnitTypeByName from '@salesforce/apex/TipoUnidadeController.getUnitTypeByName';
import transferDataAndInsert from '@salesforce/apex/UnidadeController.transferDataAndInsert';

import ID_FIELD from '@salesforce/schema/Torre__c.Id'
import FLOOR from '@salesforce/schema/Torre__c.Andares__c';
import ENTREPRISE from '@salesforce/schema/Torre__c.Empreendimento__c';
import NUMBER_STANDARD from '@salesforce/schema/Torre__c.PadraoNumeracao__c';
import UNITS_PER_FLOOR from '@salesforce/schema/Torre__c.UnidadesPorAndar__c';
import AVAILABLE_UNITS from '@salesforce/schema/Torre__c.UnidadesEstoque__c';

import unitCreatorCustomLabels from './unitCreatorCustomLabels';

  
  
export default class UnitCreator extends LightningElement {
  @api recordId;

  //Colunas da lightning-datatable
  columns = [
    {label: 'Unidade', fieldName: 'Name', type: 'text'},
    {label: 'Situação', fieldName: 'Status'},
    {label: 'Tipo', fieldName: 'TipoUnidadeName'},
    {label: 'Andar', fieldName: 'AndarExibicao'},
    {label: 'Prumada', fieldName: 'FinalUnidade'},
    {label: 'Área Privada Total', fieldName: 'AreaTotal', type: 'number'},
    {label: 'Área Comum', fieldName: 'AreaComum', type: 'number'},
    {label: 'Área Total', fieldName: 'AreaTotal', type: 'number'},
    {label: 'Fração Ideal', fieldName: 'FracaoIdeal', type:'percent'},
    {label: 'Dormitórios', fieldName: 'Dormitorios', type: 'number'},
    {label: 'Suítes', fieldName: 'Suites', type: 'number'},
    {label: 'Vagas', fieldName: 'VagasCarros', type: 'number'},
  ];

  customLabels = new unitCreatorCustomLabels().getLabels();

  firstFloor;
  lastFloor;
  floorOptions = [];

  firstFloorUnit;
  lastFloorUnit;
  floorUnitOptions = [];
  totalArea = 0;
  enterpriseId;
  numberStandard;
  availableUnits = 0;

  unitList = [];
  unitListSize = 0;
  unitTypesToDisplay = [];
  selectedUnitTypes = [];
  unitTypeData = [];  
  insertSucess = false;

  //Pega os dados da torre atual  
  @wire(getRecord, {recordId: '$recordId', fields: [FLOOR, ENTREPRISE, NUMBER_STANDARD, UNITS_PER_FLOOR, AVAILABLE_UNITS]})
  tower(result) {
    if(result.data) {
      let floors = [];
      for(let i=0;i<getFieldValue(result.data, FLOOR)+1; i++) {
        floors.push({
            label: i,
            value: i.toString()
          })
      }
      let units = [];
      for(let i=0;i<getFieldValue(result.data, UNITS_PER_FLOOR)+1; i++) {
        units.push({
            label: i,
            value: i.toString()
          })
      }
      this.floorUnitOptions = units;
      this.floorOptions = floors;
      this.totalArea = getFieldValue(result.data, UNITS_PER_FLOOR);
      this.enterpriseId = getFieldValue(result.data, ENTREPRISE);
      this.numberStandard = getFieldValue(result.data, NUMBER_STANDARD);
      this.availableUnits = getFieldValue(result.data, AVAILABLE_UNITS);
    }
  };

  //Pega os dados para serem exibidos na dual-listbox
  @wire(getUnitTypeData) 
  unitTypes(result) {
    if(result.data) {
      let unitTypes = [];
      for(let info in result.data) {
        unitTypes.push({
          label: result.data[info].Name,
          value: result.data[info].Name
        })
      }
      this.unitTypesToDisplay = unitTypes;
    } else if(result.error) {
      console.log(result.error);
    }
  }

  //Método para adicionar as unidades na lightning-datatable
  addToList() { 
    if(this.selectedUnitTypes.length == 0 || !this.firstFloor || !this.lastFloor || !this.firstFloorUnit || !this.lastFloorUnit) {
      return
    }
    var floorList = this.createFloorList();
    
    getUnitTypeByName({unitTypeNames: this.selectedUnitTypes})
      .then(data => {
        let newUnit = [];
        data.forEach(item => {//Item é o tipo de unidade
          floorList.forEach(component => { //Component é o array [Andar, Prumada]
            if(item.TipoRegistroUnidades__c == this.customLabels.TipoRegistroVaga){
              newUnit.push(this.createVgUnit(item, component));
            } else {
              newUnit.push(this.createAptoUnit(item, component));
            } 
          })      
        })
        this.unitList = newUnit;
        //Tamanho da lista que será exibida
        this.unitListSize = this.unitList.length;
      })  
      .catch(error => {
        console.log(error);
      })
  }

  //Método que limpa os dados
  clearList() {
    this.selectedUnitTypes = [];
    this.firstFloor = null;
    this.lastFloor = null;
    this.firstFloorUnit = null;
    this.lastFloorUnit = null;
    this.unitList = [];
    this.unitListSize = 0;
  }

  //Método para salvar as unidades exibidas na tabela no banco de dados
  saveList() {
    this.updateTower();
    //Envia um JSON da lista de unidade e mostra uma mensagem toast
    transferDataAndInsert({json: JSON.stringify(this.unitList)})
      .then(() => {
        const msg = new ShowToastEvent({
          title: this.customLabels.SucessoSalvarUnidade,
          variant: this.customLabels.Sucesso
        })
        this.dispatchEvent(msg);
        this.clearList();
      })
      .catch(error => {
        const msg = new ShowToastEvent({
          title: this.customLabels.ErroSalvarUnidades,
          message: error.body.message,
          variant: this.customLabels.Erro
        })
        this.dispatchEvent(msg);
      })
    
  }

  //Método para atualizar a quantidade de unidades disponíveis na torre depois que elas são salvas
  updateTower() {
    this.availableUnits = (this.availableUnits + this.unitListSize)
    const fields = {};
    fields[ID_FIELD.fieldApiName] = this.recordId;
    fields[AVAILABLE_UNITS.fieldApiName] = this.availableUnits;
    const tower = {fields};
    updateRecord(tower)
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  //Cria o array [Andar, Prumada]
  createFloorList() {
    let stringFloors = []
    for(let i = parseInt(this.firstFloor,10); i < parseInt(this.lastFloor,10)+1; i++) {
      for(let j = parseInt(this.firstFloorUnit,10); j < parseInt(this.lastFloorUnit,10) +1; j++) {
        stringFloors.push([i,j])
      }
    }
    return stringFloors;
  }

  handleFirstFloor(event) {
    this.firstFloor = event.detail.value;
    this.addToList();
  }

  handleLastFloor(event) {
    this.lastFloor = event.detail.value;
    this.addToList();
  }

  handleFirstFloorUnit(event) {
    this.firstFloorUnit = event.detail.value;
    this.addToList();
  }

  handleLastFloorUnit(event) {
    this.lastFloorUnit = event.detail.value;
    this.addToList();
  }

  handleSelectedUnitTypes(event) {
    this.selectedUnitTypes = Array.from(event.detail.value);
    this.addToList();
  }

  //Método que cria os dados quando o tipo de unidade for apartamento para adicionar na lista de exibição/inserção
  createAptoUnit(item, component) {
    if(this.numberStandard == this.customLabels.Centena) {
      return ({
        Name: ('APTO'+component[0].toLocaleString('pt-BR', {minimumIntegerDigits: 2})+component[1].toLocaleString('pt-BR', {minimumIntegerDigits: 2})),
        Status: this.customLabels.Disponivel,
        TipoUnidade: item.Id,
        TipoUnidadeName: item.Name,
        AndarExibicao: component[0],
        FinalUnidade: ''+component[1]+'',
        AreaComum: item.AreaTotal__c/item.Dormitorios__c,
        AreaTotal: item.AreaTotal__c,
        FracaoIdeal: (item.AreaTotal__c/item.Dormitorios__c)/100,
        Dormitorios: item.Dormitorios__c,
        Suites: item.Suites__c,
        VagasCarros: item.VagasCarros__c,
        Torre: this.recordId,
        Empreendimento: this.enterpriseId,
        TipoRegistroUnidade: this.customLabels.TipoRegistroApto,
        VagasDeficientes: 0,
        VagasMotos: 0,
        Banheiros: item.Banheiros__c
      });
    } else {
      return ({
        Name: ('APTO'+component[0]+component[1]),
        Status: this.customLabels.Disponivel,
        TipoUnidade: item.Id,
        TipoUnidadeName: item.Name,
        AndarExibicao: component[0],
        FinalUnidade: ''+component[1]+'',
        AreaComum: item.AreaTotal__c/item.Dormitorios__c,
        AreaTotal: item.AreaTotal__c,
        FracaoIdeal: (item.AreaTotal__c/item.Dormitorios__c)/100,
        Dormitorios: item.Dormitorios__c,
        Suites: item.Suites__c,
        VagasCarros: item.VagasCarros__c,
        Torre: this.recordId,
        Empreendimento: this.enterpriseId,
        TipoRegistroUnidade: this.customLabels.TipoRegistroApto,
        VagasDeficientes: 0,
        VagasMotos: 0,
        Banheiros: item.Banheiros__c
      });
    }
  }

  //Método que cria os dados quando o tipo de unidade for vaga para adicionar na lista de exibição/inserção
  createVgUnit(item, component) {
    if(this.numberStandard == this.customLabels.Centena) {
      return ({
        Name: ('VAGA'+component[0].toLocaleString('pt-BR', {minimumIntegerDigits: 2})+component[1].toLocaleString('pt-BR', {minimumIntegerDigits: 2})),
        Status: this.customLabels.Disponivel,
        TipoUnidade: item.Id,
        TipoUnidadeName: item.Name,
        AndarExibicao: component[0],
        FinalUnidade: ''+component[1]+'',
        AreaComum: item.AreaTotal__c/item.Dormitorios__c,
        AreaTotal: item.AreaTotal__c,
        FracaoIdeal: (item.AreaTotal__c/item.Dormitorios__c)/100,
        Dormitorios: item.Dormitorios__c,
        Suites: item.Suites__c,
        VagasCarros: item.VagasCarros__c,
        Torre: this.recordId,
        Empreendimento: this.enterpriseId,
        TipoRegistroUnidade: this.customLabels.TipoRegistroVaga,
        VagasDeficientes: 0,
        VagasMotos: 0,
        Banheiros: item.Banheiros__c
      });
    } else {
      return ({
        Name: ('VAGA'+component[0]+component[1]),
        Status: this.customLabels.Disponivel,
        TipoUnidade: item.Id,
        TipoUnidadeName: item.Name,
        AndarExibicao: component[0],
        FinalUnidade: ''+component[1]+'',
        AreaComum: item.AreaTotal__c/item.Dormitorios__c,
        AreaTotal: item.AreaTotal__c,
        FracaoIdeal: (item.AreaTotal__c/item.Dormitorios__c)/100,
        Dormitorios: item.Dormitorios__c,
        Suites: item.Suites__c,
        VagasCarros: item.VagasCarros__c,
        Torre: this.recordId,
        Empreendimento: this.enterpriseId,
        TipoRegistroUnidade: this.customLabels.TipoRegistroVaga,
        VagasDeficientes: 0,
        VagasMotos: 0,
        Banheiros: item.Banheiros__c
      });
    }
  }
}