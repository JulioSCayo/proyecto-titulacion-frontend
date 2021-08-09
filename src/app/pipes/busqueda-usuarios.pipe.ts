import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaUsuarios'
})
export class BusquedaUsuariosPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resUsuarios = [];

    console.log("-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-")

    for(const usuario of value){
      // if(arg === '' || arg.length < 3)
      //   return value;
      if(usuario.nombreUsuario.toLowerCase().indexOf(arg.toLowerCase()) > -1 || usuario._id.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resUsuarios.push(usuario);
        console.log("Este coincide en la busqueda ---->")
        console.log(usuario)
      }
    }

    return resUsuarios;
  }

}
