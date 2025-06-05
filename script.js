        // Стан додатку
        const state = {
            transactions: [],
            balance: 0,
            income: 0,
            expense: 0,
            theme: 'light'
        };

        // DOM елементи
        const elements = {
            homePage: document.getElementById('home-page'),
            trackerPage: document.getElementById('tracker-page'),
            aboutPage: document.getElementById('about-page'),
            transactionForm: document.getElementById('transaction-form'),
            transactionsList: document.getElementById('transactions-list'),
            balanceAmount: document.getElementById('balance-amount'),
            incomeAmount: document.getElementById('income-amount'),
            expenseAmount: document.getElementById('expense-amount'),
        };

        // Ініціалізація додатку
        document.addEventListener('DOMContentLoaded', function() {
            // Завантажуємо збережені дані
            loadData();
            
            // Показуємо головну сторінку
            showPage('home');
            
            // Встановлюємо поточну дату за замовчуванням
            document.getElementById('date').valueAsDate = new Date();
            
            // Обробник форми
            elements.transactionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addTransaction();
            });
        });

        // Функції для роботи з даними
        function loadData() {
            const savedData = localStorage.getItem('financeTrackerData');
            if (savedData) {
                const data = JSON.parse(savedData);
                state.transactions = data.transactions || [];
                state.balance = data.balance || 0;
                state.income = data.income || 0;
                state.expense = data.expense || 0;
                state.theme = data.theme || 'light';
                
                
                // Оновлюємо UI
                updateUI();
            }
        }

        function saveData() {
            const data = {
                transactions: state.transactions,
                balance: state.balance,
                income: state.income,
                expense: state.expense,
            };
            localStorage.setItem('financeTrackerData', JSON.stringify(data));
        }

        function addTransaction() {
            const type = document.getElementById('type').value;
            const category = document.getElementById('category').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const date = document.getElementById('date').value;
            
            if (!category || isNaN(amount) || !date) {
                alert('Будь ласка, заповніть всі поля коректно');
                return;
            }
            
            const transaction = {
                id: Date.now(),
                type,
                category,
                amount,
                date
            };
            
            state.transactions.unshift(transaction);
            
            if (type === 'income') {
                state.balance += amount;
                state.income += amount;
            } else {
                state.balance -= amount;
                state.expense += amount;
            }
            
            // Зберігаємо дані
            saveData();
            
            // Оновлюємо UI
            updateUI();
            
            // Очищаємо форму
            elements.transactionForm.reset();
            document.getElementById('date').valueAsDate = new Date();
        }

        function deleteTransaction(id) {
            const transactionIndex = state.transactions.findIndex(t => t.id === id);
            if (transactionIndex === -1) return;
            
            const transaction = state.transactions[transactionIndex];
            
            if (transaction.type === 'income') {
                state.balance -= transaction.amount;
                state.income -= transaction.amount;
            } else {
                state.balance += transaction.amount;
                state.expense -= transaction.amount;
            }
            
            state.transactions.splice(transactionIndex, 1);
            
            // Зберігаємо дані
            saveData();
            
            // Оновлюємо UI
            updateUI();
        }

        // Функції для роботи з UI
        function updateUI() {
            // Оновлюємо баланс
            elements.balanceAmount.textContent = `$${state.balance.toFixed(2)}`;
            elements.incomeAmount.textContent = `$${state.income.toFixed(2)}`;
            elements.expenseAmount.textContent = `$${state.expense.toFixed(2)}`;
            
            // Оновлюємо список транзакцій
            elements.transactionsList.innerHTML = '';
            
            if (state.transactions.length === 0) {
                elements.transactionsList.innerHTML = '<p style="text-align: center; color: var(--gray);">Немає операцій</p>';
                return;
            }
            
            state.transactions.forEach(transaction => {
                const transactionEl = document.createElement('div');
                transactionEl.className = `transaction ${transaction.type}-bg`;
                transactionEl.innerHTML = `
                    <div class="transaction-info">
                        <div class="transaction-category">${transaction.category}</div>
                        <div class="transaction-date">${formatDate(transaction.date)}</div>
                    </div>
                    <div class="transaction-amount" style="color: ${transaction.type === 'income' ? 'var(--success)' : 'var(--danger)'};">
                        ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                        <button onclick="deleteTransaction(${transaction.id})" style="margin-left: 10px; background: none; border: none; color: var(--gray); cursor: pointer;">×</button>
                    </div>
                `;
                elements.transactionsList.appendChild(transactionEl);
            });
        }

        function formatDate(dateString) {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('uk-UA', options);
        }

        // Функції для роботи зі сторінками
        function showPage(page) {
            // Ховаємо всі сторінки
            elements.homePage.style.display = 'none';
            elements.trackerPage.style.display = 'none';
            elements.aboutPage.style.display = 'none';
            
            // Показуємо вибрану сторінку
            document.getElementById(page + '-page').style.display = 'block';
            
            // Оновлюємо активні посилання в навігації
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Знаходимо активне посилання в поточній сторінці
            const currentPageNav = document.querySelector(`#${page}-page nav a[onclick*="${page}"]`);
            if (currentPageNav) {
                currentPageNav.classList.add('active');
            }
        }
