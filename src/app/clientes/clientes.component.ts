import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente';
import { ClienteService } from './cliente.service';
import {ModalService} from './detalle/modal.service';
import Swal from 'sweetalert2';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginator: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService,
     private activatedRoute: ActivatedRoute,
     private modalService: ModalService
     ) { }

  ngOnInit(): void {
    
    this.activatedRoute.paramMap.subscribe(params => {
      let page:number = +params.get('page');

      if(!page){
        page=0;
      }

      this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginator = response
        }
      );
    });

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto
        }
        return clienteOriginal;
      })
    })
  }

  delete(cliente:Cliente):void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `Seguro que quiere eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response =>{
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El cliente ${cliente.nombre} ha sido eliminado con éxito`,
              'success'
            )
          }
        )
      }
    })
  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
