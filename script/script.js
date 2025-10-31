// toggle mode (if control exists)
const btnMode = document.querySelector(".btn-mode");
if (btnMode) {
    btnMode.addEventListener("click", () => {
        document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", document.body.dataset.theme || "light");
    });
}

const defaultMenuItems = [
    {
        id: 1,
        title: "شاورما دجاج",
        image: "./assists/image/sh2.jpg",
        category: "ساندوتشات",
        description: "شاورما دجاج طازجة مع صلصة الثومية والبطاطا المقلية.",
        price: 25.0,
    },
    {
        id: 2,
        title: "شاورما لحم",
        image: "./assists/image/sh1.jpg",
        category: "ساندوتشات",
        description: "شاورما لحم مشوي مع صلصة الطحينة والسلطة.",
        price: 30.0,
    },
    {
        id: 3,
        title: "شاورما مشكل",
        image: "./assists/image/sh1.jpg",
        category: "ساندوتشات",
        description: "مزيج من شاورما الدجاج واللحم مع صلصة الزبادي والخضروات الطازجة.",
        price: 35.0,
    },
    {
        id: 4,
        title: "بطاطس مقلية",
        image: "./assists/image/sh1.jpg",
        category: "مقبلات",
        description: "بطاطس مقلية مقرمشة مع رشة ملح وخدمة مع صلصة.",
        price: 15.0,
    },
    {
        id: 5,
        title: "عصير برتقال طازج",
        image: "./assists/image/sh2.jpg",
        category: "مشروبات",
        description: "عصير برتقال طازج ومبرد.",
        price: 12.0,
    },
];

// Load current products from localStorage if present, otherwise use defaults
let menuItems = (function () {
    try {
        const stored = JSON.parse(localStorage.getItem('products'));
        if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch (e) {
        // ignore JSON parse errors and fall back to defaults
    }
    return defaultMenuItems;
})();

const menuContainer = document.querySelector(".minu-container");
const categoryList = document.getElementById("categoryList");
const searchInput = document.getElementById("searchInput");
// cart elements
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
const cartCountEl = document.getElementById('cartCount');
const cartFab = document.getElementById('cartFab');
const openCartBtn = document.getElementById('openCartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const priceMin = document.getElementById('priceMin');
const priceMax = document.getElementById('priceMax');
const sortSelect = document.getElementById('sortSelect');

// categories are computed inside displayFilterButtons so they stay in sync with menuItems/localStorage

function displayFilterButtons() {
    if (!categoryList) return;
    // compute categories from localStorage categories (if present) else from menuItems
    let storedCategories = [];
    try { storedCategories = JSON.parse(localStorage.getItem('categories') || '[]'); } catch (e) { storedCategories = []; }
    const computed = Array.from(new Set(menuItems.map((item) => item.category)));
    const merged = Array.from(new Set([...(storedCategories.length ? storedCategories : computed)]));
    const categories = ["الكل", ...merged];
    let html = "";
    categories.forEach((category, idx) => {
        html += `
        <li>
            <button type="button" class="category-btn text-lg font-medium text-gray-700 hover:text-amber-600 px-4 py-2 rounded ${category === "الكل" ? "text-amber-600 active " : ""}" data-category="${category}">${category}</button>
        </li>
        `;
    });
    categoryList.innerHTML = html;

    // attach listeners
    const buttons = categoryList.querySelectorAll(".category-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((b) => b.classList.remove("text-amber-600", "active"));
            button.classList.add("text-amber-600", "active" , "text-lg" ,);
            applyFilters();
        });
    });
}

function displayMenuItems(items) {
    if (!menuContainer) return;
    if (!items || items.length === 0) {
        menuContainer.innerHTML = `<p class="text-center text-gray-600 col-span-full">لا توجد منتجات مطابقة.</p>`;
        return;
    }
    let html = "";
    items.forEach((item) => {
        const idStr = String(item.id);
        html += `
        <div class="product-card w-full max-w-sm border border-amber-600 rounded-lg shadow-sm bg-transparent overflow-hidden">
            <a href="#">
                <img class="w-full h-44 object-cover" src="${item.image}" alt="${item.title}" />
            </a>
            <div class="px-5 pb-5">
                <a href="#" >
                    <h5 class="mt-2 text-xl font-semibold tracking-tight text-gray-900">${item.title}</h5>
                </a>
                <p class="mt-2.5 mb-5 text-gray-700 text-sm">${item.description}</p>
                <div class="flex items-center justify-between">
                    <span class="price text-2xl font-bold text-gray-900">${item.price} ج.م</span>
                </div>
            </div>
        </div>
        `;
    });
    menuContainer.innerHTML = html;
}

function applyFilters() {
    const selectedBtn = categoryList ? categoryList.querySelector(".category-btn.active") : null;
    const selectedCategory = selectedBtn ? selectedBtn.dataset.category : "الكل";
    const search = searchInput ? searchInput.value.trim().toLowerCase() : "";

    let filtered = menuItems.filter((item) => {
        const matchesCategory = selectedCategory === "الكل" || item.category === selectedCategory;
        const matchesSearch = !search || item.title.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
        const min = priceMin && priceMin.value ? parseFloat(priceMin.value) : null;
        const max = priceMax && priceMax.value ? parseFloat(priceMax.value) : null;
        const matchesPrice = (min === null || item.price >= min) && (max === null || item.price <= max);
        return matchesCategory && matchesSearch && matchesPrice;
    });

    // apply sorting
    const sort = sortSelect ? sortSelect.value : 'default';
    if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);

    displayMenuItems(filtered);
}

