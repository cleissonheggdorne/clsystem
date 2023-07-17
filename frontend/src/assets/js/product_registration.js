// document.addEventListener('DOMContentLoaded', function(){
//     let listProducts;

//     fetch('http://localhost:8080/api/product/find')
//     .then(response => {
//             //Status 200 Ok
//         if(response.ok){
//             return response.json();
//         }else{
//             console.log("Erro ao Buscar dados do usuário")
//         }   
//     })
//     .then(data =>{
//         listProducts = data
//         //Demonstrar dados
//         console.log(data);
//         const table = document.getElementById("table-products");
//         data.forEach(element => {
//             const line = document.createElement("tr");
//             const cellId = document.createElement("td");
//             const cellNameProduct= document.createElement("td");
//             const cellValueCost= document.createElement("td");
//             const cellValueSale= document.createElement("td");
//             const cellEdit= document.createElement("td");
//             const cellDelete= document.createElement("td");
//             const btnEdit= document.createElement("a");
//             const btnDelete= document.createElement("a");
            
//             btnEdit.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
//             btnEdit.setAttribute('id', 'btn-edit');
//             btnEdit.setAttribute('data-id-product', element.idProduct);
//             btnDelete.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
//             btnDelete.setAttribute('id', 'btn-delete');
//             btnDelete.setAttribute('data-id-product', element.idProduct);
//             btnEdit.setAttribute('href', '#modal1');
//             btnDelete.setAttribute('href', '#modal1');
//             btnEdit.textContent = "Editar";
//             btnDelete.textContent = "Excluir";

//             cellId.textContent = element.idProduct;
//             cellNameProduct.textContent = element.nameProduct;
//             cellValueCost.textContent = element.valueCost;
//             cellValueSale.textContent = element.valueSale;
//             cellEdit.appendChild(btnEdit);
//             cellDelete.appendChild(btnDelete);

   
//             line.appendChild(cellId);
//             line.appendChild(cellNameProduct);
//             line.appendChild(cellValueCost);
//             line.appendChild(cellValueSale);
//             line.appendChild(cellEdit);
//             line.appendChild(cellDelete);
//             table.querySelector('tbody').appendChild(line);

//             // Adicionar ouvintes de eventos para os botões de edição e exclusão
//             const editButtons = document.querySelectorAll('#btn-edit');
//             const deleteButtons = document.querySelectorAll('#btn-delete');

//             editButtons.forEach(function(button) {
//                 button.addEventListener('click', function() {
//                 console.log(listProducts);
//                 const inputIdProduct = document.getElementById("id-product");
//                 const inputProduct = document.getElementById("product");
//                 const inputProductDescription = document.getElementById("product-description");
//                 const inputValueCost = document.getElementById("value-cost");
//                 const inputValueSale = document.getElementById("value-sale");
                
//                 const productReturn = listProducts.find(obj => obj.idProduct == button.getAttribute("data-id-product"));
//                 inputIdProduct.value = String(productReturn.idProduct);
//                 inputProduct.value = String(productReturn.nameProduct);
//                 inputProductDescription.value = String(productReturn.productDescription);
//                 inputValueCost.value = String(productReturn.valueCost);
//                 inputValueSale.value = String(productReturn.valueSale);
//                 //Atualiza as entradas para evitar erro se sobreescrita de texto
//                 Materialize.updateTextFields();
//                 });
//             });

//             deleteButtons.forEach(function(button) {
//                 button.addEventListener('click', function() {
//                 console.log('Clique Delete');
//                 });
//             });
//         })
//     })
//     .catch(error=>{
//         console.error(error);
//     })

//     //Início Jquery
//     $(document).ready(function(){
//         // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
//         $('.modal').modal();
//       });
    
// })
// Model
const model = {
    listProducts: [],
    fetchProducts: function() {
      return fetch('http://localhost:8080/api/product/find')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.log(response);
            throw new Error("Erro ao listar produtos: " + response);
          }
        })
        .then(data => {
          this.listProducts = data;
          return data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    getProductById: function(id) {
      return this.listProducts.find(product => product.idProduct == id);
    },
    fetchEditProduct: function(data){
        return fetch('http://localhost:8080/api/product/save', {
            method: 'PUT',
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
        btnDelete.setAttribute('href', '#modal1');
        btnDelete.textContent = "DELETE";
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
      view.fillPopup(product);
    },
    handleDeleteButtonClick: function(event) {
      console.log('Clique Delete');
    },
    
  };
  
  // Controller
  const controller = {
    init: function() {
      document.addEventListener('DOMContentLoaded', function() {
        model.fetchProducts()
          .then(products => {
            view.renderTable(products);
            //$(document).ready(function() {
              $('.modal').modal();
              const form = document.getElementById("form-product");
              form.addEventListener('submit', function(event){
                event.preventDefault();
                model.fetchEditProduct(controller.getDataForm());
              })
           // });
          });
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
  controller.init();
  


