// Model
const model = {
    listProducts: [],
    fetchProducts: function() {
      return fetch('http://localhost:8080/api/product/findAll')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erro ao listar produtos. Contate o suporte técnico.");
          }
        })
        .then(data => {
          this.listProducts = data;
          return data;
        })
        .catch(error => {
          error.then(errorMsg =>{
            Materialize.toast(errorMsg.body, 1000)
          });
        });
    },
    fetchProductsByKey: function(key) {
      console.log("aqui");
      return fetch('http://localhost:8080/api/product/find',{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(key) 
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erro ao listar produtos. Contate o suporte técnico.");
          }
        })
        .then(data => {
          this.listProducts = data;
          return data;
        })
        .catch(error => {
          //error.then(errorMsg =>{
            Materialize.toast(error, 1000)
          //});
        });
    },
    getProductById: function(id) {
      return this.listProducts.find(product => product.idProduct == id);
    },
    fetchEditProduct: function(data, methodForm){
        console.log(methodForm);
        return fetch('http://localhost:8080/api/product/save', {
            method: methodForm,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw response.json();
        }
        })
        .then(data => {
          return data;
        })
        .catch(error => {
          error.then(errorMsg =>{
            Materialize.toast(errorMsg.body, 1000)
          });
        });
    },
    fetchDelete: function(id){
      return fetch('http://localhost:8080/api/product/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)  
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw response.json();
        }
        })
        .catch(error => {
          error.then(errorMsg =>{
            console.log(errorMsg.body);
            Materialize.toast(errorMsg.body, 1000)
          });
        });
    }
  };
  
  // View
  const view = {
    renderTable: function(products) {
      const table = document.getElementById("table-products");
      products.forEach(product => {
        const line = document.createElement("tr");
        const cellId = document.createElement("td");
        const cellNameProduct = document.createElement("td");
        const cellValueCost = document.createElement("td");
        const cellValueSale = document.createElement("td");
        const cellEdit = document.createElement("td");
        const cellDelete = document.createElement("td");
        const btnEdit = document.createElement("a");
        const btnDelete = document.createElement("a");
        
        btnEdit.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
        btnEdit.setAttribute('id', 'btn-edit');
        btnEdit.setAttribute('data-id-product', product.idProduct);
        btnEdit.setAttribute('href', '#modal1');
        btnEdit.textContent = "Editar";
        btnEdit.addEventListener('click', this.handleEditButtonClick);
        
        btnDelete.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
        btnDelete.setAttribute('id', 'btn-delete');
        btnDelete.setAttribute('data-id-product', product.idProduct);
        btnDelete.setAttribute('href', '#modal-delete');
        btnDelete.textContent = "Apagar";
        btnDelete.addEventListener('click', this.handleDeleteButtonClick);
  
        cellId.textContent = product.idProduct;
        cellNameProduct.textContent = product.nameProduct;
        cellValueCost.textContent = product.valueCost;
        cellValueSale.textContent = product.valueSale;
        cellEdit.appendChild(btnEdit);
        cellDelete.appendChild(btnDelete);
  
        line.appendChild(cellId);
        line.appendChild(cellNameProduct);
        line.appendChild(cellValueCost);
        line.appendChild(cellValueSale);
        line.appendChild(cellEdit);
        line.appendChild(cellDelete);
        table.querySelector('tbody').appendChild(line);
      });
    },
    fillPopup: function(product) {
        //Obtém inputs de dados do modal de edição
        const inputIdProduct = document.getElementById("id-product");
        const inputProduct = document.getElementById("product");
        const inputProductDescription = document.getElementById("product-description");
        const inputValueCost = document.getElementById("value-cost");
        const inputValueSale = document.getElementById("value-sale");
        const barCode = document.getElementById("bar-code");
        
        //Adicionar Valor aos Inputs
        inputIdProduct.value = String(product.idProduct);
        inputProduct.value = String(product.nameProduct);
        inputProductDescription.value = String(product.productDescription);
        inputValueCost.value = String(product.valueCost);
        inputValueSale.value = String(product.valueSale);
        barCode.value = String(product.barCode);
    
        //Atualizar Inputs para evitar texto sobreescrito
        Materialize.updateTextFields();
    },
    handleEditButtonClick: function(event) {
      const idProduct = event.target.getAttribute("data-id-product");
      const product = model.getProductById(idProduct);
      view.modifyPopup("Editar Produto");
      view.fillPopup(product);
    },
    handleDeleteButtonClick: function(event) {
      const idProduct = event.target.getAttribute("data-id-product");
      document.querySelectorAll("#modal-delete-btn-yes").forEach(btn =>{
        btn.addEventListener('click', function(){
          model.fetchDelete({
            "id": idProduct
          });
        })
      })
    },
    modifyPopup: function(title){
      headerModal.textContent = title;
    }
    
  };
  
  // Controller
  const controller = {
    init: function() {
      document.addEventListener('DOMContentLoaded', function() {
        headerModal = document.getElementById("modal1-header");
        //Listar todos os produtos
        model.fetchProducts()
          .then(products => {
            view.renderTable(products);
              $('.modal').modal();
              const form = document.getElementById("form-product");
              const btnAddProduct = document.getElementById("add-product");
              
              let methodForm = "PUT";

              btnAddProduct.addEventListener("click", function(event){
                form.reset();
                methodForm = "POST";
                console.log(headerModal);
                view.modifyPopup("Adicionar Produto");
              })

              form.addEventListener('submit', function(event){
                event.preventDefault();
                model.fetchEditProduct(controller.getDataForm(), methodForm);
              })
          });
        let inputSearch = document.getElementById("input-search");
        inputSearch.addEventListener('input', function(event){
          const key = event.target.value;
          if(key.length >= 3){
            controller.findController({"key": key});
          } 
        })
      });
    },
    findController: function(key){
      console.log(key);
      model.fetchProductsByKey(key)
      .then(products => {

        view.renderTable(products);
      });
    },
    getDataForm: function(){
        //Obtem dados do formulário de produto
        const idProduct = document.getElementById("id-product").value;
        const product = document.getElementById("product").value;
        const productDescription = document.getElementById("product-description").value;
        const valueCost = document.getElementById("value-cost").value;
        const valueSale = document.getElementById("value-sale").value;
        const barCode = document.getElementById("bar-code").value;
        return {
            idProduct: idProduct,
            nameProduct: product,
            productDescription: productDescription,
            valueCost: valueCost,
            valueSale: valueSale,
            barCode : barCode
        };
    }
  };
  
  // Inicialização do Controller
  let headerModal;
  controller.init();



