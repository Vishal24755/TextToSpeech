document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('textInput');
  const voiceSelect = document.getElementById('voiceSelect');
  const rateSlider = document.getElementById('rateSlider');
  const rateVal = document.getElementById('rateVal');
  const pitchSlider = document.getElementById('pitchSlider');
  const pitchVal = document.getElementById('pitchVal');

  const btnSpeak = document.getElementById('btnSpeak');
  const btnPause = document.getElementById('btnPause');
  const btnResume = document.getElementById('btnResume');
  const btnStop = document.getElementById('btnStop');
  const btnSample = document.getElementById('btnSample');
  const btnClear = document.getElementById('btnClear');
  const toast = document.getElementById('toast');

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.background = isError ? '#991b1b' : '#065f46';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2500);
  }

  if (!('speechSynthesis' in window)) {
    showToast('Your browser does not support the SpeechSynthesis API.', true);
    btnSpeak.disabled = true;
    return;
  }

  let voices = [];

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';

    if (voices.length === 0) {
      const opt = document.createElement('option');
      opt.textContent = 'Default System Voice';
      voiceSelect.appendChild(opt);
      return;
    }

    voices.forEach((voice, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' [Default]' : ''}`;
      voiceSelect.appendChild(option);
    });
  }

  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Sliders display
  rateSlider.addEventListener('input', () => {
    rateVal.textContent = `${parseFloat(rateSlider.value).toFixed(1)}x`;
  });

  pitchSlider.addEventListener('input', () => {
    pitchVal.textContent = parseFloat(pitchSlider.value).toFixed(1);
  });

  btnSpeak.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
      showToast('Please enter some text to speak!', true);
      return;
    }

    window.speechSynthesis.cancel(); // cancel pending utterances

    const utterance = new SpeechSynthesisUtterance(text);
    if (voices.length > 0 && voiceSelect.value !== '') {
      utterance.voice = voices[parseInt(voiceSelect.value, 10)] || voices[0];
    }
    utterance.rate = parseFloat(rateSlider.value);
    utterance.pitch = parseFloat(pitchSlider.value);

    utterance.onstart = () => showToast('Speaking started...');
    utterance.onend = () => showToast('Speech finished.');
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      showToast('Speech finished or interrupted.');
    };

    window.speechSynthesis.speak(utterance);
  });

  btnPause.addEventListener('click', () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      showToast('Speech paused.');
    }
  });

  btnResume.addEventListener('click', () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      showToast('Speech resumed.');
    }
  });

  btnStop.addEventListener('click', () => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
      showToast('Speech stopped.');
    }
  });

  btnSample.addEventListener('click', () => {
    textInput.value = 'Text-to-speech synthesis translates written words into natural spoken audio directly inside your web browser. Try adjusting my reading speed or altering the pitch slider to hear how my voice changes!';
    showToast('Sample text loaded.');
  });

  btnClear.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    textInput.value = '';
    showToast('Input cleared.');
  });
});
