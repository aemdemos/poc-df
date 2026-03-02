/**
 * Decorate the text column: split into top-copy area and card area.
 *
 * Original site structure (what we replicate):
 *   .top-copy  = "Verdeya is pioneering..."  (sits ABOVE the green box)
 *   .copy      = THE GREEN BOX containing:
 *       .scroll-to    = "Explore Verdeya"
 *       .copy-content = "About us" + H2 + "Learn more"
 *
 * Content in EDS HTML:
 *   <p>Verdeya is pioneering...</p>           -> top-copy
 *   <p><strong>Explore Verdeya</strong></p>   -> card (scroll-cta inside green box)
 *   <h6>About us</h6>                         -> card
 *   <h2>Our ambition...</h2>                  -> card
 *   <p><a>Learn more</a></p>                  -> card
 */
function decorateTextColumn(col) {
  const children = [...col.children];
  const topCopy = document.createElement('div');
  topCopy.className = 'columns-reveal-top-copy';

  const card = document.createElement('div');
  card.className = 'columns-reveal-card';

  let inCard = false;

  children.forEach((child) => {
    // Card starts at the "Explore Verdeya" element (<p><strong>) or the first heading
    if (!inCard) {
      const strong = child.querySelector('strong');
      const isExploreCta = strong && child.tagName === 'P' && !child.querySelector('a');
      const isHeading = child.matches('h6, h5, h4, h3, h2, h1');
      if (isExploreCta || isHeading) {
        inCard = true;
      }
    }

    if (inCard) {
      // Mark the "Explore Verdeya" element for specific styling
      const strong = child.querySelector('strong');
      if (strong && child.tagName === 'P' && !child.querySelector('a')) {
        child.classList.add('columns-reveal-scroll-cta');
      }
      card.append(child);
    } else {
      topCopy.append(child);
    }
  });

  col.innerHTML = '';
  if (topCopy.children.length) col.append(topCopy);
  if (card.children.length) col.append(card);
}

/**
 * Scroll-based animation that matches the original GSAP ScrollTrigger behavior.
 * Triggers when the user scrolls past the block's initial position.
 */
function setupScrollAnimation(block) {
  let triggered = false;

  function onScroll() {
    if (triggered) return;
    const rect = block.getBoundingClientRect();
    // Trigger when the top of the block is 200px or more above the viewport top
    // (matching original GSAP start: "top 200px")
    if (rect.top <= 200) {
      triggered = true;
      block.classList.add('columns-reveal-animated');
      window.removeEventListener('scroll', onScroll);
    }
  }

  // Delay observer setup to avoid triggering on initial render
  requestAnimationFrame(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
  });
}

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  block.classList.add(`columns-reveal-${cols.length}-cols`);

  // Identify image column and text column
  cols.forEach((col) => {
    const pic = col.querySelector('picture') || col.querySelector('img');
    if (pic && col.querySelectorAll('p').length <= 1) {
      // Column with only an image (possibly wrapped in <p>)
      col.classList.add('columns-reveal-img-col');
    } else {
      col.classList.add('columns-reveal-text-col');
      decorateTextColumn(col);
    }
  });

  // Set up scroll-triggered animation
  setupScrollAnimation(block);
}
