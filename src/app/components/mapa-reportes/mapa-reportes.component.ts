import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ReportesService } from "../../services/reportes/reportes.service";
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";
import { Loader } from '@googlemaps/js-api-loader';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoginService } from "../../services/login/login.service";

import { AlgoritmoIdentificacion } from './algoritmo-identificacion';
import { AlgoritmoUrgencia } from "./algoritmo-urgencia";
import { createOfflineCompileUrlResolver } from '@angular/compiler';

// import { from } from 'rxjs';

@Component({
  selector: 'app-mapa-reportes',
  templateUrl: './mapa-reportes.component.html',
  styleUrls: ['./mapa-reportes.component.css']
})
export class MapaReportesComponent implements OnInit {
  // MAS DE 150 CARACTERES EN COMENTARIO DEL FORMULARIO
  comentarioLargo = false;
  registrarForm!: FormGroup;
  @Input() span = 'Seleccionar archivo de imagen';

  @ViewChild('file', {
    read: ElementRef
  }) file?: ElementRef;

  selectedImage?: File;

  // VARIABLES PARA HACER TOGGLE DE CLASES
  toggleShowBotonReportar: boolean = false;
  toggleShowBotonReplicar: boolean = false;
  toggleDesactivarMapa: boolean = false;
  toggleTipoProblema: boolean = false;
  toggleTipoAgua: boolean = false;
  toggleTipoObstruccion: boolean = false;
  toggleFormReporte: boolean = false;

  // TRUE SI SE VA A HACER LA REPLICA DE UN REPORTE
  replica: boolean = false;

  // ID DEL REPORTE A REPLICAR
  replicaId: string = "";

  // COORDENADAS Y TIPO DEL NUEVO REPORTE EN DONDE SE COLOCÓ EL MARKER
  nuevoLatLng: any;
  nuevoProblema: string = "";

  // ESQUEMA DE REPORTE PARA RECIBIR LOS REPORTES YA EXISTENTES
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

  constructor(public reportesService: ReportesService, public http: HttpClient, private formBuilder: FormBuilder, public loginService: LoginService) { }

  ngOnInit(): void {
    

    // SE INICIA EL MAPA
    
    this.mapa();

    // ASI SE UTILIZA LA CLASE CON EL ALGORITMO DE IDENTIFICACION,
    

    // let prueba = new AlgoritmoIdentificacion(this.reportesService, this.http);
    // prueba.Identificacion(this.reportePrueba); // es el reporte que se esta haciendo

    this.registrarForm = this.formBuilder.group({
      comentario: ['', ],
      imagen: ['', ],
      cronico: [false, ],
      vidaRiesgo: [false, ],
      fantasma: [false, ],
      tipoProblema: ['', ],
      ubicacion: {
        longitud: [0, ],
        latitud: [0, ]
        },
      usuarios: {
        _id: ""
      }
    }); 
  }

