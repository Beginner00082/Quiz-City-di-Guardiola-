const screens = {
    password: document.getElementById('screen-password'),
    intro: document.getElementById('screen-intro'),
    quiz: document.getElementById('screen-quiz'),
    result: document.getElementById('screen-result')
};

const passInput = document.getElementById('pass-input');
const passSubmit = document.getElementById('pass-submit');
const passError = document.getElementById('pass-error');
const retryBox = document.getElementById('retry-box');
const retryNo = document.getElementById('retry-no');
const retryYes = document.getElementById('retry-yes');
const quizPako = document.getElementById('quiz-pako');
const quizPakoError = document.getElementById('quiz-pako-error');
const startQuiz = document.getElementById('start-quiz');
const restart = document.getElementById('restart');

const CORRECT_PASS = 'Pako';

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

// LOGIN FLOW
passSubmit.addEventListener('click', handlePass);
passInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') handlePass();
});

function handlePass() {
    if (passInput.value === CORRECT_PASS) {
        showScreen('intro');
    } else {
        passError.innerText = 'Password sbagliata. Provare con un altro metodo?';
        retryBox.classList.add('active');
        passSubmit.style.display = 'none';
    }
}

retryNo.addEventListener('click', () => {
    retryBox.classList.remove('active');
    passSubmit.style.display = 'block';
    passInput.value = '';
    passError.innerText = '';
});

retryYes.addEventListener('click', () => {
    retryBox.classList.remove('active');
    quizPako.classList.add('active');
    passError.innerText = '';
});

document.querySelectorAll('[data-q="pako"]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.dataset.a === 'C') {
            showScreen('intro');
        } else {
            quizPakoError.innerText = 'Errata';
            setTimeout(() => quizPakoError.innerText = '', 2000);
        }
    });
});

// QUIZ PRINCIPALE
const questions = [
    {
        q: 'Chi è il migliore amico di Peppe Zara?',
        a: ['A) Christian Lanza', 'B) Matteo Pagano', 'C) Angeli Melania'],
        correct: 0,
        wrongMsg: 'Ma steij buon'
    },
    {
        q: 'Completa la frase: Ocho ar frocho, ocho a?',
        a: ['A) Diego', 'B) Antonio', 'C) Vincenzo'],
        correct: 1
    },
    {
        q: 'Quale è il giocatore che Vincenzo reputa forte?',
        a: ['A) Ondrejka', 'B) Pulisic', 'C) Leão'],
        correct: 1
    },
    {
        q: 'Da dove viene il noto detto italiano "Mezz\'ora 150€? C\'è un problema, ho il nodo. Lo tenes arapatos."',
        a: ['A) Gita di 3 giorni', 'B) A scuola', 'C) Parchetto'],
        correct: 0
    },
    {
        q: 'Christian non muove mai i banchi di scuola:',
        a: ['A) Vero', 'B) Falso'],
        correct: 0
    },
    {
        q: 'Di chi erano le feci nel giardino della vicina?',
        a: ['A) Del cane', 'B) Stesso della vicina', 'C) Del padrone rimproverato'],
        correct: 2
    },
    {
        q: 'L\'iPhone è in perfette condizioni, l\'unico problema quale è?',
        a: ['A) Fotocamera sfocata', 'B) Scheda madre danneggiata', 'C) Puzza di 💦'],
        correct: 2
    },
    {
        q: 'Quanto è alto Mario?',
        a: ['A) 1.80m', 'B) 1.13m', 'C) 1.70m'],
        correct: 2
    },
    {
        q: 'Dopo aver esagerato con la sedia, cosa bisogna fare?',
        a: ['A) Controlla in modo signorile l\'orario dall\'orologio', 'B) Ridere', 'C) Guardare negli occhi la prof'],
        correct: 0
    },
    {
        q: 'Chi fece muovere i quadri da una stanza all\'altra con un calcio mentre Peppe Zara pensava chi lo avesse mandato li?',
        a: ['A) Mario', 'B) Cirillo', 'C) Diego'],
        correct: 1
    },
    {
        q: 'Domanda finale: La frase "Ho visto che sei diventato dj, mandami il video di come lo muovi", come finisce?',
        a: ['A) Il disco', 'B) Il set dj', 'C) ANCHE il disco'],
        correct: 2
    }
];

let currentQ = 0;
let score = 0;
const questionText = document.getElementById('question-text');
const answersDiv = document.getElementById('answers');
const feedback = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

startQuiz.addEventListener('click', () => {
    showScreen('quiz');
    currentQ = 0;
    score = 0;
    loadQuestion();
});

function loadQuestion() {
    const q = questions[currentQ];
    questionText.innerText = q.q;
    answersDiv.innerHTML = '';
    feedback.innerText = '';

    q.a.forEach((text, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.innerText = text;
        btn.addEventListener('click', () => answer(i));
        answersDiv.appendChild(btn);
    });

    const progress = ((currentQ) / questions.length) * 100;
    progressBar.style.setProperty('--w', progress + '%');
    progressText.innerText = `Domanda ${currentQ + 1}/${questions.length}`;
}

function answer(index) {
    const q = questions[currentQ];
    const isCorrect = index === q.correct;

    if (isCorrect) score++;

    // Solo la prima domanda mostra feedback se sbagli
    if (currentQ === 0 &&!isCorrect && q.wrongMsg) {
        feedback.innerText = q.wrongMsg;
        setTimeout(nextQuestion, 1500);
    } else {
        nextQuestion();
    }
}

function nextQuestion() {
    currentQ++;
    if (currentQ < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    showScreen('result');
    const percent = Math.round((score / questions.length) * 100);
    document.getElementById('score').innerText = percent + '%';

    let text = '';
    if (percent <= 40) {
        text = 'Nzi buon ma è succies.';
    } else if (percent <= 80) {
        text = 'Complimenti, i strunzat n sai assaij.';
    } else {
        text = 'Hai sbloccato l\'area Senato.';
    }
    document.getElementById('result-text').innerText = text;
}

restart.addEventListener('click', () => {
    passInput.value = '';
    passError.innerText = '';
    retryBox.classList.remove('active');
    quizPako.classList.remove('active');
    passSubmit.style.display = 'block';
    showScreen('password');
});
