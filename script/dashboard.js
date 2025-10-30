// Products Management
// If localStorage has no products yet, seed with a few defaults so dashboard and homepage show content
const defaultProducts = [
    { id: '1', title: 'شاورما دجاج', description: 'شاورما دجاج طازجة مع صلصة الثومية', category: 'ساندوتشات', price: 25, image: './assists/image/sh2.jpg' },
    { id: '2', title: 'شاورما لحم', description: 'شاورما لحم مشوي مع صلصة الطحينة', category: 'ساندوتشات', price: 30, image: './assists/image/sh1.jpg' },
    { id: '3', title: 'بطاطس مقلية', description: 'بطاطس مقلية مقرمشة', category: 'مقبلات', price: 15, image: './assists/image/sh1.jpg' }
];

let products = (function () {
    try {
        const stored = JSON.parse(localStorage.getItem('products'));
        if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch (e) {
        // ignore
    }
    // seed localStorage with defaults so UI shows something
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    return defaultProducts.slice();
})();

// grab elements with safety checks (some may be missing and should not break the script)
const productsTableBody = document.getElementById('productsTableBody');
const productForm = document.getElementById('productForm');
const searchInput = document.getElementById('searchProducts');
const addProductButton = document.getElementById('addProductButton');
const modalTitle = document.getElementById('modalTitle');

// Mobile sidebar toggle (guarded)
const sidebarButton = document.getElementById('toggleSidebarMobile');
const sidebar = document.getElementById('sidebar');
if (sidebarButton && sidebar) {
    sidebarButton.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });
}

// Initialize modal (use Flowbite Modal if available, otherwise provide a simple fallback)
let modal = null;
const modalEl = document.getElementById('productModal');
if (typeof Modal === 'function' && modalEl) {
    try {
        const modalOptions = {
            placement: 'center',
            backdrop: 'dynamic',
            backdropClasses: 'bg-gray-900 bg-opacity-50 fixed inset-0 z-40',
            closable: true,
        };
        modal = new Modal(modalEl, modalOptions);
    } catch (err) {
        modal = null;
    }
}
// fallback modal object (toggles hidden class)
if (!modal && modalEl) {
    modal = {
        show() {
            modalEl.classList.remove('hidden');
        },
        hide() {
            modalEl.classList.add('hidden');
        },
    };
}

// Add product button click handler
if (addProductButton) {
    addProductButton.addEventListener('click', () => {
        if (modalTitle) modalTitle.textContent = 'إضافة منتج جديد';
        if (productForm) productForm.reset();
        if (productForm && productForm.productId) productForm.productId.value = '';
        if (modal && modal.show) modal.show();
    });
}

// Handle form submission
if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(productForm);
    const productData = {
        id: formData.get('productId') || Date.now().toString(),
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        image: formData.get('image')
    };

    if (formData.get('productId')) {
        // Edit existing product
        const index = products.findIndex(p => p.id === productData.id);
        if (index !== -1) {
            products[index] = productData;
        }
    } else {
        // Add new product
        products.push(productData);
    }

    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    modal.hide();
    });
}

// Search functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    });
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product && productForm) {
        if (modalTitle) modalTitle.textContent = 'تعديل المنتج';
        productForm.title.value = product.title || '';
        productForm.description.value = product.description || '';
        productForm.category.value = product.category || '';
        productForm.price.value = product.price || '';
        productForm.image.value = product.image || '';
        productForm.productId.value = product.id;
        if (modal && modal.show) modal.show();
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
    }
}

// Render products table
function renderProducts(productsToRender = products) {
    if (!productsTableBody) return;
    productsTableBody.innerHTML = '';
    productsToRender.forEach(product => {
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-100';
        tr.innerHTML = `
            <td class="p-4 text-sm font-normal text-gray-900">
                <div class="text-base font-semibold">${product.title}</div>
                <div class="text-sm font-normal text-gray-500">${product.description}</div>
            </td>
            <td class="p-4 text-base font-medium text-gray-900">${product.category}</td>
            <td class="p-4 text-base font-medium text-gray-900">${product.price} ريال</td>
            <td class="p-4 space-x-2 whitespace-nowrap">
                <button type="button" onclick="editProduct('${product.id}')" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:ring-4 focus:ring-amber-300">
                    <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                        <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path>
                    </svg>
                    تعديل
                </button>
                <button type="button" onclick="deleteProduct('${product.id}')" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300">
                    <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    حذف
                </button>
            </td>
        `;
        productsTableBody.appendChild(tr);
    });
}

// Initial render
renderProducts();

// Keep dashboard in sync with storage changes from other tabs
window.addEventListener('storage', (e) => {
    if (e.key === 'products') {
        try {
            const newProducts = JSON.parse(e.newValue) || [];
            products = Array.isArray(newProducts) ? newProducts : [];
        } catch (err) {
            products = [];
        }
        renderProducts();
    }
});