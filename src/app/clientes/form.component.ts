import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service'
import {Router, ActivatedRoute} from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  cliente: Cliente = new Cliente()
  titulo:string ="Crear Cliente"
  
  constructor(private clienteService: ClienteService, 
    private router: Router, 
    private activateRpute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente():void
{
  this.activateRpute.params.subscribe(params=>{
    let id=params['id']
    if (id){
      this.clienteService.getCliente(id).subscribe( (cliente=> this.cliente=cliente))
    }
  })
}
  public create():void{
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado con éxito!`,'success')
    }
   );
  }
  update():void{
    this.clienteService.update(this.cliente).subscribe(cliente=>{
      this.router.navigate(['/clientes'])
      Swal.fire('Cliente Actualizado', `${cliente.nombre} actualizado con éxito!`, 'success')
    })
  }





}