  // NECESARIO PARA RECIBIR LA IMAGEN (PENDIENTE)
  onImageSelected(event: Event) {
    this.selectedImage = this.file?.nativeElement.files[0];

    if(this.selectedImage?.name) {
			this.span = this.selectedImage?.name;
    }
  }




//||||||||||||||||||||||||||||||||||||| SE CARGA EL MAPA |||||||||||||||||||||||||||||||||||||
mapa() {
  // COORDENADAS DEL USUARIO PARA CENTRAR EL MAPA
  let longitud: number =  -103.3479102;
  let latitud: number = 20.6763989;

  // DECLARAR LOADER DEL MAPA CON LA APIKEY
  let loader = new Loader({
    // apiKey: 'AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw'
    apiKey: ''
  });
  console.log("UNO")
  // CONSEGUIR COORDENADAS DEL USUARIO
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      latitud = position.coords.latitude;
      longitud = position.coords.longitude;
      console.log(position.coords)
    }, function(err){
      console.error(err);
    }, {enableHighAccuracy: true});
  }
  
  console.log("DOS")

  setTimeout(() => {
    console.log("NUEVO")
  // SE CARGA EL MAPA CENTRADO EN LA UBICACION DEL USUARIO
  loader.load().then(() => {
    const map = new google.maps.Map(document.getElementById("mapa")!, {
      center: { lat: latitud, lng: longitud},
      disableDefaultUI: true,
      zoomControl: true,
      zoom: 15,
      styles: [
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
    });

  console.log("TRES")

    // ESTO ES PARA INTENTAR HACER EL BUSCADOR EN UN FUTURO
    // const buscador = <HTMLInputElement>document.getElementById("buscador")!;
    // const buscar = new google.maps.places.Autocomplete(buscador);
    // buscar.bindTo("bounds", map);

    // INFOWINDOW
    const infoWindow = new google.maps.InfoWindow();
    // ARREGLO DE MARKERS PARA CAMBIAR DE POSICION EL MARCADOR CUANDO EL USUARIO PRESIONA EL MAPA
    let newMarker: google.maps.Marker[] = [];



    // SE CREAN LOS MARCADORES DE LOS REPORTES YA EXISTENTES
    this.reportesExistentes(map);



    // ICONO DEL MARKER DEL NUEVO REPORTE
    const nuevoReporteMarker = {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: "#04CAB3",
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30)
    };



    // SE CREA EL LISTENER DEL MAPA PARA CREAR NUEVOS REPORTES
    google.maps.event.addListener(map, "click", (event: any) => {
      let boton = document.getElementById('botonReportar')
      this.nuevoLatLng = event.latLng; // SE OBTIENE LA UBICACIÓN SELECCIONADA
      
      // SI YA EXISTE EL MARKER SE BORRA
      if(newMarker.length > 0) {
        newMarker[0].setMap(null);
        newMarker = [];
      }

      // SE CREA EL MARKER
      const addMarker = new google.maps.Marker({
        position: this.nuevoLatLng,
        map,
        title: "Has un reporte!",
        optimized: true,
        icon: nuevoReporteMarker,
        draggable: true
      });

      // SE AGREGA EL MARKER AL ARREGLO PARA SABER CUANDO SE CREA
      newMarker.push(addMarker);

      // SE CIERRA EL INFOWINDOW DEL OTRO MARKER EN CASO DE EXISTIR Y SE MUESTRA EL BOTON EN EL NUEVO MARCADOR
      setTimeout(() => {
        infoWindow.close();
        if(localStorage.getItem('TipoUsr') == 'admin' || localStorage.getItem('TipoUsr') == 'responsable'){
          infoWindow.setContent('<h2>No tiene permitido realizar reportes</h2>');
        }
        else {
          infoWindow.setContent(boton);
          this.toggleShowBotonReportar = true;
        }

        infoWindow.open(newMarker[0].getMap(), newMarker[0]);
      }, 100);
      
      // AL PRESIONAR EL BOTON SE USA EL METODO
      boton?.addEventListener('click', () => {
        this.tipoProblema();
      })
    })
  });
  }, 100);
  
}
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||




  // AGREGAR LOS MARCADORES DE LOS REPORTES EXISTENTES
  reportesExistentes(map: google.maps.Map) {
    const infoWindow = new google.maps.InfoWindow();
    let boton = document.getElementById('botonReplicar')

    // LOS COLORES DE LOS MARCADORES DE CADA TIPO DE PROBLEMA
    const markerAlumbrado = "#ccc547";
    const markerAgua = "#6cb7ce";
    const markerObstruccion = "#864109";
    const markerIncendio = "#fd8037";
    


    // SE OBTIENEN TODOS LOS REPORTES EXISTENTES DESDE EL BACKEND CON EL SERVICE
    this.reportesService.getReportes().subscribe(
      res => {
        this.reportes = <Reporte[]>res; 
        
        // FOR PARA CREAR TODOS LOS MARCADORES
        for (let i = 0; i < this.reportes.length; i++) {
          let markerColor;
    
          // SE IDENTIFICA EL TIPO DE REPORTE PARA ASIGNAR UN COLOR
          switch (this.reportes[i].tipoProblema) {
            case "alumbrado":
              markerColor = markerAlumbrado;
              break;
    
            case "inundacion":
            case "fuga":
            case "faltaAlcantarilla":
            case "alcantarillaObstruida":
              markerColor = markerAgua;
              break;
    
            case "escombros":
            case "vehiculo":
            case "arbol":
            case "socavon":
            case "cables":
              markerColor = markerObstruccion;
              break;
    
            case "incendio":
              markerColor = markerIncendio;
              break;
          }
    
          // EL ICONO TOMA EL COLOR QUE LE CORRESPONDE
          const icon = {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: markerColor,
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30)
          };
    
          // SE CREA EL MARCADOR CON EL ICONO Y LAS COORDENADAS DEL PROBLEMA
          const marker = new google.maps.Marker({
            position: { lat: this.reportes[i].ubicacion.latitud, lng: this.reportes[i].ubicacion.longitud },
            map: map,
            title: "Ver detalles",
            icon: icon,
            optimized: true,
          });

          // CUANDO SE HACE CLICK EN EL MARCADOR DE UN REPORTE EXISTENTE SE MUESTRA UN INFOWINDOW
          marker.addListener("click", () => {
            this.replicaId = this.reportes[i]._id!; // CUANDO SE PRESIONA UN MARKER DE UN REPORTE EXISTENTE SE OBTIENE SU ID
            infoWindow.close();
            if(localStorage.getItem('TipoUsr') == 'admin' || localStorage.getItem('TipoUsr') == 'responsable'){
              infoWindow.setContent('<h2>No tiene permitido replicar reportes</h2>');
            }
            else {
              infoWindow.setContent(boton);
              this.toggleShowBotonReplicar = true;
            }
              
            infoWindow.open(marker.getMap(), marker);
          })

          // AL PRESIONAR EL BOTON SE ABRE EL FORMULARIO DE LA REPLICA
          boton?.addEventListener('click', () => {
            this.formReplicar();
          })
        }
      },



      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema cargando los reportes existentes',
          icon: 'error',
          confirmButtonText: 'Ok'
        });

        console.error(err);
      }
    );
  }




  // MOSTRAR LA VENTANA DE TIPO DE PROBLEMA
  tipoProblema() {
    this.toggleTipoProblema = true; // MUESTRA FORM 1
    this.toggleDesactivarMapa = true; // DESACTIVA EL MAPA
  }
  // MOSTRAR LA VENTANA DE TIPO DE PROBLEMA DE AGUA Y CERRAR LA GENERAL
  tipoAgua() {
    this.toggleTipoProblema = false // ESCONDE EL FORM 1
    this.toggleTipoAgua = true; // MUESTRA EL FORM DE AGUA
  }
  // MOSTRAR LA VENTANA DE TIPO DE PROBLEMA DE OBSTRUCCION Y CERRAR LA GENERAL
  tipoObstruccion() {
    this.toggleTipoProblema = false // ESCONDE EL FORM 1
    this.toggleTipoObstruccion = true; // MUESTRA EL FORM DE OBSTRUCCION
  }




