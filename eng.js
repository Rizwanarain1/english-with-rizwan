
const toggleBtn = document.getElementById('toggleBtn');
  const navLinks = document.getElementById('navLinks');

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

function speakText(text, lang = "en-US") {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    const voices = speechSynthesis.getVoices();
    utter.voice = voices.find(v => v.lang === lang && /female|zira|samantha|google/i.test(v.name)) 
                || voices.find(v => v.lang === lang);
    speechSynthesis.speak(utter);
}

document.querySelectorAll('.list-item button').forEach(btn => {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        speakText(btn.closest('.list-item').querySelector('span').innerText, "en-US");
    });
});

document.querySelectorAll('.list-item').forEach(item => {
    item.addEventListener('click', () => {
        const link = item.dataset.link;
        if (link && link !== '#') window.location.href = link;
    });
});

speechSynthesis.onvoiceschanged = () => {};



  //============= Tenses Area ========== //

  let currentSpeech = null, currentButton = null, femaleVoice = null;

  speechSynthesis.onvoiceschanged = () => {
    femaleVoice = speechSynthesis.getVoices().find(v => /female|zira|samantha|google/i.test(v.name)) || speechSynthesis.getVoices()[0];
  };
  
  function toggleDetails(card) {
    const details = card.querySelector('.details');
    const open = details.style.display === 'block';
    document.querySelectorAll('.details').forEach(d => d.style.display = 'none');
    details.style.display = open ? 'none' : 'block';
  }
  
  function toggleSpeech(card, e) {
    e.stopPropagation();
    const btn = card.querySelector('.listen-btn');
    if (btn.classList.contains('speaking')) return stopSpeech();
  
    stopSpeech();
    const text = `${card.querySelector('h2').textContent.replace('🔊','').trim()}. ${card.querySelector('.details').textContent}`;
    if (!('speechSynthesis' in window)) return alert('TTS not supported.');
  
    currentSpeech = new SpeechSynthesisUtterance(text);
    Object.assign(currentSpeech, { lang: 'en-US', voice: femaleVoice, rate: 0.9 });
    btn.classList.add('speaking'); btn.textContent = '⏹';
    currentButton = btn;
    currentSpeech.onend = currentSpeech.onerror = resetButton;
    speechSynthesis.speak(currentSpeech);
  }
  
  function stopSpeech() { if (speechSynthesis.speaking) speechSynthesis.cancel(); resetButton(); }
  function resetButton() { if (currentButton) currentButton.classList.remove('speaking'), currentButton.textContent = '🔊'; currentSpeech = currentButton = null; }
  
  document.querySelectorAll('.tense-card').forEach(card => {
    card.addEventListener('click', () => toggleDetails(card));
    card.querySelector('.listen-btn').addEventListener('click', e => toggleSpeech(card, e));
  });
  


// =====================  vocabulary Areaaa ==================//

// Function to speak words
function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
}

// Function to toggle categories
function toggleCategory(category) {
    const heading = category.closest('.category-heading');
    const categoryName = heading.dataset.category;
    const contents = document.querySelectorAll(`.category-content[data-category="${categoryName}"]`);
    
    // Toggle active class on heading
    heading.classList.toggle('active');
    
    // Toggle show class on all related content rows
    contents.forEach(content => {
        content.classList.toggle('show');
    });
    
    // Update the toggle icon
    const icon = heading.querySelector('.toggle-icon');
    icon.textContent = heading.classList.contains('active') ? '−' : '+';
}

// Add click event to all category headings
document.addEventListener('DOMContentLoaded', function() {
    const categoryHeadings = document.querySelectorAll('.category-heading');
    
    categoryHeadings.forEach(heading => {
        heading.addEventListener('click', function() {
            toggleCategory(this);
        });
    });
    
    // Optional: Open first category by default
    if (categoryHeadings.length > 0) {
        toggleCategory(categoryHeadings[0]);
    }
});


// ====================== paragraph Arean =================//

