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
        image: "../assists/image/shawrma1.png",
        price: 80,
    },
    {
        id: 2,
        title: "شاورما لحمة فرنساوي",
        category: "الساندوتشات",
        discription: "",
        image: "../assists/image/shawrma1.png",
        price: 75,
    },
    {
        id: 3,
        title: "شاورما فراخ فرنساوي حار",
        category: "الساندوتشات",
        discription: "",
        image: "../assists/image/shwarma2.png",
        price: 70,
    },
    {
        id: 4,
        title: "شاورما فراخ فرنساوي",
        category: "الساندوتشات",
        discription: "",
        image: "../assists/image/shwarma2.png",
        price: 65,
    },

    // === الميني ساندوتش ===
    {
        id: 5,
        title: "ميني شاورما لحمة",
        category: "الميني ساندوتش",
        discription: "",
    image: "../assists/image/mine.png",
        price: 35,
    },
    {
        id: 6,
        title: "ميني شاورما فراخ",
        category: "الميني ساندوتش",
        discription: "",
    image: "../assists/image/mine.png",
        price: 28,
    },

    // === وجبات عربي ===
    {
        id: 9,
        title: "وجبة عربي لحمة",
        category: "وجبات عربي",
        discription: "",
    image: "../assists/image/arabymeet.png",
        price: 100,
    },
    {
        id: 10,
        title: "وجبة عربي فراخ",
        category: "وجبات عربي",
        discription: "",
    image: "../assists/image/arabyfra1.png",
        price: 90,
    },

    // === الفتة ===
    {
        id: 11,
        title: "فتة شاورما لحمة",
        category: "الفتة",
        discription: "",
    image: "../assists/image/fatameet.png",
        price: 90,
    },
    {
        id: 12,
        title: "فتة شاورما فراخ",
        category: "الفتة",
        discription: "",
    image: "../assists/image/fatache.png",
        price: 80,
    },
    {
        id: 13,
        title: "فتة شاورما ميكس",
        category: "الفتة",
        discription: "",
    image: "../assists/image/fatameet.png",
        price: 90,
    },

    // === المقبلات ===
    {
        id: 14,
        title: "بطاطس",
        category: "المقبلات",
        discription: "",
        image: "../assists/image/frise.png",
        price: 25,
    },
    {
        id: 15,
        title: "كول سلو",
        category: "المقبلات",
        discription: "",
        image: "../assists/image/clowslow.png",
        price: 22,
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
            <div class="card-menu h-fit border border-amber-200  rounded-lg shadow-md overflow-hidden">
                    <div class="image-card">
                        <img src="${product.image}" alt="شاورما دجاج" class="w-full  object-cover rounded-t-lg" />
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
