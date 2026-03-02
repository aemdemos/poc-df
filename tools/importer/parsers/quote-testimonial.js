/* eslint-disable */
/* global WebImporter */

/**
 * Parser: quote-testimonial
 * Base block: quote
 * Source: https://www.verdeyalife.com/
 * Selector: .testimonials-carousel
 * Structure: 3 rows (one per field): quotation | authorImage | attribution
 * Model: quotation (richtext), authorImage (reference), attribution (richtext)
 */
export default function parse(element, { document }) {
  // Extract the quote text from the swiper slide
  const quoteEl = element.querySelector('.quote p, .swiper-slide .quote p');

  // Extract attribution: author name and role
  const authorName = element.querySelector('.author .name, .swiper-slide .name');
  const authorRole = element.querySelector('.author .role, .swiper-slide .role');
  const authorPhoto = element.querySelector('.author .profile-picture img, .swiper-slide .profile-picture img');

  // Row 0: Quotation
  const quotationCell = [];
  quotationCell.push(document.createComment(' field:quotation '));
  if (quoteEl) quotationCell.push(quoteEl);

  // Row 1: Author image
  const imageCell = [];
  imageCell.push(document.createComment(' field:authorImage '));
  if (authorPhoto) imageCell.push(authorPhoto);

  // Row 2: Attribution text (name + role)
  const attributionCell = [];
  attributionCell.push(document.createComment(' field:attribution '));
  if (authorName) {
    const nameP = document.createElement('p');
    nameP.textContent = authorName.textContent;
    attributionCell.push(nameP);
  }
  if (authorRole) {
    const em = document.createElement('em');
    em.textContent = authorRole.textContent;
    attributionCell.push(em);
  }

  const cells = [
    [quotationCell],
    [imageCell],
    [attributionCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'quote-testimonial', cells });
  element.replaceWith(block);
}
