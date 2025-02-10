import UtilsStorage from './src/assets/js/Utils/UtilsStorage.js';
import {controller as controllerLogin } from './src/assets/js/login.js';
import{controller as controllerCashier} from './src/assets/js/cashier.js';
async function handleRoute(route) {
    const ROOT_URL = 'http://127.0.0.1:5501/frontend';

    switch (route) {
        case '/index':
            window.location.href = `${ROOT_URL}/index.html`;
            break;
        case '/login':
            window.location.href = `${ROOT_URL}/src/view/pages/login.html`;
            break;
        case '/products':
            (UtilsStorage.userLogged())?
             window.location.href = `${ROOT_URL}/src/view/pages/product_registration.html`:
            Materialize.toast("Necessário login para acessar esta funcionalidade", 1000);
            break;
        case '/employee':
            (UtilsStorage.userLogged())?
             window.location.href = `${ROOT_URL}/src/view/pages/employee.html`:
            Materialize.toast("Necessário login para acessar esta funcionalidade", 1000);
            break;
        case '/sale':
            (UtilsStorage.userLogged())?
             window.location.href = `${ROOT_URL}/src/view/pages/sale.html`:
             Materialize.toast("Necessário login para acessar esta funcionalidade", 1000);
            break;
        case '/entrar':
            await controllerLogin.entry();
            await controllerCashier.verifyCashierOpen(UtilsStorage.getUser().idEmployee);
            // (UtilsStorage.userLogged())?
            //  window.location.href = `${ROOT_URL}/src/view/pages/sale.html`:
            //  Materialize.toast("Necessário login para acessar esta funcionalidade", 1000);
            break;
        case '/history':
            (UtilsStorage.userLogged())?
                window.location.href = `${ROOT_URL}/src/view/pages/cash_history.html`:
                Materialize.toast("Necessário login para acessar esta funcionalidade", 1000);
            break;
        default:
            if(route != '#!'){
                //window.location.href = `${ROOT_URL}/src/view/pages/error.html`;
            }
    }
}

function initRouter() {
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const path = link.getAttribute('href');
        handleRoute(path);
      });
    });
    // evento de clique nos botões de avançar e retroceder no navegador e mudança de url manual
    window.addEventListener('popstate', () => {
        handleRoute(window.location.pathname);
    });

    // evento inicial
    handleRoute(window.location.pathname);
  }
  
initRouter();

export{
    handleRoute
}