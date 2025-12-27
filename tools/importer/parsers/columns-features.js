/* global WebImporter */

/**
 * Parser for columns-features block
 *
 * Source: https://www.lycamobile.co.uk/paymonthly/en/checkout/
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2: 3 columns with icon, title, description each
 *
 * Source HTML Pattern:
 * <div class="WhyLyca_main_container__lRc68">
 *   <div class="WhyLyca_heading__8zSGt"><h2>Why choose Lyca Mobile?</h2></div>
 *   <div class="WhyLyca_grid_container__ASh2C">
 *     <div class="WhyLyca_container_box__QvSlR">
 *       <p><img src="..."/></p>
 *       <p>Title</p>
 *       <p>Description</p>
 *     </div>
 *     ...
 *   </div>
 * </div>
 *
 * Generated: 2025-12-26
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all feature boxes
  const featureBoxes = element.querySelectorAll('[class*="WhyLyca_container_box"], [id*="static-mobile-block-content"]');

  // Build row with 3 columns
  const columnCells = [];

  featureBoxes.forEach((box) => {
    const columnContent = [];

    // Extract icon image
    const icon = box.querySelector('img');
    if (icon) {
      const img = document.createElement('img');
      img.src = icon.src;
      img.alt = icon.alt || '';
      columnContent.push(img);
    }

    // Extract title and description from paragraphs
    const paragraphs = box.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
      // Skip if it only contains an image
      if (p.querySelector('img') && p.textContent.trim() === '') return;

      const clone = p.cloneNode(true);
      // Remove any nested images from paragraph clones
      const imgs = clone.querySelectorAll('img');
      imgs.forEach(img => img.remove());

      if (clone.textContent.trim()) {
        // First non-image paragraph is title (make it bold)
        if (columnContent.length === 1) {
          const strong = document.createElement('strong');
          strong.textContent = clone.textContent.trim();
          columnContent.push(strong);
        } else {
          // Subsequent paragraphs are description
          const desc = document.createElement('p');
          desc.textContent = clone.textContent.trim();
          columnContent.push(desc);
        }
      }
    });

    if (columnContent.length > 0) {
      columnCells.push(columnContent);
    }
  });

  // Add the row with all columns
  if (columnCells.length > 0) {
    cells.push(columnCells);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Features', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
