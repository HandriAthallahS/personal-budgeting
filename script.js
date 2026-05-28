const STORAGE_KEY = "personal-budgeting-data";

const budgetMethods = {
  rule503020: {
    name: "50/30/20 Rule",
    description:
      "A simple rule that divides income into needs, wants, and savings.",
    categories: [
      { name: "Needs", percentage: 50 },
      { name: "Wants", percentage: 30 },
      { name: "Savings", percentage: 20 },
    ],
  },
  payYourselfFirst: {
    name: "Pay Yourself First",
    description: "A method that prioritizes savings before everyday spending.",
    categories: [
      { name: "Savings First", percentage: 20 },
      { name: "Needs", percentage: 60 },
      { name: "Wants", percentage: 20 },
    ],
  },
  envelopeBudgeting: {
    name: "Envelope Budgeting",
    description:
      "A method that divides money into spending envelopes or categories.",
    categories: [
      { name: "Food", percentage: 35 },
      { name: "Transportation", percentage: 10 },
      { name: "Internet", percentage: 5 },
      { name: "College / Work", percentage: 10 },
      { name: "Entertainment", percentage: 10 },
      { name: "Shopping", percentage: 5 },
      { name: "Health", percentage: 5 },
      { name: "Savings", percentage: 10 },
      { name: "Other", percentage: 10 },
    ],
  },
  zeroBasedBudgeting: {
    name: "Zero-Based Budgeting",
    description:
      "A method where every part of income gets a job. This app uses simple default percentages.",
    categories: [
      { name: "Food", percentage: 30 },
      { name: "Transportation", percentage: 10 },
      { name: "Internet", percentage: 5 },
      { name: "College / Work", percentage: 10 },
      { name: "Entertainment", percentage: 5 },
      { name: "Shopping", percentage: 5 },
      { name: "Health", percentage: 5 },
      { name: "Savings", percentage: 20 },
      { name: "Other", percentage: 10 },
    ],
  },
};

const expenseTypes = [
  {
    name: "Food & Drink",
    rule503020: "Needs",
    payYourselfFirst: "Needs",
    envelopeBudgeting: "Food",
    zeroBasedBudgeting: "Food",
  },
  {
    name: "Snacks / Coffee",
    rule503020: "Wants",
    payYourselfFirst: "Wants",
    envelopeBudgeting: "Food",
    zeroBasedBudgeting: "Food",
  },
  {
    name: "Transportation",
    rule503020: "Needs",
    payYourselfFirst: "Needs",
    envelopeBudgeting: "Transportation",
    zeroBasedBudgeting: "Transportation",
  },
  {
    name: "Internet / Phone",
    rule503020: "Needs",
    payYourselfFirst: "Needs",
    envelopeBudgeting: "Internet",
    zeroBasedBudgeting: "Internet",
  },
  {
    name: "College / Work",
    rule503020: "Needs",
    payYourselfFirst: "Needs",
    envelopeBudgeting: "College / Work",
    zeroBasedBudgeting: "College / Work",
  },
  {
    name: "Health",
    rule503020: "Needs",
    payYourselfFirst: "Needs",
    envelopeBudgeting: "Health",
    zeroBasedBudgeting: "Health",
  },
  {
    name: "Entertainment",
    rule503020: "Wants",
    payYourselfFirst: "Wants",
    envelopeBudgeting: "Entertainment",
    zeroBasedBudgeting: "Entertainment",
  },
  {
    name: "Fashion",
    rule503020: "Wants",
    payYourselfFirst: "Wants",
    envelopeBudgeting: "Shopping",
    zeroBasedBudgeting: "Shopping",
  },
  {
    name: "Shopping",
    rule503020: "Wants",
    payYourselfFirst: "Wants",
    envelopeBudgeting: "Shopping",
    zeroBasedBudgeting: "Shopping",
  },
  {
    name: "Gift / Social",
    rule503020: "Wants",
    payYourselfFirst: "Wants",
    envelopeBudgeting: "Other",
    zeroBasedBudgeting: "Other",
  },
  {
    name: "Savings Deposit",
    rule503020: "Savings",
    payYourselfFirst: "Savings First",
    envelopeBudgeting: "Savings",
    zeroBasedBudgeting: "Savings",
  },
  {
    name: "Other",
    rule503020: "Wants",
    payYourselfFirst: "Wants",
    envelopeBudgeting: "Other",
    zeroBasedBudgeting: "Other",
  },
];

let appData = loadData();
checkNewMonth();

let viewedMonth = appData.activeMonth;

