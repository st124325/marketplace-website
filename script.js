// Данные товаров - используем глобальную переменную из products-data.js или определяем здесь
let products = typeof window.products !== 'undefined' ? window.products : [];

// Если products-data.js не загрузился, используем данные напрямую
if (products.length === 0) {
    products = [
        {
            id: 1,
            name: "Смартфон Premium",
            description: "Новейшая модель с отличной камерой и производительностью",
            price: 29990,
            oldPrice: 34990,
            badge: "Скидка",
            emoji: "📱"
        },
        {
            id: 2,
            name: "Ноутбук Pro",
            description: "Мощный ноутбук для работы и развлечений",
            price: 59990,
            oldPrice: null,
            badge: "Новинка",
            emoji: "💻"
        },
        {
            id: 3,
            name: "Наушники Wireless",
            description: "Беспроводные наушники с шумоподавлением",
            price: 7990,
            oldPrice: 9990,
            badge: "Популярное",
            emoji: "🎧"
        },
        {
            id: 4,
            name: "Умные часы",
            description: "Отслеживание здоровья и уведомления",
            price: 14990,
            oldPrice: null,
            badge: "Новинка",
            emoji: "⌚"
        },
        {
            id: 5,
            name: "Планшет",
            description: "Идеальный для работы и творчества",
            price: 24990,
            oldPrice: 29990,
            badge: "Скидка",
            emoji: "📱"
        },
        {
            id: 6,
            name: "Камера 4K",
            description: "Профессиональная камера для видеосъемки",
            price: 44990,
            oldPrice: null,
            badge: "Популярное",
            emoji: "📷"
        },
        {
            id: 7,
            name: "Клавиатура механическая",
            description: "Удобная клавиатура для геймеров и программистов",
            price: 5990,
            oldPrice: 7990,
            badge: "Скидка",
            emoji: "⌨️"
        },
        {
            id: 8,
            name: "Монитор 4K",
            description: "Большой монитор с отличным качеством изображения",
            price: 34990,
            oldPrice: null,
            badge: "Новинка",
            emoji: "🖥️"
        }
    ];
}

let cart = [];
let cartCount = 0;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, загрузились ли данные из products-data.js
    if (typeof window.products !== 'undefined' && window.products.length > 0) {
        products = window.products;
    }
    
    console.log('Товаров загружено:', products.length);
    
    if (products.length > 0) {
        renderProducts();
        setupEventListeners();
        updateCartCount();
        renderCart();
    } else {
        console.error('Товары не загружены!');
        const grid = document.getElementById('productsGrid');
        if (grid) {
            grid.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--text-light);"><p>Товары не загружены. Обновите страницу.</p></div>';
        }
    }
});

// Рендеринг товаров
function renderProducts(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    let filteredProducts = products;

    if (filter === 'new') {
        filteredProducts = products.filter(p => p.badge === 'Новинка');
    } else if (filter === 'popular') {
        filteredProducts = products.filter(p => p.badge === 'Популярное');
    } else if (filter === 'sale') {
        filteredProducts = products.filter(p => p.oldPrice !== null);
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" style="position: relative;" onclick="window.location.href='product.html?id=${product.id}'">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div>
                        <span class="product-price">${formatPrice(product.price)} ₽</span>
                        ${product.oldPrice ? `<span class="product-old-price">${formatPrice(product.oldPrice)} ₽</span>` : ''}
                    </div>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">В корзину</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Форматирование цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        if (!cart) cart = [];
        cart.push(product);
        cartCount++;
        updateCartCount();
        
        // Анимация кнопки
        const btn = window.addToCartEvent ? window.addToCartEvent.target : event.target;
        if (btn) {
            btn.textContent = 'Добавлено!';
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.textContent = btn.classList.contains('product-detail-btn-primary') ? 'Добавить в корзину' : 'В корзину';
                btn.style.background = '';
            }, 1000);
        }
    }
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = cartCount;
        cartCountEl.style.display = cartCount > 0 ? 'flex' : 'none';
    }
    renderCart();
}

// Открытие корзины
function openCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Закрытие корзины
function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Рендеринг корзины
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><p>Ваша корзина пуста</p></div>';
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        // Группируем товары по ID
        const groupedCart = {};
        cart.forEach(item => {
            if (groupedCart[item.id]) {
                groupedCart[item.id].quantity++;
            } else {
                groupedCart[item.id] = { ...item, quantity: 1 };
            }
        });
        
        cartItems.innerHTML = Object.values(groupedCart).map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.emoji}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)} ₽ × ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Удалить">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');
        
        // Подсчет общей суммы
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        if (cartTotal) {
            cartTotal.textContent = formatPrice(total) + ' ₽';
        }
        if (cartFooter) {
            cartFooter.style.display = 'block';
        }
    }
}

// Удаление из корзины
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        cartCount--;
        updateCartCount();
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Фильтры товаров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.textContent.toLowerCase();
            let filterType = 'all';
            if (filter.includes('новинк')) filterType = 'new';
            else if (filter.includes('популярн')) filterType = 'popular';
            else if (filter.includes('скидк')) filterType = 'sale';
            
            renderProducts(filterType);
        });
    });

    // Поиск
    const searchInput = document.querySelector('.search-input');
    const searchSubmit = document.querySelector('.search-submit');
    
    if (searchSubmit) {
        searchSubmit.addEventListener('click', () => {
            const query = searchInput.value.toLowerCase();
            if (query) {
                const filtered = products.filter(p => 
                    p.name.toLowerCase().includes(query) || 
                    p.description.toLowerCase().includes(query)
                );
                
                if (filtered.length > 0) {
                    const grid = document.getElementById('productsGrid');
                    grid.innerHTML = filtered.map(product => `
                        <div class="product-card" style="position: relative;" onclick="window.location.href='product.html?id=${product.id}'">
                            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                            <div class="product-image">${product.emoji}</div>
                            <div class="product-info">
                                <h3 class="product-name">${product.name}</h3>
                                <p class="product-description">${product.description}</p>
                                <div class="product-footer">
                                    <div>
                                        <span class="product-price">${formatPrice(product.price)} ₽</span>
                                        ${product.oldPrice ? `<span class="product-old-price">${formatPrice(product.oldPrice)} ₽</span>` : ''}
                                    </div>
                                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">В корзину</button>
                                </div>
                            </div>
                        </div>
                    `).join('');
                } else {
                    alert('Товары по вашему запросу не найдены');
                }
            }
        });
    }

    // Форма обратной связи
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
            contactForm.reset();
        });
    }

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Открытие корзины
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    // Закрытие корзины
    const closeBtn = document.querySelector('.cart-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCart);
    }

    // Закрытие при клике вне модального окна
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCart();
            }
        });
    }

    // Кнопка оформления заказа
    const checkoutBtn = document.querySelector('.cart-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Спасибо за заказ! В реальном приложении здесь будет переход на страницу оформления заказа.');
            }
        });
    }

    // Анимация при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.category-card, .product-card, .feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(el);
    });
}

// Анимация счетчиков
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString('ru-RU');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString('ru-RU');
        }
    }, 16);
}

// Запуск анимации счетчиков при загрузке
window.addEventListener('load', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
        const target = parseInt(el.textContent.replace(/\s/g, ''));
        animateCounter(el, target);
    });
});

