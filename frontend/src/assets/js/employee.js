// Model
const model = {
    listEmployees: [],
    fetchEmployees: function() {
      return fetch('http://localhost:8080/api/employee/findall')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erro ao listar produtos. Contate o suporte técnico.");
          }
        })
        .then(data => {
          this.listEmployees = data;
          return data;
        })
        .catch(error => {
          error.then(errorMsg =>{
            Materialize.toast(errorMsg.body, 1000)
          });
        });
    },
    fetchEmployeesByKey: function(key) {
     // console.log(key);
      return fetch('http://localhost:8080/api/employee/find?key='+key)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            //console.log(response.ok);
            throw new Error("Erro ao listar produtos. Contate o suporte técnico.");
          }
        })
        .then(data => {
          this.listProducts = data;
          return data;
        })
        .catch(error => {
            Materialize.toast(error, 1000)
        });
    },
    getProductById: function(id) {
      return this.listEmployees.find(employee => employee.idEmployee == id);
    },
    fetchSaveEmployee: function(data, methodForm){
        //console.log(methodForm);
        return fetch('http://localhost:8080/api/employee/save', {
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
        console.log(id);
      return fetch('http://localhost:8080/api/employee/delete', {
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
           // console.log(errorMsg.body);
            Materialize.toast(errorMsg.body, 1000)
          });
        });
    }
  };
  const service = {
    findAllEmployee: async function(){
      return await model.fetchEmployees();
    } 
  }
  // View
  const view = {
    renderTable: function(employees) {
      const table = document.getElementById("table-employees");
      const tbody = table.querySelector("tbody");
      this.cleanTable(tbody);
      employees.forEach(employee => {
        const line = document.createElement("tr");
        const cellId = document.createElement("td");
        const cellEmployee = document.createElement("td");
        const cellDocument = document.createElement("td");
        const cellInitialDate = document.createElement("td");
        //const cellFinalDate = document.createElement("td");
        const cellEdit = document.createElement("td");
        const cellDelete = document.createElement("td");
        const btnEdit = document.createElement("a");
        const btnDelete = document.createElement("a");
        
        btnEdit.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
        btnEdit.setAttribute('id', 'btn-edit');
        btnEdit.setAttribute('data-id-employee', employee.idEmployee);
        btnEdit.setAttribute('href', '#modal1');
        btnEdit.textContent = "Editar";
        btnEdit.addEventListener('click', this.handleEditButtonClick);
        
        btnDelete.setAttribute('class', 'waves-effect waves-teal btn-flat  btn modal-trigger');
        btnDelete.setAttribute('id', 'btn-delete');
        btnDelete.setAttribute('data-id-employee', employee.idEmployee);
        btnDelete.setAttribute('href', '#modal-delete');
        btnDelete.textContent = "Apagar";
        btnDelete.addEventListener('click', this.handleDeleteButtonClick);
  
        cellId.textContent = employee.idEmployee;
        cellEmployee.textContent = employee.nameEmployee;
        cellDocument.textContent = employee.document;
        cellInitialDate.textContent = employee.initialDate;
        //cellInitialDate.textContent = employee.initialDate;
        cellEdit.appendChild(btnEdit);
        cellDelete.appendChild(btnDelete);
  
        line.appendChild(cellId);
        line.appendChild(cellEmployee);
        line.appendChild(cellDocument);
        line.appendChild(cellInitialDate);
        //line.appendChild(cellFinalDate);
        line.appendChild(cellEdit);
        line.appendChild(cellDelete);
        table.querySelector('tbody').appendChild(line);
      });
    },
    fillPopup: function(employee) {
        //Obtém inputs de dados do modal de edição
        const inputIdEmployee = document.getElementById("id-employee");
        const inputEmployee = document.getElementById("employee");
        const inputDocument = document.getElementById("document");
        const inputInitialDate = document.getElementById("initial-date");
       // const inputFinalDate = document.getElementById("final-date");
       // console.log(employee);
        //Adicionar Valor aos Inputs
        inputIdEmployee.value = String(employee.idEmployee);
        inputEmployee.value = String(employee.nameEmployee);
        inputDocument.value = String(employee.document);
        inputInitialDate.value = String(employee.initialDate);
        //inputFinalDate.value = String(employee.finalDate);
    
        //Atualizar Inputs para evitar texto sobreescrito
        Materialize.updateTextFields();
    },
    handleEditButtonClick: function(event) {
      const idEmployee = event.target.getAttribute("data-id-employee");
      const employee = model.getProductById(idEmployee);
      view.modifyPopup("Editar Funcionário");
      view.fillPopup(employee);
    },
    handleDeleteButtonClick: function(event) {
      const idEmployee = event.target.getAttribute("data-id-employee");
      document.querySelectorAll("#modal-delete-btn-yes").forEach(btn =>{
        btn.addEventListener('click', function(){
          model.fetchDelete({
            "id": idEmployee
          });
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
    findAllController: function(){
      model.fetchEmployees()
          .then(employees => {
           // console.log(products);
            view.renderTable(employees);
              $('.modal').modal();
              const form = document.getElementById("form-employee");
              const btnAddEmployee = document.getElementById("add-employee");
              
              let methodForm = "PUT";
              btnAddEmployee.addEventListener("click", function(){
                form.reset();
                methodForm = "POST";
                view.modifyPopup("Adicionar Produto");
              })

              form.addEventListener('submit', async function(event){
                event.preventDefault();
                console.log(form);
                const productSaved =  await model.fetchSaveEmployee(controller.getDataForm(), methodForm);
                if (productSaved){
                  tools.closeModalAndUpdateGrid();
                  tools.updateGrid();
                }
              })
          });
    },
    findController: function(key){
     // console.log(key);
      model.fetchEmployeesByKey(key)
      .then(products => {
       // console.log(products);
        view.renderTable(products);
      });
    },
    getDataForm: function(){
        //Obtem dados do formulário de produto
        const idEmployee = document.getElementById("id-employee").value;
        const nameEmployee = document.getElementById("employee").value;
        const documentEmployee = document.getElementById("document").value;
        const initialDate = document.getElementById("initial-date").value;
        //const finalDate = document.getElementById("final-date").value;
        return {
            idEmployee: idEmployee,
            nameEmployee: nameEmployee,
            document: documentEmployee,
            initialDate: initialDate
        };
    }
  };

  const tools = {
    closeModalAndUpdateGrid: function (){
      $('#modal1').modal('close');
    },
    updateGrid: function(){
      model.fetchEmployees()
          .then(employees => {
            view.renderTable(employees);
          })
    }
  }
  
// Inicialização do Controller
let headerModal;
controller.init();
export {service};