const setupBudgetButton = document.getElementById("setupBudgetButton");
const setupModal = document.getElementById("setupModal");
const closeSetupButton = document.getElementById("closeSetupButton");
const cancelSetupButton = document.getElementById("cancelSetupButton");
const setupForm = document.getElementById("setupForm");
const monthlyIncomeInput = document.getElementById("monthlyIncome");
const budgetMethodSelect = document.getElementById("budgetMethod");
const viewedMonthTitle = document.getElementById("viewedMonthTitle");
const incomeText = document.getElementById("incomeText");
const expenseText = document.getElementById("expenseText");
const remainingText = document.getElementById("remainingText");
const remainingDaysText = document.getElementById("remainingDaysText");
const safeDailyText = document.getElementById("safeDailyText");
const budgetStatusCard = document.getElementById("budgetStatusCard");
const statusText = document.getElementById("statusText");
const statusMessage = document.getElementById("statusMessage");
const methodTitle = document.getElementById("methodTitle");
const methodDescription = document.getElementById("methodDescription");
const recommendationBody = document.getElementById("recommendationBody");
const expenseForm = document.getElementById("expenseForm");
const expenseCategorySelect = document.getElementById("expenseCategory");
const mappedCategoryText = document.getElementById("mappedCategoryText");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseDateInput = document.getElementById("expenseDate");
const expenseNoteInput = document.getElementById("expenseNote");
const transactionList = document.getElementById("transactionList");

setupForm.addEventListener("submit", saveSetup);
expenseForm.addEventListener("submit", addExpense);
expenseCategorySelect.addEventListener("change", updateMappedCategory);
setupBudgetButton.addEventListener("click", openSetupModal);
closeSetupButton.addEventListener("click", closeSetupModal);
cancelSetupButton.addEventListener("click", closeSetupModal);

renderApp();

function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (savedData) {
    return JSON.parse(savedData);
  }

  const currentMonth = getCurrentMonthKey();
  const newData = {
    activeMonth: currentMonth,
    months: {},
  };

  newData.months[currentMonth] = createEmptyMonth();

  return newData;
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function createEmptyMonth() {
  return {
    monthlyIncome: 0,
    selectedMethod: "rule503020",
    transactions: [],
  };
}

function checkNewMonth() {
  const currentMonth = getCurrentMonthKey();

  if (appData.activeMonth !== currentMonth) {
    if (!appData.months[currentMonth]) {
      appData.months[currentMonth] = createEmptyMonth();
    }

    appData.activeMonth = currentMonth;
    saveData();
  }
}

function getCurrentMonthKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return year + "-" + month;
}

function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + date;
}

function renderApp() {
  viewedMonth = appData.activeMonth;
  renderSetup();
  renderDashboard();
  renderRecommendations();
  renderExpenseForm();
  renderTransactions();
}

function renderSetup() {
  const monthData = appData.months[appData.activeMonth];

  monthlyIncomeInput.value = monthData.monthlyIncome;
  budgetMethodSelect.value = monthData.selectedMethod;
}

function renderDashboard() {
  const monthData = appData.months[viewedMonth];
  const totalExpenses = calculateTotalExpenses(monthData.transactions);
  const remainingBalance = monthData.monthlyIncome - totalExpenses;
  const remainingDays = calculateRemainingDays(viewedMonth);
  const daysInMonth = getDaysInMonth(viewedMonth);
  const safeDailyLimit = calculateSafeDailyLimit(
    monthData.monthlyIncome,
    daysInMonth,
  );
  const status = getBudgetStatus(monthData, safeDailyLimit);
  const statusClass = getStatusClass(status);

  viewedMonthTitle.textContent = formatMonthName(viewedMonth);
  incomeText.textContent = formatRupiah(monthData.monthlyIncome);
  expenseText.textContent = formatRupiah(totalExpenses);
  remainingText.textContent = formatRupiah(remainingBalance);
  remainingDaysText.textContent = remainingDays;
  safeDailyText.textContent = formatRupiah(safeDailyLimit) + "/day";
  statusText.textContent = status;
  statusMessage.textContent = getStatusMessage(status);

  budgetStatusCard.className = "status-card " + statusClass;
}

function renderRecommendations() {
  const monthData = appData.months[viewedMonth];
  const method = budgetMethods[monthData.selectedMethod];
  const daysInMonth = getDaysInMonth(viewedMonth);

  methodTitle.textContent = method.name;
  methodDescription.textContent = method.description;
  recommendationBody.innerHTML = "";

  for (let i = 0; i < method.categories.length; i++) {
    const category = method.categories[i];
    const monthlySuggestion =
      (monthData.monthlyIncome * category.percentage) / 100;
    const dailySuggestion = monthlySuggestion / daysInMonth;
    const spent = calculateCategoryExpenses(
      monthData.transactions,
      category.name,
      monthData.selectedMethod,
    );
    const spentClass = getSpentClass(spent, monthlySuggestion);
    const row = document.createElement("tr");

    row.innerHTML =
      "<td><strong>" +
      category.name +
      "</strong></td>" +
      "<td>" +
      category.percentage +
      "%</td>" +
      "<td>" +
      formatRupiah(monthlySuggestion) +
      "/month</td>" +
      "<td>" +
      formatRupiah(dailySuggestion) +
      "/day</td>" +
      '<td class="' +
      spentClass +
      '">' +
      formatRupiah(spent) +
      " used</td>";

    recommendationBody.appendChild(row);
  }
}

