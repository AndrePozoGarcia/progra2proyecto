import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoModule } from './evento.module';
import { VistaPrincipalService } from '../vista-principal/service/vista-principal.service';
import { Evento } from 'src/app/interfaces/evento.interface';
import { Carrito } from 'src/app/interfaces/carrito.interface';
import { AuthService } from '../login/service/auth.service';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';

@Component({
  selector: 'app-evento',
  standalone: true,
  imports: [CommonModule, EventoModule],
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css'],
})
export default class EventoComponent {
  public productId!: string;
  public cantidadBoletos: number = 1;
  public montoTotal: number = 0;
  public evento: Evento;
  public modal: ModalComponent;


  constructor(private route: ActivatedRoute,
    private vistaPrincipalService: VistaPrincipalService,
    private authService: AuthService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id')!;
      this.getEventoById(this.productId);
    }
    );

    this.inicializaModal();
  }

  private inicializaModal() {
    this.vistaPrincipalService.trigger.subscribe((modal: ModalComponent) => {
      this.modal = modal;
    });
  }

  public incrementar(): void {
    this.cantidadBoletos++;
    this.montoTotal = this.cantidadBoletos * this.evento.precio;
  }

  public decrementar(): void {
    if (this.cantidadBoletos > 1) {
      this.cantidadBoletos--;
      this.montoTotal = this.cantidadBoletos * this.evento.precio;
    }
  }

  private getEventoById(id: string): void {
    this.vistaPrincipalService.getEventoById(id).pipe().subscribe((evento) => {
      if (evento) {
        this.evento = evento;
        this.montoTotal = this.cantidadBoletos * this.evento.precio;
        console.log('Evento encontrado', evento);
      } else {
        this.vistaPrincipalService.getPromoById(id).pipe().subscribe((promo) => {
          if (promo) {
            this.evento = promo;
            this.montoTotal = this.cantidadBoletos * this.evento.precio;
            console.log(this.evento);
          } else {
            console.log('No se encontro el evento');
          }
        });
      }
    }
    );
  }

  public agregarAlCarrito(): void {
    const evento: Evento = {
      ...this.evento,
      boletos: this.cantidadBoletos,
    }

    const item = {
      evento: evento,
      montoTotal: this.montoTotal,
    }

    this.vistaPrincipalService.setCarritoService(item);
  }
  public cerrarSesion(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
    this.vistaPrincipalService.deleteCarritoService();
  }


  public openModal() {
    this.modal.openModal();
  }
}