// FORMULARIO DE DETALLES DEL REPORTE
  formReporte(tipoProblema: string) {
    this.nuevoProblema = tipoProblema; // SE OBTIENE EL TIPO DE PROBLEMA
    this.toggleTipoProblema = false // SE ESCONDE EL FORM 1
    this.toggleTipoAgua = false; // SE ESCONDE EL FORM DE AGUA
    this.toggleTipoObstruccion = false; // SE ESCONDE EL FORM DE OBSTRUCCION
    this.toggleFormReporte = true; // SE MUESTRA EL FORM DE DETALLES
  }

  // FORMULARIO DE DETALLES DEL REPORTE
  formReplicar() {
    this.replica = true; // SE COLOCA COMO TRUE QUE SE VA A REPLICAR UN REPORTE
    this.toggleDesactivarMapa = true; // SE DESACTIVA EL MAPA
    this.toggleFormReporte = true; // SE MUESTRA EL FORM DE DETALLES
  }





  cerrarForm() {
    // SE CIERRA EL FORM DE DETALLES CON UN TOGGLE
    this.toggleFormReporte = false; 

    // SI ES EL FORM DE UNA REPLICA SE VA DIRECTO AL MAPA
    if(this.replica == true) {
      this.replica = false;
      this.toggleDesactivarMapa = false;
    }
    // SI ES EL FORM DE REPORTE NUEVO SE VA AL FORM DE TIPO DE PROBLEMA
    else
      this.toggleTipoProblema = true;  
  }





