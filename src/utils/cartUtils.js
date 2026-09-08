/**
 * Cart utilities managing persistent cart in localStorage (matching PHP hurfa_cart behavior)
 */

export const CART_STORAGE_KEY = 'hurfa_cart';

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to read cart from storage:', err);
  }
  return [];
}

export function saveCart(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('hurfa-cart-updated'));
  } catch (err) {
    console.error('Failed to save cart to storage:', err);
  }
}

export function addToCart(product, quantity = 1, finishOption = null) {
  if (!product) return;

  const currentCart = getCart();
  const priceNum = product.priceNumber !== undefined 
    ? product.priceNumber 
    : typeof product.price === 'number' 
    ? product.price 
    : parseFloat(String(product.price || '').replace(/[^0-9.]/g, '')) || 0;

  const finalPrice = product.salePrice ? product.salePrice : priceNum;
  const image = product.images?.[0] || product.image || product.mainImage || 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg';

  const cartItemId = finishOption ? `${product.id}-${finishOption}` : String(product.id);
  const displayName = finishOption ? `${product.name || product.title} (${finishOption})` : (product.name || product.title);

  const existingIndex = currentCart.findIndex((item) => String(item.id) === String(cartItemId));

  let updatedCart;
  if (existingIndex > -1) {
    updatedCart = currentCart.map((item, idx) =>
      idx === existingIndex
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    const newItem = {
      id: cartItemId,
      productId: product.id,
      name: displayName,
      category: product.category || 'Furniture',
      unitPrice: finalPrice,
      price: finalPrice,
      quantity: Math.max(1, quantity),
      image: image,
      finish: finishOption || '',
    };
    updatedCart = [newItem, ...currentCart];
  }

  saveCart(updatedCart);
  return updatedCart;
}

export function removeFromCart(itemId) {
  const currentCart = getCart();
  const updatedCart = currentCart.filter((item) => String(item.id) !== String(itemId));
  saveCart(updatedCart);
  return updatedCart;
}

export function updateCartQuantity(itemId, delta) {
  const currentCart = getCart();
  const updatedCart = currentCart.map((item) => {
    if (String(item.id) === String(itemId)) {
      const newQty = Math.max(1, item.quantity + delta);
      return { ...item, quantity: newQty };
    }
    return item;
  });
  saveCart(updatedCart);
  return updatedCart;
}

export function clearCart() {
  saveCart([]);
}
