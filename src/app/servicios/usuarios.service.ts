import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {con} from '../modelos/coneccion';
import {EncriptadoService} from '../servicios/encriptado.service';
import { Usuario } from '../modelos/Usuario';
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
    return this.http.put<any>(this.url + 'Usuarios/Usuarios.php',{ value:val},{ headers: { 'token': tok } })
    
  }
  getPerfil(idPerfil:String,tok:string){
    var val=this.encriptadoSer.encriptar(JSON.stringify(idPerfil));
    return this.http.get<any>(this.url + 'Usuarios/Perfiles.php?id='+val,{ headers: { 'token': tok } })
    
  }
  getPerfiles(tok:string){
   // var val=this.encriptadoSer.encriptar(JSON.stringify(idPerfil));
    return this.http.get<any>(this.url + 'Usuarios/Perfiles.php',{ headers: { 'token': tok } })
    
  }
  verificarPermisos(idPerfil:String,Nombre:string,tok:string){
    var val=this.encriptadoSer.encriptar(JSON.stringify({idPerfil:idPerfil,Nombre:Nombre}));
    return this.http.post<any>(this.url + 'Usuarios/Perfiles.php',{ value:val},{ headers: { 'token': tok } })
    
  }
  getUsuarios(tok:string){
   
    return this.http.get<any>(this.url + 'Usuarios/Usuarios.php',{ headers: { 'token': tok } })
  }
  DeleteUsuario(idUser:string,tok:string){
    var val=this.encriptadoSer.encriptar(JSON.stringify(idUser));
    return this.http.delete<any>(this.url + 'Usuarios/Usuarios.php?id='+val,{ headers: { 'token': tok } })
  }
  newUsuario(usr:any,tok:string){
    var val=this.encriptadoSer.encriptar(JSON.stringify(usr));
    return this.http.post<any>(this.url + 'Usuarios/Usuarios.php',{ value:val},{ headers: { 'token': tok } })
    
  }
}
