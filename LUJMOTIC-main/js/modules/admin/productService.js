export const getProducts = () => {
    return JSON.parse(localStorage.getItem("products")) || [];
};

export const saveProducts = (products) => {
    localStorage.setItem("products", JSON.stringify(products));
};

export const getProductById = (id) => {
    const products = getProducts();
    return products.find((p) => p.id === parseInt(id));
};

export const createProduct = (productData) => {
    const products = getProducts();
    const newProduct = {
        id: Date.now(),
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
    };
    products.push(newProduct);
    saveProducts(products);
    return newProduct;
};

export const updateProduct = (id, productData) => {
    const products = getProducts();
    const index = products.findIndex((p) => p.id === parseInt(id));

    if (index === -1) {
        throw new Error("Producto no encontrado.");
    }

    products[index] = {
        ...products[index],
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
    };

    saveProducts(products);
    return products[index];
};

export const deleteProduct = (id) => {
    const products = getProducts();
    const filteredProducts = products.filter((p) => p.id !== parseInt(id));

    if (filteredProducts.length === products.length) {
        throw new Error("Producto no encontrado.");
    }

    saveProducts(filteredProducts);
};

export const initializeDefaultProducts = () => {
    const existingProducts = getProducts();
    
    const hasProductsWithCategory = existingProducts.length > 0 && existingProducts.some(p => p.category);
    if (hasProductsWithCategory) return;

    const defaultProducts = [
        {
            name: "Chaqueta Suede",
            description: "Chaqueta elegante en cuero premium",
            price: 289900,
            stock: 10,
            image: "images/productos/chaqueta.png",
            category: "hombre"
        },
        {
            name: "Abrigo \"Soho\" Formal",
            description: "Abrigo formal para ocasiones especiales",
            price: 319900,
            stock: 8,
            image: "images/productos/857994Y1M111066_A.png",
            category: "hombre"
        },
        {
            name: "Camisa Polo Club Lino",
            description: "Camisa de lino para caballero",
            price: 222000,
            stock: 15,
            image: "images/productos/859775Y2N332849_A.png",
            category: "hombre"
        },
        {
            name: "Bomber de Punto",
            description: "Chaqueta bomber en punto fino",
            price: 355000,
            stock: 12,
            image: "images/productos/Medium-804159Y76QM1000_A.png",
            category: "hombre"
        },
        {
            name: "Polo Knit",
            description: "Polo tejido para dama",
            price: 245000,
            stock: 20,
            image: "images/productos/camisaa.png",
            category: "mujer"
        },
        {
            name: "Vestido \"Sahara\" Safari",
            description: "Vestido safari elegante",
            price: 390000,
            stock: 6,
            image: "images/productos/cq5dam.web.hebebed.800.800.png",
            category: "mujer"
        },
        {
            name: "Blazer Manhattan",
            description: "Blazer clásico para dama",
            price: 495000,
            stock: 5,
            image: "images/productos/cq5dam.web.hebebed.800.800 (1).png",
            category: "mujer"
        },
        {
            name: "Chaqueta Wine Leather",
            description: "Chaqueta en cuero vino",
            price: 295000,
            stock: 9,
            image: "images/productos/cq5dam.web.hebebed.800.800 (2).png",
            category: "mujer"
        }
    ];

    const productsWithIds = defaultProducts.map(product => ({
        ...product,
        id: Date.now() + Math.random() // IDs únicos
    }));

    saveProducts(productsWithIds);
};

export const validateProduct = (productData) => {
    const errors = [];

    if (!productData.name || productData.name.trim() === "") {
        errors.push("El nombre es requerido.");
    }
    if (!productData.price || isNaN(productData.price) || parseFloat(productData.price) <= 0) {
        errors.push("El precio debe ser un número positivo.");
    }
    if (!productData.stock || isNaN(productData.stock) || parseInt(productData.stock) < 0) {
        errors.push("El stock debe ser un número no negativo.");
    }
    if (!productData.category || productData.category.trim() === "") {
        errors.push("La categoría es requerida.");
    }

    return { isValid: errors.length === 0, errors };
};
