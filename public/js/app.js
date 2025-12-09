// Internet Camargo - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Setup form handlers
    setupRegistroForm();
    setupContactoForm();
    setupOrderForm();
    setupCatalog();
    setupSalesModal();
    setupServiceCardLinks();
    setupImageLightbox();
    setupOpenStatus();
    setupOrderAvailability();
    // Populate services select (no hay planes de internet)
    populateServicios();
    // Extras: mostrar banner de fin de semana y animar bloque C++
    showWeekendBanner();
    animateCppCode();
});
// Populate servicios select with static options
function populateServicios() {
    try {
        const select = document.getElementById('servicio');
        if (!select) return;
        // If options already present, skip
        if (select.options.length > 1) return;
        const servicios = [
            { value: 'platillos', text: 'Platillos de Pollo (fines de semana)' },
            { value: 'reparacion', text: 'Reparación de Computadoras' },
            { value: 'ciber', text: 'Ciber - Renta de PC y Servicios' }
        ];
        servicios.forEach(s => {
            const option = document.createElement('option');
            option.value = s.value;
            option.textContent = s.text;
            select.appendChild(option);
        });
    } catch (e) {
        console.error('Error populating servicios', e);
    }
}

// Setup a minimal sales modal (mini-catalog) for the three sales cards
function setupSalesModal() {
    try {
        const modal = document.getElementById('catalog-modal');
        const modalBody = document.getElementById('catalog-modal-body');
        const modalTitle = document.getElementById('catalog-modal-title');
        const closeBtn = modal ? modal.querySelector('.catalog-modal-close') : null;
        if (!modal || !modalBody || !modalTitle) return;

        const catalogs = {
            'venta-toner': {
                title: 'Venta y Recarga de Tóner',
                items: [
                    { name: 'Recarga tóner láser (negro)', desc: 'Recarga profesional con prueba de impresión.', price: 'Desde $120' },
                    { name: 'Tóner compatible', desc: 'Alta calidad compatible con equipos comunes.', price: 'Desde $350' }
                ]
            },
            'venta-cartucho': {
                title: 'Venta y Recarga de Cartuchos',
                items: [
                    { name: 'Recarga cartucho de tinta', desc: 'Recarga con tinta pigmentada o a base de color según modelo.', price: 'Desde $50' },
                    { name: 'Cartucho remanufacturado', desc: 'Opción económica con buena calidad.', price: 'Desde $120' }
                ]
            },
            'venta-equipos': {
                title: 'Venta de Equipos de Cómputo',
                items: [
                    { name: 'Laptop reacondicionada', desc: 'Revisada y con garantía limitada.', price: 'Desde $5,000' },
                    { name: 'PC de escritorio', desc: 'Ensambladas según necesidad (oficina/juegos).', price: 'Desde $4,500' }
                ]
            }
        };

        function openFor(id) {
            const data = catalogs[id];
            if (!data) return;
            modalTitle.textContent = data.title || 'Catálogo';
            modalBody.innerHTML = '';
            data.items.forEach(it => {
                const div = document.createElement('div');
                div.className = 'catalog-item';
                div.innerHTML = `<h4>${it.name}</h4><p>${it.desc}</p><div class="price">${it.price}</div>`;
                modalBody.appendChild(div);
            });
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (closeBtn) closeBtn.focus();
        }

        function closeModal() {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        ['venta-toner','venta-cartucho','venta-equipos'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('click', (e) => { e.preventDefault(); openFor(id); });
            el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFor(id); } });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });

    } catch (err) {
        console.error('Error setting up sales modal', err);
    }
}

