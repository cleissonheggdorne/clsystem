const model = {
    fetchOpenCashier: function(idCashier, initialValue) {
        return fetch('http://localhost:8080/api/cashier/open', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            initialValue: initialValue,
            idCashier: idCashier
          })  
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Erro ao abir caixa. Contate o suporte técnico.");
            }
          })
          .then(data => {
            return data;
          })
          .catch(error => {
              Materialize.toast(error, 1000)
          });
      },
      fetchCloseCashier: function(idCashier) {
        return fetch('http://localhost:8080/api/cashier/close', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idCashier: idCashier
          })  
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Erro ao fechar caixa. Contate o suporte técnico.");
            }
          })
          .then(data => {
            return data;
          })
          .catch(error => {
              Materialize.toast(error, 1000)
          });
      },
      fetchFindOpenCashier: function(idEmployee) {
        return fetch('http://localhost:8080/api/cashier/find-open?id='+idEmployee)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Erro ao fechar caixa. Contate o suporte técnico.");
            }
          })
        //   .then(data => {
        //     return data;
        //   })
          .catch(error => {
              Materialize.toast(error, 1000)
          });
      }
}

const controller= {
    init: function(){

    },
    verifyCashierOpen: async function(idEmployee){
        const cashier = await model.fetchFindOpenCashier(idEmployee);
        return cashier;
       
    }
}

export { controller };