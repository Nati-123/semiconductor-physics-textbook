// challenge-quiz.js — Generic instant-feedback multiple-choice challenge
// questions, shared across all Chapter 1 MicroSims.
// Include via <script src="../challenge-quiz.js"></script> in each main.html
//
// Markup contract for each question:
// <div class="challenge" data-correct="b">
//   <p class="q-text">1. Question text?</p>
//   <label><input type="radio" name="q1" value="a"> Option A</label>
//   <label><input type="radio" name="q1" value="b"> Option B</label>
//   <button class="check-btn" type="button">Check Answer</button>
//   <span class="feedback" role="status" aria-live="polite"></span>
//   <p class="explain-correct" hidden>Explanation shown when correct.</p>
//   <p class="explain-incorrect" hidden>Explanation shown when incorrect.</p>
// </div>
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.challenge').forEach(function (block) {
      var checkBtn = block.querySelector('.check-btn');
      var feedback = block.querySelector('.feedback');
      var correct = block.getAttribute('data-correct');
      var explainCorrect = block.querySelector('.explain-correct');
      var explainIncorrect = block.querySelector('.explain-incorrect');
      if (!checkBtn || !feedback) return;

      checkBtn.addEventListener('click', function () {
        var selected = block.querySelector('input[type="radio"]:checked');
        if (explainCorrect) explainCorrect.hidden = true;
        if (explainIncorrect) explainIncorrect.hidden = true;

        if (!selected) {
          feedback.textContent = 'Select an answer first.';
          feedback.className = 'feedback feedback-warn';
          return;
        }
        if (selected.value === correct) {
          feedback.textContent = 'Correct!';
          feedback.className = 'feedback feedback-correct';
          if (explainCorrect) explainCorrect.hidden = false;
        } else {
          feedback.textContent = 'Not quite — try again.';
          feedback.className = 'feedback feedback-incorrect';
          if (explainIncorrect) explainIncorrect.hidden = false;
        }
      });
    });
  });
})();
