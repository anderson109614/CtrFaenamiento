import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {con} from '../modelos/coneccion';
import {EncriptadoService} from '../servicios/encriptado.service';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http:HttpClient,private encriptadoSer:EncriptadoService) { }
  url=con.ipser;
  login(usuario:string,contraseña:string){
    var val={user:usuario,password:contraseña};
    var txtEncrip=this.encriptadoSer.encriptar(JSON.stringify(val));
    console.log(val,txtEncrip);
    return this.http.post<any>(this.url + 'Usuarios/Login.php',{ value:txtEncrip})
    
  }
  actualizarUsuario(usuario:any,tok:string){
    var val=this.encriptadoSer.encriptar(JSON.stringify(usuario));
    return this.http.post<any>(this.url + 'Usuarios/Usuarios.php',{ value:val},{ headers: { 'token': tok } })
    
  }
}
