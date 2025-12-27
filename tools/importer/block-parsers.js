/**
 * Block Parsers for Checkout Pages
 * Parse HTML elements into AEM EDS block structures
 */

export const parsers = {
  /**
   * Parse form section with input fields
   */
  'form-section': (element) => {
    const heading = element.querySelector('.yourDetails_sectionHeading__EBH2H, h2, h3')?.textContent?.trim();
    const fields = [];
    
    element.querySelectorAll('input, select').forEach(input => {
      const label = input.placeholder || input.getAttribute('aria-label') || '';
      const type = input.type || 'text';
      const required = input.hasAttribute('required');
      fields.push({ label, type, required });
    });
    
    const helperText = element.querySelector('.yourDetails_emailConfirmationBasket__8miLw')?.textContent?.trim();
    
    return {
      blockName: 'form',
      heading,
      fields,
      helperText
    };
  },

  /**
   * Parse selection cards (radio-style options)
   */
  'selection-cards': (element) => {
    const heading = element.querySelector('.BringYourNumberStatus_port_heading__iQ_g0, .SimType_simTypeHeading__bGUdn')?.textContent?.trim();
    const subheading = element.querySelector('.SimType_simTypeSubHeading__rSYfy')?.textContent?.trim();
    const cards = [];
    
    element.querySelectorAll('.BringYourNumberStatus_optionBox__kyket, .SimType_simCard__JmF7d').forEach(card => {
      const text = card.querySelector('p')?.textContent?.trim();
      const selected = card.classList.contains('BringYourNumberStatus_selectedOptionBox__gSaM_') || 
                       card.classList.contains('SimType_activeSim__KBdLj');
      cards.push({ text, selected });
    });
    
    const infoMessage = element.querySelector('.SimType_infoMessage__jqGrp')?.textContent?.trim();
    
    return {
      blockName: 'cards',
      variant: 'selection',
      heading,
      subheading,
      cards,
      infoMessage
    };
  },

  /**
   * Parse order summary pricing
   */
  'order-summary': (element) => {
    const heading = element.querySelector('.OrderSummary_orderSummary__YbC2j')?.textContent?.trim();
    const originalPrice = element.querySelector('.OrderSummary_costStrike__5InD3')?.textContent?.trim();
    const currentPrice = element.querySelector('.OrderSummary_cost__gm5gX')?.textContent?.trim();
    const promoText = element.querySelector('.OrderSummary_subText__PctUv')?.textContent?.trim();
    
    return {
      blockName: 'cards',
      variant: 'order-summary',
      heading,
      pricing: { originalPrice, currentPrice, promoText }
    };
  },

  /**
   * Parse plan features list
   */
  'plan-features': (element) => {
    const planName = element.querySelector('.SummaryDetails_monthlyPaymentPlanText__x0MUS')?.textContent?.trim();
    const features = [];
    
    element.querySelectorAll('.Planhighlights_shortDescription__5KhO_').forEach(item => {
      features.push(item.textContent?.trim());
    });
    
    return {
      blockName: 'default-content',
      planName,
      features
    };
  },

  /**
   * Parse trust badges and info
   */
  'trust-badges': (element) => {
    const items = [];
    
    element.querySelectorAll('.ContractDetails_contractPoint__unCDH').forEach(point => {
      const text = point.querySelector('p')?.textContent?.trim();
      const link = point.querySelector('a')?.href;
      items.push({ text, link });
    });
    
    const disclaimer = element.querySelector('.ContractDetails_contractDescription__FqTPD p')?.textContent?.trim();
    const helpText = element.querySelector('.ContractDetails_needHelp__P4msN')?.textContent?.trim();
    
    return {
      blockName: 'default-content',
      items,
      disclaimer,
      helpText
    };
  }
};

export default parsers;
