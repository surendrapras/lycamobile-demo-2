/* global WebImporter */

/**
 * Transformer for Lycamobile website cleanup
 * Purpose: Remove cookie banners, chat widgets, and non-content elements
 * Applies to: www.lycamobile.co.uk (all templates)
 * Generated: 2025-12-26
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner
    // EXTRACTED: Found in captured DOM - OneTrust cookie banner
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '.ot-sdk-container'
    ]);

    // Remove chat/loader widgets
    // EXTRACTED: Found LycaLoader and chat elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '[class*="LycaLoader"]',
      '[class*="chat"]'
    ]);

    // Remove header/navigation (handled separately)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'nav',
      '[class*="Header"]',
      '[class*="Navigation"]'
    ]);

    // Remove footer (handled separately)
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '[class*="Footer"]'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up tracking attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-analytics');
    });

    // Remove remaining unwanted elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'script',
      'source'
    ]);
  }
}
