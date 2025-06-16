export interface GenerateScriptDto {
  fabricante: string;
  topologia: string;
  comSwitch: boolean;
  codigoUl: string;
  versaoHuawei?: string;
  operadora?: string;
  // Adicione outros campos aceitos pelo backend, se necessário
}
