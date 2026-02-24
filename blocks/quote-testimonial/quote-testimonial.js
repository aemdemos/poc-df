export default async function decorate(block) {
  const [quotation, authorImage, attribution] = [...block.children].map((c) => c.firstElementChild);
  const blockquote = document.createElement('blockquote');
  // decorate quotation
  quotation.className = 'quote-testimonial-quotation';
  blockquote.append(quotation);
  // decorate attribution with author image
  if (attribution || authorImage) {
    const attr = document.createElement('div');
    attr.className = 'quote-testimonial-attribution';
    if (authorImage) {
      authorImage.className = 'quote-testimonial-author-image';
      attr.append(authorImage);
    }
    if (attribution) {
      attribution.className = 'quote-testimonial-author-text';
      const ems = attribution.querySelectorAll('em');
      ems.forEach((em) => {
        const cite = document.createElement('cite');
        cite.innerHTML = em.innerHTML;
        em.replaceWith(cite);
      });
      attr.append(attribution);
    }
    blockquote.append(attr);
  }
  block.innerHTML = '';
  block.append(blockquote);
}
