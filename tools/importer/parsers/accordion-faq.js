/* global WebImporter */

/**
 * Parser for accordion-faq block
 *
 * Source: https://www.lycamobile.co.uk/paymonthly/en/checkout/
 * Base Block: accordion
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2-N: One row per FAQ item with 2 columns [question | answer]
 *
 * Source HTML Pattern:
 * <div class="FAQ_container__JzOJU">
 *   <h2>FAQs</h2>
 *   <div class="MuiAccordion-root">
 *     <div class="MuiAccordionSummary-content">
 *       <h3>Question text</h3>
 *     </div>
 *     <div class="MuiAccordionDetails-root">
 *       <p>Answer text</p>
 *     </div>
 *   </div>
 *   ...
 * </div>
 *
 * Generated: 2025-12-26
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all accordion items
  const accordionItems = element.querySelectorAll('[class*="MuiAccordion-root"]');

  accordionItems.forEach((item) => {
    // Extract question from summary
    const questionEl = item.querySelector('[class*="MuiAccordionSummary-content"] h3, [id*="faq-title"]');

    // Extract answer from details
    const answerEl = item.querySelector('[class*="MuiAccordionDetails-root"], [id*="faq-answer"]');

    if (questionEl) {
      // Question column
      const questionText = questionEl.textContent.trim();

      // Answer column - extract all text content
      let answerContent = '';
      if (answerEl) {
        // Get all paragraphs and list items from answer
        const answerParts = answerEl.querySelectorAll('p, li');
        if (answerParts.length > 0) {
          answerContent = Array.from(answerParts)
            .map(el => el.textContent.trim())
            .filter(text => text)
            .join(' ');
        } else {
          answerContent = answerEl.textContent.trim();
        }
      }

      // Create row with question and answer columns
      cells.push([questionText, answerContent]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion-Faq', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
