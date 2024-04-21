function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  console.log(index);
  return choices[index];
}

function getInt(item) {
  return parseInt(localStorage.getItem(item))
}

document.addEventListener('DOMContentLoaded', () => {

  const input = document.getElementById('input')
  const content = document.getElementById('content')
  const p_lives = document.getElementById('lives');
  const p_score = document.getElementById('score');
  const settings = document.getElementById('settings')
  const b_close = document.getElementById('close')
  const s_lives = document.getElementById('max_lives')
  const s_target = document.getElementById('target')
  const cover = document.getElementById('cover');
  const reload = document.getElementById('reload');

  const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('')

  settings.style.display = 'none';
  cover.style.display = 'none';
  reload.style.display = 'none';

  let score = 0;
  p_score.textContent = score.toString();
  let lives = getInt('max_lives') || 3;
  let target = getInt('target') || alphabet.length;

  p_lives.textContent = '❤️'.repeat(lives);

  let locked = false;
  let click_settings = 0;

  function openSettings() {
    click_settings++;
    if (click_settings >= 5) {
      settings.style.display = settings.style.display === 'none' ? '' : 'none';
    }
  }

  function closeSettings() {
    settings.style.display = 'none';
    click_settings = 0;
  }

  reload.addEventListener('click', () => {
    document.location.reload();
  })

  b_close.addEventListener("click", closeSettings)
  p_score.addEventListener('click', openSettings)
  p_lives.addEventListener('click', openSettings)

  s_lives.value = lives.toString()
  s_target.value = alphabet.length.toString()

  s_lives.addEventListener('input', e => {
    lives = parseInt(e.target.value);
    p_lives.textContent = '❤️'.repeat(lives);
    localStorage.setItem('max_lives', e.target.value);
  })

  s_target.addEventListener('input', e => {
    target = parseInt(e.target.value);
    s_target.textContent = e.target.value;
    localStorage.setItem('target', e.target.value);
  })

  function setCover(text) {
    cover.textContent = text;
    cover.style.display = '';
  }

  function gameOver() {
    reload.style.display = '';
    setCover('😞')
  }

  function win() {
    setCover('😃')
  }

  function rndContent() {
    if (score >= target - 1) {
      return win();
    }
    content.textContent = choose(alphabet);
    alphabet.splice(alphabet.indexOf(content.textContent), 1);
    locked = false;
  }

  rndContent();

  input.addEventListener('input', e => {

    if (!locked) {
      const value = input.value;
      if (value.toLowerCase() === content.textContent.toLowerCase()) {
        locked = true;

        let tts = new SpeechSynthesisUtterance();
        tts.text = content.textContent;
        window.speechSynthesis.speak(tts);

        setTimeout(() => {
          rndContent();
          score++;
          p_score.textContent = score.toString();
        }, 1000);

      } else {
        locked = true

        o = (A = new AudioContext()).createOscillator();
        o.type = 'triangle';
        o.frequency.value = 100;
        o.connect(A.destination);
        o.start();
        o.stop(0.25);

        lives--;
        if (lives <= 0) {
          return gameOver();
        }
        p_lives.textContent = '❤️'.repeat(lives);

        setTimeout(() => locked = false, 500)
      }
    }

    input.value = '';
  })

})
