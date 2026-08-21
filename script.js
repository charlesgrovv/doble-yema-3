const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Obrigado! Sua mensagem foi registrada. Entraremos em contato em breve.');
    contactForm.reset();
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
const checkoutForm = document.getElementById('checkoutForm');
const checkoutName = document.getElementById('checkoutName');
const checkoutEmail = document.getElementById('checkoutEmail');
const checkoutQuantity = document.getElementById('checkoutQuantity');
const cardButton = document.getElementById('cardButton');
const pixButton = document.getElementById('pixButton');
const paymentInstructions = document.getElementById('paymentInstructions');
const eggSound = document.getElementById('eggSound');
let activePaymentMethod = 'card';

if (eggSound) {
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
  const remaining = Number(button.dataset.remaining ?? button.dataset.stock ?? 20);

  button.dataset.remaining = String(remaining);
  button.disabled = remaining <= 0;
  button.textContent = remaining > 0 ? 'Comprar' : 'Agotado';

  if (badge) {
    badge.textContent = remaining > 0
      ? `Solo ${remaining} ${remaining === 1 ? 'unidad disponible' : 'unidades disponibles'}`
      : 'Agotado';
  }
}

function setPaymentMethod(method) {
  activePaymentMethod = method;
  cardButton.classList.toggle('active', method === 'card');
  pixButton.classList.toggle('active', method === 'pix');

  if (method === 'card') {
    paymentInstructions.innerHTML = '<strong>Cartão de crédito/débito:</strong> seu pedido será confirmado por WhatsApp e a cobrança será organizada diretamente com a equipe da Doble Yema.';
  } else {
    paymentInstructions.innerHTML = '<strong>Pix:</strong> após confirmar o pedido, você recebe o valor e a chave para transferência. O código também pode ser copiado automaticamente.';
  }
}

function openCheckout(productName, productPrice, stock) {
  checkoutProductName.textContent = productName;
  checkoutProductPrice.textContent = `R$ ${productPrice}`;
  checkoutForm.reset();
  checkoutQuantity.value = '1';
  checkoutQuantity.max = String(stock);
  checkoutQuantity.min = '1';
  checkoutForm.dataset.stock = String(stock);
  setPaymentMethod('card');
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
}

function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
}

galleryImages.forEach(img => {
  img.addEventListener('pointerenter', () => {
    if (eggSound) {
      eggSound.currentTime = 0;
      eggSound.play().catch(() => {
        // Som pode não carregar se o arquivo não existir ou se ainda não houver gesto do usuário.
      });
    }
  });

  img.addEventListener('click', (e) => {
    if (modal && modalImage && modalContent) {
      modal.classList.add('open');
      modalImage.src = e.currentTarget.src;
      const isShirt = e.currentTarget.closest('.gallery-card').classList.contains('shirt');
      modalContent.classList.toggle('shirt', isShirt);
    }
  });
});

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

document.querySelectorAll('.buy-button').forEach((button) => {
  updateProductAvailability(button);

  button.addEventListener('click', (event) => {
    event.stopPropagation();

    const remaining = Number(button.dataset.remaining ?? button.dataset.stock ?? 20);
    if (remaining <= 0) {
      return;
    }

    openCheckout(button.dataset.product, button.dataset.price, remaining);
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

if (cardButton && pixButton) {
  cardButton.addEventListener('click', () => setPaymentMethod('card'));
  pixButton.addEventListener('click', () => setPaymentMethod('pix'));
}

if (checkoutForm) {
  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = checkoutName?.value.trim() || 'Cliente';
    const email = checkoutEmail?.value.trim() || 'sem e-mail';
    const quantity = Number(checkoutQuantity?.value || 1);
    const maxStock = Number(checkoutForm.dataset.stock || checkoutQuantity?.max || 20);
    const methodLabel = activePaymentMethod === 'pix' ? 'Pix' : 'Crédito / débito';

    if (!Number.isInteger(quantity) || quantity < 1) {
      alert('Selecciona una cantidad válida.');
      return;
    }

    if (quantity > maxStock) {
      alert(`Solo quedan ${maxStock} ${maxStock === 1 ? 'unidad' : 'unidades'} disponibles.`);
      checkoutQuantity.value = String(maxStock);
      return;
    }

    const remaining = maxStock - quantity;
    const matchingButton = Array.from(document.querySelectorAll('.buy-button')).find((button) => button.dataset.product === checkoutProductName.textContent);

    if (matchingButton) {
      matchingButton.dataset.remaining = String(remaining);
      updateProductAvailability(matchingButton);
    }

    const message = `Pedido recebido para ${checkoutProductName.textContent} (${quantity} unidade(s)). ${name} — ${email}. Forma de pagamento: ${methodLabel}.`;

    if (activePaymentMethod === 'pix') {
      navigator.clipboard?.writeText('dobleyema@pix').catch(() => {
        // Falha ao copiar; o usuário pode usar a informação manualmente.
      });
    }

    alert(`${message}\n\nA equipe da Doble Yema irá confirmar o pedido em breve.`);
    closeCheckout();
  });
}

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
