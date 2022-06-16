let blockElements = {
  imageLink: 'https://tuplatapp.com/wp-content/uploads/2021/11/FaviconTPA-02.png',
  initTime: '3-12 meses',
  valueMax: 2000000,
  valueMin: 300000,
  valueStep: 50000,
  valueInit: 700000,
  timeMax: 12,
  timeMin: 3,
  timeInit: 6,
  titleCommission: 'Desglose de los costos',
  titleRequestedAmount: 'Monto solicitado',
  titleInterestRate: 'Interes',
  interes: 0.10,
  interesForMounth: 0.007974,
  titleSubtotal: 'Subtotal',
  titleAplication: 'Solicitud',
  aplication: 0,
  titleTaxes: 'IVA',
  administrationFeeAndSure: 2500,
  taxes: 0.19,
  titleGMF: 'GMF',
  valueGMF: 0.004,
  titleTotal: 'Total',
  titleContinue: 'Continuar',
  textCondition: '*Estos datos no son reales, hacemos un estudio de credito previo',
  linkContinue: '/register',

  /* Styles to block */
  borderColor: '#ebf2f5',
  socondarColor: '#ddd',
  principalColor:'#0054a4'
}

/* Save The new state for the calculator */
let state = {
  money: blockElements.valueInit,
  time: blockElements.timeInit,
  tax: `${blockElements.administrationFeeAndSure * blockElements.taxes}`,
  gmf: `${blockElements.valueInit * blockElements.valueGMF}`,
  subtotal: 0
}

let elemetDOM = document.getElementById('tu-plata-app')
let allIntupData = []

/* Check format Number */
const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

/* Find a input with name and change value it
 * parameters: id input, the value for change, a number for check if the value must have a symbol
 */
const searchInputAndChangeValue = (idInput, value, outwithSimbol) => {
  let input = allIntupData.find(element => element.id === idInput)
  if (outwithSimbol) {
    input.value = formatNumber(value)
  } else {
    input.value = `$ ${formatNumber(value)}`
  }
} 

const seachIntere = (amount, NMV, month) => {
  let fee = amount * ((NMV * Math.pow((1 + NMV), month)) / (Math.pow((1 + NMV), month) - 1))
  return Math.floor(fee)
}

const changeTotal = () => {
  let value = state.subtotal + state.tax + state.gmf
  searchInputAndChangeValue('total', value)
}

const changeInterestRate = () => {
  let value = (seachIntere(state.money, blockElements.interesForMounth, state.time) * state.time) - state.money
  searchInputAndChangeValue('rate', value)
}

const changeTax = () => {
  let value = state.time * (blockElements.administrationFeeAndSure * blockElements.taxes)
  state.tax = value
  searchInputAndChangeValue('tax', value)
}

const changeGMF = () => {
  let value = state.money * blockElements.valueGMF
  state.gmf = value
  searchInputAndChangeValue('gmf', value)
}

/* change value in input and
 * Change Interes
 * Change Tax
 * Change Total
 */
const changeSubtotal = () => {
  let input = allIntupData.find(element => element.id === 'subtotal')
  let value = seachIntere(state.money, blockElements.interesForMounth, state.time) * state.time
  state.subtotal = value
  input.value = `$ ${formatNumber(value)}`
  //searchInputAndChangeValue('subtotal', value)
  changeInterestRate()
  changeTax()
  changeGMF()
  changeTotal()
}

const changeValueForMonth = (nameInput, month) => {
  let value = seachIntere(state.money, blockElements.interesForMounth, month)
  searchInputAndChangeValue(nameInput, value)
}

const changeInputsShare = () => {
    changeValueForMonth('value-to-paid', state.time)
    changeValueForMonth('paid-first', blockElements.timeMin)
    changeValueForMonth('paid-last', blockElements.timeMax)
}

const changeInputsRequest = () => {
  changeSubtotal() 
  changeInputsShare()
}

const changeToRequest = () => {
  allIntupData = [...elemetDOM.querySelectorAll('input[type="text"]')]
  let inputMoney = document.getElementById('value-modifier-money')
  inputMoney.addEventListener('input', (e) => {  
    state.money =  e.target.value
    searchInputAndChangeValue('value-request', e.target.value)
    searchInputAndChangeValue('value-principal', e.target.value)
    changeSubtotal() 
    changeInputsShare()
  })
}

