/**
 * 예약 폼 + 간편 주문 + 완료 모달 (모듈 없이 동작)
 */
(function () {
  var SUPABASE_URL = 'https://uvrlchwzcdmfpwdllbpi.supabase.co';
  var SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cmxjaHd6Y2RtZnB3ZGxsYnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzQzMDYsImV4cCI6MjA5NDkxMDMwNn0.Qy--uf_XduKU5aZdeeroclCUe3DCc35NiuDyrqz1_6E';

  function init() {
    var form = document.getElementById('reservation-form');
    var statusEl = document.getElementById('form-status');
    var modal = document.getElementById('reservation-success-modal');

    if (!form || form.dataset.bound === '1') return;
    form.dataset.bound = '1';

    initOrderItems(form);
    if (modal) initSuccessModal(modal, form, statusEl);

    var dateInput = form.querySelector('#date');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
      }

      var name = (form.querySelector('#name')?.value || '').trim();
      var contact = (form.querySelector('#contact')?.value || '').trim();
      var date = form.querySelector('#date')?.value || '';
      var time = form.querySelector('#time')?.value || '';
      var people = parseInt(form.querySelector('#people')?.value || '1', 10);
      var memo = (form.querySelector('#message')?.value || '').trim() || null;
      var orderData = collectOrderData(form);

      if (!name || !contact || !date || !time) {
        if (statusEl) {
          statusEl.textContent = '필수 항목을 모두 입력해 주세요.';
          statusEl.classList.add('is-error');
        }
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch(SUPABASE_URL + '/rest/v1/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          name: name,
          contact: contact,
          date: date,
          time: time,
          people: isNaN(people) ? 1 : people,
          memo: memo,
          order_category: orderData.order_category,
          order_items: orderData.order_items,
        }),
      })
        .then(function (res) {
          if (!res.ok) {
            return res.text().then(function (t) {
              throw new Error(t || 'HTTP ' + res.status);
            });
          }
          if (submitBtn) submitBtn.disabled = false;
          openSuccessModal(modal);
        })
        .catch(function (err) {
          console.error(err);
          if (submitBtn) submitBtn.disabled = false;
          if (statusEl) {
            statusEl.textContent =
              '예약 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
            statusEl.classList.add('is-error');
          }
        });
    });
  }

  function setVisible(el, visible) {
    if (!el) return;
    if (visible) {
      el.classList.remove('is-hidden');
      el.classList.add('is-visible');
    } else {
      el.classList.add('is-hidden');
      el.classList.remove('is-visible');
    }
  }

  function initOrderItems(form) {
    var wrap = form.querySelector('#order-items');
    var categoryWrap = form.querySelector('.order-category');
    var groups = form.querySelectorAll('[data-order-group]');

    if (!wrap || !categoryWrap || !groups.length) return;

    function showCategory(category) {
      if (!category) {
        setVisible(wrap, false);
        groups.forEach(function (g) {
          setVisible(g, false);
          g.querySelectorAll('input[name="order_items"]').forEach(function (i) {
            i.checked = false;
          });
        });
        return;
      }
      setVisible(wrap, true);
      groups.forEach(function (g) {
        var on = g.getAttribute('data-order-group') === category;
        setVisible(g, on);
        if (!on) {
          g.querySelectorAll('input[name="order_items"]').forEach(function (i) {
            i.checked = false;
          });
        }
      });
    }

    categoryWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.order-category__btn');
      if (!btn) return;
      var radio = btn.querySelector('input[type="radio"]');
      if (!radio) return;
      radio.checked = true;
      showCategory(radio.value);
    });

    form.querySelectorAll('input[name="order_category"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (radio.checked) showCategory(radio.value);
      });
    });
  }

  function collectOrderData(form) {
    var cat = form.querySelector('input[name="order_category"]:checked');
    var items = [];
    form.querySelectorAll('input[name="order_items"]:checked').forEach(function (i) {
      items.push(i.value);
    });
    return {
      order_category: cat ? cat.value : null,
      order_items: items.length ? items : null,
    };
  }

  var modalState = { scrollY: 0, closeTimer: null };

  function openSuccessModal(modal) {
    if (!modal) return;

    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }

    modalState.scrollY = window.scrollY || 0;
    modal.classList.remove('is-hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.body.style.top = '-' + modalState.scrollY + 'px';

    requestAnimationFrame(function () {
      modal.classList.add('is-active', 'is-open');
    });
  }

  function closeSuccessModal(modal, form, statusEl) {
    if (!modal) return;
    modal.classList.remove('is-open', 'is-active');
    modal.classList.add('is-hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    window.scrollTo(0, modalState.scrollY);

    if (form) {
      form.reset();
      var wrap = form.querySelector('#order-items');
      setVisible(wrap, false);
      form.querySelectorAll('[data-order-group]').forEach(function (g) {
        setVisible(g, false);
      });
      form.querySelectorAll('input[name="order_category"]').forEach(function (r) {
        r.checked = false;
      });
    }
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'form-status';
    }
    var submitBtn = form && form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = false;
  }

  function initSuccessModal(modal, form, statusEl) {
    modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        closeSuccessModal(modal, form, statusEl);
      });
    });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeSuccessModal(modal, form, statusEl);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
