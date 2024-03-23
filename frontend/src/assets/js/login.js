//import { utilsNavbar as utilsNavbar} from './commonComponents/NavbarCustom.js';
import UtilsStorage from './Utils/UtilsStorage.js';
import { controller as controllerCashier} from './cashier.js';

const model = {
    fetchEntry: async function(idOrDocument) {
        const response = await fetch('http://localhost:8080/api/employee/entry?idOrDocument=' + idOrDocument);
        if (response.ok && response.text !== "") {
           return await response.json();
        } else {
           throw new Error("Usuário Inexistente!");
        }
     }
}

const view = {
   
    modalUser: function(openClose){
        $('#modal-select-user').modal(openClose);
    },
    initComponents: function(){
        $('#modal-select-user').modal();
        $('select').material_select();
        $('.modal').modal({
          dismissible: false
        });
    },
    eventsSale: function(){

        const btnEnter = document.getElementById("btn-enter");
        btnEnter.addEventListener("click", async function(){
          const idOrDocument = document.getElementById("input-user").value;
          controller.entry(idOrDocument);
        });
    
        const btnModalCustom = document.getElementById("btn-modal-custom");
    },

}

const controller = {
    entry: async function(idOrDocument){
        if(idOrDocument !== "" && idOrDocument !== null){
            try{
                user = await model.fetchEntry(idOrDocument);
                UtilsStorage.setUser(user);
                view.modalUser("close");
                cashier = await controller.verifyCashier(user.idEmployee);
             if(cashier !== null){
               UtilsStorage.setCashier(cashier);
             }else{
               view.modalCustom("open", "Atenção", "Não há um caixa aberto para esse usuário. Uma venda só poderá ser feita quando houver a abertura de um.", false);
               view.fillButtonOpenCloseCashier("open");
             }
            }catch(error){
              Materialize.toast(error, 1000);
            }
        }else{
          Materialize.toast("Preencha os dados", 1000);
        }
    },
    init: function(){
        view.initComponents();
        user = UtilsStorage.getUser();
        view.eventsSale();
        (user === null)? view.modalUser("open"): this.entry(user.idEmployee);
    },
    verifyCashier: async function(idEmployee){
        try{
            const cashierReturned = await controllerCashier.verifyCashierOpen(idEmployee);
            return cashierReturned;
        }catch(error){
            throw error;
        }
    },
}
let user= null;
let cashier = null;
controller.init();

export { controller };
export { view };