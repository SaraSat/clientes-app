import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente';
import {ClienteService} from '../cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  cliente: Cliente;
  titulo: string = "Detalle del cliente";
  private fotoSeleccionada: File;
  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente=>{
          this.cliente = cliente;
        });
      }
    });
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
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
        cliente => {
          this.cliente = cliente
          Swal.fire("La foto se ha subido completamente", `La foto se subido con éxito: ${this.cliente.foto}`, "success");
      }
    )

    }

  }

}
