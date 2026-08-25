const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

// Dropdown functionality
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownContent = document.querySelector('.dropdown-content');

if (dropdownToggle && dropdownContent) {
  dropdownToggle.addEventListener('click', () => {
    const isOpen = dropdownContent.classList.toggle('open');
    dropdownToggle.setAttribute('aria-expanded', isOpen);
  });
}

// Egg globe hero removed — restored original behavior
const galleryImages = document.querySelectorAll('.gallery-card img');
const modal = document.getElementById('imageModal');
const modalContent = document.querySelector('.modal-content');
const modalImage = document.getElementById('modalImage');
const modalClose = document.querySelector('.modal-close');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutClose = document.querySelector('.checkout-close');
const checkoutProductName = document.getElementById('checkoutProductName');
const checkoutProductPrice = document.getElementById('checkoutProductPrice');
const checkoutQuantityLabel = document.getElementById('checkoutQuantityLabel');
const checkoutDynamicContent = document.getElementById('checkoutDynamicContent');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutName = document.getElementById('checkoutName');
const checkoutEmail = document.getElementById('checkoutEmail');
const eggSoundEnabled = false;
const eggSound = document.getElementById('eggSound');
const cartIcon = document.getElementById('cartIcon');
const cartBadge = document.getElementById('cartBadge');

let activePaymentMethod = 'card';
let cart = []; // array of {product, price, quantity, stock}

if (eggSoundEnabled && eggSound) {
  document.body.addEventListener('click', () => {
    eggSound.play().then(() => {
      eggSound.pause();
      eggSound.currentTime = 0;
    }).catch(() => {
      // O navegador pode bloquear reprodução automática antes da primeira interação.
    });
  }, { once: true });
}

function updateProductAvailability(button) {
  const card = button.closest('.gallery-card');
  const badge = card?.querySelector('.product-badge');
  const stock = Number(button.dataset.stock ?? 20);
  const cartItem = cart.find(item => item.product === button.dataset.product);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const available = stock - cartQty;

  button.dataset.remaining = String(available);
  button.disabled = available <= 0;
  button.textContent = available > 0 ? 'AÑADIR AL CARRITO' : 'AGOTADO';

  if (badge) {
    badge.textContent = available > 0
      ? `Solo ${available} ${available === 1 ? 'unidad disponible' : 'unidades disponibles'}`
      : 'AGOTADO';
  }
}

function openCheckout(productName, productPrice, stock) {
  // Single product checkout
  checkoutForm.hidden = false;
  checkoutProductName.textContent = productName;
  checkoutProductPrice.textContent = `R$ ${productPrice}`;
  checkoutQuantityLabel.textContent = 'Cantidad: 1';

  // Dynamic content: show product image and details
  checkoutDynamicContent.innerHTML = `
    <div class="checkout-product-thumb">
      <img src="assets/${document.querySelector(`[data-product="${productName}"]`)?.dataset.image || ''}" alt="${productName}">
    </div>
    <p>Edición limitada: 20 unidades disponibles</p>
  `;

  // Reset form
  checkoutForm.reset();
  delete checkoutForm.dataset.cart;
  checkoutForm.dataset.product = productName;
  checkoutForm.dataset.price = productPrice;
  checkoutForm.dataset.stock = stock;

  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
}

function openBundleCheckout() {
  // Bundle checkout
  checkoutForm.hidden = false;
  checkoutProductName.textContent = 'EL DROP COMPLETO';
  checkoutProductPrice.textContent = 'R$ 799';
  checkoutQuantityLabel.textContent = 'Cantidad: 1';

  checkoutDynamicContent.innerHTML = `
    <div class="checkout-product-thumb bundle-preview" aria-label="Las seis piezas del drop">
      ${[1, 2, 3, 4, 5, 6].map((piece) => `<img src="assets/piece-${piece}.png" alt="Pieza ${piece}">`).join('')}
    </div>
    <p>6 camisetas + edición completa + packaging especial</p>
    <p>Ahorras R$ 95 respecto al precio individual</p>
  `;

  // Reset form
  checkoutForm.reset();
  delete checkoutForm.dataset.cart;
  checkoutForm.dataset.product = 'EL DROP COMPLETO';
  checkoutForm.dataset.price = 799;
  checkoutForm.dataset.stock = 1; // assuming limited bundle stock

  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
}

