import { IsString, IsNotEmpty, IsIP, IsBoolean, IsIn, ValidateIf, IsOptional } from 'class-validator';

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

  // --- Endereçamento IP (opcionais, mas DEVEM estar decorados!) ---
  @IsOptional() @IsString() ipLoopbackPrim?: string;
  @IsOptional() @IsString() ipLoopback10?: string;
  @IsOptional() @IsString() ipRedeVlan?: string;
  @IsOptional() @IsString() ipRedeVlan1?: string;
  @IsOptional() @IsString() ipRedeVlan3?: string;
  @IsOptional() @IsString() ipRedeSwitch?: string;
  @IsOptional() @IsString() ipSwitch?: string;
  @IsOptional() @IsString() ipSwitchRouter?: string;
  @IsOptional() @IsString() ipSwitchVip?: string;
  @IsOptional() @IsString() ipWanBkp?: string;
  @IsOptional() @IsString() ipWanBkp1?: string;
  @IsOptional() @IsString() ipWanBkp2?: string;

  // --- Campos Condicionais (opcionais) ---
  @IsOptional() @IsString() versaoHuawei?: string;
  @IsOptional() @IsString() operadora?: string;

  // --- Campos para DMVPN e Concentrador calculados ---
  @IsOptional() @IsString() ipDmvpn?: string;
  @IsOptional() @IsString() concentradorDmvpn?: string;
}