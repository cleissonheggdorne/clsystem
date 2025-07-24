
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import UtilsStorage from './src/assets/js/Utils/UtilsStorage.js';
import session from 'express-session';
import { controller as controllerLogin } from './src/assets/js/login.js';
import { controller as controllerCashier } from './src/assets/js/cashier.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'src', 'view', 'pages')));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'src', 'view', 'pages')));

// Configuração da sessão
app.use(session({
    secret: 'seu_segredo_aqui', // Altere para um segredo forte
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

// Função para verificar se o usuário está logado
const isUserLogged = (req, res, next) => {
    if (req.session.user) { // Verifica se o usuário está na sessão
        next();
    } else {
        res.status(401).send("Necessário login para acessar esta funcionalidade");
    }
};

// Definindo rotas
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'view', 'pages', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'view', 'pages', 'login.html'));
});

app.get('/products', isUserLogged, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'view', 'pages', 'product_registration.html'));
});

app.get('/employee', isUserLogged, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'view', 'pages', 'employee.html'));
});

app.get('/sale', isUserLogged, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'view', 'pages', 'sale.html'));
});

app.get('/history', isUserLogged, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'view', 'pages', 'cash_history.html'));
});

app.post('/entrar', async (req, res) => {
    await controllerLogin.entry();
    await controllerCashier.verifyCashierOpen(UtilsStorage.getUser().idEmployee);
    if (UtilsStorage.userLogged()) {
        res.redirect('/sale');
    } else {
        res.status(401).send("Necessário login para acessar esta funcionalidade");
    }
});

// Iniciando o servidor
app.listen(PORT, () => {
});
