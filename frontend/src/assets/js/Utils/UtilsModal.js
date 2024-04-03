
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
}
