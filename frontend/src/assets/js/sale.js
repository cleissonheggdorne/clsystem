import { controller as controllerCashier} from './cashier.js';
import { controller as controllerLogin} from './login.js';



const model = {

  fetchOpenCashier: async function(idEmployee, initialValue) {
    
    const response = await fetch('http://localhost:8080/api/cashier/open', {
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
  fetchCloseCashier: async function(idCashier) {
    const response = await fetch('http://localhost:8080/api/cashier/close', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idCashier: idCashier
      })  
      })
      if(response.ok && response.text !== ""){
        return await response.json();
      } else{
        throw new Error("Houve um erro ao fechar caixa.");
      }
  },
    fetchItensSale: async function(idSale, idCashier) {
      const urlIds = "?idSale="+idSale+"&idCashier="+idCashier;
      const response = await fetch('http://localhost:8080/api/itemsale/finditenssale' + urlIds);
      if(response.ok){
        return await response.json();
      } else if (!response.ok){
        throw new Error("Erro ao buscar lista de compras");
      } 
    },
    fetchProductsByKey: function(key) {
      return fetch('http://localhost:8080/api/product/find?key='+key)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erro ao listar produtos. Contate o suporte técnico.");
          }
        })
        .then(data => {
          return data;
        })
        .catch(error => {
            Materialize.toast(error, 1000)
        });
    },
    fetchSave: async function(item) {
      const response = await fetch('http://localhost:8080/api/itemsale/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)  
        });
        if(response.ok && response.text !== ""){
          return await response.json();
        } else{
          throw new Error("Erro ao salvar produto. Contate o suporte técnico.");
        }
    },
    fetchUpdateItem: async function(item) {
      const response = await fetch('http://localhost:8080/api/itemsale/save', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)  
        });
        if(response.ok && response.text !== ""){
          return await response.json();
        } else{
          throw new Error("Erro ao atualizar item da venda. Contate o suporte técnico.");
        }
    },
    calculateMoneyChange: function(entryValue, total){
      return entryValue-total;
    },
    fetchCloseSale: async function(idCashier, idSale, formPayment){
      const saleClosed = await fetch('http://localhost:8080/api/sale/closesale', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idCashier: idCashier,
          idSale: idSale,
          formPayment: formPayment
        })  
      });
      if(saleClosed.ok && saleClosed.text !== ""){
        return saleClosed.json();
      }else {
        throw new Error("Erro ao fechar venda.");
      }
    },
    fetchCancelSale: async function(idCashier, idSale){
      const saleCancel = await fetch('http://localhost:8080/api/sale/cancel-sale', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idCashier: idCashier,
          idSale: idSale
        })  
      });
      if(saleCancel.ok && saleCancel.text !== ""){
        return saleCancel.json();
      }else {
        throw new Error("Erro ao fechar venda.");
      }
    },
    fetchSummaryByCashier: async function(idCahier) {
      const response = await fetch('http://localhost:8080/api/sale/summary-by-cashier?idCashier=' + idCahier);
      if (response.ok && response.text !== "") {
         return await response.json();
      } else {
         throw new Error("Não foi possível obter o resumo de fechamento deste caixa!");
      }
   },
}
const view = {
  init: function(){
     user = JSON.parse(sessionStorage.getItem("user"));
     cashier = JSON.parse(sessionStorage.getItem("cashier"));
     this.eventsSale();

   },
  eventsSale: function(){

    const btnModalCustom = document.getElementById("btn-modal-custom");
    
    btnModalCustom.addEventListener("click", function(){
      if(btnModalCustom.textContent.toUpperCase() == "CONFIRMAR"){
        (cashier !== null)? controller.findItensSaleController("", cashier.idCashier) : null;
      }
      view.modalCustom("close");
    });

    const inputSearch = document.getElementById("input-product");
    inputSearch.focus();
    
    inputSearch.addEventListener('input', async function(event){
      const key = event.target.value;
      if(key.length >= 3){
        //Busca produtos com a chave determinada
        const products = await controller.findController(key);
        view.AutoComplete(products);
      }
    });

    // Abrir/Fechar Caixa
    const btnOpenClosecashier = document.getElementById("open-close-cashier");
    btnOpenClosecashier.addEventListener('click', async function(event){
       
     if(btnOpenClosecashier.textContent.includes("Fechar")){
       let summaryByCashier;
       try{
           summaryByCashier = await  model.fetchSummaryByCashier(cashier.idCashier);
       }catch(error){
           Materialize.toast(error, 1000);
       }
       view.modalOpenCloseCashier("open", "Fechamento de Caixa", "", true, summaryByCashier);
     }else{
        view.modalOpenCloseCashier("open", "Abertura de Caixa", "Você está prestes a iniciar um caixa.", true, null);
     }
    });
    
    //Pagamento
    const payment  = document.getElementById("btn-payment");
    document.addEventListener('keydown', function(event) {
      // Verificar se a tecla pressionada 
      if (event.key === "F2") {
        payment.click();
      }
    });

    payment.addEventListener('click', function(){
      const btnBackModalPayment = document.getElementById("back");
      btnBackModalPayment.addEventListener('click', function(){
        $('#modal').modal('close');
      })
      
      view.fillModalPayment();
      
      const divMoneyChange = document.getElementById("div-money-change");
      divMoneyChange.style.visibility = "hidden";
      let inputMoneyChange = document.getElementById("modal-input-money");
      inputMoneyChange.addEventListener('input', function(event){
        const moneychange = controller.calculateMoneyChange(event.target.value, total);
        view.fillMoneyChange(moneychange);
        Materialize.updateTextFields();
      })

      const btnConclude = document.getElementById("conclude");
      const listPayment = document.querySelectorAll(".collection-item");
      let formPayment = null;
      listPayment.forEach(item =>{
        item.addEventListener("click", function(){
          formPayment = (item.childNodes[1].textContent.toUpperCase()).replace(/ /g, "_");
          listPayment.forEach(item => {
            item.classList.remove('active');
            btnConclude.classList.add('disabled');
          });

          if(item.childNodes[1].textContent.toUpperCase() === "DINHEIRO"){
            divMoneyChange.style.visibility = "visible";
          }else{
            divMoneyChange.style.visibility = "hidden";
          }
          
          item.classList.toggle("active");
          btnConclude.classList.remove("disabled");
        })
      })
      btnConclude.addEventListener("click", async function(){
        try{
          const saleClosed = await controller.closeSale(cashier.idCashier, idSaleReal, formPayment);//model.fetchCloseSale(cashier.idCashier, idSaleReal, formPayment) 
          if(saleClosed != null && saleClosed.idSale != null){
            $('#modal').modal('close');
            location.reload();
            Materialize.toast("Venda finalizada.", 1000);
          }else{
            Materialize.toast("Houve um erro ao tentar fechar a venda.", 1000);
          }
          
        }catch(error){
          Materialize.toast(error, 1000);
        }
      })
    });
     //Cancelamento
     const btnCancel = document.getElementById("btn-cancel");
     btnCancel.addEventListener("click", async function(){
      try{
        view.modalCustom("open","ATENÇÃO","Deseja realmente cancelar esta venda?", true);
        view.addButonActionInModalCustom();
        $('#modal-custom').modal("open");

        const  btnActionModalCustom = document.getElementById("btn-action-modal-custom");
        btnActionModalCustom.addEventListener("click", async function(){
          console.log("cancelamento de venda")
          
          const saleCancel = await controller.cancelSale();
          if(saleCancel != null && saleCancel.idSale != null){
            Materialize.toast("Venda Cancelada", 1000);
            $('#modal').modal('close');
            setTimeout(() =>{
              location.reload()
            }, 500);
          }else{
            Materialize.toast("Houve um erro ao tentar cancelar a venda.", 1000);
          }

        })
      }catch(error){
        Materialize.toast(error, 1000);
      }
     });
  },
  saleEventsDinamicsComponents: {
    handleEditclickFunction: function(btnEditItemSale){

      if(btnEditItemSale.textContent === "EDITAR"){

        let row = btnEditItemSale.parentNode; // Linha da tabela
        let cells = row.getElementsByTagName('td');

        
        for (let i = 0; i < cells.length -1; i++) {
          if(cells[i].id == "table-itens-quantity"){
            this.transformCellToInput(cells[i]);


            btnEditItemSale.textContent = 'SALVAR';
            btnEditItemSale.removeEventListener("click", this.handleEditclick);        
            break;
          }
        }
        return;
      }
      this.handleSaveClick(btnEditItemSale);
    },
    transformCellToInput: function(cell){
      let originalContent = cell.textContent;
      let input = document.createElement('input');
      input.setAttribute("id", "table-itens-quantity-input")
      input.type = 'number';
      input.min = 0; 
      input.value = originalContent;
      // Substitui o conteúdo da célula pelo input
      cell.textContent = '';
      cell.appendChild(input);
    },
    handleSaveClick: async function(btnEditItemSale){
      const quantityInput = document.getElementById("table-itens-quantity-input");
      const itemData = {
        "idProduct": null,
        "quantity": quantityInput.value, 
        "idSale": null,
        "idCashier": cashier.idCashier,
        "idItemSale": btnEditItemSale.dataset.idItem
      };
      try{
        await model.fetchUpdateItem(itemData)
        await controller.findItensSaleController("", cashier.idCashier);
      }catch(error){
        Materialize.toast(error, 1000);
      }
    }
  },
  AutoComplete: function(products){
    const autoCompleteProducts = {};
    const selected = {};
    
    products.forEach(product => {
      autoCompleteProducts[product.nameProduct] = null;
    });

    $('input.autocomplete').autocomplete({
      data: autoCompleteProducts,
      limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
      onAutocomplete: function(selected) {
        // Callback function when value is autcompleted.
        selected = products.find(product => product.nameProduct == selected || product.barCode == selected);
        
        view.fillQuantityAndUnitaryValueAndNameProduct(selected);
        $('#input-product').val('');
        (cashier !== null)? controller.addItemInList(selected): null;
      },
      minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
    });
  },
  fillQuantityAndUnitaryValueAndNameProduct: function(product){
    const inputQuantity = document.getElementById("input-quantity");
    const inputUnitaryValue = document.getElementById("unitary-value");
    
    if(inputQuantity.value == "" || inputQuantity.value == null){
      inputQuantity.value = 1;
    }

    inputUnitaryValue.value = product.valueCost;
    const informationProductSelected = document.getElementById("selected-product-summary")
    informationProductSelected.value = product.nameProduct 
                                      + "\nQtd.: " + inputQuantity.value
                                      +" \nUnd.: " + inputUnitaryValue.value
                                      +" \nTot.: "+ inputQuantity.value * inputUnitaryValue.value; 
    Materialize.updateTextFields();     
  },
  renderTable: function(itens) {
    const table = document.getElementById("table-itens");
    const tbody = table.querySelector("tbody");
    this.cleanTable(tbody);
    itens.forEach(item => {
      const line = document.createElement("tr");
      const cellQuantity = document.createElement("td");
      cellQuantity.setAttribute("id", "table-itens-quantity");
      const cellAmount = document.createElement("td");
      cellAmount.setAttribute("id", "table-itens-amount");
      const cellNameProduct = document.createElement("td");
      cellNameProduct.setAttribute("id", "table-itens-name--product");
      const cellUnitaryValue = document.createElement("td");
      cellUnitaryValue.setAttribute("id", "table-itens-unitary-value");
      const cellEdit = document.createElement("td");
      const cellDelete = document.createElement("td");
      const btnEdit = document.createElement("a");
      const btnDelete = document.createElement("a");
      btnEdit.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
      btnEdit.setAttribute('id', 'btn-edit-item-sale');
      btnEdit.setAttribute('data-id-item', item.idItemSale);
      btnEdit.setAttribute('href', '#modal1');
      btnEdit.textContent = "EDITAR";
       btnEdit.addEventListener('click', () => {
        view.saleEventsDinamicsComponents.handleEditclickFunction(btnEdit);
       });
      
      btnDelete.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
      btnDelete.setAttribute('id', 'btn-delete');
      btnDelete.setAttribute('data-id-item', ''); 
      btnDelete.setAttribute('href', '#modal-delete');
      btnDelete.textContent = "Apagar";

      cellQuantity.textContent = item.quantity;
      cellNameProduct.textContent = item.idProductNameProduct;
      cellUnitaryValue.textContent = item.unitaryValue;
      cellAmount.textContent = item.amount;
      cellEdit.appendChild(btnEdit);
      cellDelete.appendChild(btnDelete);

      line.appendChild(cellQuantity);
      line.appendChild(cellNameProduct);
      line.appendChild(cellUnitaryValue);
      line.appendChild(cellAmount);
      line.appendChild(btnEdit);
      table.querySelector('tbody').appendChild(line);
      view.moveScroll();

    });
  },
  customModal: function(){
   
  },
  applyCustomModal: function(content){
    const modal = document.getElementById("modal");
    const modalContent = modal.querySelector(".modal-content");
    modalContent.innerHTML = '';
    modalContent.appendChild(content);
  },
  renderAmount: function (amount){
    $('#span-total-list').text("R$ "+amount);
  },
  moveScroll: function (){
    const scroll = document.querySelector(".section-table-itens");
    scroll.scrollTop = scroll.scrollHeight;
  },
  cleanTable: function (tbody) {
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  },
  fillModalPayment: function(){
     $('#span-total-list-modal').text("Total " + $('#span-total-list').text());
  },
  fillMoneyChange: function(moneyChange){
    $('#modal-return-money').val(moneyChange);
  },
  modalCustom: function(openClose, title, content, moreComponents){
    const modal = document.getElementById("modal-custom");
    const modalContent = modal.querySelector(".modal-content");
    modalContent.innerHTML = "";
    const h4Title = document.createElement('h4');
    const paragraph = document.createElement('p');
    h4Title.textContent = title;
    paragraph.textContent = content;
    modalContent.appendChild(h4Title);
    modalContent.appendChild(paragraph);
    
    $('#modal-custom').modal(openClose);
    return {"modal":modal, "modalContent":modalContent, "h4title":h4Title, "paragraph":paragraph};
  },
  modalOpenCloseCashier: function(openClose, title, content, moreComponents, summaryByCashier){
    const modal = this.modalCustom("close", title,content, moreComponents);
    
    if(moreComponents && summaryByCashier == null){
       modal.modalContent.appendChild(this.addComponentsMoldalCustom());
       const  btnActionModalCustom = document.getElementById("btn-action-modal-custom");
       btnActionModalCustom.addEventListener("click", function(){
        const inputValueModal = document.getElementById("input-value-initial");
        controller.openCashier(inputValueModal.value);
      })
    }else{
        this.addComponentsForCloseCashier(modal,  summaryByCashier)
      const  btnActionModalCustom = document.getElementById("btn-action-modal-custom");
       btnActionModalCustom.addEventListener("click", function(){
        const inputValueModal = document.getElementById("input-value-initial");
        const amounthReportedAtClosed = inputValueModal.value;
        controller.closeCashier(amounthReportedAtClosed);
      })
    }
    
    $('#modal-custom').modal(openClose);
  },
  
  createInputNumber: function(){
    const divInputFild = document.createElement("div");
    divInputFild.setAttribute("class", "input-field col s6");
    const input  = document.createElement('input')
    input.setAttribute("type", "number");;
    input.setAttribute("min", "0");
    input.setAttribute("class", "validate");
    input.setAttribute("id", "input-value-initial")
    const label = document.createElement('label');
    label.setAttribute("class", "active");
    label.setAttribute("for", "input-value-initial");
    label.textContent = "Valor de Entrada";
    return {"div": divInputFild, 
            "input": input,
            "label": label
            };
  },
  createButtonWithAction: function(){
    const btnActionModalCustom = document.createElement("a");
    btnActionModalCustom.setAttribute("href", "#!");
    btnActionModalCustom.setAttribute("class", "waves-effect waves-green btn");
    btnActionModalCustom.setAttribute("id", "btn-action-modal-custom");
    btnActionModalCustom.textContent = "Confirmar";
    
    return btnActionModalCustom;
  },
  addComponentsForOpenCashier: function(){
    
    const divInputLabel = this.createInputNumber();

    //Alteração de botão padrão do modal custom
    const btnOkModalCustom = document.getElementById("btn-modal-custom")
    btnOkModalCustom.textContent = "Cancelar";
    const footerModalCustom = btnOkModalCustom.parentElement;
    //Adição de botão de ação
    if(!document.getElementById("btn-action-modal-custom")){
      const btnActionModalCustom = this.createButtonWithAction();
      btnActionModalCustom.addEventListener("click", function(){
        controller.openCashier(divInputLabel.input.value);
      })
      footerModalCustom.appendChild(btnActionModalCustom);
    }
    divInputLabel.div.appendChild(divInputLabel.input);
    divInputLabel.div.appendChild(divInputLabel.label);
    return divInputLabel.div;
  },
  addButonActionInModalCustom: function(){
    //Alteração de botão padrão do modal custom
    const btnOkModalCustom = document.getElementById("btn-modal-custom")
    btnOkModalCustom.textContent = "Cancelar";
    const footerModalCustom = btnOkModalCustom.parentElement;
    //Adição de botão de ação
    if(!document.getElementById("btn-action-modal-custom")){
      const btnActionModalCustom = this.createButtonWithAction();
     
      footerModalCustom.appendChild(btnActionModalCustom);
    }
   
  },
  addComponentsMoldalCustom: function(){
    const divInputLabel = this.createInputNumber();

    //Alteração de botão padrão do modal custom
    const btnOkModalCustom = document.getElementById("btn-modal-custom")
    btnOkModalCustom.textContent = "Cancelar";
    const footerModalCustom = btnOkModalCustom.parentElement;
    //Adição de botão de ação
    if(!document.getElementById("btn-action-modal-custom")){
      const btnActionModalCustom = this.createButtonWithAction();
      footerModalCustom.appendChild(btnActionModalCustom);
    }
    divInputLabel.div.appendChild(divInputLabel.input);
    divInputLabel.div.appendChild(divInputLabel.label);
    return divInputLabel.div;
  },
  addComponentsForCloseCashier:  function(modal, summaryByCashier){
    modal.h4title.textContent = "Fechamento de Caixa";
    modal.paragraph.textContent = "Movimentação Registrada: ";

    modal.modalContent.appendChild(this.constroiTabela(summaryByCashier))
    this.addComponentsMoldalCustom();
  },
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
  fillInformationCashier: function(){
    const navInformation = document.getElementById("nav");
    const liCashier = document.createElement("li");
    liCashier.innerHTML = "";
    liCashier.textContent = (cashier != null)? " Caixa: " + cashier.status + " Hora Abertura: "+cashier.dateHourOpenFormatted: "Não Há Registro de Caixa em Aberto";
    navInformation.appendChild(liCashier); 
  },
  fillButtonOpenCloseCashier: function(openClose){
    const btnSpanOpenCloseCashier = document.getElementById("open-close-cashier");
    btnSpanOpenCloseCashier.classList.add("white-text");
    if(openClose === "open"){
      btnSpanOpenCloseCashier.textContent = "Abrir Caixa";
      btnSpanOpenCloseCashier.classList.add("light-green");
    }else{
      btnSpanOpenCloseCashier.textContent = "Fechar Caixa";
      btnSpanOpenCloseCashier.classList.add("light-gray");
    } 
  },
  openModalPayment: function(){
    
  },
}
const controller = { 
   
     componentEntry: function(){
         view.init();
         console.log(cashier);
         this.findItensSaleController("", cashier.idCashier);
     },
      verifyCashier: async function(idEmployee){
        try{
          const cashierReturned = await controllerCashier.verifyCashierOpen(idEmployee);
          return cashierReturned;
        }catch(error){
          throw error;
        }
      },
      openCashier: async function(initialValue){
        try{
          cashier = await model.fetchOpenCashier(user.idEmployee, initialValue);
          if(cashier !== null){
              view.modalCustom("close", "", "", false);
              view.fillInformationCashier();
              view.fillButtonOpenCloseCashier("close");
          }else{
              view.modalCustom("open", "Atenção", "Não há um caixa aberto para esse usuário. Uma venda só poderá ser feita quando houver a abertura de um.", true);
          }
        }catch(error){
          throw error;
        }
      },
      closeCashier: async function(finalValue){
        try{
          cashier = await model.fetchCloseCashier(cashier.idCashier, finalValue);
          if(cashier !== null){
              view.modalCustom("close", "", "", false);
              location.reload();
          }else{
              view.modalCustom("open", "Atenção", "Não foi possível fechar o caixa corretamente. Tente novamente", true);
          }
        }catch(error){
          throw error;
        }
      },
      findController: async function(key){
        return await model.fetchProductsByKey(key);
      },
      addItemInList: async function(item){
        const itemData = {
          "idProduct": item.idProduct,
          "quantity": document.getElementById("input-quantity").value, 
          "idSale": null,
          "idCashier": cashier.idCashier
        };
        document.getElementById("input-quantity").value = '';
        document.getElementById("unitary-value").value= '';

        try{
          await model.fetchSave(itemData)
          await controller.findItensSaleController("", cashier.idCashier);
        }catch(error){
          Materialize.toast(error, 1000);
        }
      },
      findItensSaleController: async function(idSale, idCashier){
        try{
          const items = await model.fetchItensSale(idSale, idCashier);
          quantityItensInSale = items.length;
          if(items.length >= 1){
            idSaleReal = items[0].idSale.idSale;
            sale = items[0].idSale;
            view.renderTable(items);
            total = Number(items.reduce((sum, item) => sum + item.amount, 0)).toFixed(2);
            view.renderAmount(total);
          }
        }catch(error){
          throw error;
        }
      },
      calculateMoneyChange: function(entryValue, total){
        return model.calculateMoneyChange(entryValue, total);
      },
      closeSale: async function(idCashier, idSaleReal, formPayment){
        try{
          return await model.fetchCloseSale(idCashier, idSaleReal, formPayment);
        }catch(error){
          throw error;
        }    
      },
      cancelSale: async function(){
        try{
          return await model.fetchCancelSale(cashier.idCashier, idSaleReal);
        }catch(error){
          throw error;
        }    
      }
}

let total;
let idSaleReal = null;
let user = null;
let cashier = null;

controller.componentEntry();