function renderExpenseForm() {
  const monthData = appData.months[viewedMonth];
  const isActiveMonth = viewedMonth === appData.activeMonth;

  expenseCategorySelect.innerHTML = "";

  for (let i = 0; i < expenseTypes.length; i++) {
    const option = document.createElement("option");
    option.value = expenseTypes[i].name;
    option.textContent = expenseTypes[i].name;
    expenseCategorySelect.appendChild(option);
  }

  expenseDateInput.value = getTodayDateKey();
  updateMappedCategory();

  expenseCategorySelect.disabled = !isActiveMonth;
  expenseAmountInput.disabled = !isActiveMonth;
  expenseDateInput.disabled = !isActiveMonth;
  expenseNoteInput.disabled = !isActiveMonth;
  expenseForm.querySelector("button").disabled = !isActiveMonth;
}

function renderTransactions() {
  const monthData = appData.months[viewedMonth];

  transactionList.innerHTML = "";

  if (monthData.transactions.length === 0) {
    transactionList.innerHTML =
      '<p class="empty-state">No expenses recorded for this month.</p>';
    return;
  }

  for (let i = 0; i < monthData.transactions.length; i++) {
    const transaction = monthData.transactions[i];
    const expenseType = transaction.expenseType || transaction.category;
    let budgetGroup = transaction.category;

    if (transaction.expenseType) {
      budgetGroup = getbudgetGroupForExpenseType(
        transaction.expenseType,
        monthData.selectedMethod,
      );
    }

    const item = document.createElement("article");
    item.className = "transaction-item";

    let noteHtml = "";

    if (transaction.note !== "") {
      noteHtml = "<span>Note: " + transaction.note + "</span>";
    }

    item.innerHTML =
      "<div><strong>" +
      expenseType +
      "</strong><span>Group: " +
      budgetGroup +
      "</span>" +
      noteHtml +
      "</div>" +
      "<div><strong>" +
      formatRupiah(transaction.amount) +
      "</strong><span>Amount</span></div>" +
      "<div><strong>" +
      transaction.date +
      "</strong><span>Date</span></div>" +
      '<div><button class="delete-button" data-id="' +
      transaction.id +
      '">Delete</button></div>';

    transactionList.appendChild(item);
  }

  addDeleteButtonEvents();
}

function addDeleteButtonEvents() {
  const buttons = document.querySelectorAll(".delete-button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", deleteExpense);
  }
}

function openSetupModal() {
  renderSetup();
  setupModal.classList.add("show");
}

function closeSetupModal() {
  setupModal.classList.remove("show");
  renderSetup();
}

function saveSetup(event) {
  event.preventDefault();

  const monthData = appData.months[appData.activeMonth];
  const incomeValue = Number(monthlyIncomeInput.value);

  if (incomeValue < 0) {
    alert("Monthly income cannot be negative.");
    return;
  }

  monthData.monthlyIncome = incomeValue;
  monthData.selectedMethod = budgetMethodSelect.value;
  viewedMonth = appData.activeMonth;

  saveData();
  renderApp();
  closeSetupModal();
}

function addExpense(event) {
  event.preventDefault();

  const monthData = appData.months[appData.activeMonth];
  const amount = Number(expenseAmountInput.value);

  if (amount <= 0) {
    alert("Expense amount must be more than 0.");
    return;
  }

  if (!expenseDateInput.value) {
    alert("Please choose a date.");
    return;
  }

  const expenseType = expenseCategorySelect.value;
  const budgetGroup = getbudgetGroupForExpenseType(
    expenseType,
    monthData.selectedMethod,
  );

  const transaction = {
    id: "trx_" + Date.now(),
    expenseType: expenseType,
    category: budgetGroup,
    amount: amount,
    date: expenseDateInput.value,
    note: expenseNoteInput.value.trim(),
  };

  monthData.transactions.push(transaction);
  expenseAmountInput.value = "";
  expenseNoteInput.value = "";

  saveData();
  renderApp();
}

function deleteExpense(event) {
  const transactionId = event.target.getAttribute("data-id");
  const monthData = appData.months[appData.activeMonth];
  const newTransactions = [];

  for (let i = 0; i < monthData.transactions.length; i++) {
    if (monthData.transactions[i].id !== transactionId) {
      newTransactions.push(monthData.transactions[i]);
    }
  }

  monthData.transactions = newTransactions;

  saveData();
  renderApp();
}

