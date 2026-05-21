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
  const confirmBtn = modal.querySelector('.success-modal__btn');
  const closeTargets = modal.querySelectorAll('[data-modal-close]');
  let savedScrollY = 0;

  const closeModal = () => {
    modal.classList.remove('is-open', 'is-active');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('hidden', '');
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);

    window.setTimeout(() => {
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
      if (orderItemsWrap) {
        orderItemsWrap.classList.remove('is-visible');
        orderItemsWrap.setAttribute('hidden', '');
      }
      form.querySelectorAll('[data-order-group]').forEach((group) => {
        setOrderGroupVisible(group, false);
      });
      form.querySelectorAll('input[name="order_category"]').forEach((input) => {
        input.checked = false;
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
      modal.removeAttribute('hidden');
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-active');
      document.body.classList.add('modal-open');
      document.body.style.top = `-${savedScrollY}px`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          modal.classList.add('is-open');
          confirmBtn?.focus({ preventScroll: true });
        });
      });
    },
    closeModal,
  };
}

function showReservationComplete(modalApi) {
  modalApi.openModal();
}

function setOrderGroupVisible(group, visible) {
  if (visible) {
    group.classList.add('is-visible');
    group.removeAttribute('hidden');
  } else {
    group.classList.remove('is-visible');
    group.setAttribute('hidden', '');
    group.querySelectorAll('input[name="order_items"]').forEach((input) => {
      input.checked = false;
    });
  }
}

function initOrderItems(form) {
  const orderItemsWrap = form.querySelector('#order-items');
  const categoryWrap = form.querySelector('.order-category');
  const groups = form.querySelectorAll('[data-order-group]');

  if (!orderItemsWrap || !categoryWrap || !groups.length) return;

  const showGroup = (category) => {
    if (!category) {
      orderItemsWrap.classList.remove('is-visible');
      orderItemsWrap.setAttribute('hidden', '');
      groups.forEach((group) => setOrderGroupVisible(group, false));
      return;
    }

    orderItemsWrap.classList.add('is-visible');
    orderItemsWrap.removeAttribute('hidden');

    groups.forEach((group) => {
      setOrderGroupVisible(group, group.dataset.orderGroup === category);
    });
  };

  const onCategoryPick = (input) => {
    if (!input?.value) return;
    input.checked = true;
    showGroup(input.value);
  };

  categoryWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.order-category__btn');
    if (!btn) return;
    const input = btn.querySelector('input[type="radio"]');
    onCategoryPick(input);
  });

  form.querySelectorAll('input[name="order_category"]').forEach((input) => {
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

  if (!form) return;

  const modalApi = modal ? initSuccessModal(modal, form, statusEl) : null;

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
        'Supabase 설정이 없습니다. .env 또는 Vercel 환경 변수를 확인해 주세요.';
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

      submitBtn.disabled = false;
      if (modalApi) {
        showReservationComplete(modalApi);
      } else {
        statusEl.textContent = '예약 신청이 완료되었습니다.';
        statusEl.classList.add('is-success');
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent =
        '예약 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      statusEl.classList.add('is-error');
      submitBtn.disabled = false;
    }
  });
}