const changeMonth = () => {
  let inputShare = document.getElementById('value-modifier-share')
  inputShare.addEventListener('input', (e) => { 
    state.time = e.target.value
    searchInputAndChangeValue('month', e.target.value, 1)
    changeValueForMonth('value-to-paid', state.time)
    changeValueForMonth('paid-first', blockElements.timeMin)
    changeValueForMonth('paid-last', blockElements.timeMax)
    changeInputsRequest()
  })
}

const initCalculator = (objectInit) => {
  elemetDOM.innerHTML = `
  <style>
  :root{
    --principal-color: #0054a4;
    --secondary-color: #ddd;
    --border: #ebf2f5;
  }
  #tu-plata-app{
  
  }
  #tu-plata-app .calculator{
    border: solid var(--secondary-color) 3px;
    border-radius: 10px;
  }
  
  #tu-plata-app .calculator__container{
    padding: 0.5rem 0.5rem 0;
  }
  
  #tu-plata-app input[type="text"]{
    border: none;
    padding: 0;
    max-width: 6.75rem;
    background-color: transparent;
    pointer-events: none;
  }
  
  #tu-plata-app p{
    margin: 0;
  }
  
  #tu-plata-app .input__bar{
    margin: 0.5rem 0;
    border: 0;
    border-radius: 500px;
    width: 100%;
    height: 1rem;
    outline: 0;
    background-color: var(--secondary-color);
    -webkit-appearance: none;
    appearance: none;
  }
  
  #tu-plata-app .input__bar::-webkit-slider-runnable-track {
    height: 40px;
    -webkit-appearance: none;
    appearance: none;
  }
  
  #tu-plata-app .input__bar::-webkit-slider-thumb{
    border-radius: 50%;
    width: 30px;
    height: 30px;
    position: relative;
    top: 5px;
    cursor: pointer;
    box-shadow: inset 0px 0px 0px 16px var(--principal-color);
    -webkit-appearance: none;
    appearance: none;
  }
  
  #tu-plata-app .calculator-header{
    padding-top: 1rem;
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  #tu-plata-app .calculator-header .calculator-header__logo{
    width: 30%;
    max-width: 5rem;
    max-height: 9rem;
  }
  
  #tu-plata-app .calculator-header .calculator-header__logo img{
      max-width: 100%;
      max-height: 4rem;
      border: none;
      border-radius: 0;
      -webkit-box-shadow: none;
      box-shadow: none;
  }
  
  #tu-plata-app .calculator-header .calculator-header__data{
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  #tu-plata-app .calculator-header .calculator-header__data > div{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0 0.5rem 0;
    flex-wrap: wrap;
  }
  
  #tu-plata-app .calculator-header .calculator-header__data .header__value{
    border-radius: 1.5em;
    padding: 0.5rem 0.875rem 0.25rem;
    text-align: center;
    font-size: 0.9rem;
    color: white;
    background-color: var(--principal-color);
  }
  
  #tu-plata-app .calculator-header .calculator-header__data .calculator-header__time{
    margin: 0;
    padding: 0 0 0 0.5rem;
    text-align: center;
  }
  
  #tu-plata-app .calculator-header .calculator-header__sentence{
    margin: 0;
    font-size: 0.8rem;
    text-align: center;
  }
  
  #tu-plata-app .calculator-body{
    border-bottom: 1px solid var(--border);
    border-top: 2px solid var(--border);
  }
  
  #tu-plata-app .calculator-body__method{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__features-title{
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__features-title--value{
    padding: 0 0 0 0;
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__features-title--value#value-to-paid{
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__features-title--value#month{
   width: 1.5rem;
   text-align: center !important;
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__input{
    width: 100%;
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__value{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__value--share{
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__value--share span{
    font-size: 0.825rem;
  }
  
  #tu-plata-app .calculator-body .calculator-body__method div.calculator-body__value--share input[type='text']{
    padding-top: 0;
    text-align: center !important;
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__value p,
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__value input[type="text"]{
    padding: 0.5rem 0;
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__value input[type="text"]:last-of-type{
    text-align:right;
  }
  
  #tu-plata-app .calculator-footer{
    padding-bottom: 1rem;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__title{
    padding: 0 0 0.875rem;
    text-align: center;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount{
    display: flex;
    flex-direction: column;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount > ul{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--item{
    display: flex;
    justify-content: space-between;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--title{
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--total{
    display: flex;
    justify-content: center;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--total{
  
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--total p{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__continue{
    display: flex;
    justify-content: center;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__continue a{
    display: block;
    padding: 1rem 0.5rem;
    border-radius: 5px;
    background-color: var(--principal-color);
    width: fit-content;
    color: var(--secondary-color);
    text-decoration: none;
  }
  @media (min-width: 680px) {
    #tu-plata-app .calculator{
      display: grid;
      grid-template-columns: 3fr 8fr;
      grid-template-rows: 1fr 1fr;
    }
  
    #test .calculator-header{
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
  
    #tu-plata-app .calculator-body{
      border: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-left: 2px solid var(--secondary-color);
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
  
    #tu-plata-app .calculator-footer{
      border-top: 1px solid var(--secondary-color);
      grid-column: 1 / 3;
      grid-row: 2 / 3;
    }
  
    #tu-plata-app .calculator-footer .calculator-footer__amount{
      display: grid;
      grid-template-columns: auto auto;
      grid-template-rows: auto auto;
    }
  
    #tu-plata-app .calculator-footer .calculator-footer__amount > ul:first-of-type{
      grid-column: 1/2;
      grid-row: 1/3;
    }
  
    #tu-plata-app .calculator-footer .calculator-footer__amount > ul:last-of-type{
      grid-column: 2/3;
      grid-row: 1/2;
    }
  
    #tu-plata-app .calculator-footer .calculator-footer__amount > div{
      grid-column: 2/3;
      grid-row: 2/3;
    }
  
    #tu-plata-app .calculator-footer .calculator-footer__continue{
      padding: 1rem 0 0;
    }
  }
  @media (min-width: 1024px) {
    #tu-plata-app {
      padding: 0 3rem;
    }
  }
  @media (min-width: 1200px) {
    #tu-plata-app {
      padding: 0;
    }
  }
  </style>
     <div class="calculator">
        <div class="calculator-header calculator__container">
            <div class="calculator-header__logo">
                <img src="${objectInit.imageLink}" alt="">
            </div>
            <div class="calculator-header__data">
                <div>
                    <div class="header__value">
                      <sup>hasta</sup>$ ${formatNumber(objectInit.valueMax)}
                    </div>
                    <p class="calculator-header__time">
                      ${objectInit.initTime}
                    </p>
                </div>
                <p class="calculator-header__sentence">Crédito en cómodas cuotas mensuales</p>
            </div>
        </div>
        
        
        
        <div class="calculator-body calculator__container">
        
        
            <div class="calculator-body__method money">
                <p class="calculator-body__features-title">
                    Monto solicitado
                    <label for="value-request" hidden>Valor que solicita</label>
                    <input type="text" id="value-request" name="value-request" class="calculator-body__features-title--value" id='value-request' value="$ ${formatNumber(objectInit.valueInit)}" readonly>
                </p>
                <div class="calculator-body__input">
                    <label for="value-modificator" hidden>Valor a solicitar</label>
                    <input type="range" class="input__bar" id="value-modifier-money" name="value-modificator" min="${objectInit.valueMin}" max="${objectInit.valueMax}" value="${objectInit.valueInit}" step="${objectInit.valueStep}">
                </div>
                <div class="calculator-body__value">
                    <input type="text" class="calculator-body__value--left" value="$ ${formatNumber(objectInit.valueMin)}">
                    <input type="text" class="calculator-body__value--rigth"  value="$ ${formatNumber(objectInit.valueMax)}">
                </div>
            </div>
            
            
            
            <div class="calculator-body__method share">
                <p class="calculator-body__features-title">
                    Cuota mensual de
                    <label for="value-to-paid" hidden>Valor de cuota</label>
                    <input type="text" id="value-to-paid" name="value-to-paid" class="calculator-body__features-title--value" value="$ ${ formatNumber( seachIntere(objectInit.valueInit, objectInit.interesForMounth, objectInit.timeInit))}" readonly>
                     </br> por
                    <label for="month" hidden>Cantidad de meses</label>
                    <input 
                      type="text" 
                      id="month" 
                      name="month" 
                      class="calculator-body__features-title--value" 
                      value="${formatNumber(objectInit.timeInit)}" 
                      readonly>
                    meses*
                </p>
                <div class="calculator-body__input">
                    <label for="value-modifier-share" hidden>Tiempo de prestamo</label>
                    <input type="range" class="input__bar" id="value-modifier-share" name="value-modifier-share" min="${objectInit.timeMin}" max="${objectInit.timeMax}" value="${objectInit.timeInit}" step="1">
                </div>
                <div class="calculator-body__value calculator-body__value--share">
                    <span>por 3 meses</span>
                    <span>por 12 meses</span>
                    <label for="paid-first" hidden>Cantidad por tres meses</label>
                    <input type="text" id="paid-first" name="paid-first" class="calculator-body__value--rigth" value="$ ${ formatNumber( seachIntere(objectInit.valueInit, objectInit.interesForMounth, objectInit.timeMin))}" readonly>
                    <label for="paid-last" hidden>Cantidad por doce meses</label>
                    <input type="text" id="paid-last" name="paid-last" class="calculator-body__value--left" value="$ ${formatNumber( seachIntere(objectInit.valueInit, objectInit.interesForMounth, objectInit.timeMax))}" readonly>
                </div>
            </div>
        </div>
        
        
        
        
        
        <div class="calculator-footer calculator__container">
            <div class="calculator-footer__title">
                <p class="h4">${objectInit.titleCommission}</p>
            </div>
            <div class="calculator-footer__amount">
                <ul>
                    <li class="calculator-footer__amount--item">
                        <p class="calculator-footer__amount--title">${objectInit.titleRequestedAmount}</p>
                        <label for="value-principal" hidden>Solicitud</label>
                        <input type="text" id="value-principal" name="value-principal" class="calculator-body__features-title--value" id='request' value="$ ${formatNumber(objectInit.valueInit)}" readonly>
                    </li>
                    <li class="calculator-footer__amount--item">
                        <p class="calculator-footer__amount--title">${objectInit.titleInterestRate}</p>
                        <input 
                          type="text" 
                          id="rate" 
                          name="rate" 
                          class="calculator-footer__amount--value rate" 
                          value="$ ${formatNumber((seachIntere(state.money, objectInit.interesForMounth, state.time) * state.time) - state.money)}" 
                          readonly>
                    </li>
                    <li class="calculator-footer__amount--item">
                        <p class="calculator-footer__amount--title">${objectInit.titleSubtotal}</p>
                        <label for="subtotal" hidden>Cantidad por doce meses</label>
                        <input 
                          type="text" 
                          id="subtotal" 
                          name="subtotal" 
                          class="calculator-footer__amount--value subtotal" 
                          data-interes-for-month="${objectInit.interesForMounth}" 
                          value="$ ${formatNumber(seachIntere(state.money, objectInit.interesForMounth, state.time) * state.time)}" 
                          readonly>
                    </li>
                </ul>
                
                
                
                
                <ul>
                    <li class="calculator-footer__amount--item">
                        <p class="calculator-footer__amount--title">${objectInit.titleAplication}</p>
                        <input 
                          type="text" 
                          id="aplication" 
                          name="subtotal" 
                          class="calculator-footer__amount--value" 
                          value="$ ${objectInit.aplication}" 
                          readonly>
                    </li>
                    <li class="calculator-footer__amount--item">
                        <p class="calculator-footer__amount--title">${objectInit.titleTaxes}</p>
                         <label for="tax" hidden>Impuestos</label>
                        <input 
                          type="text" 
                          id="tax"
                          name="tax" 
                          class="calculator-footer__amount--value tax" 
                          data-tax="${objectInit.taxes}" 
                          value="$ ${formatNumber((objectInit.administrationFeeAndSure * objectInit.timeInit) * objectInit.taxes)}" 
                          readonly>
                    </li>
                    <li class="calculator-footer__amount--item">
                        <p class="calculator-footer__amount--title">${objectInit.titleGMF}</p>
                        <label for="gmf" hidden>Impuestos</label>
                        <input 
                          type="text" 
                          id="gmf"
                          name="gmf" 
                          class="calculator-footer__amount--value gmf" 
                          value="$ ${formatNumber(objectInit.valueInit * objectInit.valueGMF)}" 
                          readonly>
                    </li>
                </ul>
                <div class="calculator-footer__amount--total">
                    <p>${objectInit.titleTotal}
                      <label for="total" hidden>Impuestos</label>
                      <input 
                        type="text" 
                        id="total" 
                        name="total" 
                        class="calculator-footer__amount--value total" 
                        data-tax="${objectInit.taxes}" 
                        data-money="${objectInit.valueInit}" 
                        value="$ ${formatNumber((seachIntere(state.money, objectInit.interesForMounth, state.time) * state.time) + ((objectInit.administrationFeeAndSure * objectInit.timeInit) * objectInit.taxes))}" 
                        readonly>
                    </p>
                </div>
            </div>
            
            <div class="calculator-footer__continue">              
              <a href="${objectInit.linkContinue}">
                ${objectInit.titleContinue}
              </a>
            </div>
        </div>
    </div>
    <span style="font-size: 0.8rem;">${objectInit.textCondition}</span>`
  changeToRequest()
  changeMonth(objectInit.valueInit)
}
if(elemetDOM){
  initCalculator(blockElements)
 }
