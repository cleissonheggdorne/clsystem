import UtilsStorage from './Utils/UtilsStorage.js';
import UtilsModal from './Utils/UtilsModal.js';
import config from './config/config.js';

//import {handleRoute} from '../../../routes.js';

const model = {
    fetchOpenCashier: async function(idEmployee, initialValue) {
      const response = await fetch(`${config.backendBaseUrl}/api/cashier/open`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          initialValue: initialValue,
          idEmployee: idEmployee
        })  
        });
        if (response.ok && response.text !== "") {
          return response.json();
        } else {
            throw new Error("Erro ao abrir caixa. Contate o suporte técnico.");
        }
      },
      fetchCloseCashier: function(idCashier) {
        return fetch(`${config.backendBaseUrl}/api/cashier/close`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idCashier: idCashier
          })  
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Erro ao fechar caixa. Contate o suporte técnico.");
            }
          })
          .then(data => {
            return data;
          })
          .catch(error => {
              Materialize.toast(error, 1000)
          });
      },
      fetchFindOpenCashier: async function(idEmployee) {
        const response = await fetch(`${config.backendBaseUrl}/api/cashier/find-open?id=${idEmployee}`)
        if(response.ok && response.text !== ""){
          return response.json();
        }else{
          throw new Error("Não Há Caixa Aberto Para o Usuario Informado!")
        }
      },
      fetchSummaryByCashier: async function(idCahier) {
        const response = await fetch(`${config.backendBaseUrl}/api/cashier/summary-by-cashier?idCashier=${idCahier}`);
        if (response.ok && response.text !== "") {
          return await response.json();
        } else {
          throw new Error("Não foi possível obter o resumo de fechamento deste caixa!");
        }
    },
}

const view= {
    modalOpenCloseCashier: function(openClose, title, content, moreComponents, summaryByCashier){
        //const modal = this.modalCustom("close", title,content, moreComponents);
        UtilsModal.addButonActionInModalCustom();
        const modal = UtilsModal.modalCustom(title, content);
        if(moreComponents && summaryByCashier == null){
          modal.modalContent.appendChild(UtilsModal.addComponentsMoldalCustom());//this.addComponentsMoldalCustom());
          const  btnActionModalCustom = document.getElementById("btn-action-modal-custom");
          btnActionModalCustom.addEventListener("click", function(){
            const inputValueModal = document.getElementById("input-value-initial");
            controller.openCashier(user.idEmployee, inputValueModal.value);
          })
        }else{
            this.addComponentsForCloseCashier(modal,  summaryByCashier)
            const  btnActionModalCustom = document.getElementById("btn-action-modal-custom");
            btnActionModalCustom.addEventListener("click", function(){
              const inputValueModal = document.getElementById("input-value-initial");
            //const amounthReportedAtClosed = inputValueModal.value;
              controller.closeCashier();
          })
        }
        
        $('#modal-custom').modal(openClose);
      },
      addComponentsForCloseCashier:  function(modal, summaryByCashier){
        modal.h4title.textContent = "Fechamento de Caixa";
        modal.paragraph.textContent = "Movimentação Registrada: ";
    
        modal.modalContent.appendChild(this.buildTableForResume(summaryByCashier))
        UtilsModal.addComponentsMoldalCustom();
      },
      buildTableForResume: function(dados){
    
        const tabela = document.createElement('table');
        tabela.className = "responsive-table striped";
  
        dados.forEach(item => {
          const tipo = Object.keys(item)[0]; // Obtém o tipo (Quantidade, Valor, Resumo)
          const valores = Object.values(item)[0][0]; // Obtém os valores
          
          const linha = tabela.insertRow(); 
          
          // Adiciona o tipo como o cabeçalho da linha
          const cabecalho = linha.insertCell();
          cabecalho.textContent = tipo;
          
          // Adiciona os valores como células na linha
          for (const chave in valores) {
            const celula = linha.insertCell();
            celula.textContent = `${chave}: ${valores[chave]}`;
          }
        });
        return tabela;
    },
}

const controller= {
    init: function(){

    },
    verifyCashierOpen: async function(idEmployee){
       try{
        const cashier = await model.fetchFindOpenCashier(idEmployee);
        UtilsStorage.setCashier(cashier);
        return cashier;
       }catch(error){
        throw error;
       }
    },
    resumeByCashier: async function(idCashier){
      try{
        return await model.fetchSummaryByCashier(idCashier);
       }catch(error){
        throw error;
       }
    },
    openCashier: async function(idEmployee, initialValue){
      try{
        const cashier = await model.fetchOpenCashier(idEmployee, initialValue);
        UtilsStorage.setCashier(cashier);
        // if(cashier !== null){
        //     view.modalCustom("close", "", "", false);
        // }else{
        //     view.modalCustom("open", "Atenção", "Não há um caixa aberto para esse usuário. Uma venda só poderá ser feita quando houver a abertura de um.", true);
        // }
      }catch(error){
        throw error;
      }
    },
    modalOpenCloseCashier: async function(openClose, title, content, moreComponents, summaryByCashier){
      return await view.modalOpenCloseCashier(openClose, title, content, moreComponents, summaryByCashier);
    },
    addComponentsForCloseCashier:  function(modal, summaryByCashier){
      return view.addComponentsForCloseCashier(modal, summaryByCashier);
    },
}

//controller.verifyCashierOpen(UtilsStorage.getUser());

export { controller };