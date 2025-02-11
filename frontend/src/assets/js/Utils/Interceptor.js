import UtilsStorage from './UtilsStorage.js';
import { handleRoute } from '../../../../routes.js';
// Salva uma referência para o fetch original
const defaultFetch = window.fetch;

// Sobrescreve o fetch com um interceptor
window.fetch = async (url, options = {}) => {
    const token = UtilsStorage.getJwtToken("jwttoken"); // Obtém o token armazenado

    // Adiciona o cabeçalho Authorization se houver um token
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    try {
        const response = await defaultFetch(url, options);

        // Se o token estiver expirado, pode tratar aqui
        if (response.status === 401) {
            console.warn("Token expirado. Redirecionando para login...");
            // Exemplo: Redireciona para a tela de login
            handleRoute(window.location.href);
        }

        return response;
    } catch (error) {
        console.error("Erro ao realizar a requisição:", error);
        throw error;
    }
};
