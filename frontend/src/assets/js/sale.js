import { controller as controllerCashier} from './cashier.js';
import { service as serviceEmployee} from './employee.js';

const model = {
  fetchEntry: async function(idOrDocument) {
     const response = await fetch('http://localhost:8080/api/employee/entry?idOrDocument=' + idOrDocument);
     if (response.ok && response.text !== "") {
        return await response.json();
     } else {
        throw new Error("Usuário Inexistente!");
     }
  },
  fetchOpenCashier: async function(idEmployee, initialValue) {
    console.log(idEmployee + "value: "+initialValue)
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
  fetchCloseCashier: function(idCashier) {
    return fetch('http://localhost:8080/api/cashier/close', {
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
    fetchItensSale: async function(idSale, idCashier) {
      const urlIds = "?idSale="+idSale+"&idCashier="+idCashier;
      const response = await fetch('http://localhost:8080/api/itemsale/finditenssale' + urlIds);
      if(response.ok && response.text !== ""){
        return await response.json();
      } else{
        throw new Error("Não há lista de compras em aberto");
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
        console.log(response)
        if(response.ok && response.text !== ""){
          return await response.json();
        } else{
          throw new Error("Erro ao salvar produto. Contate o suporte técnico.");
        }
    },
    fetchUpdateItem: async function(item) {
      console.log(item);
      const response = await fetch('http://localhost:8080/api/itemsale/save', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)  
        });
        console.log(response)
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
      console.log(idCashier+" "+idSale+" "+formPayment);
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
      console.log(saleClosed);
      if(saleClosed.ok && saleClosed.text !== ""){
        return saleClosed.json();
      }else {
        throw new Error("Erro ao fechar venda.");
      }

    }
}
const view = {
  init: function(){
    this.initComponents();
    this.modalUser("open");
    const btnEnter = document.getElementById("btn-enter");
    this.eventsSale();

  },
  eventsSale: function(){
    
    const btnModalCustom = document.getElementById("btn-modal-custom");
    
    btnModalCustom.addEventListener("click", function(){
      (cashier !== null)? controller.findItensSaleController("", cashier.idCashier) : null;
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

    // Abrir caixa
    document.getElementById("open-close-cashier").addEventListener('click', async function(event){
      view.modalCustom("open", "Abertura de Caixa", "Você está prestes a iniciar um caixa.", true);
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
          formPayment = item.childNodes[1].textContent.toUpperCase();
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
          $('#modal').modal('close');
        }catch(error){
          Materialize.toast(error, 1000);
        }
      })
    });
  },
  saleEventsDinamicsComponents: {
    handleEditclickFunction: function(btnEditItemSale){
      console.log(btnEditItemSale.textContent)
      if(btnEditItemSale.textContent === "EDITAR"){
        console.log("editar")
        let row = btnEditItemSale.parentNode; // Linha da tabela
        let cells = row.getElementsByTagName('td');
        console.log(cells);
  
        for (let i = 0; i < cells.length -1; i++) {
          if(cells[i].id == "table-itens-quantity"){
            this.transformCellToInput(cells[i]);
            console.log(cells[i]);
            console.log(btnEditItemSale);
            btnEditItemSale.textContent = 'SALVAR';
            btnEditItemSale.removeEventListener("click", this.handleEditclick);        
            break;
          }
        }
        return;
      }
      console.log("SALVAR")
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
      console.log(quantityInput);
      const itemData = {
        "idProduct": null,
        "quantity": quantityInput.value, 
        "idSale": null,
        "idCashier": cashier.idCashier,
        "idItemSale": btnEditItemSale.dataset.idItem
      };
      console.log(itemData);
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
    const inputNameProduct = document.getElementById("name-product");
    
    if(inputQuantity.value == "" || inputQuantity.value == null){
      inputQuantity.value = 1;
    }

    inputUnitaryValue.value = product.valueCost;
    document.getElementById("name-product").value = product.nameProduct; 

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
      console.log(item);
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
      //btnDelete.addEventListener('click', this.handleDeleteButtonClick);

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
    console.log($('#span-total-list').text());
     $('#span-total-list-modal').text("Total " + $('#span-total-list').text());
  },
  fillMoneyChange: function(moneyChange){
    $('#modal-return-money').val(moneyChange);
  },
  initComponents: function(){
    $('#modal-select-user').modal();
    $('select').material_select();
    $('.modal').modal({
      dismissible: false
    });
  },
  modalUser: function(openClose){
    $('#modal-select-user').modal(openClose);
  },
  modalCustom: function(openClose, title, content, moreComponents){
    const modal = document.getElementById("modal-custom");
    const modalContent = modal.querySelector(".modal-content");
    modalContent.innerHTML = "";
    const h4 = document.createElement('h4');
    const p = document.createElement('p');
    h4.textContent = title;
    p.textContent = content;
    modalContent.appendChild(h4);
    modalContent.appendChild(p);
    
    if(moreComponents){
      modalContent.appendChild(this.addComponentsForOpenCashier());
    }
    
    $('#modal-custom').modal(openClose);
  },
  addComponentsForOpenCashier: function(){
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
    
    //Alteração de botão padrão do modal custom
    const btnOkModalCustom = document.getElementById("btn-modal-custom")
    btnOkModalCustom.textContent = "Cancelar";
    const footerModalCustom = btnOkModalCustom.parentElement;
    //Adição de botão de ação
    if(!document.getElementById("btn-action-modal-custom")){
      const btnActionModalCustom = document.createElement("a");
      btnActionModalCustom.setAttribute("href", "#!");
      btnActionModalCustom.setAttribute("class", "waves-effect waves-green btn");
      btnActionModalCustom.setAttribute("id", "btn-action-modal-custom");
      btnActionModalCustom.textContent = "Confirmar";
    
      btnActionModalCustom.addEventListener("click", function(){
        controller.openCashier(input.value);
      })

      footerModalCustom.appendChild(btnActionModalCustom);

    }
    divInputFild.appendChild(input);
    divInputFild.appendChild(label);
    return divInputFild;
  },
  fillInformationLoggin: function(){
    const navInformation = document.getElementById("nav");
    const liUser = document.createElement("li");
    liUser.textContent = "Usuário: "+user.idEmployee+" "+user.nameEmployee+" ";
    navInformation.appendChild(liUser); 

  },
  fillInformationCashier: function(){
    const navInformation = document.getElementById("nav");
    const liCashier = document.createElement("li");
    liCashier.innerHTML = "";
    liCashier.textContent = (cashier != null)? "Caixa: " + cashier.status + " Hora Abertura: "+cashier.dateHourOpen: "Não Há Registro de Caixa em Aberto";
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
      document.addEventListener("DOMContentLoaded", function(){
        view.init();

        const btnEnter = document.getElementById("btn-enter");
        btnEnter.addEventListener("click", async function(){
          const idOrDocument = document.getElementById("input-user").value;
          controller.entry(idOrDocument);
        })
      })
    },
    //1
    entry: async function(idOrDocument){
   
        if(idOrDocument.length >= 1){
            try{
               user = await model.fetchEntry(idOrDocument);
            // if(user != null){
               view.modalUser("close");
               view.fillInformationLoggin();
            // }
            
            cashier = await controller.verifyCashier(user.idEmployee);
            if(cashier !== null){
              view.modalCustom("open", "Caixa Aberto", "Há um caixa aberto para esse usuário.", false);
              view.fillInformationCashier();
              view.fillButtonOpenCloseCashier("close");
            }else{
              view.modalCustom("open", "Atenção", "Não há um caixa aberto para esse usuário. Uma venda só poderá ser feita quando houver a abertura de um.", false);
              view.fillButtonOpenCloseCashier("open");
            }
            
            }catch(error){
              Materialize.toast(error, 1000);
            }
        }else{
          Materialize.toast("Preencha os dados", 1000);
        }
    },
    //Passo 2
      verifyCashier: async function(idEmployee){
        try{
          const cashierReturned = await controllerCashier.verifyCashierOpen(idEmployee);
          return cashierReturned;
        }catch(error){
          throw error;
        }
      },
      openCashier: async function(initialValue){
        //view.modalCustom("open", "Abertura de Caixa", "Você está prestes a iniciar um caixa.", true);
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
        console.log(itemData);
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
         // console.log(items.length);
          if(items.length >= 1){
            idSaleReal = items[0].idSale.idSale;
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
      }
}

// const utils = {
//   formatDateHour: function(dateHourUnformatted){
//     // String de data no formato ISO
//     const dateHourISO = dateHourUnformatted;

//     // Criar um objeto de data a partir da string ISO
//     const dateHour = new Date(dateHourISO);

//     // Formatando a data para o padrão brasileiro
//     const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric' };
//     const dateformated = dateHour.toLocaleDateString('pt-BR', optionsDate);

//     // Formatando a hora para o padrão brasileiro
//     const optionsHour = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
//     const hourFormated = dateHour.toLocaleTimeString('pt-BR', optionsHour);
//     return {
//       date: dateformated,
//       hour: hourFormated
//     }
//   }
// }

let total;
/*
Fluxo de Entrada na Aplicação
1- Selecionar Usuário (Verifica se usuário existe)
2- Verificar se existe caixa aberto para o usuário selecionado
3- Verifica se existe lista de compras aberta para o caixa 
*/

let idSaleReal = null;
let user = null;
let cashier = null;
const listSelectedItens = [];

controller.componentEntry();


