import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConfigService } from './services/config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenerateScriptDto } from './dto/generate-script.dto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  configForm: FormGroup;
  generatedScript: string | null = null;
  isLoading = false;

  // Tabela de IPs por operadora
  readonly operadoraInfo: any = {
    'Tim 1': { dmvpn: '41.50.255.81', concentrador: '10.98.0.81' },
    'Tim 2': { dmvpn: '42.50.255.82', concentrador: '10.98.0.82' },
    'Arqia': { dmvpn: '18.50.255.83', concentrador: '10.98.0.83' },
    'Vivo': { dmvpn: '15.50.255.80', concentrador: '10.98.0.80' },
  };

  dmvpnConsulta: string = '';
  concentradorConsulta: string = '';
  dmvpnComLoopback10: string = '';

  private ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private snackBar: MatSnackBar
  ) {
    this.configForm = this.fb.group({
      fabricante: [''],
      topologia: [''],
      comSwitch: [true],
      codigoUl: ['', Validators.required],
      ipLoopbackPrim: [''],
      ipLoopback10: [''],
      ipRedeVlan: [''],
      ipRedeVlan1: [''],
      ipRedeVlan3: [''],
      ipRedeSwitch: [''],
      ipSwitch: [''],
      ipSwitchRouter: [''],
      ipSwitchVip: [''],
      ipWanBkp: [''],
      ipWanBkp1: [''],
      ipWanBkp2: [''],
      versaoHuawei: [''],
      operadora: [''],
    });
  }

  ngOnInit(): void {
    const valueChangesSubscription = this.configForm.valueChanges.subscribe(() => {
        this.manageConditionalValidators();
        this.atualizarConsultaDMVPN();
    });
    this.subscriptions.add(valueChangesSubscription);
    // Chamada inicial para configurar validadores
    this.manageConditionalValidators();
    this.atualizarConsultaDMVPN();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private manageConditionalValidators(): void {
    // Não faz mais nada, pois só codigoUl é obrigatório
  }
  
  getControl(name: string): AbstractControl {
    return this.configForm.get(name) as AbstractControl;
  }

  private toggleValidator(controlName: string, isRequired: boolean, isIp: boolean = false): void {
    const control = this.getControl(controlName);
    const validators = [];
    if (isRequired) {
      validators.push(Validators.required);
    }
    if (isIp) {
      validators.push(Validators.pattern(this.ipv4Pattern));
    }
    control.setValidators(validators);
    control.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit(): void {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios corretamente.', 'Fechar', { duration: 4000 });
      return;
    }

    this.isLoading = true;
    this.generatedScript = null;

    // Envia todos os campos do formulário para o backend
    const dto: GenerateScriptDto = {
      ...this.configForm.value
    };
    // Futuramente, pode-se filtrar campos conforme a topologia/modelo/router

    this.configService.generateScript(dto).subscribe({
      next: (script) => {
        this.generatedScript = script;
        this.isLoading = false;
        this.snackBar.open('Script gerado com sucesso!', 'OK', { duration: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        const errorMsg = err.error?.message?.join ? err.error.message.join(', ') : (err.error || err.message);
        this.snackBar.open(`Erro ao gerar script: ${errorMsg}`, 'Fechar', { duration: 7000, panelClass: ['error-snackbar'] });
      }
    });
  }

  copyToClipboard(): void {
    if (!this.generatedScript) return;
    navigator.clipboard.writeText(this.generatedScript).then(() => {
      this.snackBar.open('Script copiado para a área de transferência!', 'OK', { duration: 2000 });
    }).catch(err => {
        console.error('Falha ao copiar: ', err);
        this.snackBar.open('Erro ao copiar o script.', 'Fechar', { duration: 3000, panelClass: ['error-snackbar'] });
    });
  }

  /**
   * Atualiza os campos de consulta de DMVPN, Concentrador e o valor do placeholder <DMVPN_COM_LOOPBACK10>
   */
  atualizarConsultaDMVPN(): void {
    const topologia = this.getControl('topologia').value;
    const operadora = this.getControl('operadora').value;
    const ipLoopback10 = this.getControl('ipLoopback10').value;
    if (topologia === 'Tipo 2' && this.operadoraInfo[operadora]) {
      this.dmvpnConsulta = this.operadoraInfo[operadora].dmvpn;
      this.concentradorConsulta = this.operadoraInfo[operadora].concentrador;
      // Monta o IP do placeholder <DMVPN_COM_LOOPBACK10>
      if (ipLoopback10 && this.ipv4Pattern.test(ipLoopback10)) {
        const dmvpnOctetos = this.dmvpnConsulta.split('.');
        const loopbackOctetos = ipLoopback10.split('.');
        if (dmvpnOctetos.length === 4 && loopbackOctetos.length === 4) {
          this.dmvpnComLoopback10 = `${dmvpnOctetos[0]}.${dmvpnOctetos[1]}.${loopbackOctetos[2]}.${loopbackOctetos[3]}`;
        } else {
          this.dmvpnComLoopback10 = '';
        }
      } else {
        this.dmvpnComLoopback10 = '';
      }
    } else {
      this.dmvpnConsulta = '';
      this.concentradorConsulta = '';
      this.dmvpnComLoopback10 = '';
    }
  }
}