function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  checkoutForm.hidden = false;
}

function openEmptyCart() {
  checkoutProductName.textContent = 'Tu carrito está vacío';
  checkoutProductPrice.textContent = 'Aún no has elegido ninguna pieza.';
  checkoutQuantityLabel.textContent = '';
  checkoutDynamicContent.innerHTML = '<p>Explora el drop y añade tu pieza favorita para verla aquí.</p>';
  delete checkoutForm.dataset.cart;
  delete checkoutForm.dataset.product;
  checkoutForm.hidden = true;
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
}

// Initialize cart badge from icon
function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalQty;
}

function renderCartSummary() {
  let total = 0;
  const summary = cart.map((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    return `
      <div class="cart-line">
        <div>
          <strong>${item.product}</strong>
          <span>R$ ${item.price} cada</span>
        </div>
        <div class="cart-line-actions">
          <button type="button" class="quantity-button" data-cart-action="decrease" data-product="${item.product}" aria-label="Quitar una unidad de ${item.product}">−</button>
          <span class="cart-quantity">${item.quantity}</span>
          <button type="button" class="quantity-button" data-cart-action="increase" data-product="${item.product}" aria-label="Añadir una unidad de ${item.product}">+</button>
          <strong>R$ ${subtotal.toFixed(2)}</strong>
        </div>
      </div>
    `;
  }).join('');

  checkoutProductName.textContent = 'Tu carrito';
  checkoutProductPrice.textContent = `Total: R$ ${total.toFixed(2)}`;
  checkoutQuantityLabel.textContent = '';
  checkoutDynamicContent.innerHTML = `<p>Revisa y ajusta tu pedido:</p><div class="cart-lines">${summary}</div>`;
  checkoutForm.dataset.cart = JSON.stringify(cart);
}

// Add to cart (keeping for possible future use, but not primary flow)
document.querySelectorAll('.buy-button').forEach((button) => {
  updateProductAvailability(button);
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const available = Number(button.dataset.remaining);
    if (available <= 0) return;
    const product = button.dataset.product;
    const price = Number(button.dataset.price);
    const stock = Number(button.dataset.stock);
    const cartItem = cart.find(item => item.product === product);
    if (cartItem) {
      if (cartItem.quantity < stock) {
        cartItem.quantity++;
      } else {
        alert('Sin stock disponible.');
        return;
      }
    } else {
      cart.push({ product, price, quantity: 1, stock });
    }
    updateCartBadge();
    updateProductAvailability(button); // refresh availability
  });
});

if (cartIcon) {
  cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      openEmptyCart();
      return;
    }
    checkoutForm.hidden = false;
    renderCartSummary();
    checkoutModal.classList.add('open');
    checkoutModal.setAttribute('aria-hidden', 'false');
  });
}

checkoutDynamicContent.addEventListener('click', (event) => {
  const control = event.target.closest('[data-cart-action]');
  if (!control) return;

  const item = cart.find(cartItem => cartItem.product === control.dataset.product);
  if (!item) return;

  if (control.dataset.cartAction === 'increase' && item.quantity < item.stock) {
    item.quantity++;
  } else if (control.dataset.cartAction === 'decrease') {
    item.quantity--;
    if (item.quantity <= 0) {
      cart = cart.filter(cartItem => cartItem.product !== item.product);
    }
  }

  updateCartBadge();
  document.querySelectorAll('.buy-button').forEach(updateProductAvailability);

  if (cart.length === 0) {
    closeCheckout();
    openEmptyCart();
  } else {
    renderCartSummary();
  }
});

// Existing modal and checkout close handlers
if (modal && modalClose && modalContent) {
  modalClose.addEventListener('click', () => {
    modal.classList.remove('open');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });
}

