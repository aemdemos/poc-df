var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // parsers/columns-slide-in.js
  function parse(element, { document }) {
    const image = element.querySelector(".col-image img, .col-md-7 img");
    const topCopyEl = element.querySelector(".top-copy") || element.querySelector(".mobile-top-copy");
    const scrollToEl = element.querySelector(".scroll-to");
    const subtitle = element.querySelector(".copy-content .subtitle, .copy .subtitle, h6.subtitle");
    const heading = element.querySelector(".copy-content .title h2, .copy .title h2, .copy-content h2");
    const allLinks = element.querySelectorAll(".copy-content > a[href], .copy > a[href], .copy-content a[href]:has(button)");
    let ctaLink = null;
    for (const link of allLinks) {
      if (link.querySelector("button") || link.closest(".title") === null) {
        ctaLink = link;
        break;
      }
    }
    if (!ctaLink) {
      const btnLinks = element.querySelectorAll("a[href]");
      for (const link of btnLinks) {
        if (link.querySelector("button")) {
          ctaLink = link;
          break;
        }
      }
    }
    const leftCell = [];
    if (image) leftCell.push(image);
    const rightCell = [];
    if (topCopyEl) {
      const p = document.createElement("p");
      p.textContent = topCopyEl.textContent.trim();
      rightCell.push(p);
    }
    if (scrollToEl) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = scrollToEl.textContent.trim();
      p.append(strong);
      rightCell.push(p);
    }
    if (subtitle) rightCell.push(subtitle);
    if (heading) rightCell.push(heading);
    if (ctaLink) {
      const btn = ctaLink.querySelector("button");
      if (btn) {
        ctaLink.textContent = btn.textContent;
      }
      rightCell.push(ctaLink);
    }
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-slide-in", cells });
    element.replaceWith(block);
  }

  // parsers/columns-pillars.js
  function parse2(element, { document }) {
    const leftCol = element.querySelector(".col-md-6:first-child .intro, .col-md-6:first-child");
    const subtitle = leftCol ? leftCol.querySelector("h6.subtitle, .subtitle") : null;
    const heading = leftCol ? leftCol.querySelector(".copy h2, h2") : null;
    const paragraphs = leftCol ? leftCol.querySelectorAll(".copy p") : [];
    const leftCta = leftCol ? leftCol.querySelector("a[href]:has(button), a[href]") : null;
    const leftCell = [];
    if (subtitle) leftCell.push(subtitle);
    if (heading) leftCell.push(heading);
    paragraphs.forEach((p) => leftCell.push(p));
    if (leftCta) {
      const btn = leftCta.querySelector("button");
      if (btn) {
        leftCta.textContent = btn.textContent;
      }
      leftCell.push(leftCta);
    }
    const rightCol = element.querySelector(".col-md-6:last-child .blocks, .col-md-6:last-child");
    const cards = rightCol ? rightCol.querySelectorAll(".block") : [];
    const rightCell = [];
    cards.forEach((card) => {
      const cardSubtitle = card.querySelector("h6.subtitle, .subtitle");
      const cardTitle = card.querySelector("h4, h3");
      const cardText = card.querySelector(".copy p, p");
      const cardCta = card.querySelector("a[href]:has(button), a[href]");
      if (cardSubtitle) rightCell.push(cardSubtitle);
      if (cardTitle) rightCell.push(cardTitle);
      if (cardText) rightCell.push(cardText);
      if (cardCta) {
        const btn = cardCta.querySelector("button");
        if (btn) {
          cardCta.textContent = btn.textContent;
        }
        rightCell.push(cardCta);
      }
    });
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-pillars", cells });
    element.replaceWith(block);
  }

  // parsers/quote-testimonial.js
  function parse3(element, { document }) {
    const quoteEl = element.querySelector(".quote p, .swiper-slide .quote p");
    const authorName = element.querySelector(".author .name, .swiper-slide .name");
    const authorRole = element.querySelector(".author .role, .swiper-slide .role");
    const authorPhoto = element.querySelector(".author .profile-picture img, .swiper-slide .profile-picture img");
    const quotationCell = [];
    quotationCell.push(document.createComment(" field:quotation "));
    if (quoteEl) quotationCell.push(quoteEl);
    const imageCell = [];
    imageCell.push(document.createComment(" field:authorImage "));
    if (authorPhoto) imageCell.push(authorPhoto);
    const attributionCell = [];
    attributionCell.push(document.createComment(" field:attribution "));
    if (authorName) {
      const nameP = document.createElement("p");
      nameP.textContent = authorName.textContent;
      attributionCell.push(nameP);
    }
    if (authorRole) {
      const em = document.createElement("em");
      em.textContent = authorRole.textContent;
      attributionCell.push(em);
    }
    const cells = [
      [quotationCell],
      [imageCell],
      [attributionCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "quote-testimonial", cells });
    element.replaceWith(block);
  }

  // transformers/verdeya-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".onetrust-pc-dark-filter"
      ]);
      WebImporter.DOMUtils.remove(element, [".skip-link.screen-reader-text"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header#masthead"]);
      WebImporter.DOMUtils.remove(element, ["footer#colophon"]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript"]);
    }
  }

  // transformers/verdeya-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const { template } = payload || {};
    if (!template || !template.sections || template.sections.length < 2) return;
    const document = element.ownerDocument;
    const sections = [...template.sections].reverse();
    for (const section of sections) {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.after(sectionMetadata);
      }
      const firstSection = template.sections[0];
      if (section.id !== firstSection.id) {
        const hr = document.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // import-homepage.js
  var parsers = {
    "columns-slide-in": parse,
    "columns-pillars": parse2,
    "quote-testimonial": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Verdeya Life homepage - main landing page",
    urls: [
      "https://www.verdeyalife.com/"
    ],
    blocks: [
      {
        name: "columns-slide-in",
        instances: [".intro-section.homepage-intro"]
      },
      {
        name: "columns-pillars",
        instances: [".blocks-section.l-50-50"]
      },
      {
        name: "quote-testimonial",
        instances: [".testimonials-carousel"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "header.entry-header",
        style: null,
        blocks: [],
        defaultContent: ["h1.entry-title"]
      },
      {
        id: "section-2",
        name: "About Intro",
        selector: ".homepage-intro-pin-wrapper",
        style: "lavender",
        blocks: ["columns-slide-in"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Science Pillars",
        selector: ".blocks-section.l-50-50",
        style: null,
        blocks: ["columns-pillars"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Testimonial",
        selector: ".testimonials-carousel",
        style: null,
        blocks: ["quote-testimonial"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
