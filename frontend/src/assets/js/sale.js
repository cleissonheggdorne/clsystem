import { controller as controllerCashier} from './cashier.js';
import { service as serviceEmployee} from './employee.js';


const model = {
  fetchEntry: function(idOrDocument) {
    return fetch('http://localhost:8080/api/employee/entry?idOrDocument=' + idOrDocument)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erro ao pesquisar usuário. Contate o suporte técnico.");
        }
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        Materialize.toast(error, 1000)
      });
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
          throw new Error("Erro ao abir caixa. Contate o suporte técnico.");
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
    fetchItensSale: function(idSale, idCashier) {
      const urlIds = "?idSale="+idSale+"&idCashier="+idCashier;
      return fetch('http://localhost:8080/api/itemsale/finditenssale' + urlIds)
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
    fetchCloseSale: function(idCashier, idSale, formPayment){
      console.log(idCashier+" "+idSale+" "+formPayment);
      return fetch('http://localhost:8080/api/sale/closesale', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idCashier: idCashier,
          idSale: idSale,
          formPayment: formPayment
        })  
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erro ao fechar venda. Contate o suporte técnico.");
        }
      })
      .then(data => {
        return data;
      })
      .catch(error => {
          Materialize.toast(error, 1000)
      });
    }
}
const view = {
  init: function(){
    this.initComponents();
    this.modalUser("open");
    const btnEnter = document.getElementById("btn-enter");

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
        view.fillQuantityAndUnitaryValue(selected);
        controller.addItemInList(selected);
        $('#input-product').val('');
      },
      minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
    });
  },
  fillQuantityAndUnitaryValue: function(product){
      $("#input-quantity").val(1);
      $("#unitary-value").val(product.valueCost); 
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
     // line.appendChild(cellEdit);
     // line.appendChild(cellDelete);
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
    entry: function(){
      document.addEventListener("DOMContentLoaded", function(){
        view.init();

        const btnEnter = document.getElementById("btn-enter");
        btnEnter.addEventListener("click", async function(){
            const idOrDocument = document.getElementById("input-user").value;
            if(idOrDocument.length >= 1){
              user = await model.fetchEntry(idOrDocument);
              if(user){
                view.modalUser("close");
                console.log(user);
                controller.init();
              }else{
                Materialize.toast("Usuário Inexistente", 1000);
              }
            }else{
              Materialize.toast("Preencha os dados", 1000);
            }
        })
      })
    },
    init: async function() { 
        cashier = await this.verifyCashier(user.idEmployee);
        //Verifica se existe caixa aberto para o usuário
        if(cashier){
          view.modalCustom("open", "Caixa Aberto", "Há um caixa aberto para esse usuário.");
          const btnModalCustom = document.getElementById("btn-modal-custom");
          btnModalCustom.addEventListener("click", function(){
            controller.findItensSaleController("", cashier.idCashier);
            view.modalCustom("close");
          })
        }
        
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
          // Verificar se a tecla pressionada é a tecla Enter (código 13)
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
            const moneychange = model.calculateMoneyChange(event.target.value, total);
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
          btnConclude.addEventListener("click", function(){
            model.fetchCloseSale(cashier.idCashier, idSaleReal, formPayment)
            .then(response => {
              $('#modal').modal('close');
            })
          })
        })
    //});
      },
      verifyCashier: function(idEmployee){
        console.log(controllerCashier)
        return controllerCashier.verifyCashierOpen(idEmployee);
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
      findItensSaleController: function(idSale, idCashier){
        console.log(idCashier);
        model.fetchItensSale(idSale, idCashier)
        .then(items => {
          console.log(items[0].idSale.idSale);
          idSaleReal = items[0].idSale.idSale;
          console.log(idSale);
          view.renderTable(items);
          total = Number(items.reduce((sum, item) => sum + item.amount, 0)).toFixed(2);
          view.renderAmount(total);
        })
        console.log(idSaleReal);
      }
      // updateSaleList: function(idSale, idCashier){
      //   this.findItensSaleController(idSale, idCashier);
      // }
}
let total;
/*
1- Selecionar Usuário
2- Verificar se existe caixa aberto para o usuário selecionado
3- Caso não exista, abrir o caixa 
*/

let idSaleReal = null;
let user = null;
let cashier = null;
const listSelectedItens = [];
controller.entry();
