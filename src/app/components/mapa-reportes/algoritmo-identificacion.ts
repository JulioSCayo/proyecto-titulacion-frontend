import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { pipe } from 'rxjs';
import Swal from 'sweetalert2';

// implements OnInit
export class AlgoritmoIdentificacion {

    constructor(public reportesService: ReportesService, private http: HttpClient) { }
 
    mensajeError: any = {
        title: 'Oh no!',
        text: 'No se puede reportar',
        icon: 'error',
        confirmButtonText: 'Ok'
    }

    fecha = new Date();
    denegado: boolean = false;
    reportes: any[] = [];
    tiempos: any[] = [];


    async Identificacion(reporte: any) : Promise<boolean>{
        // this.denegado = this.ChecarBan();

        // console.log(reporte)

        // if(!this.denegado) {
        //     console.log("Entra al primer if")
        //     if(this.Leer() == true){ // si existe la variable en el LS con algun reporte hace el resto de metodos
        //         this.VerificarDistancia(reporte);
        //         // this.VerificarTiempo();
        //         // this.VerificarFantasma();
        //     }
        //     // guarda o no el id del nuevo reporte y da acceso a las siguientes validaciones y algoritmos
        //     this.AccederYGuardar(reporte._id);
        //     console.log("el estado de denegado es: " ,this.denegado)
            
            
        // }
        // return this.denegado;
        

        // this.denegado = false;
        // this.Leer();
        this.ChecarBan();
        if(this.denegado == true){
            return this.denegado
        }
        
        if(this.Leer() == true){ // si existe la variable en el LS con algun reporte hace el resto de metodos
            // this.VerificarDistancia(reporte);
            // this.VerificarTiempo();
            // // // // // // this.VerificarFantasma();
        }
        // guarda o no el id del nuevo reporte y da acceso a las siguientes validaciones y algoritmos
        // // // // // // this.AccederYGuardar(reporte._id);
        await console.log("el estado de denegado es: " ,this.denegado)
        return await this.denegado;
    }
    
    
    Leer() : boolean{
        if(localStorage.getItem("reportes")){   // si existe algun reporte aun si solucionar
            this.reportes = JSON.parse(localStorage.getItem('reportes') || '{}'); // convierte a arreglo la varible de LS
            this.tiempos = JSON.parse(localStorage.getItem('tiempos') || '{}'); // convierte a arreglo la varible de LS
            // this.denegado = true;
            return true;
        }else{
            // this.denegado = false;
            console.log("No existe ningun reporte");
            return false
        }
    }


