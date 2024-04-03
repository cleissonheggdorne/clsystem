import UtilsStorage from './src/assets/js/Utils/UtilsStorage.js';
import {controller as controllerLogin } from './src/assets/js/login.js';

async function handleRoute(route) {
    const ROOT_URL = 'http://127.0.0.1:5501';

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
            (UtilsStorage.userLogged())?
             window.location.href = `${ROOT_URL}/src/view/pages/sale.html`:
             Materialize.toast("Necessário login para acessar esta funcionalidade", 1000);
            break;
        case '/history':
            (UtilsStorage.userLogged())?
                window.location.href = `${ROOT_URL}/src/view/pages/cash_history.html`:
                Materialize.toast("Necessário login para acessar esta funcionalidade", 1000);
            break;
        default:
            //Definir página de erros
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
  }
initRouter();

export{
    handleRoute
}