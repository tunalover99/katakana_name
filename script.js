/* ===========================================
   UI 인터랙션: 실시간 변환, 복사하기, 성씨 칩
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ----- 이름 변환 -----
  const nameInput = document.getElementById('name-input');
  const nameOutput = document.getElementById('name-output');

  let nameOutputTouched = false;
  nameOutput.addEventListener('input', () => { nameOutputTouched = true; });

  nameInput.addEventListener('input', () => {
    // 사용자가 출력창을 직접 수정한 적이 없을 때만 자동 갱신 (수정 내용 보호)
    if (!nameOutputTouched) {
      nameOutput.value = convertHangulToKatakana(nameInput.value);
    }
  });

  // 입력창이 다시 비워지면 수정 보호 해제
  nameInput.addEventListener('input', () => {
    if (nameInput.value === '') nameOutputTouched = false;
  });

  // ----- 주소 변환 -----
  const addressInput = document.getElementById('address-input');
  const addressOutput = document.getElementById('address-output');

  let addressOutputTouched = false;
  addressOutput.addEventListener('input', () => { addressOutputTouched = true; });

  addressInput.addEventListener('input', () => {
    if (!addressOutputTouched) {
      addressOutput.value = convertHangulToKatakana(addressInput.value);
    }
    if (addressInput.value === '') addressOutputTouched = false;
  });

  // ----- 성씨 칩 클릭 시 이름 입력창에 추가 -----
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const surname = chip.getAttribute('data-name');
      nameInput.value = surname;
      nameOutputTouched = false;
      nameOutput.value = convertHangulToKatakana(nameInput.value);
      nameInput.focus();
    });
  });

  // ----- 복사하기 버튼 -----
  document.querySelectorAll('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const target = document.getElementById(targetId);
      const feedback = btn.parentElement.querySelector('.copy-feedback');

      if (!target.value) {
        feedback.textContent = '복사할 내용이 없습니다';
        feedback.classList.add('visible');
        setTimeout(() => feedback.classList.remove('visible'), 1800);
        return;
      }

      try {
        await navigator.clipboard.writeText(target.value);
        feedback.textContent = '복사되었습니다';
      } catch (err) {
        // Clipboard API 실패 시 폴백
        target.select();
        document.execCommand('copy');
        feedback.textContent = '복사되었습니다';
      }
      feedback.classList.add('visible');
      setTimeout(() => feedback.classList.remove('visible'), 1800);
    });
  });
});
