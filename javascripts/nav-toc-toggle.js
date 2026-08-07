// Click-to-toggle controller for the "Content" outline toggle injected by
// toc.integrate (input#__toc + label[for="__toc"] in overrides/partials/nav-item.html).
//
// Why this exists: with a bare <label for="__toc">, the browser's default
// label click forwards straight to the checkbox, and separately some
// browsers restore that checkbox's checked state from a previous visit to
// the same URL a moment after paint (form/autofill state restore). Combined,
// the outline could flash open on first paint and then snap shut before a
// user could click a subsection. Fully owning the toggle in script sidesteps
// both: we set .checked directly (no native "change" event, so nothing else
// on the page can react to or undo it) and we don't touch it on hover, blur,
// or focus changes.
(function () {
  function init() {
    var toggle = document.getElementById("__toc");
    var label = document.querySelector('label[for="__toc"]');
    if (!toggle || !label) return;

    // Always start expanded for the chapter page currently being viewed.
    toggle.checked = true;

    label.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggle.checked = !toggle.checked;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