document.addEventListener("DOMContentLoaded", () => {
  let currentBtn = null;

  const getVoice = () => {
    const voices = speechSynthesis.getVoices();
    return voices.find(v => /(female|zira|samantha|victoria|karen)/i.test(v.name)) || voices[0];
  };

  function stop() {
    speechSynthesis.cancel();
    if (currentBtn) currentBtn.textContent = "🔊 Read", currentBtn.classList.remove("speaking");
    currentBtn = null;
  }

  document.querySelectorAll(".read-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();

      if (btn.classList.contains("speaking")) return stop();

      stop(); // stop any previous

      const text = btn.closest(".box")?.querySelector("p")?.innerText;
      if (!text) return;

      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = getVoice();
      utter.lang = "en-US";
      utter.rate = 0.95;

      btn.textContent = "⏹ Stop";
      btn.classList.add("speaking");
      currentBtn = btn;

      utter.onend = stop;
      speechSynthesis.speak(utter);
    });
  });
});

//============================= MCQ Area ================//

const quizData = [
  {q:"He ___ to school every day.", o:["go","goes","gone"], a:1},
  {q:"I ___ a book now.", o:["read","am reading","reads"], a:1},
  {q:"They ___ playing football yesterday.", o:["was","were","are"], a:1},
  {q:"She ___ tea.", o:["like","likes","liked"], a:1},
  {q:"We ___ friends.", o:["is","are","am"], a:1},
  {q:"I ___ in Lahore.", o:["live","lives","lived"], a:0},
  {q:"He ___ English well.", o:["speak","speaks","speaking"], a:1},
  {q:"The cat is ___ the table.", o:["in","on","at"], a:1},
  {q:"___ you like coffee?", o:["Do","Does","Did"], a:0},
  {q:"She ___ not coming tomorrow.", o:["is","are","was"], a:0},
  {q:"Ali and Sara ___ best friends.", o:["is","are","was"], a:1},
  {q:"This is ___ apple.", o:["a","an","the"], a:1},
  {q:"He ___ his homework already.", o:["has done","have done","did"], a:0},
  {q:"We ___ to the park last Sunday.", o:["go","went","gone"], a:1},
  {q:"They ___ watching TV right now.", o:["is","are","was"], a:1},
  {q:"She ___ a new dress yesterday.", o:["buy","bought","buys"], a:1},
  {q:"My father ___ a doctor.", o:["Was","are","is"], a:2},
  {q:"There ___ many books on the table.", o:["is","are","was"], a:1},
  {q:"I have two brothers and ___ sister.", o:["a","an","the"], a:0},
  {q:"We ___ visit our grandparents every month.", o:["usually","yesterday","tomorrow"], a:0},
  {q:"He is ___ Father.", o:["Her","Him","His"], a:2}
];

let score = 0;

const quizContainer = document.getElementById("quizContainer");
const scoreBox = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");

function loadQuiz() {
  quizContainer.innerHTML = "";
  score = 0;
  scoreBox.textContent = score;

  quizData.forEach((qData, index) => {
    const box = document.createElement("div");
    box.className = "question-box";
    box.innerHTML = `
      <h4>Q${index+1}: ${qData.q}</h4>
      <div class="options"></div>
      <p class="result"></p>
    `;
    
    const optionsDiv = box.querySelector(".options");
    qData.o.forEach((opt, i) => {
      let btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(btn, i, qData.a, box);
      optionsDiv.appendChild(btn);
    });
    
    quizContainer.appendChild(box);
  });
}

function checkAnswer(btn, selected, correct, box) {
  const result = box.querySelector(".result");
  const buttons = box.querySelectorAll("button");

  buttons.forEach(b => b.disabled = true);

  if(selected === correct) {
    btn.classList.add("correct");
    result.textContent = "✅ Correct";
    score++;
  } else {
    btn.classList.add("wrong");
    buttons[correct].classList.add("correct");
    result.textContent = "❌ Wrong";
  }

  scoreBox.textContent = score;
}

// Reset quiz
resetBtn.addEventListener("click", loadQuiz);

// Load quiz first time
loadQuiz();



// ===================== parts of body ========================== //




