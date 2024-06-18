import { controller as controllerCashier} from './cashier.js';
import UtilsModal from './Utils/UtilsModal.js';
import UtilsStorage from './Utils/UtilsStorage.js';
import {handleRoute} from '../../../routes.js';

const model = {
    fetchCashiers: async function() {
        const response = await fetch('http://localhost:8080/api/cashier/findall')
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erro ao listar os caixas. Contate o suporte técnico.");
        }
      },
      fetchCashiersByKey: async function(key) {
        const response = await fetch('http://localhost:8080/api/cashier/find?key='+key)
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erro ao listar produtos. Contate o suporte técnico.");
        }
      }
}

const view = {
    eventsSale: function(){

      // const btnModalCustom = document.getElementById("btn-modal-custom");
      // //UtilsModal.initComponent();
      // btnModalCustom.addEventListener("click", function(){
      //   $('.modal').modal('close');
      // });
    },
    renderTable: function(cashiers) {
        const table = document.getElementById("table-cashier");
        const tbody = table.querySelector("tbody");
        this.cleanTable(tbody);
        cashiers.forEach(cashier => {
          const line = document.createElement("tr");
          const cellId = document.createElement("td");
          const cellCodeEmployee = document.createElement("td");
          const cellNameEmployee = document.createElement("td");
          const cellDateHourOpen = document.createElement("td");
          const cellDateHourClose = document.createElement("td");
          const cellAmount = document.createElement("td");
          const btnDetail = document.createElement("td");
         
          const icon = document.createElement("i");
          icon.classList.add("material-icons");
          icon.textContent = "pageview"
          icon.setAttribute('data-id-cashier', cashier.idCashier);

          btnDetail.setAttribute('class', 'btn');
          btnDetail.setAttribute('id', 'btn-edit');
          btnDetail.setAttribute('data-id-cashier', cashier.idCashier);
          btnDetail.setAttribute('href', '#modal1');
          
          btnDetail.appendChild(icon);
          //btnDetail.addEventListener('click', this.handleViewDetailButtonClick);
          btnDetail.addEventListener('click', this.handleViewDetailButtonClick);
          
          cellId.textContent = cashier.idCashier;
          cellCodeEmployee.textContent = cashier.employee.idEmployee;
          cellNameEmployee.textContent = cashier.employee.nameEmployee;
          cellDateHourOpen.textContent = cashier.dateHourOpenFormatted;
          cellDateHourClose.textContent = cashier.dateHourCloseFormatted;
          cellAmount.textContent = cashier.amountSales;
            
          line.appendChild(btnDetail);
          line.appendChild(cellId);
          line.appendChild(cellCodeEmployee);
          line.appendChild(cellNameEmployee);
          line.appendChild(cellDateHourOpen);
          line.appendChild(cellDateHourClose);
          line.appendChild(cellAmount);
          table.querySelector('tbody').appendChild(line);
        });
      },
      cleanTable: function (tbody) {
        while (tbody.firstChild) {
          tbody.removeChild(tbody.firstChild);
        }
      },
      handleViewDetailButtonClick: async function(event){
            const idCashier = event.target.getAttribute("data-id-cashier");
            const summaryByCashier = await controllerCashier.resumeByCashier(idCashier);
            view.modalOpenCloseCashier("open", "Fechamento de Caixa", "", true, summaryByCashier);

            //view.modifyPopup("Editar Produto");
            //view.fillPopup(product);
      },
      //REUTILIZAR
      modalOpenCloseCashier: function(openClose, title, content, moreComponents, summaryByCashier){
        //const modal = this.modalCustom("close", title,content, moreComponents);
        const modal = UtilsModal.modalCustom(title, content);
        if(moreComponents && summaryByCashier == null){
           modal.modalContent.appendChild(UtilsModal.addComponentsMoldalCustom());//.addComponentsMoldalCustom());
           const  btnActionModalCustom = document.getElementById("btn-action-modal-custom");
           btnActionModalCustom.addEventListener("click", function(){
            const inputValueModal = document.getElementById("input-value-initial");
            controller.openCashier(inputValueModal.value);
          })
        }else{
           this.addComponentsForCloseCashier(modal,  summaryByCashier)
           //const  btnActionModalCustom = document.getElementById("btn-action-modal-custom");
          //  btnActionModalCustom.addEventListener("click", function(){
          //  const inputValueModal = document.getElementById("input-value-initial");
          //   //const amounthReportedAtClosed = inputValueModal.value;
          //   controller.closeCashier();
          // })
        }
        
        $('#modal-custom').modal(openClose);
      },
      //REUTILIZAR
      addComponentsForOpenCashier: function(){
    
        const divInputLabel = UtilsModal.createInputNumber("Valor de Entrada")//this.createInputNumber();
    
        //Alteração de botão padrão do modal custom
        const btnOkModalCustom = document.getElementById("btn-modal-custom")
        btnOkModalCustom.textContent = "Cancelar";
        const footerModalCustom = btnOkModalCustom.parentElement;
        //Adição de botão de ação
        if(!document.getElementById("btn-action-modal-custom")){
          const btnActionModalCustom = UtilsModal.createButtonWithAction("Confirmar");//this.createButtonWithAction();
          btnActionModalCustom.addEventListener("click", function(){
            controller.openCashier(divInputLabel.input.value);
          })
          footerModalCustom.appendChild(btnActionModalCustom);
        }
        divInputLabel.div.appendChild(divInputLabel.input);
        divInputLabel.div.appendChild(divInputLabel.label);
        return divInputLabel.div;
      },
      //REUTILIZAR
      addComponentsForCloseCashier:  function(modal, summaryByCashier){
        modal.h4title.textContent = "Fechamento de Caixa";
        modal.paragraph.textContent = "Movimentação Registrada: ";
    
        modal.modalContent.appendChild(this.constroiTabela(summaryByCashier))
        //UtilsModal.addComponentsMoldalCustom();
      },
      //Reutilizar
      constroiTabela: function(dados){
    
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
    //Reutilizar
    // addComponentsMoldalCustom: function(){
    //     const divInputLabel = UtilsModal.createInputNumber("Valor de Entrada");//this.createInputNumber();
    
    //     //Alteração de botão padrão do modal custom
    //     const btnOkModalCustom = document.getElementById("btn-modal-custom")
    //     btnOkModalCustom.textContent = "Cancelar";
    //     const footerModalCustom = btnOkModalCustom.parentElement;
    //     //Adição de botão de ação
    //     if(!document.getElementById("btn-action-modal-custom")){
    //       const btnActionModalCustom = UtilsModal.createButtonWithAction("Confirmar");//this.createButtonWithAction();
    //       footerModalCustom.appendChild(btnActionModalCustom);
    //     }
    //     divInputLabel.div.appendChild(divInputLabel.input);
    //     divInputLabel.div.appendChild(divInputLabel.label);
    //     return divInputLabel.div;
    //   },
      //Reutilizar
      // createInputNumber: function(){
      //   const divInputFild = document.createElement("div");
      //   divInputFild.setAttribute("class", "input-field col s6");
      //   const input  = document.createElement('input')
      //   input.setAttribute("type", "number");;
      //   input.setAttribute("min", "0");
      //   input.setAttribute("class", "validate");
      //   input.setAttribute("id", "input-value-initial")
      //   const label = document.createElement('label');
      //   label.setAttribute("class", "active");
      //   label.setAttribute("for", "input-value-initial");
      //   label.textContent = "Valor de Entrada";
      //   return {"div": divInputFild, 
      //           "input": input,
      //           "label": label
      //           };
      // },
      //Reutilizar
      // createButtonWithAction: function(){
      //   const btnActionModalCustom = document.createElement("a");
      //   btnActionModalCustom.setAttribute("href", "#!");
      //   btnActionModalCustom.setAttribute("class", "waves-effect waves-green btn");
      //   btnActionModalCustom.setAttribute("id", "btn-action-modal-custom");
      //   btnActionModalCustom.textContent = "Confirmar";
        
      //   return btnActionModalCustom;
      // },
}

const controller = {
    init: function() {
      UtilsModal.initComponent();
      view.eventsSale();
      if(!UtilsStorage.userLogged()){
        handleRoute("/login");
      }
        document.addEventListener('DOMContentLoaded', function() {
          controller.findAllController();
          let inputSearch = document.getElementById("input-search");
          inputSearch.addEventListener('input', function(event){
            const key = event.target.value;
            if(key.length >= 3){
              controller.findController(key);
              
            }else{
              controller.findAllController();
            }
          })
        });
      },
      findAllController: async function(){
        let cashiers;
        try{
          cashiers = await model.fetchCashiers();
        }catch(error){
          Materialize.toast(error, 1000);
        }
        if(cashiers){
          view.renderTable(cashiers)
        }
      },
      findController: async function(key){
        let cashiers;
        try{
          cashiers = await model.fetchCashiersByKey(key)
        }catch(error){
          Materialize.toast(error, 1000);
        }
        if(cashiers){
          view.renderTable(cashiers);
        }
      }
}

controller.init()