galleryImages.forEach(img => {
  img.addEventListener('pointerenter', () => {
    if (eggSoundEnabled && eggSound) {
      eggSound.currentTime = 0;
      eggSound.play().catch(() => {
        // Som pode não carregar se o arquivo não existir ou se ainda não houver gesto do usuário.
      });
    }
  });

  img.addEventListener('click', (e) => {
    if (modal && modalImage && modalContent) {
      modal.classList.add('open');
      modalImage.src = e.currentTarget.getAttribute('src');
      modalImage.alt = e.currentTarget.alt || 'Vista ampliada';
      const isShirt = e.currentTarget.closest('.gallery-card').classList.contains('shirt');
      modalContent.classList.toggle('shirt', isShirt);
    }
  });
});

if (checkoutClose && checkoutModal) {
  checkoutClose.addEventListener('click', closeCheckout);
  checkoutModal.addEventListener('click', (event) => {
    if (event.target === checkoutModal) {
      closeCheckout();
    }
  });
}

// Form submit: generate WhatsApp message
checkoutForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = checkoutName?.value.trim() || 'Cliente';
  const email = checkoutEmail?.value.trim() || 'sem e-mail';
  const product = checkoutForm.dataset.product || 'Producto desconocido';
  const price = checkoutForm.dataset.price || '0';
  const quantity = 1; // we are selling one at a time

  // If we have cart data, use that
  if (checkoutForm.dataset.cart) {
    const cartData = JSON.parse(checkoutForm.dataset.cart);
    let message = 'Has encontrado una Doble Yema. 🥚🥚\n\n';
    message += 'Pedido recibido:\n';
    cartData.forEach(item => {
      message += `- ${item.product} (${item.quantity} uds.): R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    const total = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `\nTotal: R$ ${total.toFixed(2)}\n`;
    message += `${name} — ${email}.`;

    // Clear cart
    cart = [];
    updateCartBadge();

    // Refresh stock labels after checkout.
    cartData.forEach(item => {
      const button = Array.from(document.querySelectorAll('.buy-button')).find(b => b.dataset.product === item.product);
      if (button) {
        updateProductAvailability(button);
      }
    });
  } else {
    // Single product or bundle
    let message = 'Has encontrado una Doble Yema. 🥚🥚\n\n';
    message += `Producto: ${product}\n`;
    message += `Precio: R$ ${price}\n`;
    message += `Cantidad: ${quantity}\n`;
    message += `${name} — ${email}.\n`;

    // Update stock if it's a regular product (not bundle)
    if (product !== 'EL DROP COMPLETO') {
      const button = Array.from(document.querySelectorAll('.buy-button')).find(b => b.dataset.product === product);
      if (button) {
        const remaining = Number(button.dataset.stock) - quantity;
        button.dataset.remaining = String(remaining);
        updateProductAvailability(button);
      }
    }
  }

  // Encode message for WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  // Open WhatsApp
  window.open(whatsappUrl, '_blank');

  // Optional: show confirmation
  alert('Se abrirá WhatsApp para completar tu pedido. ¡Gracias!');

  closeCheckout();
});

// Initialize product buttons to open checkout (instead of add to cart)
// We'll keep the add-to-cart behavior but also allow direct purchase?
// According to spec, we want direct WhatsApp per product.
// Let's change the buy-button to open checkout directly, bypassing cart.
// But we also want to keep cart for multiple items? We'll keep both: left-click for direct, right-click for cart? Too complex.
// We'll change: clicking buy-button opens the product checkout modal.
// We'll keep the cart icon for those who want to buy multiple items.
// Bundle button
const bundleButton = document.querySelector('.bundle-button');
if (bundleButton) {
  bundleButton.addEventListener('click', (e) => {
    e.preventDefault();
    openBundleCheckout();
  });
}

// Esc key handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
    if (checkoutModal && checkoutModal.classList.contains('open')) {
      closeCheckout();
    }
  }
});