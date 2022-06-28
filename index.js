let blockElements = {
  imageBackgound: './back.png',
  iconLike: './like.svg',
  iconInfo: './info.svg',
  initTime: '3-12 meses',
  titleHeader: 'Cómodas cuotas que te hacen la vida más fácil',
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
  titleTotal: 'Total a pagar',
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
    --principal-color: #0B56A2;
    --secondary-color: #ddd;
    --border: #ebf2f5;
    --border-color: #113899;
    --background-input: #E8F0F7;
    --text-blue: #0B56A2;
    --text-blue-black: #233956;
    --text-gray: #555656;
    --text-gray-blue: #BCCAE2;
  }
  #tu-plata-app{
  
  }
  #tu-plata-app .calculator{
    border: solid var(--border-color) 4px;
    border-radius: 10px;
    padding: 0 0.6rem 0;
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
    height: 0.72rem;
    outline: 0;
    background-color: var(--background-input);
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
  
  #tu-plata-app .calculator-image{
    display: none;
    background-image: url(${objectInit.imageBackgound});
    background-position: center;
    background-repeat: no-repeat;
    background-size: 110%;
  }
  
  #tu-plata-app .calculator-header{
    padding-top: 1rem;
    padding-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
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
    padding: 0 0 1rem 0;
    flex-wrap: wrap;
  }
  
  #tu-plata-app .calculator-header .calculator-header__data .header__value{
    border-radius: 1.5em;
    padding: 0.5rem 0.875rem 0.25rem;
    text-align: center;
    font-size: 1.4rem;
    color: white;
    background-color: var(--principal-color);
  }
  
  #tu-plata-app .calculator-header .calculator-header__data .header__value span{
    color: var(--text-gray-blue);
  }
  
  #tu-plata-app .calculator-header .calculator-header__data .calculator-header__time{
    margin: 0;
    padding: 0 0 0 1rem;
    font-size: 1.4rem;
    text-align: center;
    color: var(--text-blue);
  }
  
  #tu-plata-app .calculator-header .calculator-header__sentence{
    margin: 0;
    padding: 0 0 0 2rem;
    position: relative;
    font-size: 0.8rem;
    text-align: center;
    color: var(--text-gray);
  }
  
  #tu-plata-app .calculator-header .calculator-header__sentence::before{
    content: '';
    width: 2rem;
    height: 1.9rem;
    position: absolute;
    left: -0.6rem;
    top: 0;
    transform: translate(50%, -5px);
    background-image: url(${objectInit.iconLike});
    background-repeat: no-repeat;
  }
  
  #tu-plata-app .calculator-body{
    border-bottom: 3px solid var(--border);
    border-top: 3px solid var(--border);
    padding: 0 0 1.8rem;
  }
  
  #tu-plata-app .calculator-body__method{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__features-title{
    font-size: 1.6rem; /**/
    color: var(--text-blue-black);
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__features-title--value{
    padding: 0 0 0 0;
    max-width: 10rem; /**/
    font-size: 1.4rem; /**/
    color: var(--text-blue-black);
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__features-title--value#value-to-paid{
    max-width: 6.5rem;/**/
  }
  
  #tu-plata-app .calculator-body .calculator-body__method .calculator-body__features-title--value#month{
   width: 1.75rem; /**/
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
    color: var(--text-blue-black);
  }
  
  #tu-plata-app .calculator-body .calculator-body__method div.calculator-body__value--share input[type='text']{
    padding-top: 0.2rem;
    padding-bottom: 0;
    text-align: center !important;
    color: var(--text-blue-black);
  }
  
  #tu-plata-app .calculator-body .calculator-body__method div.calculator-body__value--money input[type='text']{
    padding-top: 0.2rem;
    padding-bottom: 1rem;
    color: var(--text-blue-black);
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
    font-size: 1.4rem;
    text-align: center;
    color: var(--text-blue);
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount{
    display: flex;
    flex-direction: column;
    color: var(--text-gray);
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount input[type="text"]{
    text-align: end;
    color: var(--text-gray);
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
    padding: 0 0 0 1rem;
    position: relative;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--title::before{
    content: '';
    width: 13px;
    height: 13px;
    position: absolute;
    left: -0.6rem;
    top: 0;
    transform: translate(50%, 1px);
    background-image: url(${objectInit.iconInfo});
    background-repeat: no-repeat;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--total{
    display: flex;
    justify-content: center;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--total{
  
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--total p{
    width: 100%;
    padding: 0 0 0 1rem;
    position: relative;
    display: flex;
    justify-content: space-between;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--total p::before{
    content: '';
    width: 13px;
    height: 13px;
    position: absolute;
    left: -0.6rem;
    top: 0;
    transform: translate(50%, 1px);
    background-image: url(${objectInit.iconInfo});
    background-repeat: no-repeat;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__continue{
    margin: 1rem 0 0;
    display: flex;
    justify-content: center;
  }
  
  #tu-plata-app .calculator-footer .calculator-footer__continue a{
    border-radius: 30px;
    padding: 0.5rem;
    min-width: 50%;
    display: block;
    background-color: var(--principal-color);
    color: #FFF;
    text-decoration: none;
    text-align: center;
    font-size: 1.6rem;
  }
  @media (min-width: 680px) {
    #tu-plata-app .calculator{
      padding: 0 1.6rem 0;
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: auto auto auto;
    }
  
    #tu-plata-app .calculator-header{
      border-bottom: 3px solid var(--border);
      padding-bottom: 4rem;
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
  
    #tu-plata-app .calculator-body{
      border: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }
  
    #tu-plata-app .calculator-footer{
      border-top: 3px solid var(--border);
      grid-column: 1 / 2;
      grid-row: 3 / 4;
    }
  
    #tu-plata-app .calculator-footer .calculator-footer__amount{
      display: grid;
      grid-template-columns: 50% 50%;
      grid-template-rows: auto auto;
    }
  
    #tu-plata-app .calculator-footer .calculator-footer__amount > ul:first-of-type{
      grid-column: 1/2;
      grid-row: 1/3;
      position: relative;
    }
  
    #tu-plata-app .calculator-footer .calculator-footer__amount > ul:first-of-type input[type="text"]{
      padding: 0 2rem 0 0;
    }
    
    #tu-plata-app .calculator-footer .calculator-footer__amount > ul:last-of-type{
      grid-column: 2/3;
      grid-row: 1/2;
      padding: 0 0 0 2rem;
      position: relative;
    }
  
    #tu-plata-app .calculator-footer .calculator-footer__amount > ul:last-of-type::after{
      content: '';
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(-50%, 1px);
      background-color: var(--border);
    }
  
    #tu-plata-app .calculator-footer .calculator-footer__amount .calculator-footer__amount--total{
      padding: 0 0 0 2rem;
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
  
    #tu-plata-app .calculator{
      padding: 0;
      display: grid;
      grid-template-columns: 200px 3fr 8fr;
      grid-template-rows: auto auto auto;
    }
  
    #tu-plata-app .calculator-image{
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      display: block;
      grid-column: 1 / 2;
      grid-row: 1 / 4;
    }
  
    #tu-plata-app .calculator-header{
      grid-column: 2 / 4;
      grid-row: 1 / 2;
      border: none;
    }
  
    #tu-plata-app .calculator-body{
      grid-column: 2 / 4;
      grid-row: 2 / 3;
      flex-direction: row;
      padding: 0 1.6rem 1.8rem;
    }
  
    #tu-plata-app .calculator-body__method.money{
      padding: 0 2.6rem 0 0;
      justify-content: space-between;
    }
  
    #tu-plata-app .calculator-body__method.share{
      border-left: 3px solid var(--background-input);
      padding: 0 0 0 2.6rem;
    }
    
    #tu-plata-app .calculator-footer{
      margin: 0 1.6rem 0;
      border-top: 3px solid var(--border);
      grid-column: 2 / 4;
      grid-row: 3 / 4;
    }
  }
  @media (min-width: 1200px) {
  /*   #tu-plata-app {
      padding: 0;
    } */
  }
  </style>
     <div class="calculator">
        <div class="calculator-image"></div>
        <div class="calculator-header calculator__container">
            <div class="calculator-header__data">
                <div>
                    <div class="header__value">
                      <span>hasta</span> $${formatNumber(objectInit.valueMax)}
                    </div>
                    <p class="calculator-header__time">
                      ${objectInit.initTime}
                    </p>
                </div>
                <p class="calculator-header__sentence"> ${objectInit.titleHeader}</p>
            </div>
        </div>
        
        
        
        <div class="calculator-body calculator__container">
        
        
            <div class="calculator-body__method money">
                <p class="calculator-body__features-title">
                    Monto solicitado
                    <label for="value-request" hidden>Valor que solicita</label>
                    <input type="text" id="value-request" name="value-request" class="calculator-body__features-title--value" id='value-request' value="$ ${formatNumber(objectInit.valueInit)}" readonly>
                </p>
                <div style="width: 100%;">
                  <div class="calculator-body__input">
                      <label for="value-modificator" hidden>Valor a solicitar</label>
                      <input type="range" class="input__bar" id="value-modifier-money" name="value-modificator" min="${objectInit.valueMin}" max="${objectInit.valueMax}" value="${objectInit.valueInit}" step="${objectInit.valueStep}">
                  </div>
                  <div class="calculator-body__value calculator-body__value--money">
                      <input type="text" class="calculator-body__value--left" value="$ ${formatNumber(objectInit.valueMin)}">
                      <input type="text" class="calculator-body__value--rigth"  value="$ ${formatNumber(objectInit.valueMax)}">
                  </div>
                </div>
            </div>
            
            
            
            <div class="calculator-body__method share">
                <p class="calculator-body__features-title">
                    Cuota mensual
                    <label for="value-to-paid" hidden>Valor de cuota</label>
                    <input type="text" id="value-to-paid" name="value-to-paid" class="calculator-body__features-title--value" value="$ ${ formatNumber( seachIntere(objectInit.valueInit, objectInit.interesForMounth, objectInit.timeInit))}" readonly>
                     por
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
                  <label for="paid-first" hidden>Cantidad por tres meses</label>
                  <input type="text" id="paid-first" name="paid-first" class="calculator-body__value--rigth" value="$ ${ formatNumber( seachIntere(objectInit.valueInit, objectInit.interesForMounth, objectInit.timeMin))}" readonly>
                  <label for="paid-last" hidden>Cantidad por doce meses</label>
                  <input type="text" id="paid-last" name="paid-last" class="calculator-body__value--left" value="$ ${formatNumber( seachIntere(objectInit.valueInit, objectInit.interesForMounth, objectInit.timeMax))}" readonly>
                  <span>por 3 meses</span>
                  <span>por 12 meses</span>
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
    <span style="padding: 0 0 0 2rem;font-size: 0.8rem;">${objectInit.textCondition}</span>`
  changeToRequest()
  changeMonth(objectInit.valueInit)
}
if(elemetDOM){
  initCalculator(blockElements)
 }
