/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-intro
 * Base block: columns
 * Source: https://www.verdeyalife.com/
 * Selector: .intro-section.homepage-intro
 * Structure: 2 columns - left: image, right: subtitle + heading + description + CTA
 * Note: Columns blocks do NOT require field hints (per xwalk hinting rules)
 */
export default function parse(element, { document }) {
  // Left column: image
  const image = element.querySelector('.col-image img, .col-md-7 img');

  // Right column content from the lavender card area
  const subtitle = element.querySelector('.copy-content .subtitle, .copy .subtitle, h6.subtitle');
  const heading = element.querySelector('.copy-content .title h2, .copy .title h2, .copy-content h2');
  // Select the CTA link that wraps a <button>, not inline links in the heading
  const allLinks = element.querySelectorAll('.copy-content > a[href], .copy > a[href], .copy-content a[href]:has(button)');
  let ctaLink = null;
  for (const link of allLinks) {
    if (link.querySelector('button') || link.closest('.title') === null) {
      ctaLink = link;
      break;
    }
  }
  // Fallback: find any link wrapping a button element
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
  if (subtitle) rightCell.push(subtitle);
  if (heading) rightCell.push(heading);
  if (ctaLink) {
    // Convert button inside anchor to just the anchor with text
    const btn = ctaLink.querySelector('button');
    if (btn) {
      ctaLink.textContent = btn.textContent;
    }
    rightCell.push(ctaLink);
  }

  const cells = [[leftCell, rightCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-intro', cells });
  element.replaceWith(block);
}
