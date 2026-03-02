/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsSlideInParser from './parsers/columns-slide-in.js';
import columnsPillarsParser from './parsers/columns-pillars.js';
import quoteTestimonialParser from './parsers/quote-testimonial.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/verdeya-cleanup.js';
import sectionsTransformer from './transformers/verdeya-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-slide-in': columnsSlideInParser,
  'columns-pillars': columnsPillarsParser,
  'quote-testimonial': quoteTestimonialParser,
};

// PAGE TEMPLATE CONFIGURATION (from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Verdeya Life homepage - main landing page',
  urls: [
    'https://www.verdeyalife.com/',
  ],
  blocks: [
    {
      name: 'columns-slide-in',
      instances: ['.intro-section.homepage-intro'],
    },
    {
      name: 'columns-pillars',
      instances: ['.blocks-section.l-50-50'],
    },
    {
      name: 'quote-testimonial',
      instances: ['.testimonials-carousel'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'header.entry-header',
      style: null,
      blocks: [],
      defaultContent: ['h1.entry-title'],
    },
    {
      id: 'section-2',
      name: 'About Intro',
      selector: '.homepage-intro-pin-wrapper',
      style: 'lavender',
      blocks: ['columns-slide-in'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Science Pillars',
      selector: '.blocks-section.l-50-50',
      style: null,
      blocks: ['columns-pillars'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Testimonial',
      selector: '.testimonials-carousel',
      style: null,
      blocks: ['quote-testimonial'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
// Section transformer conditionally included when template has 2+ sections
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform (cleanup cookie banners, etc.)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform (remove header/footer, add section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
