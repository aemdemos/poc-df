/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Verdeya site cleanup.
 * Selectors from captured DOM at https://www.verdeyalife.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent SDK (OneTrust) - found as #onetrust-consent-sdk in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
    ]);

    // Remove skip-to-content link
    WebImporter.DOMUtils.remove(element, ['.skip-link.screen-reader-text']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    // Header: <header id="masthead" class="site-header">
    WebImporter.DOMUtils.remove(element, ['header#masthead']);

    // Footer: <footer id="colophon" class="site-footer">
    WebImporter.DOMUtils.remove(element, ['footer#colophon']);

    // Remove iframes, link tags, noscript
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);
  }
}
