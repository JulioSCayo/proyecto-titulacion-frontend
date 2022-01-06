import { Component, OnInit, OnDestroy } from '@angular/core';
import { Reporte } from 'src/app/models/reporte';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import Swal from 'sweetalert2';
import { AlgoritmoUrgencia } from '../../mapa-reportes/algoritmo-urgencia';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { stringify } from '@angular/compiler/src/util';
import { FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-tabla-desatendidos',
  templateUrl: './tabla-desatendidos.component.html',
  styleUrls: ['./tabla-desatendidos.component.css']
})
export class TablaDesatendidosComponent implements OnDestroy,OnInit {

  reportes: Reporte[] = [{
    ubicacion: {
      latitud: 0,
      longitud: 0
    },
    tipoProblema: "",
    credibilidad: 0,
    usuarios: [{
      _id: ""
    }]
  }];

  usuariosInfo: any;

  busqueda = ""; // Pipe

  registrarForm!: FormGroup;
  submitted = false;

  // dtOptions: DataTables.Settings = {};
  // dtTrigger: Subject<any > = new Subject<any>();
  // data: any;

  public orden: string[] = ['Más reciente', 'Más antiguo', 'Más urgente', 'Menos urgente'];
  public seleccionado!: "ninguno";

  constructor(public reportesService: ReportesService,
              private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private modal:NgbModal
            ) {}

  ngOnInit(): void {

    try {
      localStorage.getItem("Usr");
      this.getReportes();
      
    } catch (error) {
      console.error(error);
    }
  }


  ngOnDestroy(): void {
    // this.dtTrigger.unsubscribe();
  }


  openCentrado(contenido: any, reporte: any){
    this.reportesService.getInfoUsuariosReporte(reporte.usuarios).subscribe(
      async res => {
          this.usuariosInfo = res;
          for(let i = 0; i < (reporte.usuarios.length - this.usuariosInfo.length);  i++){
            this.usuariosInfo.push({
              _id: "Usuario Anonimo",
              nombreUsuario: "---",
              reputacion: "---"
            })
          }
      }, 
      err => {
          console.log('No se pudo cargar los reportes');
          console.error(err);
      }
    );

    this.modal.open(contenido,{centered:true});
  }


  async onSelect(orden:any): Promise<void> {
    let cont = 0, aux;
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);

    switch (orden) {
      case "Más urgente":
        cont = 0;

        for(let reporte of this.reportes) {  // calcula la urgencia de cada reporte y la guarda en un arreglo junto su id
          reporte.urgencia = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
        }

        aux = this.reportes;
        this.reportes = aux.sort(function (a: any, b: any){
          return (b.urgencia - a.urgencia)
        });

        console.log(this.reportes)
      break;

      case "Menos urgente":
        cont = 0;

        for(let reporte of this.reportes) {  // calcula la urgencia de cada reporte y la guarda en un arreglo junto su id
          reporte.urgencia = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
        }

        aux = this.reportes;
        this.reportes = aux.sort(function (a: any, b: any){
          return (a.urgencia - b.urgencia)
        });

        console.log(this.reportes)
      break;
    
      default:
        console.log("Opción no valida")
        break;
    }

  }



  //DEPENDIENDO EL USUARIO (INSTITUCION) SON LOS REPORTES QUE VA A PEDIR
  getReportes() {
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);
    let estado = "Desatendido$"+ localStorage.getItem("Usr");

    this.reportesService.getEstadoReportes(estado).subscribe(
      async res => {
          this.reportes = <Reporte[]>res;
          // this.data = <Reporte[]>res;

          // this.dtTrigger.next();
      }, 
      err => {
          console.log('No se pudo cargar los reportes');
          console.error(err);
      }
    );
  }



  cambioEnProceso(reporte: Reporte) {
    Swal.fire({
      title: 'Seguro?',
      text: "Se cambiará el estado del reporte a 'En proceso'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aceptar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        reporte.estado = "En proceso";
        
        this.reportesService.editReporte(reporte)?.subscribe(
          res => {
            Swal.fire({
              title: 'En proceso!',
              text: "Se cambió el estado del reporte a 'En proceso'",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                window.location.reload();
              }
            });
          },
          err => {
            reporte.estado = "Desatendido";
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema cambiando el estado del reporte',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
          );
      }
    });
  }

  cambioDenegado(reporte: Reporte) {
    Swal.fire({
      title: 'Seguro?',
      text: "Se cambiará el estado del reporte a 'Denegado'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aceptar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        reporte.estado = "Denegado";
        this.reportesService.editReporte(reporte)?.subscribe(
          res => {
            Swal.fire({
              title: 'Denegado!',
              text: "Se cambió el estado del reporte a 'Denegado'",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                window.location.reload();
              }
            });
          },
          err => {
            reporte.estado = "Desatendido";
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema cambiando el estado del reporte',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
          );
      }
    });
  }
}
