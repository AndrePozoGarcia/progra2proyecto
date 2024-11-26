import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Carrito } from 'src/app/interfaces/carrito.interface';
import { Evento } from 'src/app/interfaces/evento.interface';
import { Item } from 'src/app/interfaces/item';
import { Promo } from 'src/app/interfaces/promo.interface';
const PROMOPATH = 'promo';
const EVENTOPATH = 'evento';
const SALEPATH = 'venta';


@Injectable({
  providedIn: 'root',
})
export class VistaPrincipalService {
  constructor(private firestore: Firestore) {}

  private _collections = collection(this.firestore, PROMOPATH);
  private _collectionsEvento = collection(this.firestore, EVENTOPATH);
  private _collectionsVenta = collection(this.firestore, SALEPATH);
  private carritoService: Carrito = {
    items: [],
    montoTotal: 0,
  };

  public getCarritoService(): Carrito {
    return this.carritoService;
  }

  public setCarritoService(evento: Item): void {
    this.removeCarritoLocalStorage();

    if (this.carritoService.items.length === 0) {
      this.carritoService.items.push(evento.evento);
      this.carritoService.montoTotal = evento.montoTotal;
      this.setCarritoLocalStorage(this.carritoService);
      console.log('Primer elemento');
      return;
    }

    const existingItem = this.carritoService.items.find((i) => i.id === evento.evento.id);
    if(existingItem) {
      existingItem.boletos += evento.evento.boletos;
      this.carritoService.montoTotal += evento.montoTotal;
      this.setCarritoLocalStorage(this.carritoService);
      console.log('Elemento existente');
      return;
    }

    this.carritoService.items.push(evento.evento);
    this.carritoService.montoTotal += evento.montoTotal;


    this.setCarritoLocalStorage(this.carritoService);
  }

  public getPromos() {
    return collectionData(this._collections) as Observable<Promo[]>;
  }

  public getEventos() {
    return collectionData(this._collectionsEvento, {
      idField: 'id',
    }) as Observable<Evento[]>;
  }

  public getEventoById(id: string): Observable<Evento | undefined> {
    const eventoDocRef = doc(this.firestore, `${EVENTOPATH}/${id}`);

    return new Observable<Evento | undefined>((observer) => {
      getDoc(eventoDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const eventoData = { id: docSnap.id, ...docSnap.data() } as Evento;
            observer.next(eventoData);
          } else {
            observer.next(undefined);
          }
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  public postEvento() {
    let evento: Evento = {
      nombre: 'Concierto virtual de rock',
      descripcion:
        'Por que puedes ser parte de el concierto desde la comodidad de tu hogar con tus amigos y familiares y disfrutar de la mejor musica de rock en vivo',
      precio: 100,
      // imagen: 'https://img.freepik.com/psd-gratis/plantilla-banner-festival-musica-rock_23-2148971252.jpg',
      imagen:
        'https://img.freepik.com/psd-gratis/plantilla-banner-concierto-rock-virtual_23-2148974091.jpg',
      fecha: '10/06/2025',
      boletos: 1000,
      lugar: 'Online',
      categoria: 'Concierto virtual',
    };
    return addDoc(this._collectionsEvento, evento);
  }

  public postPromo() {
    let promo: Promo = {
      nombre: 'Concierto de Kpop',
      descripcion:
        'Vive la experiencia de un concierto de Kpop en vivo con tus amigos y familiares en el estadio de la ciudad con un 10% de descuento',
      precio: 100,
      imagen:
        'https://img.freepik.com/psd-gratis/plantilla-banner-festival-musica-rock_23-2148971252.jpg',
      fecha: '10/06/2025',
      boletos: 1000,
      lugar: 'Estadio de la ciudad',
      categoria: 'Concierto',
      descuento: 10,
      fechaFin: '10/06/2025',
      fechaInicio: '10/06/2024',
    };
    return addDoc(this._collections, promo);
  }

  public postCarrito(carrito: Item) {
    return addDoc(this._collectionsVenta, carrito).then(() => {
      this.removeCarritoLocalStorage();
    });
  }
  

  public setCarritoLocalStorage(carrito: Carrito): void {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  public getCarritoLocalStorage(): void {
    const carrito = localStorage.getItem('carrito');
    if (carrito) {
      this.carritoService = JSON.parse(carrito);
    }
  }

  public removeCarritoLocalStorage(): void {
    localStorage.removeItem('carrito');
  }
}