// wire search
if (searchInput) {
    searchInput.addEventListener("input", () => {
        // small debounce
        clearTimeout(searchInput._timer);
        searchInput._timer = setTimeout(applyFilters, 150);
    });
}

// initialize
displayFilterButtons();
displayMenuItems(menuItems);

// cart utilities
function updateCartCount() {
    const count = cart.reduce((s,i) => s + (i.qty || 1), 0);
    if (cartCountEl) cartCountEl.textContent = count;
}
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(id) {
    const idStr = String(id);
    const item = menuItems.find(m => String(m.id) === idStr);
    if (!item) return alert('المنتج غير موجود');
    const existing = cart.find(c => String(c.id) === idStr);
    if (existing) existing.qty = (existing.qty || 1) + 1;
    else cart.push({ id: idStr, title: item.title, price: item.price, qty: 1 });
    saveCart();
    updateCartCount();
    alert('تمت الإضافة للسلة');
}
window.addToCart = addToCart; // expose to inline onclick

function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.forEach(ci => {
        total += (ci.price || 0) * (ci.qty || 1);
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between';
        div.innerHTML = `<div>${ci.title} x ${ci.qty}</div><div>${(ci.price * ci.qty).toFixed(2)} ج.م <button data-id="${ci.id}" class="remove-cart-btn text-red-600 ml-2">حذف</button></div>`;
        cartItemsEl.appendChild(div);
    });
    if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
    // attach remove handlers
    document.querySelectorAll('.remove-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = String(e.target.dataset.id);
            cart = cart.filter(c => String(c.id) !== id);
            saveCart();
            renderCart();
            updateCartCount();
        });
    });
}

// cart modal handlers
if (openCartBtn) openCartBtn.addEventListener('click', () => { if (cartModal) cartModal.classList.remove('hidden'); renderCart(); });
if (closeCartBtn) closeCartBtn.addEventListener('click', () => { if (cartModal) cartModal.classList.add('hidden'); });
if (clearCartBtn) clearCartBtn.addEventListener('click', () => { cart = []; saveCart(); renderCart(); updateCartCount(); });
if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    if (!cart || cart.length === 0) return alert('السلة فارغة');
    const customer = prompt('اسم العميل/بيانات الاتصال (اختياري)');
    const total = cart.reduce((s,i) => s + (i.price * (i.qty || 1)), 0);
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const id = Date.now().toString();
    const order = { id, items: cart, total, customer: customer || '', status: 'pending', createdAt: new Date().toISOString() };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    // clear cart
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
    if (cartModal) cartModal.classList.add('hidden');
    alert('تم إرسال الطلب (محلياً). سيظهر في لوحة التحكم.');
});

// initialize cart count
updateCartCount();

// Listen for localStorage changes (so dashboard edits in other tabs/windows update this page)
window.addEventListener('storage', (e) => {
    if (e.key === 'products') {
        try {
            const newProducts = JSON.parse(e.newValue);
            menuItems = Array.isArray(newProducts) && newProducts.length > 0 ? newProducts : defaultMenuItems;
        } catch (err) {
            menuItems = defaultMenuItems;
        }
        // rebuild UI
        displayFilterButtons();
        applyFilters();
    }
    if (e.key === 'categories') {
        // categories changed in dashboard; rebuild filter buttons
        displayFilterButtons();
        applyFilters();
    }
});

// NAV TOGGLE (responsive)
(function setupNavToggle() {
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    const mobileMenu = document.getElementById('mobileMenu');
    const header = document.querySelector('header');
    if (!navToggle) return;

    // choose which menu to toggle on small screens: prefer mobileMenu (outside header)
    const menuEl = mobileMenu || mainNav;
    if (!menuEl) return;

    function openMenu() {
        menuEl.classList.remove('hidden');
        navToggle.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
        menuEl.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // initialize state depending on width
    if (window.innerWidth >= 768) {
        // on larger screens ensure header nav (mainNav) is visible
        if (mainNav) mainNav.classList.remove('hidden');
        if (mobileMenu) mobileMenu.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'true');
    } else {
        closeMenu();
    }

    // toggle visibility
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menuEl.classList.contains('hidden')) openMenu();
        else closeMenu();
    });

    // close menu when clicking a link (on small screens)
    menuEl.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            if (window.innerWidth < 768) closeMenu();
        });
    });

    // close when clicking outside the header/menu on small screens
    document.addEventListener('click', (ev) => {
        if (window.innerWidth >= 768) return;
        if (!header.contains(ev.target) && !menuEl.contains(ev.target)) {
            closeMenu();
        }
    });

    // handle resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            if (mainNav) mainNav.classList.remove('hidden');
            if (mobileMenu) mobileMenu.classList.add('hidden');
            navToggle.setAttribute('aria-expanded', 'true');
        } else {
            if (mainNav) mainNav.classList.add('hidden');
            closeMenu();
        }
    });
})();