// Setup open/closed status for the Ciber (8:00 - 18:00)
function setupOpenStatus() {
    try {
        const badge = document.getElementById('open-status');
        if (!badge) return;

        const OPEN_HOUR = 8; // 8:00
        const CLOSE_HOUR = 18; // 18:00 (6 PM)

        function formatRange() {
            return `${String(OPEN_HOUR).padStart(2,'0')}:00–${String(CLOSE_HOUR).padStart(2,'0')}:00`;
        }

        function updateStatus() {
            const now = new Date();
            const day = now.getDay(); // 0 = Sunday, 6 = Saturday
            const hour = now.getHours();

            // Open only Monday (1) through Saturday (6)
            const isWeekdayOpen = (day >= 1 && day <= 6);
            const isOpenHour = (hour >= OPEN_HOUR && hour < CLOSE_HOUR);
            const isOpen = isWeekdayOpen && isOpenHour;

            // Prepare dot and text
            if (isOpen) {
                badge.classList.remove('closed');
                badge.classList.add('open');
                badge.innerHTML = `<span class="os-dot"></span><span class="os-text">Abierto ahora · ${formatRange()}</span>`;
            } else {
                badge.classList.remove('open');
                badge.classList.add('closed');
                let text = '';
                if (day === 0) {
                    // Sunday: closed, next open Monday
                    text = `Cerrado · Abre lunes ${String(OPEN_HOUR).padStart(2,'0')}:00`;
                } else if (hour < OPEN_HOUR) {
                    text = `Cerrado · Abre hoy a las ${String(OPEN_HOUR).padStart(2,'0')}:00`;
                } else {
                    // after close
                    // if today is Saturday (6), next open is Monday
                    if (day === 6) {
                        text = `Cerrado · Abre lunes ${String(OPEN_HOUR).padStart(2,'0')}:00`;
                    } else {
                        text = `Cerrado · Abre mañana a las ${String(OPEN_HOUR).padStart(2,'0')}:00`;
                    }
                }
                badge.innerHTML = `<span class="os-dot"></span><span class="os-text">${text}</span>`;
            }
        }

        // initial update
        updateStatus();
        // update every 30 seconds to reflect changes near opening/closing
        setInterval(updateStatus, 30 * 1000);
    } catch (err) {
        console.error('Error setting up open status', err);
    }
}

// (No plans UI) UI focuses on servicios, ciber y pedidos

// Mostrar banner si es fin de semana
function showWeekendBanner() {
    try {
        const banner = document.getElementById('weekend-banner');
        if (!banner) return;
        const today = new Date().getDay(); // 0 = Domingo, 6 = Sábado
        if (today === 0 || today === 6) {
            banner.style.display = 'block';
        }
    } catch (e) {
        console.error('Error mostrando banner de fin de semana', e);
    }
}

// Animación simple para mostrar el bloque C++ carácter por carácter
function animateCppCode() {
    try {
        const pre = document.getElementById('cpp-code');
        if (!pre) return;
        const original = pre.textContent.trim();
        pre.textContent = '';
        let i = 0;
        const speed = 12; // ms por carácter
        const timer = setInterval(() => {
            pre.textContent += original.charAt(i);
            i++;
            if (i >= original.length) clearInterval(timer);
        }, speed);
    } catch (e) {
        console.error('Error animando bloque C++', e);
    }
}

