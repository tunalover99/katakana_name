/* ===========================================
   UI 인터랙션
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ----- 모바일 네비게이션 토글 -----
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.header-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ----- 변환기 (변환기 페이지에만 존재) -----
  const nameInput = document.getElementById('name-input');
  const nameOutput = document.getElementById('name-output');
  const addressInput = document.getElementById('address-input');
  const addressOutput = document.getElementById('address-output');

  function setupConverter(input, output) {
    if (!input || !output) return;
    let touched = false;
    output.addEventListener('input', () => { touched = true; });
    input.addEventListener('input', () => {
      if (input.value === '') touched = false;
      if (!touched) output.value = convertHangulToKatakana(input.value);
    });
  }

  setupConverter(nameInput, nameOutput);
  setupConverter(addressInput, addressOutput);

  // ----- 성씨 칩 -----
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const surname = chip.getAttribute('data-name');
      if (nameInput && nameOutput) {
        nameInput.value = surname;
        nameOutput.value = convertHangulToKatakana(surname);
        nameInput.focus();
      }
    });
  });

  // ----- 복사하기 -----
  document.querySelectorAll('.btn-copy[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = document.getElementById(btn.getAttribute('data-copy-target'));
      const feedback = btn.parentElement.querySelector('.copy-feedback');
      if (!target) return;

      if (!target.value) {
        if (feedback) {
          feedback.textContent = '복사할 내용이 없어요';
          feedback.classList.add('visible');
          setTimeout(() => feedback.classList.remove('visible'), 1800);
        }
        return;
      }

      try {
        await navigator.clipboard.writeText(target.value);
      } catch (err) {
        target.select();
        document.execCommand('copy');
      }
      if (feedback) {
        feedback.textContent = '복사됐어요!';
        feedback.classList.add('visible');
        setTimeout(() => feedback.classList.remove('visible'), 1800);
      }
    });
  });

  // ----- 여행 준비물 체크리스트 (travel 페이지) -----
  const checklist = document.getElementById('checklist');
  if (checklist) {
    const STORAGE_KEY = 'kana_travel_checklist';
    const boxes = checklist.querySelectorAll('input[type="checkbox"]');
    const progress = document.getElementById('check-progress');
    const resetBtn = document.getElementById('reset-checklist');

    function loadState() {
      let saved = {};
      try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      } catch (e) { saved = {}; }
      boxes.forEach((box) => {
        if (saved[box.dataset.key]) box.checked = true;
      });
    }

    function saveState() {
      const state = {};
      boxes.forEach((box) => { state[box.dataset.key] = box.checked; });
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    function updateProgress() {
      const done = Array.from(boxes).filter((b) => b.checked).length;
      if (progress) progress.textContent = `${done} / ${boxes.length} 완료`;
    }

    loadState();
    updateProgress();

    boxes.forEach((box) => {
      box.addEventListener('change', () => {
        saveState();
        updateProgress();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        boxes.forEach((box) => { box.checked = false; });
        saveState();
        updateProgress();
      });
    }
  }
});
