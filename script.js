'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


const displayMovements = function (movements, sort = false) {

  containerMovements.innerHTML = '';
  
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements
  
  movs.forEach(function (mov, i) {

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}



const user = 'Steven Thomas Williams'; //username stw


const createUsernames = function(accounts){
  accounts.forEach(function(account){
      account.username = account.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
}

createUsernames(accounts);
console.log(accounts);

const calcDisplaySummary = function(account){
  console.log(account.movements);
  const incomes = account.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}`;

  const interest = account.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * account.interestRate) / 100)
  .filter(int => int >= 1)
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}`;
    
}

const updateUI = function(currentAccount){
  
    displayMovements(currentAccount.movements);

    calcDisplayBalance(currentAccount);

    calcDisplaySummary(currentAccount);

}

let currentAccount;
btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount);
  if(currentAccount?.pin === Number(inputLoginPin.value)){

    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    
    updateUI(currentAccount);

    console.log('LOGIN');
  }
});

const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = acc.balance;
};

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAccount = accounts.find(acc => acc.username === inputTransferTo.value);

  console.log(amount, reciverAccount);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && reciverAccount && currentAccount.balance >= amount && reciverAccount?.username !== currentAccount.username){
    console.log('transfer valid');
    currentAccount.movements.push(-amount);
    reciverAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  

});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';



});

btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username 
    &&  Number(inputClosePin.value) === currentAccount.pin){
      const index = accounts.findIndex(acc => acc.username === currentAccount.username)
      accounts.splice(index, 1);
    }

    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = 0;
});

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault(e)
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', function(){
  const movemenysUI = Array.from(document.querySelectorAll('.movements__value'), 
  el => Number(el.textContent));
  console.log(movemenysUI);
})

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////

const deposits = movements.filter(function(mov){
  return mov > 0;
});
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);

const balance = movements.reduce(function(accumulator, current){
  return accumulator + current;
}, 0);

console.log(balance);

const euroToUSD = 1.1;
const totalDepositUSD = movements.filter(mov => mov > 0).map((mov) => mov * euroToUSD).reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositUSD);


let arr = ['a', 'b', 'c', 'd', 'e'];

//slice does not mutate the originsl arr, it creates new
console.log(arr.slice(2));

//slice from the end - creates ne array
console.log(arr.slice(-2));

//splice - mutates the original array
console.log(arr.splice(2));
arr.splice(-1); //removes the last element

//REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];

const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse()); //mutates the array

//CONCAT

const letters = arr.concat(arr2);
console.log(letters);
//the same using spread
console.log([...arr, ...arr2]);

//JOIN
console.log(letters.join('-'));

const arr3 = [23, 11, 64];
//at() method - allows method chaining
console.log(arr3.at(0));

//last element of the array at() method also works on strings
console.log(arr.at(-1));

//FOREACH LOOP
movements.forEach(function (movement, index, array) {
  console.log(movement);
  console.log(index);
});

//FOREACH MAP
currencies.forEach(function (value, key, map) {
  console.log(key, value);
});
