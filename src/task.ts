
type BaseProduct = {
    id: number;
    name: string;
    price: number;
};

type Electronics = BaseProduct & {
    category: 'electronics';
    warrantyMonths: number;
};

type Clothing = BaseProduct & {
    category: 'clothing';
    size: string;
    material: string;
};

type Book = BaseProduct & {
    category: 'book';
    author: string;
    pages: number;
};

// ==========================
// Функції для пошуку та фільтрації
// ==========================

/**
 * Знаходить товар за id
 */
const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    return products.find(p => p.id === id);
};

/**
 * Фільтрує товари за максимальною ціною
 */
const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    return products.filter(p => p.price <= maxPrice);
};

// ==========================
// 3️⃣ Кошик
// ==========================

type CartItem<T extends BaseProduct> = {
    product: T;
    quantity: number;
};

/**
 * Додає товар у кошик
 */
const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T | undefined,
    quantity: number
): CartItem<T>[] => {
    if (!product || quantity <= 0) return cart;
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }
    return cart;
};

/**
 * Обчислює загальну вартість кошика
 */
const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

// ==========================
// Тестові дані
// ==========================

const electronics: Electronics[] = [
    { id: 1, name: "Телефон", price: 10000, category: 'electronics', warrantyMonths: 24 },
    { id: 2, name: "Ноутбук", price: 25000, category: 'electronics', warrantyMonths: 12 }
];

const clothing: Clothing[] = [
    { id: 3, name: "Футболка", price: 500, category: 'clothing', size: "M", material: "cotton" },
    { id: 4, name: "Джинси", price: 1200, category: 'clothing', size: "L", material: "denim" }
];

const books: Book[] = [
    { id: 5, name: "TypeScript Handbook", price: 800, category: 'book', author: "Microsoft", pages: 300 }
];

// ==========================
// Використання функцій
// ==========================

// Пошук товару
const phone = findProduct(electronics, 1);
console.log("Found product:", phone);

// Фільтрація по ціні
const affordable = filterByPrice([...electronics, ...clothing, ...books], 2000);
console.log("Affordable products:", affordable);

// Робота з кошиком
let cart: CartItem<BaseProduct>[] = [];
cart = addToCart(cart, phone, 1);
cart = addToCart(cart, clothing[0], 2);
cart = addToCart(cart, books[0], 1);

console.log("Cart items:", cart);
console.log("Total price:", calculateTotal(cart));