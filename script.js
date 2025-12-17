// Данные товаров
const products = [
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

let cart = [];
let cartCount = 0;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    updateCartCount();
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
        <div class="product-card" style="position: relative;">
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
                    <button class="add-to-cart" onclick="addToCart(${product.id})">В корзину</button>
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
        cart.push(product);
        cartCount++;
        updateCartCount();
        
        // Анимация кнопки
        const btn = event.target;
        btn.textContent = 'Добавлено!';
        btn.style.background = '#10b981';
        setTimeout(() => {
            btn.textContent = 'В корзину';
            btn.style.background = '';
        }, 1000);
    }
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = cartCount;
        cartCountEl.style.display = cartCount > 0 ? 'flex' : 'none';
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
                alert(`Поиск по запросу: "${query}"\n\nВ реальном приложении здесь будет поиск по товарам.`);
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

