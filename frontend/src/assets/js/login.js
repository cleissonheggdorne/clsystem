import  NavbarUtils  from '../js/commonComponents/navbarCustom.js';
import UtilsStorage from './Utils/UtilsStorage.js';
import ModalCustom from './Utils/UtilsModal.js';
import {handleRoute} from '../../../routes.js';

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
    initComponents: function(){
        // $('#modal-select-user').modal();
        $('select').material_select();
        $('.modal').modal({
          dismissible: false
        });
    },
}

const controller = {
    entry: async function(){
        const idOrDocument = document.getElementById("input-user").value;
        if(idOrDocument !== "" && idOrDocument !== null){
            try{
                user = await model.fetchEntry(idOrDocument);
                UtilsStorage.setUser(user);
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
export { controller};