    VerificarID( id_reporte: any): boolean{//  ESTE ES EL PASO 1, PERO OJO CON EL COMENTARIO DE ARRIBA
        let identificador = id_reporte;
        this.Leer();
        // console.log(this.reportes)
        // console.log(id_reporte)
        this.reportes.forEach(e => {
            if(e == identificador){ // si algun identificador coincide significa que este usuario habia hecho el reporte
                // console.log("No se puede repotar este problema de nuevo");
                this.denegado = true                
                Swal.fire({
                    title: 'Este problema ya lo reportaste',
                    text: 'No se puede reportar mas de una vez un problema',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
            }
        });

        console.log(this.denegado)
        if(this.denegado) return true
        else{
            console.log("SE PUEDE REPORTAR")
            return false
        }     
    }


 
    VerificarDistancia(reporteActual: any): any{   // ESTE ES EL PASO 2
        let latComparada, lngComparada, contador = 0;

        //busca cada uno de los reportes en el LS, para comparar las distancias de sus ubicaciones con el actual
        this.reportes.forEach((e: string | undefined) => {
            if(e != this.reportes[this.reportes.length-1]) {
                this.reportesService.getReporte(e).subscribe(
                    (        res: any) => {
                        latComparada = res.ubicacion.latitud
                        lngComparada = res.ubicacion.longitud

                        //  (LatNueva  -  LataComparar) / 111,100 = distancia en metros entre las dos latitudes, igual con longitudes
                        let distanciaLatitud = ((reporteActual.ubicacion.latitud - latComparada) * 111100)
                        let distaciaLongitud = ((reporteActual.ubicacion.longitud - lngComparada) * 111100)

                        if(distanciaLatitud < 0)
                            distanciaLatitud = distanciaLatitud*-1
                            
                        if(distaciaLongitud < 0)
                            distaciaLongitud = distaciaLongitud*-1

                        console.log("Parte izquierda: " + distanciaLatitud + "  |  " + "Parte derecha: " + distaciaLongitud)

                        if( distanciaLatitud < 30 && distaciaLongitud < 30){
                            //la distancia es menor a 30m
                            // console.log(latComparada, lngComparada)
                            // console.log(res.tipoProblema)
                            if(reporteActual.tipoProblema == res.tipoProblema){
                                if(contador == 0){
                                    // console.log(reporteActual.ubicacion.latitud, reporteActual.ubicacion.longitud)
                                    // el tipo de problema coincide y la distancia es menor a 30 m, no se puede reportar
                                    this.denegado = true
                                    console.log("El reporte no se puede reportar NOO!")
                                    Swal.fire({
                                        title: 'Este problema no se puede reportar',
                                        text: 'Muy cerca y del mismo tipo',
                                        icon: 'error',
                                        confirmButtonText: 'Ok'
                                    });
                                    console.log("denegado = ", this.denegado)
                                    
                                    contador++;
                                }
                            }
                        }
                    }, 
                    (err: any) => {
                        console.error(err);
                    })
            }
        });
    }


    VerificarTiempo(){    // ESTE ES EL PASO 3
        let tiempo;
            tiempo = this.reportes[this.reportes.length - 1] 
            if((this.fecha.getTime() - tiempo) < 300000 ){
                this.denegado = true;
                Swal.fire({
                    title: 'Oh no!',
                    text: 'No se puede reportar mas de un reporte cada 5 minutos.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
            }else{
                console.log(" El reporte se puede realizar")
                this.denegado = false;
                // this.mensajeError.text = "No se puede reportar mas un reporte cada 5 minutos."
            }
    }


    VerificarFantasma(){  // ESTE ES EL PASO 4
        let contador = 1;
        // console.log(this.tiempos)
        this.tiempos.forEach(e => { // paso 2 del cuaderno
            if(e >= (this.fecha.getTime() - 86400000)){
                console.log("Fue hace menos de 24 horas");
                contador++;
            }
        });

        if(contador == 3){
            Swal.fire({
                title: 'Seguro?',
                text: 'El siguiente reporte será fantasma y te restará 1 punto a tu fiabilidad',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Entiendo, enviar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if(result.isConfirmed || result.isDismissed) {
                  // window.location.reload();
                  console.log("hace putas algo")
                }
            });
            // if (result.isConfirmed){
            //     console.log("entro a confirmado, TRUE")
            //     return true
            // }else{
            //     console.log("entro a desconfirmado, FALSE")
            //     return false
            // }
        }else if(contador == 4){
            Swal.fire({
                title: 'Seguro?',
                text: 'Este reporte ya es fantasma, no pudes hacer ningun reporte desde este dispositivo',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, enviar reporte!'
                    }).then((result => {
                        if (result.isConfirmed){
                            localStorage.setItem("Ban", this.fecha.getTime().toString()); // banea por 36 horas
                            // console.log("y resta 1 punto a la fiabilidad")
                            console.log("TRUE")
                            return true
                        }else{
                            console.log("FALSE")
                            return false
                        }
                    }));
                    console.log("mando true")
                    return true;  //////////////
        }else if(contador > 4){
            this.denegado = true;
        }
        console.log("mando false")
        return false;
    }


    ChecarBan(): boolean{
        let ban = JSON.parse(localStorage.getItem('Ban') || '{}');

        if(localStorage.getItem("Ban")){ // significa que fue baneado
            if(ban >= (this.fecha.getTime() - 129600000)){ // si han pasado menos de 36 desde que fue baneado no lo deja hacer reporte
                console.log("No se puede generar");
                this.denegado = true;
                Swal.fire({
                    title: 'Estas baneado',
                    text: 'No puedes hacer ningun reporte por el momento',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
                return true;
            }else{
                localStorage.removeItem("Ban");
            }
        }
        
        return false;
    }


    AccederYGuardar(idReporte: any){

            if(this.denegado == true){
                console.log("-- NO SE PUEDE HACER EL REPORTE --")
                this.reportesService.deleteReporte(idReporte.toString()).subscribe(
                    res =>{
                      console.log("Reporte eliminado")
                    },
                    err =>{
                      console.log("Error al eliminar el reporte")
                    })
            }else{
                this.reportes.pop();
                // console.log(idReporte)
                this.reportes.push(idReporte)
                this.reportes.push(this.fecha.getTime())
                this.tiempos.push(this.fecha.getTime())
                localStorage.setItem("reportes", JSON.stringify(this.reportes));
                localStorage.setItem("tiempos", JSON.stringify(this.tiempos));
                console.log("-- SE GUARDO EL ID EN EL LOCALSTORAGE --")
                Swal.fire({
                    title: 'Reporte enviado!',
                    text: 'Hemos recibido tu reporte del problema',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  }).then((result) => {
                      if(result.isConfirmed || result.isDismissed) {
                        // window.location.reload();
                      }
                  });
            }
    }


}