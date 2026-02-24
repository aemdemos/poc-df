const CARD_PEEK = 80; // px of previous card that peeks above the next

function splitStackCards(col) {
  const children = [...col.children];
  const cards = [];
  let currentCard = null;

  children.forEach((child) => {
    const isNumberHeading = child.tagName === 'H6' && /^\d{2}$/.test(child.textContent.trim());
    if (isNumberHeading) {
      currentCard = document.createElement('div');
      currentCard.className = 'columns-stack-card';
      cards.push(currentCard);
    }
    if (currentCard) {
      currentCard.append(child);
    }
  });

  col.innerHTML = '';
  const colors = ['green', 'brown', 'light-green', 'purple'];
  cards.forEach((card, i) => {
    card.style.setProperty('--card-index', i);
    card.style.setProperty('--card-sticky-top', `${i * CARD_PEEK}px`);
    if (colors[i]) {
      card.classList.add(`columns-stack-card-${colors[i]}`);
    }
    col.append(card);
  });
}

function setupScrollAnimations(block) {
  const cards = block.querySelectorAll('.columns-stack-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('columns-stack-card-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  cards.forEach((card) => observer.observe(card));
}

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  block.classList.add(`columns-stack-${cols.length}-cols`);

  cols.forEach((col, i) => {
    if (i === 0) {
      col.classList.add('columns-stack-intro-col');
    } else {
      col.classList.add('columns-stack-cards-col');
      splitStackCards(col);
    }
  });

  setupScrollAnimations(block);
}
