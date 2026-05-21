import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

async function submitReservation(payload) {
  const url = `${SUPABASE_URL}/rest/v1/reservations`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
}

const MODAL_CLOSE_MS = 380;

function initSuccessModal(modal, form, statusEl) {
  document.body.prepend(modal);

  const confirmBtn = modal.querySelector('.success-modal__btn');
  const closeTargets = modal.querySelectorAll('[data-modal-close]');
  let savedScrollY = 0;

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);

    window.setTimeout(() => {
      modal.hidden = true;
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = false;
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
      }
      form.reset();
      form.querySelectorAll('input[name="order_items"]').forEach((el) => {
        el.checked = false;
      });
      const orderItemsWrap = form.querySelector('#order-items');
      if (orderItemsWrap) orderItemsWrap.hidden = true;
      form.querySelectorAll('[data-order-group]').forEach((group) => {
        group.hidden = true;
      });
    }, MODAL_CLOSE_MS);
  };

  closeTargets.forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  return {
    openModal: () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      savedScrollY = window.scrollY;
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      document.body.style.top = `-${savedScrollY}px`;

      requestAnimationFrame(() => {
        modal.classList.add('is-open');
        confirmBtn?.focus({ preventScroll: true });
      });
    },
    closeModal,
  };
}

function showReservationComplete(modalApi) {
  modalApi.openModal();
}

function initOrderItems(form) {
  const orderItemsWrap = form.querySelector('#order-items');
  const groups = form.querySelectorAll('[data-order-group]');
  const categoryInputs = form.querySelectorAll('input[name="order_category"]');

  if (!orderItemsWrap || !groups.length) return;

  const showGroup = (category) => {
    groups.forEach((group) => {
      const isActive = group.dataset.orderGroup === category;
      group.hidden = !isActive;
      if (!isActive) {
        group.querySelectorAll('input[name="order_items"]').forEach((input) => {
          input.checked = false;
        });
      }
    });
    orderItemsWrap.hidden = !category;
  };

  categoryInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) showGroup(input.value);
    });
  });
}

function collectOrderData(form) {
  const categoryInput = form.querySelector('input[name="order_category"]:checked');
  const orderCategory = categoryInput?.value || null;
  const orderItems = [...form.querySelectorAll('input[name="order_items"]:checked')].map(
    (el) => el.value
  );

  return {
    order_category: orderCategory,
    order_items: orderItems.length > 0 ? orderItems : null,
  };
}

export function initReservation() {
  const form = document.getElementById('reservation-form');
  const statusEl = document.getElementById('form-status');
  const modal = document.getElementById('reservation-success-modal');

  if (!form || !modal) return;

  const modalApi = initSuccessModal(modal, form, statusEl);

  initOrderItems(form);

  const today = new Date().toISOString().split('T')[0];
  const dateInput = form.querySelector('#date');
  if (dateInput) dateInput.min = today;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      statusEl.textContent =
        'Supabase 설정이 없습니다. src/config.js 파일을 확인해 주세요.';
      statusEl.classList.add('is-error');
      return;
    }

    const data = new FormData(form);
    const name = data.get('name')?.toString().trim();
    const contact = data.get('contact')?.toString().trim();
    const date = data.get('date')?.toString();
    const time = data.get('time')?.toString();
    const people = parseInt(data.get('people')?.toString() || '1', 10);
    const memo = data.get('message')?.toString().trim() || null;
    const { order_category, order_items } = collectOrderData(form);

    if (!name || !contact || !date || !time) {
      statusEl.textContent = '필수 항목을 모두 입력해 주세요.';
      statusEl.classList.add('is-error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      await submitReservation({
        name,
        contact,
        date,
        time,
        people: Number.isNaN(people) ? 1 : people,
        memo: memo || null,
        order_category,
        order_items,
      });

      showReservationComplete(modalApi);
    } catch (err) {
      console.error(err);
      statusEl.textContent =
        '예약 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      statusEl.classList.add('is-error');
      submitBtn.disabled = false;
    }
  });
}
