const creditSum = document.querySelector('.creditSum')                     /* Сумма кредита */
const creditTerm = document.querySelector('.creditTerm')                   /* Срок кредита */
const creditRate = document.querySelector('.creditRate')                   /* Кредитная ставка */
const typeOfPay = document.querySelector('.typeOfPay')                     /* Тип платежей */
const firstPay = document.querySelector('.firstPay')                       /* Дата первого платежа */
const rangeValues = document.querySelector('.rangeValues')                 /* Блок вывода суммы ежемесячного платежа */
const overpayment = document.querySelector('.overpayment')                 /* Блок вывода для переплаченных процентов */
const mainCont = document.querySelector('.mainContent')                    /* Блок с содержанием таблицы */
const eventKeyup = document.querySelector('.inputParametrs')               /* Блок с полями ввода */


function differentiatedPayment(sum, term, rate, counter, changedSum) {     /* Функция вычисленения по дифферинцированному платежу */
   const outInfo = []
   let mainDebt = (+sum / +term).toFixed(2)                                /* Вычисление основного долга */
   let percents = (+changedSum * +rate / 100 / 12).toFixed(2)              /* Вычисление начисляемых процентов */
   let payment = (+mainDebt + +percents).toFixed(2)                        /* Вычисление суммы платежа */
   let balanceOfDebt = (+changedSum - +mainDebt).toFixed(2)                /* Вычисление остатка задолженности */
   if (balanceOfDebt > 0 && balanceOfDebt < 1) {
      mainDebt = +mainDebt + +balanceOfDebt
      balanceOfDebt = 0
   }
   outInfo.push(counter, payment, mainDebt, percents, balanceOfDebt)       /* возвращаемый массив [счетчик, сумма платежа, сумма основного долго, начисленные проценты, остаток задолженности] */

   return outInfo
}


function annuityPayment(summ, term, rate, counter, changedSum) {           /* Функция вычисленения по аннуитентному платежу */
   const outInfo2 = [];
   let payment = (+summ * ((+rate / 100 / 12) + (+rate / 100 / 12) / (((1 + (+rate / 100 / 12)) ** +term) - 1))).toFixed(2) /* Вычисление суммы платежа */
   let percents = (+changedSum * (+rate / 100 / 12)).toFixed(2)            /* Вычисление начисляемых процентов */
   let mainDebt = (payment - percents).toFixed(2)                          /* Вычисление основного долга */
   let balanceOfDebt = (+changedSum - mainDebt).toFixed(2)                 /* Вычисление остатка задолженности */
   if (balanceOfDebt < 0) balanceOfDebt = 0;
   outInfo2.push(counter, payment, mainDebt, percents, balanceOfDebt)      /* Возвращаемый массив [счетчик, сумма платежа, сумма основного долго, начисленные проценты, остаток задолженности] */

   return outInfo2
}
   
function eventHandler() {
   mainCont.innerHTML = ' '
   rangeValues.innerHTML = ' '
   overpayment.innerHTML = ' '
   let counter = 1                                                         /* Счетчик № платежа*/
   let dataHolder = 0                                                      /* Переменная для хранения возвращаемого массива*/
   let countPercents = 0                                                   /* Счетчик процентов */
   let sumListener = creditSum.value                                       /* Передаваемый остаток задолженности */
   let diapason = []                                                       /* Массив для получения диапазона значений ежемесячного платежа */
   let dateOfPay = (firstPay.value).split('-')                             /* Получение массива с данными текущей даты*/
   let currentMonth = +dateOfPay[1] - 1
   const startYear = +dateOfPay[0]
   dateOfPay = new Date(startYear, dateOfPay[1], dateOfPay[2])
   let options = {
      year: 'numeric',
      month: 'long'
   }
  
   if (creditSum.value > 0 && creditTerm.value > 0 && creditRate.value > 0 && firstPay.value != '') {    /* Условие проверки на пустоту ячеек */
      for (let i = 0; i < +creditTerm.value; i++) {

         if (typeOfPay.value == 'Аннуитентный') {                                /* Проверка вида платежа */
            dataHolder = annuityPayment(creditSum.value, creditTerm.value, creditRate.value, counter, sumListener)
         } else {
            dataHolder = differentiatedPayment(creditSum.value, creditTerm.value, creditRate.value, counter, sumListener)
            if ((i == 0) || (i == (+creditTerm.value) - 1)) diapason.push(dataHolder[1])

         }
         dateOfPay.setMonth(currentMonth % 12)                                               /* Изменение значения месяца*/
         dateOfPay.setYear(startYear + (currentMonth - (currentMonth % 12)) / 12)            /* Изменение значения года*/
         currentMonth++

         mainCont.innerHTML += `<div class="outputLine">                                           
            <div>${dataHolder[0]}</div>
            <div>${dateOfPay.toLocaleString("ru", options)}</div>
            <div>${dataHolder[1]}</div>
            <div>${dataHolder[2]}</div>
            <div>${dataHolder[3]}</div>                              
            <div>${dataHolder[4]}</div>
         </div>`

         counter++;
         sumListener = dataHolder[4]                                                          /* Изменение переменной с остатком задолженности */
         countPercents += +dataHolder[3]                                                      /* Счетчик переплаты по процентам */

         if (dataHolder[1] == undefined || isNaN(dataHolder[1])) {                            /* Проверка на undefined и NaN суммы платежа */ 
            rangeValues.innerHTML = 0
         } if (diapason.length == 0) {
            rangeValues.innerHTML = dataHolder[1]
         } else rangeValues.innerHTML = `${diapason.join('...')}`
         overpayment.innerHTML = countPercents.toFixed(2)
      }


   }


}


eventKeyup.addEventListener('keyup', eventHandler)
typeOfPay.addEventListener('input', eventHandler)
firstPay.addEventListener('input', eventHandler)
