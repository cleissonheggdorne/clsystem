import UtilsStorage from '../Utils/UtilsStorage.js';
class HeaderCustom extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `<div class="row">
                            <nav>
                                <div class="nav-wrapper teal">
                                    <a href="" class="brand-logo">CLSYSTEM LOGO</a>
                                    <ul id="nav" class="right">
                                    </ul>
                                    </div>
                            </nav>
                        </div>`;
        //(UtilsStorage.userLogged)?NavbarUtils.fillInformationLoggin(UtilsStorage.getUser()):"";
        //(UtilsStorage.openedCashier)?NavbarUtils.fillInformationCashier(UtilsStorage.getCashier()):"";

    }
}
class NavbarCustom extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `<div class="col s2">
                            <ul class="collection" id="routes">
                                <li class="collection-item"><a href="/sale">Venda</a><span class="badge btn" id="open-close-cashier"></span></li>
                                <li class="collection-item"><a href="/products">Cadastro de Produtos</a></li>
                                <li class="collection-item"><a href="/employee">Cadastro de Funcionários</a></li>
                                <li class="collection-item"><a href="/history">Histórico de Caixa</a></li>
                            </ul>
                        </div>`;
       NavbarUtils.fillButtonOpenCloseCashier(UtilsStorage.openedCashier()?"close":"open");
    }
    getSessionStorage(){
        return sessionStorage;
    }
}
export default class NavbarUtils{
    constructor(){ }
    
    static fillButtonOpenCloseCashier(openClose){
        const btnSpanOpenCloseCashier = document.getElementById("open-close-cashier");
        btnSpanOpenCloseCashier.classList.add("white-text");
        if(openClose === "open"){
        btnSpanOpenCloseCashier.textContent = "Abrir Caixa";
        btnSpanOpenCloseCashier.classList.add("light-green");
        }else{
        btnSpanOpenCloseCashier.textContent = "Fechar Caixa";
        btnSpanOpenCloseCashier.classList.add("light-gray");
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
}

customElements.define("header-custom", HeaderCustom);
customElements.define("navbar-custom", NavbarCustom);