function updateMappedCategory() {
  const monthData = appData.months[viewedMonth];
  const expenseType = expenseCategorySelect.value;
  const budgetGroup = getbudgetGroupForExpenseType(
    expenseType,
    monthData.selectedMethod,
  );

  mappedCategoryText.textContent = "Group: " + budgetGroup;
}

function calculateTotalExpenses(transactions) {
  let total = 0;

  for (let i = 0; i < transactions.length; i++) {
    total += transactions[i].amount;
  }

  return total;
}

function calculateTodaySpending(transactions) {
  const today = getTodayDateKey();
  let total = 0;

  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].date === today) {
      total += transactions[i].amount;
    }
  }

  return total;
}

function checkOverDailyMethodBudget(monthData) {
  const method = budgetMethods[monthData.selectedMethod];
  const daysInMonth = getDaysInMonth(viewedMonth);
  const today = getTodayDateKey();

  for (let i = 0; i < method.categories.length; i++) {
    const category = method.categories[i];

    if (category.name === "Savings" || category.name === "Savings First") {
      continue;
    }

    const dailyBudget =
      (monthData.monthlyIncome * category.percentage) / 100 / daysInMonth;
    let todayCategorySpending = 0;

    for (let j = 0; j < monthData.transactions.length; j++) {
      const transaction = monthData.transactions[j];

      if (transaction.date === today) {
        let transactionCategory = transaction.category;

        if (transaction.expenseType) {
          transactionCategory = getbudgetGroupForExpenseType(
            transaction.expenseType,
            monthData.selectedMethod,
          );
        }

        if (transactionCategory === category.name) {
          todayCategorySpending += transaction.amount;
        }
      }
    }

    if (todayCategorySpending > dailyBudget) {
      return true;
    }
  }

  return false;
}

function calculateCategoryExpenses(transactions, categoryName, methodKey) {
  let total = 0;

  for (let i = 0; i < transactions.length; i++) {
    let transactionCategory = transactions[i].category;

    if (transactions[i].expenseType) {
      transactionCategory = getbudgetGroupForExpenseType(
        transactions[i].expenseType,
        methodKey,
      );
    }

    if (transactionCategory === categoryName) {
      total += transactions[i].amount;
    }
  }

  return total;
}

function getbudgetGroupForExpenseType(expenseTypeName, methodKey) {
  for (let i = 0; i < expenseTypes.length; i++) {
    if (expenseTypes[i].name === expenseTypeName) {
      return expenseTypes[i][methodKey];
    }
  }

  return "Other";
}

function calculateRemainingDays(monthKey) {
  const currentMonth = getCurrentMonthKey();
  const daysInMonth = getDaysInMonth(monthKey);

  if (monthKey !== currentMonth) {
    return daysInMonth;
  }

  const today = new Date();
  const todayDate = today.getDate();

  return daysInMonth - todayDate + 1;
}

function calculateSafeDailyLimit(monthlyIncome, remainingDays) {
  if (remainingDays <= 0) {
    return 0;
  }

  return monthlyIncome / remainingDays;
}

function getBudgetStatus(monthData, safeDailyLimit) {
  const todaySpending = calculateTodaySpending(monthData.transactions);
  const hasOverDailyMethodBudget = checkOverDailyMethodBudget(monthData);

  if (todaySpending > safeDailyLimit) {
    return "Danger";
  }

  if (hasOverDailyMethodBudget) {
    return "Warning";
  }

  return "Safe";
}

function getStatusClass(status) {
  if (status === "Safe") {
    return "status-aman";
  } else if (status === "Warning") {
    return "status-waspada";
  } else {
    return "status-bahaya";
  }
}

function getStatusMessage(status) {
  if (status === "Safe") {
    return "Your spending is still within today's budget.";
  } else if (status === "Warning") {
    return "One or more categories are over today's method budget.";
  } else {
    return "Today's spending is over your safe daily limit.";
  }
}

function getSpentClass(spent, recommendation) {
  if (spent > recommendation) {
    return "over-budget";
  } else {
    return "under-budget";
  }
}

function getDaysInMonth(monthKey) {
  const parts = monthKey.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const lastDay = new Date(year, month, 0);

  return lastDay.getDate();
}

function formatMonthName(monthKey) {
  const parts = monthKey.split("-");
  const year = parts[0];
  const month = parts[1];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthIndex = Number(month) - 1;

  return monthNames[monthIndex] + " " + year;
}

function formatRupiah(amount) {
  const roundedAmount = Math.round(amount);
  const formatter = new Intl.NumberFormat("id-ID");

  return "Rp " + formatter.format(roundedAmount);
}