// Setup registration form
function setupRegistroForm() {
    const form = document.getElementById('registro-form');
    const mensaje = document.getElementById('registro-mensaje');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';

        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            plan: (document.getElementById('servicio') ? document.getElementById('servicio').value : '')
        };

        if (!formData.nombre || !formData.email) {
            mensaje.className = 'mensaje error';
            mensaje.textContent = 'Nombre y correo son requeridos.';
            mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        try {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando...'; }

            const response = await fetch('/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json().catch(() => ({}));

            if (response.ok) {
                mensaje.className = 'mensaje success';
                mensaje.textContent = '¡Registro exitoso! Nos pondremos en contacto contigo pronto.';
                form.reset();
            } else {
                mensaje.className = 'mensaje error';
                mensaje.textContent = result.error || 'Error al registrar. Por favor, intenta de nuevo.';
            }
        } catch (error) {
            mensaje.className = 'mensaje error';
            mensaje.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
            mensaje.style.display = 'block';
            mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Setup contact form
function setupContactoForm() {
    const form = document.getElementById('contacto-form');
    const mensaje = document.getElementById('contacto-mensaje');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';

        const formData = {
            nombre: document.getElementById('contacto-nombre').value.trim(),
            telefono: document.getElementById('contacto-telefono').value.trim(),
            email: document.getElementById('contacto-email').value.trim(),
            servicio: document.getElementById('contacto-servicio').value.trim(),
            mensaje: document.getElementById('mensaje').value.trim()
        };

        if (!formData.nombre || !formData.telefono || !formData.email || !formData.servicio || !formData.mensaje) {
            mensaje.className = 'mensaje error';
            mensaje.textContent = 'Todos los campos son requeridos.';
            mensaje.style.display = 'block';
            mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        try {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando...'; }
            const response = await fetch('/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json().catch(() => ({}));

            if (response.ok) {
                mensaje.className = 'mensaje success';
                mensaje.textContent = '¡Mensaje enviado! Te responderemos pronto.';
                form.reset();
            } else {
                mensaje.className = 'mensaje error';
                mensaje.textContent = result.error || 'Error al enviar. Por favor, intenta de nuevo.';
            }
        } catch (error) {
            mensaje.className = 'mensaje error';
            mensaje.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
            mensaje.style.display = 'block';
            mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Setup order form (platillos de pollo)
function setupOrderForm() {
    const form = document.getElementById('order-form');
    const mensaje = document.getElementById('order-mensaje');
    if (!form) return;

    // Recalculate price display and expose for catalog prefill
    function recalcOrderPriceDisplay() {
        const precioUnit = parseFloat(document.getElementById('order-precio').value) || 0;
        const cantidad = parseInt(document.getElementById('order-cantidad').value, 10) || 1;
        const extraEl = document.getElementById('order-extra');
        const extra = extraEl ? extraEl.value : '';
        const extraPrice = (extra === 'arroz' || extra === 'elote') ? 40 : 0;
        const total = (precioUnit * cantidad) + extraPrice;
        const precioDisplay = document.getElementById('order-precio-display');
        const extraDisplay = document.getElementById('order-extra-display');
        if (precioUnit > 0 && precioDisplay) {
            precioDisplay.textContent = `Precio unitario: $${precioUnit.toFixed(2)} — Total estimado: $${total.toFixed(2)}`;
        }
        if (extraDisplay) {
            extraDisplay.textContent = extraPrice > 0 ? `Extra seleccionado: ${extra} (+$${extraPrice})` : '';
        }
    }

    // expose globally so setupCatalog can call it after prefill
    window.recalcOrderPriceDisplay = recalcOrderPriceDisplay;

    // Attach listeners to recalc when quantity or extra changes
    const cantidadEl = document.getElementById('order-cantidad');
    const extraEl = document.getElementById('order-extra');
    if (cantidadEl) cantidadEl.addEventListener('change', recalcOrderPriceDisplay);
    if (extraEl) extraEl.addEventListener('change', recalcOrderPriceDisplay);

    // Initial display
    recalcOrderPriceDisplay();

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        // enforce Saturday-only ordering on submit
        const now = new Date();
        if (now.getDay() !== 6) {
            const mensaje = document.getElementById('order-mensaje');
            if (mensaje) {
                mensaje.className = 'mensaje error';
                mensaje.textContent = 'Los pedidos sólo se aceptan los sábados.';
                mensaje.style.display = 'block';
                mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        const cantidadVal = parseInt(document.getElementById('order-cantidad').value, 10) || 1;
        const precioUnit = parseFloat(document.getElementById('order-precio').value) || 0;
        const extra = document.getElementById('order-extra') ? document.getElementById('order-extra').value : '';
        const extraPrice = (extra === 'arroz' || extra === 'elote') ? 40 : 0;
        const totalComputed = +(precioUnit * cantidadVal) + extraPrice;
        const data = {
            nombre: document.getElementById('order-nombre').value,
            telefono: document.getElementById('order-telefono').value,
            direccion: document.getElementById('order-direccion').value,
            platillo: document.getElementById('order-platillo').value,
            cantidad: cantidadVal,
            notas: document.getElementById('order-notas').value,
            tipo_entrega: document.getElementById('order-tipo').value,
            precio_unitario: precioUnit,
            precio_total: totalComputed,
            extra: extra
        };
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';

        if (!data.nombre || !data.telefono || !data.platillo) {
            mensaje.className = 'mensaje error';
            mensaje.textContent = 'Nombre, teléfono y platillo son obligatorios.';
            mensaje.style.display = 'block';
            mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        try {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando pedido...'; }
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json().catch(() => ({}));

            if (response.ok) {
                mensaje.className = 'mensaje success';
                mensaje.textContent = 'Pedido enviado correctamente. ID: ' + (result.id || '—');
                form.reset();
                recalcOrderPriceDisplay();
            } else {
                mensaje.className = 'mensaje error';
                mensaje.textContent = result.error || 'Error al enviar el pedido.';
            }
        } catch (err) {
            mensaje.className = 'mensaje error';
            mensaje.textContent = 'Error de conexión. Intenta de nuevo.';
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
            mensaje.style.display = 'block';
            mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Disable or enable the pedidos UI depending on whether it's Saturday
function setupOrderAvailability() {
    try {
        const orderForm = document.getElementById('order-form');
        const catalogCards = document.querySelectorAll('.catalog-card');
        const catalogButtons = document.querySelectorAll('.catalog-btn');
        const orderClosedEl = document.getElementById('order-closed');

        const isSaturday = (new Date()).getDay() === 6;

        if (!isSaturday) {
            // show closed notice
            if (orderClosedEl) {
                orderClosedEl.style.display = 'block';
                orderClosedEl.textContent = 'Pedidos sólo disponibles los sábados. Puedes ver el menú, pero no realizar pedidos entre semana.';
            }
            // visually disable catalog cards and buttons
            catalogCards.forEach(c => c.classList.add('disabled'));
            catalogButtons.forEach(b => b.disabled = true);
            // disable order form inputs
            if (orderForm) {
                orderForm.classList.add('disabled');
                const elems = orderForm.querySelectorAll('input,select,textarea,button');
                elems.forEach(el => el.disabled = true);
            }
        } else {
            // Saturday: ensure enabled
            if (orderClosedEl) {
                orderClosedEl.style.display = 'none';
            }
            catalogCards.forEach(c => c.classList.remove('disabled'));
            catalogButtons.forEach(b => b.disabled = false);
            if (orderForm) {
                orderForm.classList.remove('disabled');
                const elems = orderForm.querySelectorAll('input,select,textarea,button');
                elems.forEach(el => el.disabled = false);
            }
        }

        // Re-run at midnight to update the state when day changes
        const now = new Date();
        const msUntilMidnight = (new Date(now.getFullYear(), now.getMonth(), now.getDate()+1) - now) + 1000;
        setTimeout(setupOrderAvailability, msUntilMidnight);
    } catch (err) {
        console.error('Error setting up order availability', err);
    }
}

// Setup catalog buttons to prefill order form and scroll to it
function setupCatalog() {
    try {
        const buttons = document.querySelectorAll('.catalog-btn');
        if (!buttons || buttons.length === 0) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const platillo = btn.dataset.platillo || '';
                    const cantidad = btn.dataset.cantidad || '1';
                    const precio = btn.dataset.precio || '';

                const orderForm = document.getElementById('order-form');
                if (!orderForm) return;

                const platilloEl = document.getElementById('order-platillo');
                const cantidadEl = document.getElementById('order-cantidad');
                const nombreEl = document.getElementById('order-nombre');
                const precioEl = document.getElementById('order-precio');
                const precioDisplay = document.getElementById('order-precio-display');

                if (platilloEl) platilloEl.value = platillo;
                if (cantidadEl) cantidadEl.value = cantidad;
                if (precioEl) precioEl.value = precio;
                if (precioDisplay) {
                    const qty = parseInt(cantidad, 10) || 1;
                    const unit = parseFloat(precio) || 0;
                    const total = (unit * qty).toFixed(2);
                    if (unit > 0) {
                        precioDisplay.textContent = `Precio unitario: $${unit.toFixed(2)} — Total estimado: $${total}`;
                    } else {
                        precioDisplay.textContent = '';
                    }
                }

                // Recalculate display (extras) if function is exposed
                try {
                    if (window.recalcOrderPriceDisplay && typeof window.recalcOrderPriceDisplay === 'function') {
                        window.recalcOrderPriceDisplay();
                    }
                } catch (e) {
                    // ignore
                }

                // Scroll to the order form and focus name
                orderForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (nombreEl) {
                    setTimeout(() => nombreEl.focus(), 600);
                }
            });
        });
    } catch (err) {
        console.error('Error setting up catalog buttons', err);
    }
}

// Make service cards with data-target navigable (click or Enter key)
function setupServiceCardLinks() {
    try {
        const cards = document.querySelectorAll('.servicio-card[data-target]');
        if (!cards || cards.length === 0) return;
        cards.forEach(card => {
            // keyboard accessible
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
            card.addEventListener('click', (e) => {
                const targetSelector = card.getAttribute('data-target');
                if (!targetSelector) return;
                const target = document.querySelector(targetSelector);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // fallback: change hash
                    window.location.hash = targetSelector;
                }
            });
        });
    } catch (err) {
        console.error('Error setting up service card links', err);
    }
}

// Setup a simple lightbox that toggles the image on repeated clicks
function setupImageLightbox() {
    try {
        // create the lightbox container and append to body if not present
        let existing = document.getElementById('lightbox');
        if (!existing) {
            const lb = document.createElement('div');
            lb.id = 'lightbox';
            lb.setAttribute('aria-hidden', 'true');
            lb.innerHTML = '<div class="lightbox-inner"><button class="lightbox-close" aria-label="Cerrar">\u00d7</button><img id="lightbox-img" src="" alt=""></div>';
            document.body.appendChild(lb);
        }

        const lightbox = document.getElementById('lightbox');
        const lbImg = document.getElementById('lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        let currentSrc = null;
        let lastTrigger = null;

        function openImage(src, trigger) {
            // toggle: if same image is open, close
            if (lightbox.classList.contains('open') && currentSrc === src) {
                closeImage();
                return;
            }
            currentSrc = src;
            lastTrigger = trigger || null;
            lbImg.src = src;
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            // indicate opened state on trigger
            if (lastTrigger && lastTrigger.classList) lastTrigger.classList.add('opened');
        }

        function closeImage() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            lbImg.src = '';
            currentSrc = null;
            document.body.style.overflow = '';
            if (lastTrigger && lastTrigger.classList) lastTrigger.classList.remove('opened');
            if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
            lastTrigger = null;
        }

        // attach handlers to any image with .lightbox-trigger
        const triggers = document.querySelectorAll('img.lightbox-trigger');
        triggers.forEach(img => {
            img.addEventListener('click', function(e) {
                // prevent parent anchors from navigating
                e.preventDefault();
                e.stopPropagation();
                const src = this.getAttribute('src') || this.dataset.src;
                if (!src) return;
                openImage(src, this);
            });
            img.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // close when clicking overlay (but not when clicking the image)
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target === closeBtn) {
                closeImage();
            }
        });

        // ESC to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                closeImage();
            }
        });
    } catch (err) {
        console.error('Error setting up image lightbox', err);
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
