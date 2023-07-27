const model = {
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
        selected = products.find(product => product.nameProduct == selected);
        view.fillQuantityAndUnitaryValue(selected);
      },
      minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
    });
  },
  fillQuantityAndUnitaryValue: function(product){
    //$(document).ready(function() {
      $("#input-quantity").val(1);
      $("#unitary-value").val(product.valueCost); 
      Materialize.updateTextFields();     
   // });
  }
}
const controller = {
    init: function() {
        document.addEventListener('DOMContentLoaded', function() {
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
}

controller.init();