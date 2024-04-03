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
        return JSON.parse(sessionStorage.getItem("cashier"));
    }

    static userLogged(){
      const user = StorageUtils.existsPropertyStorage("user")? 
                  JSON.parse(sessionStorage.getItem("user")) : "";
      return user != "";
    }
    static openedCashier(){
      const cashier = StorageUtils.existsPropertyStorage() ? 
                  JSON.parse(sessionStorage.getItem("cashier"))
                    : "";
      return (cashier != "");
    }
    static existsPropertyStorage(property){
      return sessionStorage.getItem(property) != undefined;
    }
}