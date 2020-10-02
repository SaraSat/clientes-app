import { Component, OnInit,Input } from '@angular/core';
import { Cliente } from '../cliente';
import {ClienteService} from '../cliente.service';
import {ModalService} from './modal.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso:number = 0;

  constructor(private clienteService: ClienteService, public modalService: ModalService) { }

  ngOnInit(): void {

  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);

    if(this.fotoSeleccionada.type.indexOf('image')< 0){
      Swal.fire('Error al seleccionar la imagen: ','debe seleccionar un archivo de tipo imagen', 'error');
    }
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      Swal.fire('Error Upload: ','debe seleccionar una foto', 'error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100)
          }else if(event.type === HttpEventType.Response){
            let response: any = event.body;
            this.cliente = response.cliente as Cliente

            this.modalService.notificarUpload.emit(this.cliente);

            Swal.fire("La foto se ha subido completamente", response.mensaje, "success");
          }
      })
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