//comentario: HTMLTextAreaElement, cronico: HTMLInputElement, riesgoVida: HTMLInputElement
  // FORM DE DETALLES Y ENVIAR REPORTE
  async reportar(): Promise<any> {
    //hace las validaciones del algoritmo de identificacion
    // ASI SE UTILIZA LA CLASE CON EL ALGORITMO DE IDENTIFICACION
    let pruebaIdentifiacion = new AlgoritmoIdentificacion(this.reportesService, this.http); // ---------------

    if(!pruebaIdentifiacion.ChecarBan()){ // primero revisa que el dispositivo no este baneado
        // Revisa si el usuario es invitado o no
        if(localStorage.getItem('TipoUsr') == 'invitado') {
          this.registrarForm.value.usuarios._id = '000000000000000000000000'; // (PROVISIONAL)
          
        } else {
          this.registrarForm.value.usuarios._id = this.loginService.getUsuarioActual();
        }
        
        // SI ES REPLICA SE ENVIAN LOS DATOS PARA MODIFICAR EL REPORTE
        if(this.replica == true) {

          
          // SE INGRESA LA CREDIBILIDAD Y ID DEL USUARIO QUE VA A REPLICAR (FALTAN LOS ALGORITMOS)
          if(!pruebaIdentifiacion.VerificarID(this.replicaId)){ // si pasa el algoritmo de validacion hace el reporte ---------------

              // if(pruebaIdentifiacion.VerificarFantasma()){ // si retorna true significa que dicidio hacer el reporte fantasma
              
              // };
            this.reportesService.replicarReporte(this.replicaId, this.registrarForm?.value).subscribe(
              async res => {
                Swal.fire({
                  title: 'Reporte replicado!',
                  text: 'Hemos recibido tu replica de un reporte ya existente',
                  icon: 'success',
                  confirmButtonText: 'Ok'
                });
                
                // Algoritmo de urgencia de prueba
                let pruebaUrgencia = new AlgoritmoUrgencia(this.reportesService);
                console.log("URGENTE: " + await pruebaUrgencia.Urgente(res.toString()));

                pruebaIdentifiacion.AccederYGuardar(res.toString());

                // CUANDO SE REPLICA UN REPORTE SE VA DIRECTO AL MAPA Y SE REFRESCA
                this.toggleFormReporte = false; // SE ESCONDE EL FORM DE DETALLES
                this.toggleDesactivarMapa = false; // SE ACTIVA EL MAPA
                this.ngOnInit();
              },
              err => {
                Swal.fire({
                  title: 'Oh no!',
                  text: 'Ocurrio un problema replicando el reporte',
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });

                console.error(err);
              }
            );
          }
        } // ---



        // SI NO ES REPLICA ES REPORTE NUEVO
        else {
          if(this.registrarForm.value.comentario.length > 150) {
            this.comentarioLargo = true;
          }
          else {
            if(await pruebaIdentifiacion.Identificacion(this.registrarForm?.value) == false){ // si pasa los algoritmos de validacion guarda el reporte

              /*
              if(pruebaIdentifiacion.VerificarFantasma()){ // si retorna true significa que dicidio hacer el reporte fantasma
                this.registrarForm.value.fantasma = true;
              }else{
                this.registrarForm.value.fantasma = false;
              };
              */
              
              this.registrarForm.value.fantasma = await pruebaIdentifiacion.VerificarFantasma();

              // SE OBTIENEN LAS COORDENADAS DEL MARKER COLOCADO POR EL USUARIO
              const latitud = this.nuevoLatLng.lat();
              const longitud = this.nuevoLatLng.lng();

              // SE GUARDAN LA UBICACION, EL TIPO DE PROBLEMA Y EL ID DEL USUARIO
              this.registrarForm.value.ubicacion.latitud = latitud;
              this.registrarForm.value.ubicacion.longitud = longitud;
              this.registrarForm.value.tipoProblema = this.nuevoProblema;

              // SE VA A NECESITAR PARA ENVIAR LA IMAGEN
              // const formData = new FormData;
              // formData.append('credibilidad', '5');
              // formData.append('tipoProblema', this.nuevoProblema);
              // formData.append('ubicacion.latitud', latitud);
              // formData.append('ubicacion.longitud', longitud);
              // formData.append('comentario', comentario.value);
              // formData.append('cronico', cronico.value);
              // formData.append('riesgoVida', riesgoVida.value);
              // formData.append('imagen', this.file?.nativeElement.files[0]);

              this.reportesService.createReporte(this.registrarForm?.value).subscribe(
                async res => {
                  /*Swal.fire({
                    title: 'Reporte enviado!',
                    text: 'Hemos recibido tu reporte del problema',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  }); */

                  // Algoritmo de urgencia de prueba
                  let pruebaUrgencia = new AlgoritmoUrgencia(this.reportesService);
                  console.log("URGENTE: " + await pruebaUrgencia.Urgente(res.toString()));

                  pruebaIdentifiacion.AccederYGuardar(res.toString());
                  
                  // CUANDO SE CREA UN REPORTE SE VA DIRECTO AL MAPA Y SE REFRESCA
                  this.toggleFormReporte = false; // SE ESCONDE EL FORM DE DETALLES
                  this.toggleDesactivarMapa = false; // SE ACTIVA EL MAPA
                  this.ngOnInit();
                },
                err => {
                  Swal.fire({
                    title: 'Oh no!',
                    text: 'Ocurrio un problema enviando tu reporte',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });

                  console.error(err);
                }
              );
            } // ---
          }
        }
    }

  }
}