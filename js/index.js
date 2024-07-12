let details;
let buttons;
const collapseNum = [`One`, `Two`, `Three`, `Four`, `Five`,`Six`, `Seven`, `Eight`, `Nine`, `Ten`];
const search = document.querySelector(`button.search`);
console.log(search);

function getTotal(id) {
    let total = 0;
    numbers = 0
    for(let i = 0 ; i < details.transactions.length; i++) {
        if(details.transactions[i].customer_id == id) {
            total += details.transactions[i].amount;
            numbers++;
        }
    }
    return [total,numbers];
}

function view() {
    let container = ``;
    for(let i = 0 ; i < details.customers.length; i++) {
        container += ` <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${collapseNum[i]}" aria-expanded="true" aria-controls="collapseOne">
              ${details.customers[i].name}
              </button>
            </h2>
            <div id="collapse${collapseNum[i]}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div class="accordion-body row">
                    <div class="col-md-8 ps-3 pt-3">
                        <p class="text-capitalize fs-5 mt-2">id: <span class="font-bold">${details.customers[i].id}</span></p>
                        <p class="text-capitalize fs-5 mt-2">name: <span class="font-bold">${details.customers[i].name}</span></p>
                        <p class="text-capitalize fs-5 mt-2">total of transactions: <span class="font-bold">${getTotal(details.customers[i].id)[0]}</span></p>
                        <p class="text-capitalize fs-5 mt-2">numbers of transactions: <span class="font-bold">${getTotal(details.customers[i].id)[1]}</span></p>
                    </div>
                    <div class="col-md-4 d-flex align-items-center justify-content-center">
                        <button data-id="${details.customers[i].id}" class="view btn btn-outline-primary">
                            <i class="fa-solid mb-4 fa-chart-simple fa-xl block"></i>
                            <p>view transactions graph</p>
                        </button>
                    </div>
                </div>
          </div>
      </div>`
    }
    accordionExample.innerHTML = container;

}

document.body

async function data() {
    const response = await fetch(`js/data.json`);
    const data = await response.json();


    details = data;
    view();
    buttons = document.querySelectorAll(`button.view`);
    for(let i = 0; i < buttons.length;i++) {
        buttons[i].addEventListener(`click`, function() {

            let dataArr = filterData(buttons[i].getAttribute(`data-id`));
            chart(dataArr);
            document.querySelector(`div.graph`).classList.replace(`d-none`, `d-flex`);
        })
    }
    search.addEventListener(`click`, function() {
      const inputValue = document.querySelector(`input[type="search"]`).value;
      document.querySelector(`input[type="search"]`).value = '';

      if(isNaN(inputValue)) {
        for(let i = 0 ; i < details.customers.length;i++) {
          if((details.customers[i].name).toLowerCase() == inputValue.toLowerCase()) {
            let searchFilter = filterData(details.customers[i].id);
            chart(searchFilter);
            document.querySelector(`div.graph`).classList.replace(`d-none`, `d-flex`);
            return;
        }
      }
      }
      else {
        for(let i = 0 ; i < details.transactions.length;i++) {
          if(details.transactions[i].amount == inputValue) {
            let searchFilter = filterData(details.transactions[i].customer_id);
            chart(searchFilter);
            document.querySelector(`div.graph`).classList.replace(`d-none`, `d-flex`);
            return;
        }
      }}
      document.querySelector(`.alert`).classList.remove(`d-none`);
})
}

function filterData(id) {
    let amounts = [];
    let dates = [];
    let addTransaction = `            <div class="col-6">
                <p class="text-center fw-bold">date</p>
            </div>
            <div class="col-6">
                <p class="text-center fw-bold">amount</p>
            </div>`;
    for(let i = 0; i < details.transactions.length; i++) {
        if(details.transactions[i].customer_id == id) {
            addTransaction += ` <div class="col-6">
                <p class="text-center fw-bold">${details.transactions[i].date}</p>
            </div>
             <div class="col-6">
                <p class="text-center fw-bold">${details.transactions[i].amount}</p>
            </div>
            `
            amounts.push(details.transactions[i].amount);
            dates.push(details.transactions[i].date);
    } 
}
for (let i = 0; i < details.customers.length;i++) {
  if(details.customers[i].id == id) {
    document.title = `${details.customers[i].name} graph`;
  }
}
document.documentElement.scrollTop = 0;
document.body.classList.add(`overflow-y-hidden`);
document.querySelector(`.history`).innerHTML = addTransaction;
return [amounts, dates];
};


data();

function chart(doubleArr) {
    console.log(doubleArr);
    const ctx = document.getElementById('myChart');

  myChART = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [...doubleArr[1]],
      datasets: [{
        label: '# of Votes',
        data: [...doubleArr[0]],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  document.querySelector(`i.fa-xmark`).addEventListener(`click`, _ => {
    document.body.classList.remove(`overflow-y-hidden`);
    document.title = `graph system`;
    myChART.destroy();
    document.querySelector(`div.graph`).classList.replace(`d-flex`, `d-none`);
})
  document.querySelector(`div.graph`).addEventListener(`click`, e => {
    document.title = `graph system`;
    myChART.destroy();
    document.querySelector(`div.graph`).classList.replace(`d-flex`, `d-none`);
    document.body.classList.remove(`overflow-y-hidden`);
})
}

document.querySelector(`input[type="search"]`).addEventListener(`focus`, function() {
  document.querySelector(`.alert`).classList?.add(`d-none`);
})
document.querySelector(`div.bg-opacity-100`).addEventListener(`click`, e => e.stopPropagation());