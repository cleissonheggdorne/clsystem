
export default class ModalCustom{
    static initComponent(){
      $('.modal').modal({
        dismissible: false
      });
    }
    static modalCustom(title, content){
        this.initComponent();
        const modal = document.getElementById("modal-custom");
        const modalContent = modal.querySelector(".modal-content");
        modalContent.innerHTML = "";
        const h4Title = document.createElement('h4');
        const paragraph = document.createElement('p');
        h4Title.textContent = title;
        paragraph.textContent = content;
        modalContent.appendChild(h4Title);
        modalContent.appendChild(paragraph);
        return {"modal":modal, "modalContent":modalContent, "h4title":h4Title, "paragraph":paragraph};
    }
    static createButtonWithAction(title){
      const btnActionModalCustom = document.createElement("a");
      btnActionModalCustom.setAttribute("href", "#!");
      btnActionModalCustom.setAttribute("class", "waves-effect waves-green btn");
      btnActionModalCustom.setAttribute("id", "btn-action-modal-custom");
      btnActionModalCustom.textContent = title;
      
      return btnActionModalCustom;
    }
    static createInputNumber(labeltext){
      const divInputFild = document.createElement("div");
      divInputFild.setAttribute("class", "input-field col s6");
      const input  = document.createElement('input')
      input.setAttribute("type", "number");;
      input.setAttribute("min", "0");
      input.setAttribute("class", "validate");
      input.setAttribute("id", "input-value-initial")
      const label = document.createElement('label');
      label.setAttribute("class", "active");
      label.setAttribute("for", "input-value-initial");
      label.textContent = labeltext;
      return {"div": divInputFild, 
              "input": input,
              "label": label
              };
    }
    static addComponentsMoldalCustom(){
      const divInputLabel = this.createInputNumber("Valor de Entrada");//this.createInputNumber();
  
      //Alteração de botão padrão do modal custom
      const btnOkModalCustom = document.getElementById("btn-modal-custom")
      btnOkModalCustom.textContent = "Cancelar";
      const footerModalCustom = btnOkModalCustom.parentElement;
      //Adição de botão de ação
      if(!document.getElementById("btn-action-modal-custom")){
        const btnActionModalCustom = this.createButtonWithAction("Confirmar");//this.createButtonWithAction();
        footerModalCustom.appendChild(btnActionModalCustom);
      }
      divInputLabel.div.appendChild(divInputLabel.input);
      divInputLabel.div.appendChild(divInputLabel.label);
      return divInputLabel.div;
    } 
    static addButonActionInModalCustom(){
      //Alteração de botão padrão do modal custom
      const btnOkModalCustom = document.getElementById("btn-modal-custom")
      btnOkModalCustom.textContent = "Cancelar";
      const footerModalCustom = btnOkModalCustom.parentElement;
      //Adição de botão de ação
      if(!document.getElementById("btn-action-modal-custom")){
        const btnActionModalCustom = this.createButtonWithAction("Confirmar");//this.createButtonWithAction();
        footerModalCustom.appendChild(btnActionModalCustom);
      }
      const btnModalCustom = document.getElementById("btn-modal-custom");
      //UtilsModal.initComponent();
      btnModalCustom.addEventListener("click", function(){
        $('.modal').modal('close');
      });
    }

    
}
