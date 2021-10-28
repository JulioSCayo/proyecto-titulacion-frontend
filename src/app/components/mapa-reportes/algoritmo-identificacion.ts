import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { pipe } from 'rxjs';
import Swal from 'sweetalert2';

// implements OnInit
export class AlgoritmoIdentificacion {

    constructor(public reportesService: ReportesService, private http: HttpClient) { }
 
    mensajeEror = {
        title: 'Oh no!',
        text: 'No se puede reportar',
        icon: 'error',
        confirmButtonText: 'Ok'
    }

    fecha = new Date();
    denegado: boolean = false;
    reportes: any[] = [];

     async Identificacion(reporte: any) : Promise<boolean>{
        this.denegado = false;
        if(this.Leer() == true){ // si existe la variable en el LS con algun reporte hace el resto de metodos
            // this.VerificarID(reporte._id);
            this.VerificarDistancia(reporte);
            // this.VerificarTiempo();
        }
        // guarda o no el id del nuevo reporte y da acceso a las siguientes validaciones y algoritmos
        // this.AccederYGuardar(reporte._id);
        await console.log("el estado de denegado es: " ,this.denegado)
        return await this.denegado;
    }
    
    
    Leer() : boolean{
        if(localStorage.getItem("reportes")){   // si existe algun reporte aun si solucionar
            this.reportes = JSON.parse(localStorage.getItem('reportes') || '{}'); // convierte a arreglo la varible de LS
            // this.denegado = true
            return true
        }else{
            // this.denegado = false
            console.log("No existe ningun reporte");
            return false
        }
    }


    VerificarID( id_reporte: any): boolean{//  ESTE ES EL PASO UNO, PERO OJO CON EL COMENTARIO DE ARRIBA
        let identificador = id_reporte;
        this.Leer();
        console.log(this.reportes)
        console.log(id_reporte)
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
                        if( ((reporteActual.ubicacion.latitud - latComparada) / 111100) < 30 && ((reporteActual.ubicacion.longitud - lngComparada) / 111100) < 30){
                            //la distancia es menor a 30m
                            console.log(latComparada, lngComparada)
                            console.log(res.tipoProblema)
                            if(reporteActual.tipoProblema == res.tipoProblema){
                                if(contador == 0){
                                    console.log(reporteActual.ubicacion.latitud, reporteActual.ubicacion.longitud)
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
                        }
                );
            }
        });

    }


    VerificarTiempo(){    // ESTE ES EL PASO 3
        let tiempo;
        console.log("ENTRO AL PASO 3")

            tiempo = this.reportes[this.reportes.length - 1] 
    
            if((this.fecha.getTime() - tiempo) < 300000 ){
                console.log(" El reporte no se puede realizar, no han pasado mas de 5 min desde el ultimo")
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
                this.mensajeEror.text = "No se puede reportar mas un reporte cada 5 minutos."
                
            }
    }


    VerificarFantasma(){  // ESTE ES EL PASO 4
        this.reportes.forEach(e => { // paso 2 del cuaderno
            
        });
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
                    }
                  )
            }else{
                this.reportes.pop();
                this.reportes.push(idReporte)
                this.reportes.push(this.fecha.getTime())
                localStorage.setItem("reportes", JSON.stringify(this.reportes));
                console.log("-- SE GUARDO EL ID EN EL LOCALSTORAGE --")
                Swal.fire({
                    title: 'Reporte enviado!',
                    text: 'Hemos recibido tu reporte del problema',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  });
            }
    }
}