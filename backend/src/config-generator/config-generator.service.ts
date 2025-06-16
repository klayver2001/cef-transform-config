import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { GenerateScriptDto } from './dto/generate-script.dto';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class ConfigGeneratorService {
  
  async generate(dto: GenerateScriptDto): Promise<string> {
    const templateName = this.buildTemplateName(dto);
    const templatePath = path.join(__dirname, '..', 'templates', templateName);

    try {
      await fs.access(templatePath);
    } catch {
      // Fornece um erro mais amigável se o template não existir
      const huaweiBase = `huawei-ver-${dto.comSwitch ? 'com' : 'sem'}_switch-tipo2.ejs`;
      if (templateName.startsWith('huawei-v')) {
          try {
             await fs.access(path.join(__dirname, '..', 'templates', huaweiBase));
             // O erro é que a versão específica não existe, mas a base sim.
          } catch {
             throw new NotFoundException(`Template base para Huawei Tipo 2 (${huaweiBase}) não foi encontrado.`);
          }
      }
      throw new NotFoundException(`Template não encontrado para a combinação: ${templateName}. Verifique se o arquivo existe no diretório 'templates'.`);
    }

    const templateData = this.buildTemplateData(dto);

    try {
        // Para os templates de Huawei Tipo 2, renderizamos o template base 'ver'
        if (templateName.startsWith('huawei-v') && templateName.includes('tipo2')) {
             const baseTemplateName = `huawei-ver-${dto.comSwitch ? 'com' : 'sem'}_switch-tipo2.ejs`;
             const baseTemplatePath = path.join(__dirname, '..', 'templates', baseTemplateName);
             const script = await ejs.renderFile(baseTemplatePath, templateData);
             return script;
        }

        const script = await ejs.renderFile(templatePath, templateData);
        return script;
    } catch (error) {
        console.error("Erro ao renderizar o template EJS:", error);
        throw new InternalServerErrorException('Falha ao gerar o script de configuração.');
    }
  }

  private buildTemplateName(dto: GenerateScriptDto): string {
    const { fabricante, topologia, comSwitch } = dto;
    const switchSuffix = comSwitch ? 'com_switch' : 'sem_switch';
    const tipo = topologia.replace(' ', '').toLowerCase(); // tipo1 ou tipo2
    const fabricanteLower = fabricante.toLowerCase();
    // Exemplo: tipo1-hp-sem_switch.ejs dentro da pasta tipo1/
    return `${tipo}/${tipo}-${fabricanteLower}-${switchSuffix}.ejs`;
  }

  private buildTemplateData(dto: GenerateScriptDto): any {
    const data: any = { ...dto };

    if (dto.fabricante === 'Cisco' && dto.topologia === 'Tipo 2') {
      data.nhrpMap = `${dto.ipDmvpn} ${dto.concentradorDmvpn}`;
    }

    // Reintroduz a lógica para os blocos versionados do Huawei
    if (dto.fabricante === 'Huawei') {
      const { verhuawei1, verhuawei2 } = this.getHuaweiVersionedBlocks(dto.versaoHuawei);
      data.verhuawei1 = verhuawei1;
      data.verhuawei2 = verhuawei2;
    }

    if (dto.topologia === 'Tipo 2' && dto.operadora) {
      switch (dto.operadora.toLowerCase()) {
        case 'tim 1':
          data.ipDmvpn = '41.50.255.81';
          data.concentradorDmvpn = '10.98.0.81';
          break;
        case 'tim 2':
          data.ipDmvpn = '42.50.255.82';
          data.concentradorDmvpn = '10.98.0.82';
          break;
        case 'arqia':
          data.ipDmvpn = '18.50.255.83';
          data.concentradorDmvpn = '10.98.0.83';
          break;
        case 'vivo':
          data.ipDmvpn = '15.50.255.80';
          data.concentradorDmvpn = '10.98.0.80';
          break;
      }
    }

    return data;
  }
  
  // Esta função é agora usada para ambos os tipos de topologia do Huawei
  private getHuaweiVersionedBlocks(version: string): { verhuawei1: string, verhuawei2: string } {
    if (version === 'V2R7') {
      return {
        verhuawei1: `
ipsec proposal 1
 esp authentication-algorithm sha1
 esp encryption-algorithm 3des`,
        verhuawei2: `
ike proposal 1
 encryption-algorithm 3des
 authentication-algorithm sha1
 authentication-method pre-share
 dh group2`
      };
    } else if (version === 'V2R10') {
      return {
        verhuawei1: `
ipsec proposal 10
 esp authentication-algorithm sha2-256
 esp encryption-algorithm aes-256`,
        verhuawei2: `
ike proposal 10
 encryption-algorithm aes-256
 authentication-algorithm sha2-256
 authentication-method pre-share
 dh group14`
      };
    }
    
    return { verhuawei1: '', verhuawei2: '' };
  }
}