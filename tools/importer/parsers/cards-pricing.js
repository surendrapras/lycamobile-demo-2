/* global WebImporter */

/**
 * Parser for cards-pricing block
 *
 * Source: https://www.lycamobile.co.uk/paymonthly/en/checkout/
 * Base Block: cards
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2-N: One row per pricing plan card
 *
 * Source HTML Pattern:
 * <div class="PayMonthlyPage_plansListContainer__CxdXX">
 *   <div class="PlanCardFullWidth_planCardContainer__rx5TX">
 *     <div class="PlanCardFullWidth_planOfferHeading__w65nt">Badge</div>
 *     <div class="PlanCardFullWidth_planCardSubContainer___V8aY">
 *       Plan name, price, data, features, CTA
 *     </div>
 *   </div>
 *   ...
 * </div>
 *
 * Generated: 2025-12-26
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all plan cards
  const planCards = element.querySelectorAll('[class*="PlanCardFullWidth_planCardContainer"]');

  planCards.forEach((card) => {
    // Extract badge/offer heading
    const badge = card.querySelector('[class*="planOfferHeadingText"]');

    // Extract plan name
    const planName = card.querySelector('[class*="plan-name"], [id*="plan-name"]');

    // Extract prices
    const strikePrice = card.querySelector('[id*="plan-strike-price"]');
    const newPrice = card.querySelector('[id*="plan-new-price"]');
    const priceNote = card.querySelector('[class*="plan-money-text"]');

    // Extract data amount
    const dataAmount = card.querySelector('[id*="plan-data-text"]');

    // Extract features
    const features = Array.from(card.querySelectorAll('[id*="plan-has-detail"]'));

    // Extract CTA button
    const ctaButton = card.querySelector('a[class*="buy"], button[class*="buy"], [class*="BuyNow"] a');

    // Build cell content
    const cellContent = [];

    if (badge) cellContent.push(badge.cloneNode(true));
    if (planName) cellContent.push(planName.cloneNode(true));

    // Create price element
    if (strikePrice || newPrice) {
      const priceDiv = document.createElement('p');
      if (strikePrice) {
        const strike = document.createElement('s');
        strike.textContent = strikePrice.textContent;
        priceDiv.appendChild(strike);
        priceDiv.appendChild(document.createTextNode(' '));
      }
      if (newPrice) {
        const strong = document.createElement('strong');
        strong.textContent = newPrice.textContent;
        priceDiv.appendChild(strong);
        priceDiv.appendChild(document.createTextNode(' monthly'));
      }
      cellContent.push(priceDiv);
    }

    if (priceNote) cellContent.push(priceNote.cloneNode(true));
    if (dataAmount) {
      const dataP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = dataAmount.textContent;
      dataP.appendChild(strong);
      cellContent.push(dataP);
    }

    features.forEach(feature => {
      cellContent.push(feature.cloneNode(true));
    });

    if (ctaButton) {
      const link = document.createElement('a');
      link.href = ctaButton.href || '#';
      link.textContent = 'Buy now';
      cellContent.push(link);
    }

    if (cellContent.length > 0) {
      cells.push(cellContent);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Pricing', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
