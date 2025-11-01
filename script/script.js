// dark mode toggle
const btnMode = document.querySelector(".btn-mode");
if (btnMode) {
    btnMode.addEventListener("click", () => {
        document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", document.body.dataset.theme || "light");
    });
}
//____________________________________________________________________________________________________________________________
// products data
const products = [
    // === الساندوتشات ===
    {
        id: 1,
        title: "شاورما لحمة فرنساوي حار",
        category: "الساندوتشات",
        discription: "",
        image: "shawarma_beef_french_hot.jpg",
        price: 80,
    },
    {
        id: 2,
        title: "شاورما لحمة فرنساوي",
        category: "الساندوتشات",
        discription: "",
        image: "shawarma_beef_french.jpg",
        price: 75,
    },
    {
        id: 3,
        title: "شاورما فراخ فرنساوي حار",
        category: "الساندوتشات",
        discription: "",
        image: "shawarma_chicken_french_hot.jpg",
        price: 70,
    },
    {
        id: 4,
        title: "شاورما فراخ فرنساوي",
        category: "الساندوتشات",
        discription: "",
        image: "shawarma_chicken_french.jpg",
        price: 65,
    },

    // === الميني ساندوتش ===
    {
        id: 5,
        title: "ميني شاورما لحمة",
        category: "الميني ساندوتش",
        discription: "",
        image: "mini_shawarma_beef.jpg",
        price: 35,
    },
    {
        id: 6,
        title: "ميني شاورما فراخ",
        category: "الميني ساندوتش",
        discription: "",
        image: "mini_shawarma_chicken.jpg",
        price: 28,
    },

    // === ركن الأكيل ===
    {
        id: 7,
        title: "شاورما لحمة فرنساوي جامبو",
        category: "ركن الأكيل",
        discription: "",
        image: "shawarma_beef_jumbo.jpg",
        price: 135,
    },
    {
        id: 8,
        title: "شاورما فراخ فرنساوي جامبو",
        category: "ركن الأكيل",
        discription: "",
        image: "shawarma_chicken_jumbo.jpg",
        price: 120,
    },

    // === وجبات عربي ===
    {
        id: 9,
        title: "وجبة عربي لحمة",
        category: "وجبات عربي",
        discription: "",
        image: "arabic_meal_beef.jpg",
        price: 100,
    },
    {
        id: 10,
        title: "وجبة عربي فراخ",
        category: "وجبات عربي",
        discription: "",
        image: "arabic_meal_chicken.jpg",
        price: 90,
    },

    // === الفتة ===
    {
        id: 11,
        title: "فتة شاورما لحمة",
        category: "الفتة",
        discription: "",
        image: "fatteh_shawarma_beef.jpg",
        price: 90,
    },
    {
        id: 12,
        title: "فتة شاورما فراخ",
        category: "الفتة",
        discription: "",
        image: "fatteh_shawarma_chicken.jpg",
        price: 80,
    },
    {
        id: 13,
        title: "فتة شاورما ميكس",
        category: "الفتة",
        discription: "",
        image: "fatteh_shawarma_mix.jpg",
        price: 90,
    },

    // === المقبلات ===
    {
        id: 14,
        title: "بطاطس",
        category: "المقبلات",
        discription: "",
        image: "fries.jpg",
        price: 25,
    },
    {
        id: 15,
        title: "كول سلو",
        category: "المقبلات",
        discription: "",
        image: "coleslaw.jpg",
        price: 22,
    },

    // === المناسبات الخاصة ===
    {
        id: 16,
        title: "متاح ميني بانييه شاورما لحمة أو فراخ خاص بالحفلات وأعياد الميلاد والمناسبات الخاصة",
        category: "المناسبات الخاصة",
        discription: "ميني بانييه شاورما لحمة أو فراخ، مثالي للحفلات والمناسبات الخاصة.",
        image: "special_occasions.jpg",
        price: null, // السعر حسب الطلب
    },
];
//____________________________________________________________________________________________________________________________
let categoryType = "الكل";
const categoryContainer = document.querySelector(".filter-controls .categories");
const productsContainer = document.querySelector(".minu-container");
function handelFilterProduct() {
    if (categoryType == "الكل") {
        return handelDisplayProduct(products);
    } else {
        const productsFilter = products.filter((product) => product.category == categoryType);
        return handelDisplayProduct(productsFilter);
    }
}

function handelCategories() {
    const categories = [];
    products.map((product) => categories.push(product.category));
    const uniqueCategories = ["الكل", ...new Set(categories)];
    const results = uniqueCategories.map((category) => ({
        label: category?.toUpperCase().replaceAll("-", " "),
        value: category,
    }));
    let html = ``;
    results.forEach((result) => {
        html += `
            <li class="category-list"><h3 data-value="${result.value}" class="category-item cursor-pointer px-4 py-2 rounded-lg hover:bg-amber-100 hover:text-amber-500 transition ${result.value === "الكل" ? "active bg-amber-100 text-amber-500" : ""}">${result.label}</h3></li>
        `;
    });
    categoryContainer.innerHTML = html;
    // select the generated category items from the same container
    const items = categoryContainer.querySelectorAll('h3');
    items.forEach((item) => {
        item.onclick = () => {
            categoryType = item.dataset.value;
            items.forEach((it) => it.classList.remove('active', 'bg-amber-100', 'text-amber-500'));
            item.classList.add('active', 'bg-amber-100', 'text-amber-500');
            handelFilterProduct();
        };
    });
}

function handelDisplayProduct(data) {
    let html = ``;
    data.forEach((product) => {
        html += `
            <div class="card border border-amber-200 bg-transparent rounded-lg shadow-md overflow-hidden">
                    <div class="image-card">
                        <img src="./assists/image/sh1.jpg" alt="شاورما دجاج" class="w-full h-[45vh] object-cover rounded-t-lg" />
                    </div>
                    <div class="info-card p-4 bg-white rounded-b-lg shadow-md">
                        <h3 class="text-xl font-bold mb-2">${product.title}</h3>
                        <p class="text-gray-600 mb-4">${product.discription}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-amber-600 font-bold text-lg">${product.price} ج.م</span>
                        </div>
                    </div>
            </div>
        `;
    });
    productsContainer.innerHTML = html;
}

handelCategories();
handelFilterProduct();
// ______________________________________________

// Header mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
if (navToggle && mainNav) {
    // initialize state based on viewport
    const setInitialNav = () => {
        if (window.innerWidth < 768) {
            mainNav.classList.add("hidden");
            navToggle.setAttribute("aria-expanded", "false");
        } else {
            mainNav.classList.remove("hidden");
            navToggle.setAttribute("aria-expanded", "false");
        }
    };
    setInitialNav();

    navToggle.addEventListener("click", () => {
        const expanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", (!expanded).toString());
        mainNav.classList.toggle("hidden");
    });

    // keep nav state consistent on resize
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            mainNav.classList.remove("hidden");
            navToggle.setAttribute("aria-expanded", "false");
        } else {
            mainNav.classList.add("hidden");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
}
