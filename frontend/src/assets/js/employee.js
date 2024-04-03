//import { controller as controllerLogin} from './login.js';
import UtilsStorage from './Utils/UtilsStorage.js';
import {handleRoute} from '../../../routes.js';

const model = {
    listEmployees: [],
    fetchEmployees: async function() {
      const response = await fetch('http://localhost:8080/api/employee/findall');
      if(response.ok){
        const data = await response.json();
        this.listEmployees = data;
        return data;
      } else {
        throw new Error("Erro ao listar listar funcionários");
      } 
    },
    fetchEmployeesByKey: async function(key) {
     const response = await fetch('http://localhost:8080/api/employee/find?key='+key)
     if(response.ok){
        const data = await response.json();
        this.listEmployees = data;
        return data;
      } else {
        throw new Error("Erro ao listar produtos. Contate o suporte técnico.");
      }    
    },
    getProductById: function(id) {
      return this.listEmployees.find(employee => employee.idEmployee == id);
    },
    fetchSaveEmployee: async function(data, methodForm){
        const response = await fetch('http://localhost:8080/api/employee/save', {
            method: methodForm,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  
        })
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error("Erro ao salvar produto. Contate o suporte técnico.");
        }
    },
    fetchDelete: async function(id){
      const response = await fetch('http://localhost:8080/api/employee/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)  
        });
        if (response.ok) {
          return response;
        } else {
          throw await response.json();
        }
    }
  };
  const service = {
    findAllEmployee: async function(){
      
    }
  };
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
        const cellEdit = document.createElement("td");
        const cellDelete = document.createElement("td");
        const btnEdit = document.createElement("a");
        const btnDelete = document.createElement("a");
        
        const iconEdit = document.createElement("i");
        iconEdit.classList.add("material-icons");
        iconEdit.textContent = "edit"
        iconEdit.setAttribute('data-id-employee', employee.idEmployee);


        btnEdit.setAttribute('class', 'btn modal-trigger');
        btnEdit.setAttribute('id', 'btn-edit');
        btnEdit.setAttribute('data-id-employee', employee.idEmployee);
        btnEdit.setAttribute('href', '#modal1');
        btnEdit.addEventListener('click', this.handleEditButtonClick);
        btnEdit.appendChild(iconEdit);
        
        const iconDelete = document.createElement("i");
        iconDelete.classList.add("material-icons");
        iconDelete.textContent = "delete"
        iconDelete.setAttribute('data-id-employee', employee.idEmployee);

        btnDelete.setAttribute('class', 'btn modal-trigger');
        btnDelete.setAttribute('id', 'btn-delete');
        btnDelete.setAttribute('data-id-employee', employee.idEmployee);
        btnDelete.setAttribute('href', '#modal-delete');
        btnDelete.addEventListener('click', this.handleDeleteButtonClick);
        btnDelete.appendChild(iconDelete);
  
        cellId.textContent = employee.idEmployee;
        cellEmployee.textContent = employee.nameEmployee;
        cellDocument.textContent = employee.document;
        cellInitialDate.textContent = employee.initialDate;
        cellEdit.appendChild(btnEdit);
        cellDelete.appendChild(btnDelete);
  
        line.appendChild(cellId);
        line.appendChild(cellEmployee);
        line.appendChild(cellDocument);
        line.appendChild(cellInitialDate);
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

        //Adicionar Valor aos Inputs
        inputIdEmployee.value = String(employee.idEmployee);
        inputEmployee.value = String(employee.nameEmployee);
        inputDocument.value = String(employee.document);
        const partes = String(employee.initialDate).split('/');
        const dia = partes[0];
        const mes = partes[1] - 1; // (janeiro é 0)
        const ano = partes[2];

        const data = new Date(dia, mes, ano);
        inputInitialDate.value = employee.initialDate;//(data.getFullYear()+"-"+data.getMonth()+"-"+data.getDate());
    
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
        btn.addEventListener('click', async function(){
          try{
            const response = await model.fetchDelete({
              "id": idEmployee
            });
            if(response.ok){
              tools.updateGrid();
            }
          }catch(error){
            Materialize.toast(error, 1000)
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
          let employees;
          try{
            employees = await model.fetchEmployees();
          }catch(error){
            Materialize.toast(error, 1000);
          }
          view.renderTable(employees);
          $('.modal').modal();
          const form = document.getElementById("form-employee");
          const btnAddEmployee = document.getElementById("add-employee");
          
          let methodForm = "PUT";
          btnAddEmployee.addEventListener("click", function(){
            form.reset();
            methodForm = "POST";
            view.modifyPopup("Adicionar Funcionário");
          })

          form.addEventListener('submit', async function(event){
            event.preventDefault();
            try{
              const employeeSaved =  await model.fetchSaveEmployee(controller.getDataForm(), methodForm);
              if (employeeSaved){
                tools.closeModalAndUpdateGrid();
                tools.updateGrid();
              }
            }catch(error){
                Materialize.toast(error, 1000);
            }
          });
    },
    findController: async function(key){
      try{
        const employees = await model.fetchEmployeesByKey(key);
        view.renderTable(employees);
      }catch(error){
        Materialize.toast(error, 1000);
      }
    },
    getDataForm: function(){
        //Obtem dados do formulário de produto
        const idEmployee = document.getElementById("id-employee").value;
        const nameEmployee = document.getElementById("employee").value;
        const documentEmployee = document.getElementById("document").value;
        const initialDate = document.getElementById("initial-date").value;
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
  };
// Inicialização do Controller
let headerModal;
controller.init();
export { service };


