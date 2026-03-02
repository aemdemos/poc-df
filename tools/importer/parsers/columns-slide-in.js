/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-slide-in
 * Base block: columns
 * Source: https://www.verdeyalife.com/
 * Selector: .intro-section.homepage-intro
 * Structure: 1 row, 2 columns
 *   Left col: image
 *   Right col: top-copy paragraph, "Explore Verdeya" link, subtitle, heading, CTA
 * Note: Columns blocks do NOT require field hints (per xwalk hinting rules)
 */
export default function parse(element, { document }) {
  // Left column: image
  const image = element.querySelector('.col-image img, .col-md-7 img');

  // Right column: top-copy text (the "Verdeya is pioneering..." paragraph)
  const topCopyEl = element.querySelector('.top-copy') || element.querySelector('.mobile-top-copy');

  // Right column: "Explore Verdeya" scroll-to element
  const scrollToEl = element.querySelector('.scroll-to');

  // Right column: subtitle from copy-content area
  const subtitle = element.querySelector('.copy-content .subtitle, .copy .subtitle, h6.subtitle');

  // Right column: heading from copy-content area
  const heading = element.querySelector('.copy-content .title h2, .copy .title h2, .copy-content h2');

  // Right column: CTA link wrapping a <button>
  const allLinks = element.querySelectorAll('.copy-content > a[href], .copy > a[href], .copy-content a[href]:has(button)');
  let ctaLink = null;
  for (const link of allLinks) {
    if (link.querySelector('button') || link.closest('.title') === null) {
      ctaLink = link;
      break;
    }
  }
  if (!ctaLink) {
    const btnLinks = element.querySelectorAll('a[href]');
    for (const link of btnLinks) {
      if (link.querySelector('button')) {
        ctaLink = link;
        break;
      }
    }
  }

  // Build left column cell
  const leftCell = [];
  if (image) leftCell.push(image);

  // Build right column cell
  const rightCell = [];

  // 1. Top-copy paragraph
  if (topCopyEl) {
    const p = document.createElement('p');
    p.textContent = topCopyEl.textContent.trim();
    rightCell.push(p);
  }

  // 2. "Explore Verdeya" as a styled paragraph
  if (scrollToEl) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = scrollToEl.textContent.trim();
    p.append(strong);
    rightCell.push(p);
  }

  // 3. Subtitle (h6)
  if (subtitle) rightCell.push(subtitle);

  // 4. Heading (h2)
  if (heading) rightCell.push(heading);

  // 5. CTA link
  if (ctaLink) {
    const btn = ctaLink.querySelector('button');
    if (btn) {
      ctaLink.textContent = btn.textContent;
    }
    rightCell.push(ctaLink);
  }

  const cells = [[leftCell, rightCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-slide-in', cells });
  element.replaceWith(block);
}
