import { controller as controllerLogin} from './login.js';
import UtilsStorage from './Utils/UtilsStorage.js';
import {handleRoute} from '../../../routes.js';
import config from './config/config.js';

const model = {
    listProducts: [],
    fetchProducts: async function() {
      const response = await fetch(`${config.backendBaseUrl}/api/product/findall`)
          if (response.ok) {
            this.listProducts = await response.json();
            return this.listProducts;
          } else {
            throw new Error("Erro ao listar produtos. Contate o suporte técnico.");
          }
    },
    fetchProductsByKey: async function(key) {
      const response = await fetch(`${config.backendBaseUrl}/api/product/find?key=${key}`);
          if (response.ok) {
            this.listProducts = await response.json();
            return this.listProducts;
          } else {
            throw new Error("Erro ao listar produtos. Contate o suporte técnico.");
          }
    },
    getProductById: function(id) {
      return this.listProducts.find(product => product.idProduct == id);
    },
    fetchSaveProduct: async function(data, methodForm){
        const response = await fetch(`${config.backendBaseUrl}/api/product/save`, {
            method: methodForm,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  
        });
        if (response.ok) {
          return response.json();
        } else {
          throw response.json();
        }
    },
    fetchDelete: async function(id){
      const response = await fetch(`${config.backendBaseUrl}/api/product/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)  
        });
        if (response.ok) {
          return response;
        } else {
          throw response.error;
        }
    }
  };
  
  // View
  const view = {
    renderTable: function(products) {
      const table = document.getElementById("table-products");
      const tbody = table.querySelector("tbody");
      this.cleanTable(tbody);
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
        
        const iconEdit = document.createElement("i");
        iconEdit.classList.add("material-icons");
        iconEdit.textContent = "edit"
        iconEdit.setAttribute("data-id-product", product.idProduct);

        btnEdit.setAttribute('class', 'btn modal-trigger');
        btnEdit.setAttribute('id', 'btn-edit');
        btnEdit.setAttribute('data-id-product', product.idProduct);
        btnEdit.setAttribute('href', '#modal1');
        btnEdit.addEventListener('click', this.handleEditButtonClick);
        btnEdit.appendChild(iconEdit);

        const iconDelete = document.createElement("i");
        iconDelete.classList.add("material-icons");
        iconDelete.textContent = "delete"
        iconDelete.setAttribute('data-id-product', product.idProduct);

        btnDelete.setAttribute('class', 'btn modal-trigger');
        btnDelete.setAttribute('id', 'btn-delete');
        btnDelete.setAttribute('data-id-product', product.idProduct);
        btnDelete.setAttribute('href', '#modal-delete');
        btnDelete.addEventListener('click', this.handleDeleteButtonClick);
        btnDelete.appendChild(iconDelete);

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
        btn.addEventListener('click', async function(){
          try{
            const response = await model.fetchDelete({
              "id": idProduct
            });
            if(response.ok){
              tools.updateGrid();
            }
          }catch(error){
            Materialize.toast(error, 1000);
          }
        })
      })
    },
    modifyPopup: function(title){
      headerModal.textContent = title;
    },
    cleanTable: function (tbody) {
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
    }
  };
  
  // Controller
  const controller = {
    init: function() {
      if(!UtilsStorage.userLogged()){
        handleRoute("/login");
      }
      document.addEventListener('DOMContentLoaded', function() {
        headerModal = document.getElementById("modal1-header");
        //List all products
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
      let products;
      try{
        products  = await model.fetchProducts();
      }catch(error){
        Materialize.toast(error, 1000);
      }
      view.renderTable(products);
      $('.modal').modal();
      const form = document.getElementById("form-product");
      const btnAddProduct = document.getElementById("add-product");
      
      let methodForm = "PUT";

      btnAddProduct.addEventListener("click", function(){
        form.reset();
        methodForm = "POST";
        view.modifyPopup("Adicionar Produto");
      })

      form.addEventListener('submit', async function(event){
        event.preventDefault();
        let productSaved;
        try{
          productSaved = await model.fetchSaveProduct(controller.getDataForm(), methodForm);
        }catch(error){
          Materialize.toast(error, 1000);
        }
        if (productSaved){
          tools.closeModal();
          tools.updateGrid();
        }
      })
    },
    findController: async function(key){
      try{
        const products = await model.fetchProductsByKey(key);
        view.renderTable(products);
      }catch(error){
        Materialize.toast(error, 1000);
      }
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

  const tools = {
    closeModal: function (){
      $('#modal1').modal('close');
    },
    updateGrid: async function(){
      let products;
      try{
        products =  await model.fetchProducts();
      } catch(error){
        Materialize.toast(error, 1000);
      }
      if(products){
        view.renderTable(products);
      }
    }
  }
  
  // Inicialização do Controller
  let headerModal;
  controller.init();



