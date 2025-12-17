// Загрузка данных товара на страницу
document.addEventListener('DOMContentLoaded', () => {
    // Получаем ID товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (productId && products) {
        const product = products.find(p => p.id === productId);
        
        if (product) {
            renderProductDetail(product);
        } else {
            showProductNotFound();
        }
    } else {
        showProductNotFound();
    }
});

// Рендеринг страницы товара
function renderProductDetail(product) {
    const productDetail = document.getElementById('productDetail');
    
    if (!productDetail) return;

    productDetail.innerHTML = `
        <div class="product-detail-image">
            ${product.emoji}
        </div>
        <div class="product-detail-info">
            ${product.badge ? `<span class="product-detail-badge">${product.badge}</span>` : ''}
            <h1 class="product-detail-title">${product.name}</h1>
            <p class="product-detail-description">${product.description}</p>
            
            ${product.features ? `
                <div class="product-detail-features">
                    <h3>Характеристики:</h3>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="product-detail-price">
                <span class="product-detail-price-current">${formatPrice(product.price)} ₽</span>
                ${product.oldPrice ? `<span class="product-detail-price-old">${formatPrice(product.oldPrice)} ₽</span>` : ''}
            </div>
            
            <div class="product-detail-actions">
                <button class="product-detail-btn product-detail-btn-primary" onclick="addToCartFromPage(${product.id})">
                    Добавить в корзину
                </button>
                <button class="product-detail-btn product-detail-btn-secondary" onclick="window.history.back()">
                    Назад
                </button>
            </div>
        </div>
    `;

    // Обновляем заголовок страницы
    document.title = `${product.name} - Маркетплейс`;
}

// Добавление в корзину со страницы товара
function addToCartFromPage(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Используем функцию из script.js, если она доступна глобально
        if (typeof addToCart === 'function') {
            // Создаем событие для функции addToCart
            const event = { target: document.querySelector('.product-detail-btn-primary') };
            window.addToCartEvent = event;
            addToCart(productId);
        } else {
            // Если функция недоступна, добавляем напрямую
            if (!window.cart) window.cart = [];
            if (!window.cartCount) window.cartCount = 0;
            
            window.cart.push(product);
            window.cartCount++;
            
            // Обновляем счетчик корзины
            const cartCountEl = document.querySelector('.cart-count');
            if (cartCountEl) {
                cartCountEl.textContent = window.cartCount;
                cartCountEl.style.display = window.cartCount > 0 ? 'flex' : 'none';
            }
            
            // Показываем уведомление
            const btn = document.querySelector('.product-detail-btn-primary');
            const originalText = btn.textContent;
            btn.textContent = 'Добавлено в корзину!';
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
    }
}

// Форматирование цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Показ сообщения, если товар не найден
function showProductNotFound() {
    const productDetail = document.getElementById('productDetail');
    if (productDetail) {
        productDetail.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem;">Товар не найден</h2>
                <p style="color: var(--text-light); margin-bottom: 2rem;">К сожалению, запрашиваемый товар не найден.</p>
                <a href="index.html#products" class="product-detail-btn product-detail-btn-primary" style="text-decoration: none; display: inline-block;">
                    Вернуться к каталогу
                </a>
            </div>
        `;
    }
}

