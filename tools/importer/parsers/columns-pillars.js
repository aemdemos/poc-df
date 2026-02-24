/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-pillars
 * Base block: columns
 * Source: https://www.verdeyalife.com/
 * Selector: .blocks-section.l-50-50
 * Structure: 2 columns - left: subtitle + heading + paragraphs + CTA,
 *            right: 4 numbered colored cards with titles and descriptions
 * Note: Columns blocks do NOT require field hints (per xwalk hinting rules)
 */
export default function parse(element, { document }) {
  // Left column: Science intro text
  const leftCol = element.querySelector('.col-md-6:first-child .intro, .col-md-6:first-child');
  const subtitle = leftCol ? leftCol.querySelector('h6.subtitle, .subtitle') : null;
  const heading = leftCol ? leftCol.querySelector('.copy h2, h2') : null;
  const paragraphs = leftCol ? leftCol.querySelectorAll('.copy p') : [];
  const leftCta = leftCol ? leftCol.querySelector('a[href]:has(button), a[href]') : null;

  // Build left column cell
  const leftCell = [];
  if (subtitle) leftCell.push(subtitle);
  if (heading) leftCell.push(heading);
  paragraphs.forEach((p) => leftCell.push(p));
  if (leftCta) {
    const btn = leftCta.querySelector('button');
    if (btn) {
      leftCta.textContent = btn.textContent;
    }
    leftCell.push(leftCta);
  }

  // Right column: 4 numbered cards
  const rightCol = element.querySelector('.col-md-6:last-child .blocks, .col-md-6:last-child');
  const cards = rightCol ? rightCol.querySelectorAll('.block') : [];

  // Build right column cell - each card's content as heading + paragraph
  const rightCell = [];
  cards.forEach((card) => {
    const cardSubtitle = card.querySelector('h6.subtitle, .subtitle');
    const cardTitle = card.querySelector('h4, h3');
    const cardText = card.querySelector('.copy p, p');
    const cardCta = card.querySelector('a[href]:has(button), a[href]');

    if (cardSubtitle) rightCell.push(cardSubtitle);
    if (cardTitle) rightCell.push(cardTitle);
    if (cardText) rightCell.push(cardText);
    if (cardCta) {
      const btn = cardCta.querySelector('button');
      if (btn) {
        cardCta.textContent = btn.textContent;
      }
      rightCell.push(cardCta);
    }
  });

  const cells = [[leftCell, rightCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-pillars', cells });
  element.replaceWith(block);
}
