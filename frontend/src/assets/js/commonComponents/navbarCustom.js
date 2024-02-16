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
    }
}
class NavbarCustom extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `<div class="col s2">
                            <ul class="collection">
                                <li class="collection-item"><a href="http://127.0.0.1:5500/frontend/src/view/pages/sale.html">Venda</a><span class="badge btn" id="open-close-cashier"></span></li>
                                <li class="collection-item"><a href="http://127.0.0.1:5500/frontend/src/view/pages/product_registration.html">Cadastro de Produtos</a></li>
                                <li class="collection-item"><a href="http://127.0.0.1:5500/frontend/src/view/pages/employee.html">Cadastro de Funcionários</a></li>
                            </ul>
                        </div>`;
    }
}
console.log("teste")
customElements.define("header-custom", HeaderCustom);
customElements.define("navbar-custom", NavbarCustom);

