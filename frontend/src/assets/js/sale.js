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
  fetchOpenCashier: function(idCashier, initialValue) {
    return fetch('http://localhost:8080/api/cashier/open', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        initialValue: initialValue,
        idCashier: idCashier
      })  
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erro ao abrir caixa. Contate o suporte técnico.");
        }
      })
      .then(data => {
        return data;
      })
      .catch(error => {
          Materialize.toast(error, 1000)
      });
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
    fetchSave: function(item) {
      return fetch('http://localhost:8080/api/itemsale/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)  
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erro ao salvar produto. Contate o suporte técnico.");
          }
        })
        .then(data => {
          return data;
        })
        .catch(error => {
            Materialize.toast(error, 1000)
        });
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
    console.log(product);
      
    document.getElementById("input-quantity").value = 1;
    document.getElementById("unitary-value").value = product.valueCost;
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
      const cellAmount = document.createElement("td");
      const cellNameProduct = document.createElement("td");
      const cellUnitaryValue = document.createElement("td");
      const cellEdit = document.createElement("td");
      const cellDelete = document.createElement("td");
      const btnEdit = document.createElement("a");
      const btnDelete = document.createElement("a");
      
      btnEdit.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
      btnEdit.setAttribute('id', 'btn-edit');
      btnEdit.setAttribute('data-id-item', '');
      btnEdit.setAttribute('href', '#modal1');
      btnEdit.textContent = "Editar";
      btnEdit.addEventListener('click', this.handleEditButtonClick);
      
      btnDelete.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
      btnDelete.setAttribute('id', 'btn-delete');
      btnDelete.setAttribute('data-id-item', ''); 
      btnDelete.setAttribute('href', '#modal-delete');
      btnDelete.textContent = "Apagar";
      btnDelete.addEventListener('click', this.handleDeleteButtonClick);

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
  modalCustom: function(openClose, title, content){
    const modal = document.getElementById("modal-custom");
    const modalContent = modal.querySelector(".modal-content");
    modalContent.innerHTML = "";
    const h4 = document.createElement('h4');
    const p = document.createElement('p');
    h4.textContent = title;
    p.textContent = content;
    modalContent.appendChild(h4);
    modalContent.appendChild(p);
    $('#modal-custom').modal(openClose);
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
            view.modalUser("close");
            cashier = await controller.verifyCashier(user.idEmployee);
            if(cashier   !== null){
              view.modalCustom("open", "Caixa Aberto", "Há um caixa aberto para esse usuário.");
            }else{
              view.modalCustom("open", "Atenção", "Não há um caixa aberto para esse usuário. Uma venda só poderá ser feita quando houver a abertura de um.");
            }
            console.log(cashier);
            
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
      findController: async function(key){
        return await model.fetchProductsByKey(key);
      },
      addItemInList: function(item){
        const itemData = {
          "idProduct": item.idProduct,
          "quantity": $("#input-quantity").val(),
          "idSale": null,
          "idCashier": 1
        }
        model.fetchSave(itemData)
        .then(item => {
          console.log(cashier);
            controller.findItensSaleController("", cashier.idCashier);
        })
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


