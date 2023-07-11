document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:8080/api/product/find')
    .then(response => {
            //Status 200 Ok
        if(response.ok){
            return response.json();
        }else{
            console.log("Erro ao Buscar dados do usuário")
        }   
    })
    .then(data =>{
        //Demonstrar dados
        console.log(data);
        const table = document.getElementById("table-products");
        data.forEach(element => {
            const line = document.createElement("tr");
            const cellId = document.createElement("td");
            const cellNameProduct= document.createElement("td");
            const cellValueCost= document.createElement("td");
            const cellValueSale= document.createElement("td");
            const cellEdit= document.createElement("td");
            const cellDelete= document.createElement("td");
            const btnEdit= document.createElement("a");
            const btnDelete= document.createElement("a");
            
            btnEdit.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
            btnEdit.setAttribute('id', 'btn-edit');
            btnDelete.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
            btnDelete.setAttribute('id', 'btn-delete');
            btnEdit.setAttribute('href', '#modal1');
            btnDelete.setAttribute('href', '#modal1');
            btnEdit.textContent = "Editar";
            btnDelete.textContent = "Excluir";

            cellId.textContent = element.idProduct;
            cellNameProduct.textContent = element.nameProduct;
            cellValueCost.textContent = element.valueCost;
            cellValueSale.textContent = element.valueSale;
            cellEdit.appendChild(btnEdit);
            cellDelete.appendChild(btnDelete);

   
            line.appendChild(cellId);
            line.appendChild(cellNameProduct);
            line.appendChild(cellValueCost);
            line.appendChild(cellValueSale);
            line.appendChild(cellEdit);
            line.appendChild(cellDelete);
            table.querySelector('tbody').appendChild(line);

            // Adicionar ouvintes de eventos para os botões de edição e exclusão
            const editButtons = document.querySelectorAll('#btn-edit');
            const deleteButtons = document.querySelectorAll('#btn-delete');

            editButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                console.log('Clique Edit');
                });
            });

            deleteButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                console.log('Clique Delete');
                });
            });
        })
    })
    .catch(error=>{
        console.error(error);
    })

    //Início Jquery
    $(document).ready(function(){
        // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
      });
    
})


