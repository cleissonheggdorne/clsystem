//import { controller as controllerCashier} from './cashier.js';

export default class StorageUtils {
    static setUser(user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  
    static getUser() {
      return JSON.parse(sessionStorage.getItem("user"));
    }

    static setCashier(cashier) {
        sessionStorage.setItem("cashier", JSON.stringify(cashier));
    }
    
    static getCashier() {
        //controllerCashier.verifyCashierOpen()
        return JSON.parse(sessionStorage.getItem("cashier"));
    }

    static userLogged(){
      const user = StorageUtils.existsPropertyStorage("user")? 
                  JSON.parse(sessionStorage.getItem("user")) : "";
      return user != "";
    }
    static openedCashier(){
      const cashier = StorageUtils.existsPropertyStorage("cashier") ? 
                  JSON.parse(sessionStorage.getItem("cashier"))
                    : "";
      return (cashier != null && cashier != "");
    }
    static setTokenJwt(token){
      sessionStorage.setItem("jwttoken", JSON.stringify(token));
    }
    static getJwtToken(){
      return StorageUtils.existsPropertyStorage("jwttoken")? 
                  JSON.parse(sessionStorage.getItem("jwttoken")) : "";
    }
    static existsPropertyStorage(property){
      return sessionStorage.getItem(property) != undefined;
    }
}