import { ConfigGeneratorService } from './config-generator.service';

describe('ConfigGeneratorService', () => {
  let service: ConfigGeneratorService;

  beforeEach(() => {
    service = new ConfigGeneratorService();
  });

  describe('replaceDmvpnComLoopback10', () => {
    it('deve substituir <DMVPN_COM_LOOPBACK10> pelo IP combinado', () => {
      const script = 'Tunnel IP: <DMVPN_COM_LOOPBACK10> fim';
      const data = {
        ipDmvpn: '41.50.255.81',
        ipLoopback10: '10.50.161.96',
      };
      // @ts-ignore: método privado
      const result = service['replaceDmvpnComLoopback10'](script, data);
      expect(result).toBe('Tunnel IP: 41.50.161.96 fim');
    });

    it('não deve substituir se faltar ipDmvpn', () => {
      const script = 'Tunnel IP: <DMVPN_COM_LOOPBACK10> fim';
      const data = {
        ipLoopback10: '10.50.161.96',
      };
      // @ts-ignore: método privado
      const result = service['replaceDmvpnComLoopback10'](script, data);
      expect(result).toBe(script);
    });

    it('não deve substituir se faltar ipLoopback10', () => {
      const script = 'Tunnel IP: <DMVPN_COM_LOOPBACK10> fim';
      const data = {
        ipDmvpn: '41.50.255.81',
      };
      // @ts-ignore: método privado
      const result = service['replaceDmvpnComLoopback10'](script, data);
      expect(result).toBe(script);
    });

    it('não deve substituir se IPs forem inválidos', () => {
      const script = 'Tunnel IP: <DMVPN_COM_LOOPBACK10> fim';
      const data = {
        ipDmvpn: '41.50',
        ipLoopback10: '10.50.161',
      };
      // @ts-ignore: método privado
      const result = service['replaceDmvpnComLoopback10'](script, data);
      expect(result).toBe(script);
    });
  });
}); 