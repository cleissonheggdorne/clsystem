import  * as NavbarUtils  from '../js/commonComponents/navbarCustom.js';
import UtilsStorage from './Utils/UtilsStorage.js';
import config from './config/config.js';

const model = {
    fetchEntry: async function(user, password) {
        const auth = btoa(`${user}:${password}`)
        const response = await fetch(`${config.backendBaseUrl}/api/public/employee/authenticate`, {
            method: "POST",
            headers: {
                'Authorization': `Basic ${auth}`
            }
        })

        if (response.ok) {
            const token = await response.json(); // Lê o token como texto
            return token;
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
        document.getElementById('login-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Previne o comportamento padrão do formulário

            // Cria um objeto FormData a partir do formulário
            const formData = new FormData(this);

            // Converte FormData para um objeto JavaScript (opcional)
            const dados = {};
            formData.forEach((value, key) => {
                dados[key] = value;
            });

        });
    },
}

const controller = {
    entry: async function(){
        const formHtml = document.getElementById('login-form');//.addEventListener('submit', function(event) {
        const form = new FormData(formHtml);
        const user = form.get("user"); //necessario attributo name
        const password = form.get("password");

        console.log('Dados do formulário:', user + password);
        try{
            const data = await model.fetchEntry(user, password);
            let token = null;
            let user1 = null;
            Object.entries(data).forEach(([chave, employee]) => {
                console.log(`Chave: ${chave}, Nome: ${employee.nome}, Cargo: ${employee.cargo}`);
                user1 = employee;
                token = chave;
            });
            //const user1  = token[1];
            UtilsStorage.setUser(user1);
            UtilsStorage.setTokenJwt(token);
            console.log("usr: "+ user1);
            console.log("token: "+ token);
        }catch(error){
            Materialize.toast(error, 1000);
        }
    },
    init: function(){
        view.initComponents();
        user = UtilsStorage.getUser();
        (user === null)? view.modalUser("open"): this.entry(user.idEmployee);
    },
    // verifyCashier: async function(idEmployee){
    //     try{
    //         const cashierReturned = await controllerCashier.verifyCashierOpen(idEmployee);
    //         return cashierReturned;
    //     }catch(error){
    //         throw error;
    //     }
    // },
}
let user= null;
//controller.init();
export { controller};
