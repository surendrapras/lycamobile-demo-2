/**
 * Checkout Page Template
 * Used for importing Lycamobile checkout/basket pages
 */

export default {
  name: 'checkout',
  
  /**
   * Detect if a page matches this template
   */
  detect: (document) => {
    const hasProgressHeader = document.querySelector('.ProgressHeader_progressHeader_container__dU2Ud');
    const hasCheckoutForm = document.querySelector('.checkout_form_container__wTagn');
    const hasOrderSummary = document.querySelector('.OrderSummary_orderSummaryContainer__gdbXN');
    return hasProgressHeader && hasCheckoutForm && hasOrderSummary;
  },

  /**
   * Extract page metadata
   */
  extractMetadata: (document) => {
    const title = document.querySelector('title')?.textContent || 'Checkout';
    return {
      title,
      description: 'Complete your order for Lycamobile SIM only deals',
      template: 'checkout',
      'og:title': title,
      'og:type': 'website'
    };
  },

  /**
   * Define sections to extract
   */
  sections: [
    {
      name: 'page-heading',
      selector: '.checkout_inner_form_heading__Ekd3U',
      transform: 'heading'
    },
    {
      name: 'your-details',
      selector: '#your_details',
      transform: 'form-section'
    },
    {
      name: 'bring-your-number',
      selector: '#bring_your_number',
      transform: 'selection-cards'
    },
    {
      name: 'sim-type',
      selector: '#sim_type',
      transform: 'selection-cards'
    },
    {
      name: 'review-contract',
      selector: '.ReviewContract_container__MCnd2',
      transform: 'content-section'
    },
    {
      name: 'contract-agreement',
      selector: '.ConsentContract_container__fQCfa',
      transform: 'consent-section'
    },
    {
      name: 'order-summary',
      selector: '.OrderSummary_orderSummaryContainer__gdbXN',
      transform: 'order-summary'
    },
    {
      name: 'plan-details',
      selector: '.checkout_descriptionlayout__ZP7Le',
      transform: 'plan-features'
    },
    {
      name: 'contract-info',
      selector: '.ContractDetails_layoutcontainer__wrLUg',
      transform: 'trust-badges'
    }
  ]
};
