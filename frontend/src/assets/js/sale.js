const model = {
    fetchItensSale: function(idSale) {
      return fetch('http://localhost:8080/api/itemsale/finditenssale?id=' + idSale)
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
      }
}
const view = {
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
        controller.fillList(selected);
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
  renderAmount: function (amount){
    $('#span-total-list').text(amount);
  },
  moveScroll: function (){
    const scroll = document.querySelector(".section-table-itens");
    scroll.scrollTop = scroll.scrollHeight;
  },
  cleanTable: function (tbody) {
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  }
}
const controller = { 
    init: function() {
        document.addEventListener('DOMContentLoaded', function() {
         // const table = document.getElementById("table-itens");
          controller.findItensSaleController(6);
          let inputSearch = document.getElementById("input-product");
          inputSearch.focus();
          inputSearch.addEventListener('input', async function(event){
            const key = event.target.value;
            if(key.length >= 3){
              const products = await controller.findController(key);
              view.AutoComplete(products);
            }
          })
        });
      },
      findController: async function(key){
        return await model.fetchProductsByKey(key);
      },
      fillList: function(item){
        const itemData = {
          "idProduct": item.idProduct,
          "quantity": $("#input-quantity").val(),
          "idSale": null,
          "idCashier": 1
        }
        model.fetchSave(itemData)
        .then(item => {
            controller.findItensSaleController(6);
        })
      },
      findItensSaleController: function(idSale){
        model.fetchItensSale(idSale)
        .then(items => {
          view.renderTable(items);
          const total = Number(items.reduce((sum, item) => sum + item.amount, 0)).toFixed(2);
          view.renderAmount(total);
        })
      }
}
const listSelectedItens = [];
controller.init();