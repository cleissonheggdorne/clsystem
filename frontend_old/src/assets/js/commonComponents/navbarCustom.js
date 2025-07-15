import UtilsStorage from '../Utils/UtilsStorage.js';
import { handleRoute } from '../../../../routes.js';
import UtilsModal from '../Utils/UtilsModal.js';
import { controller as controllerCashier} from '../cashier.js';
class HeaderCustom extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `<div class="row">
                            <nav>
                                <div class="nav-wrapper teal id="nav"">
                                    <a href="" class="brand-logo">CLSYSTEM</a>
                                    <ul id="nav" class="right right hide-on-med-and-down">
                                    </ul>
                                    <a href="/logout" id="logout" class="right">Sair</a>
                                    </div>
                            </nav>
                        </div>`;
        this.handleButtonLogout();
       // console.log('teste');
        //(UtilsStorage.userLogged)?NavbarUtils.fillInformationLoggin(UtilsStorage.getUser()):"";
        //(UtilsStorage.openedCashier)?NavbarUtils.fillInformationCashier(UtilsStorage.getCashier()):"";
    }
    handleButtonLogout(){
        const logout = document.getElementById("logout");
        logout.addEventListener('click', async function(event){
            handleRoute("/logout");
        });
    }

}
class NavbarCustom extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `<div class="col s12 m4 l3">
                            <ul class="collection" id="routes">
                                <a href="#!" class="collection-item btn" id="open-close-cashier"></a>
                                <li class="collection-item teal"><a href="/sale" class="white-text">Venda</a></li>
                                <li class="collection-item teal"><a href="/products" class="white-text">Cadastro de Produtos</a></li>
                                <li class="collection-item teal"><a href="/employee" class="white-text">Cadastro de Funcionários</a></li>
                                <li class="collection-item teal"><a href="/history" class="white-text">Histórico de Caixa</a></li>
                            </ul>
                        </div>`;
       NavbarUtils.fillButtonOpenCloseCashier(UtilsStorage.openedCashier()?"close":"open");
       NavbarUtils.fillInformationLoggin(UtilsStorage.getUser());
       NavbarUtils.fillInformationCashier(UtilsStorage.getCashier());
       NavbarUtils.handleButton();
    }
    getSessionStorage(){
        return sessionStorage;
    }
}

class ModalCustom extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `<!-- Modal Structure -->
                        <div id="modal-custom" class="modal">
                        <div class="modal-content">
                            
                        </div>
                        <div class="modal-footer">
                            <button class="waves-effect waves-green btn-flat" data-target="modal-custom" class="btn modal-trigger" id="btn-modal-custom">Ok</button>
                        </div>
                        </div>`;
                    }
}

export class ProgressCustom extends HTMLElement{
    connectedCallback(){
        this.innerHTML = ` <div class="progress">
                            <div class="indeterminate"></div>
                        </div>`;
            
        }
    
    static setHiddenProgress(){
        const loading = document.querySelector('.progress');
        loading.style.visibility = "hidden";
    } 
    static setVisibleProgress(){
        const loading = document.querySelector('.progress');
        loading.style.visibility = "";
    }               

}
export class NavbarUtils{
    constructor(){// Abrir/Fechar Caixa
    }
    
    static fillButtonOpenCloseCashier(openClose){
        const btnOpenCloseCashier = document.getElementById("open-close-cashier");
        btnOpenCloseCashier.classList.add("white-text");
        if(openClose === "open"){  
            btnOpenCloseCashier.textContent = "Abrir Caixa";
            btnOpenCloseCashier.classList.add("light-green");
        }else{
            btnOpenCloseCashier.textContent = "Fechar Caixa";
            btnOpenCloseCashier.classList.add("teal");
        } 
    }
    static fillInformationLoggin(user){
        const navInformation = document.getElementById("nav");
        const liUser = document.createElement("li");
        liUser.textContent = "Usuário: " + user.idEmployee+" "+user.nameEmployee+"ㅤ";
        navInformation.appendChild(liUser); 
    }
    static fillInformationCashier(cashier){
        const navInformation = document.getElementById("nav");
        const liCashier = document.createElement("li");
        liCashier.innerHTML = "";
        liCashier.textContent = (cashier != null)? " Caixa: " + cashier.status + " Hora Abertura: "+cashier.dateHourOpenFormatted: "Não Há Registro de Caixa em Aberto";
        navInformation.appendChild(liCashier); 
    }
    static handleButton(){
        const btnOpenClosecashier = document.getElementById("open-close-cashier");
        btnOpenClosecashier.addEventListener('click', async function(event){
           
         if(btnOpenClosecashier.textContent.includes("Fechar")){
           let summaryByCashier;
           try{
               summaryByCashier = await controllerCashier.resumeByCashier(UtilsStorage.getCashier().idCashier);
            }catch(error){
               Materialize.toast(error, 1000);
           }
            controllerCashier.modalOpenCloseCashier("open", "Fechamento de Caixa", "", true, summaryByCashier);
         }else{
            controllerCashier.modalOpenCloseCashier("open", "Abertura de Caixa", "Você está prestes a iniciar um caixa.", true, null);
         }
        });
    }
}


customElements.define("header-custom", HeaderCustom);
customElements.define("navbar-custom", NavbarCustom);
customElements.define("modal-custom", ModalCustom);
customElements.define("progress-custom", ProgressCustom);

