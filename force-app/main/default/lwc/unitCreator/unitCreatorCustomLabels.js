import TipoRegistroApto from '@salesforce/label/c.TipoRegistroApto';
import TipoRegistroVaga from '@salesforce/label/c.TipoRegistroVaga';
import Disponivel from '@salesforce/label/c.Disponivel';
import Centena from '@salesforce/label/c.Centena';
import TextoAjudaGerador from '@salesforce/label/c.TextoAjudaGerador';
import ErroQuantidadeUnidadeMaior from '@salesforce/label/c.ErroQuantidadeUnidadeMaior';
import Atencao from '@salesforce/label/c.Atencao';
import SucessoSalvarUnidade from '@salesforce/label/c.SucessoSalvarUnidade';
import Sucesso from '@salesforce/label/c.Sucesso';
import ErroSalvarUnidades from '@salesforce/label/c.ErroSalvarUnidades';
import Erro from '@salesforce/label/c.Erro';
import TiposUnidade from '@salesforce/label/c.TiposUnidade';
import Disponiveis from '@salesforce/label/c.Disponiveis';
import Selecionadas from '@salesforce/label/c.Selecionadas';
import Limpar from '@salesforce/label/c.Limpar';
import LimparDadosSelecionados from '@salesforce/label/c.LimparDadosSelecionados';
import Adicionar from '@salesforce/label/c.Adicionar';
import Nenhum from '@salesforce/label/c.Nenhum';
import AndarInicial from '@salesforce/label/c.AndarInicial';
import AndarFinal from '@salesforce/label/c.AndarFinal';
import PrumadaInicial from '@salesforce/label/c.PrumadaInicial';
import PrumadaFinal from '@salesforce/label/c.PrumadaFinal';
import Salvar from '@salesforce/label/c.Salvar';
import CriarUnidades from '@salesforce/label/c.CriarUnidades';
import PreviaDisplay from '@salesforce/label/c.PreviaDisplay';
import UnidadesGeradasDisplay from '@salesforce/label/c.UnidadesGeradasDisplay';

let instance = null;

export default class Labels {
  constructor() {
    if(!instance) {
      this._data = {
        TipoRegistroApto,
        TipoRegistroVaga,
        Disponivel,
        Centena,
        TextoAjudaGerador,
        ErroQuantidadeUnidadeMaior,
        Atencao,
        SucessoSalvarUnidade,
        Sucesso,
        ErroSalvarUnidades,
        Erro,
        TiposUnidade,
        Disponiveis,
        Selecionadas,
        Limpar,
        LimparDadosSelecionados,
        Adicionar,
        Nenhum,
        AndarInicial,
        AndarFinal,
        PrumadaInicial,
        PrumadaFinal,
        Salvar,
        CriarUnidades,
        PreviaDisplay,
        UnidadesGeradasDisplay
      }

      instance = this
    }
    return  instance;
  }

  getLabels() {
    return this._data;
  }
}