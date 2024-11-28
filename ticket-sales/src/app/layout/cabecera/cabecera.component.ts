import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { AuthService } from 'src/app/modulos/login/service/auth.service';
import { RouterModule, Router } from '@angular/router';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css'],
  imports: [CommonModule, RouterModule, PrimeModule, ModalComponent],
  standalone: true,
})
export class HeaderComponent {
  public isvisible: boolean;
  public destroySubject: Subject<void> = new Subject<void>();
  constructor(private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.empiezaAEscuchar();
    console.log(this.isvisible, 'isvisible');
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }


  public empiezaAEscuchar() {
    this.authService.getIsAuth()
    .pipe(takeUntil(this.destroySubject))
    .subscribe((isAuth) => {
      console.log(isAuth, 'isAuth');
      this.isvisible = isAuth;
      console.log(this.isvisible, 'isvisible');

    });
  }

  public openModal(modal: ModalComponent) {
    modal.openModal();
  }

  public cerrarSesion() {
    console.log(this.isvisible);

    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
    console.log(this.isvisible);

  }
}
