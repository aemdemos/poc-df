/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Verdeya section breaks and section-metadata.
 * Runs in afterTransform only.
 * Sections from page-templates.json for the homepage template.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const { template } = payload || {};
  if (!template || !template.sections || template.sections.length < 2) return;

  const document = element.ownerDocument;

  // Process sections in reverse order to avoid offset issues when inserting elements
  const sections = [...template.sections].reverse();

  for (const section of sections) {
    // Try selector(s) to find the section boundary element
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    let sectionEl = null;
    for (const sel of selectors) {
      sectionEl = element.querySelector(sel);
      if (sectionEl) break;
    }
    if (!sectionEl) continue;

    // Add section-metadata block if section has a style
    if (section.style) {
      const sectionMetadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.after(sectionMetadata);
    }

    // Add <hr> section break before this section (unless it's the first content)
    const firstSection = template.sections[0];
    if (section.id !== firstSection.id) {
      const hr = document.createElement('hr');
      sectionEl.before(hr);
    }
  }
}
