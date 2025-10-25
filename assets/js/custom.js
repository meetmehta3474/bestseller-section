document.querySelectorAll('.product-img').forEach(img => {
  const secondary = img.dataset.secondary;
  if (!secondary) return;

  let primarySrc = img.src;
  // Mouse swap
  img.addEventListener('mouseenter', () => {
    img.src = secondary;
  });
  img.addEventListener('mouseleave', () => {
    img.src = primarySrc;
  });

  // For accessibility / touch devices: toggle on touchstart
  img.addEventListener('touchstart', (ev) => {
    ev.preventDefault(); // avoid triggering mouse events as well
    img.src = img.src === primarySrc ? secondary : primarySrc;
  }, {passive:false});
});

// MOBILE: Show More toggling
(function() {
  const btn = document.getElementById('showMoreBtn');
  const hiddenCards = document.getElementById('hiddenCards');
  const hiddenCardsInner = document.getElementById('hiddenCardsInner');

  // On mobile we want to show cards 5..end inside hiddenCardsInner.
  // We'll clone them from the main .product-list if they exist.
  function populateHidden() {
    // find all original cards
    const allCards = Array.from(document.querySelectorAll('.product-list > .product-card'));
    // we want index 4.. (5th onward)
    const cloneTargets = allCards.slice(4); // 0-indexed
    hiddenCardsInner.innerHTML = '';
    cloneTargets.forEach(card => {
      const clone = card.cloneNode(true);
      // Ensure hover swapping in clones also works: attach listeners similar to original
      const img = clone.querySelector('.product-img');
      if (img) {
        const secondary = img.dataset.secondary;
        const primary = img.src;
        img.addEventListener('mouseenter', () => img.src = secondary);
        img.addEventListener('mouseleave', () => img.src = primary);
        img.addEventListener('touchstart', (ev) => {
          ev.preventDefault();
          img.src = img.src === primary ? secondary : primary;
        }, {passive:false});
      }
      hiddenCardsInner.appendChild(clone);
    });
  }

  // Populate on load
  populateHidden();

  // Toggle function
  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    if (open) {
      hiddenCards.classList.add('open');
      btn.textContent = 'Show Less';
      // scroll into view slightly so user sees reveal
      hiddenCards.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    } else {
      hiddenCards.classList.remove('open');
      btn.textContent = 'Show More';
    }
  });

  // Accessibility: close when orientation or resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) {
      hiddenCards.classList.remove('open');
      btn.textContent = 'Show More';
      open = false;
    }
  });
})();

// Scrollbar touch behavior: when user touches the page, grow the thumb a bit
// Best-effort: add a class to html so ::-webkit-scrollbar rules don't need :hover
(function() {
  let touching = false;
  const html = document.documentElement;
  function setTouchingOn() {
    if (!touching) {
      touching = true;
      html.classList.add('scrolling-touch');
      // remove after short timeout
      setTimeout(() => {
        touching = false;
        html.classList.remove('scrolling-touch');
      }, 1200);
    }
  }
  window.addEventListener('touchstart', setTouchingOn, {passive:true});
  window.addEventListener('wheel', setTouchingOn, {passive:true});
})();
  