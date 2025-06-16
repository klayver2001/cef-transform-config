import { IsString, IsNotEmpty, IsIP, IsBoolean, IsIn, ValidateIf } from 'class-validator';

export class GenerateScriptDto {
  // --- Sempre Obrigatórios ---
  @IsNotEmpty()
  @IsIn(['Cisco', 'Huawei', 'HP'])
  fabricante: string;

  @IsNotEmpty()
  @IsIn(['Tipo 1', 'Tipo 2'])
  topologia: string;

  @IsBoolean()
  comSwitch: boolean;

  @IsNotEmpty()
  @IsString()
  codigoUl: string;

  // --- Endereçamento IP (opcionais, sem validação) ---
  ipLoopbackPrim?: string;
  ipLoopback10?: string;
  ipRedeVlan?: string;
  ipRedeVlan1?: string;
  ipRedeVlan3?: string;
  ipRedeSwitch?: string;
  ipSwitch?: string;
  ipSwitchRouter?: string;
  ipSwitchVip?: string;
  ipWanBkp?: string;
  ipWanBkp1?: string;
  ipWanBkp2?: string;

  // --- Campos Condicionais (sem validação) ---
  versaoHuawei?: string;
  concentradorDmvpn?: string;
  ipDmvpn?: string;
  concentrador1?: string;
  concentrador2?: string;

  @IsString()
  operadora?: string;
}