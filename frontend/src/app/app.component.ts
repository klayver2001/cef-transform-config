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
    });
    this.subscriptions.add(valueChangesSubscription);
    // Chamada inicial para configurar validadores
    this.manageConditionalValidators();
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

    // Monta explicitamente o DTO aceito pelo backend
    const form = this.configForm.value;
    const dto: GenerateScriptDto = {
      fabricante: form.fabricante,
      topologia: form.topologia,
      comSwitch: form.comSwitch,
      codigoUl: form.codigoUl,
      versaoHuawei: form.versaoHuawei || undefined,
      operadora: form.operadora || undefined,
    };

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
}