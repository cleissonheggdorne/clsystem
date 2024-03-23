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

    static userLogged(sessionStorage){
      const user = JSON.parse(sessionStorage.getItem("user"));
      console.log(sessionStorage);
      return (user != null);
    }
    static openedCashier(sessionStorage){
      const cashier = JSON.parse(sessionStorage.getItem("cashier"));
      console.log(sessionStorage);
      return (cashier != null);
  }
}