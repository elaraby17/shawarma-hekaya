

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

// categories are computed inside displayFilterButtons so they stay in sync with menuItems/localStorage

function displayFilterButtons() {
    if (!categoryList) return;
    // compute categories from current menuItems so they stay in sync with localStorage
    const categories = ["الكل", ...new Set(menuItems.map((item) => item.category))];
    let html = "";
    categories.forEach((category, idx) => {
        html += `
        <li>
            <button type="button" class="category-btn text-lg font-medium text-gray-700 hover:text-amber-600 px-4 py-2 rounded ${category === "الكل" ? "text-amber-600 active" : ""}" data-category="${category}">${category}</button>
        </li>
        `;
    });
    categoryList.innerHTML = html;

    // attach listeners
    const buttons = categoryList.querySelectorAll(".category-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((b) => b.classList.remove("text-amber-600", "active"));
            button.classList.add("text-amber-600", "active" , "text-lg");
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
                    <span class="text-2xl font-bold text-gray-900">${item.price} ج.م</span>   
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
        return matchesCategory && matchesSearch;
    });

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
