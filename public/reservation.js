/**
 * 예약 폼 + 간편 주문 + 완료 모달 (모듈 없이 동작, 서버 전송 없음)
 */
(function () {
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

      if (!name || !contact || !date || !time) {
        if (statusEl) {
          statusEl.textContent = '필수 항목을 모두 입력해 주세요.';
          statusEl.classList.add('is-error');
        }
        return;
      }

      openSuccessModal(modal);
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
    var groups = form.querySelectorAll('[data-order-group]');

    if (!wrap || !groups.length) return;

    function categoryInput(category) {
      return form.querySelector(
        'input[name="order_category"][value="' + category + '"]'
      );
    }

    function groupHasCheckedItems(group) {
      return group.querySelectorAll('input[name="order_items"]:checked').length > 0;
    }

    function updateWrapVisibility() {
      var anyVisible = false;
      groups.forEach(function (g) {
        if (g.classList.contains('is-visible')) anyVisible = true;
      });
      setVisible(wrap, anyVisible);
    }

    function hideOrderGroup(group) {
      var category = group.getAttribute('data-order-group');
      var catInput = categoryInput(category);

      setVisible(group, false);
      group.querySelectorAll('input[name="order_items"]').forEach(function (i) {
        i.checked = false;
      });
      if (catInput) catInput.checked = false;
      updateWrapVisibility();
    }

    function showOrderGroup(group) {
      var category = group.getAttribute('data-order-group');
      var catInput = categoryInput(category);

      setVisible(wrap, true);
      setVisible(group, true);
      wrap.appendChild(group);
      if (catInput) catInput.checked = true;
    }

    form.querySelectorAll('input[name="order_category"]').forEach(function (input) {
      input.addEventListener('change', function () {
        var group = form.querySelector(
          '[data-order-group="' + input.value + '"]'
        );
        if (!group) return;

        if (input.checked) {
          showOrderGroup(group);
        } else {
          hideOrderGroup(group);
        }
      });
    });

    groups.forEach(function (group) {
      group.addEventListener('change', function (e) {
        if (e.target.name !== 'order_items') return;
        if (!group.classList.contains('is-visible')) return;
        if (!groupHasCheckedItems(group)) {
          hideOrderGroup(group);
        }
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
