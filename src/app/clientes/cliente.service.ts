import { Injectable } from '@angular/core';
import {Cliente} from './cliente';
import {of, Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {formatDate, DatePipe} from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:9090/api/clientes'

  private httpHeaders = new HttpHeaders({'Content-type':'application/json'})
  
  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(  //--> otra forma: return this.http.get<Cliente[]>(this.urlEndPoint)
      tap((response: any) => {
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre)
        })
      }),
      map((response:any) => {
         (response.content as Cliente[]).map(cliente =>{

          cliente.nombre = cliente.nombre.toUpperCase();

        //otra forma:  cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'en-US'); 
          let datePipe= new DatePipe('es'); 
          cliente.createAt=datePipe.transform(cliente.createAt, ' EEEE dd, MMMM yyyy'); 
          return cliente;
        });
        return response;
      })
    )
  }

  //Hay dos formas de sacar el cliente desde back, en create se mapea la respuesta desde aquí, en update, se mapea en form.component
  create(cliente: Cliente):Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers:this.httpHeaders}).pipe(
      map((response:any) =>response.cliente as Cliente),
      catchError(e =>{

        if(e.status==400){
           return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    )
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  update(cliente: Cliente):Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente, {headers:this.httpHeaders}).pipe(
      catchError(e =>{

        if(e.status==400){
          return throwError(e);
       }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })

    )
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.httpHeaders})
  }
}
