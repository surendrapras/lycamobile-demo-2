/**
 * Checkout Page Transformer
 * Transforms parsed checkout page content into AEM EDS markdown
 */

import template from './checkout-template.js';
import parsers from './block-parsers.js';

/**
 * Transform a checkout page document into markdown
 */
export function transform(document, url) {
  const metadata = template.extractMetadata(document);
  const sections = [];
  
  // Extract each section using template definitions
  for (const sectionDef of template.sections) {
    const element = document.querySelector(sectionDef.selector);
    if (element && parsers[sectionDef.transform]) {
      const parsed = parsers[sectionDef.transform](element);
      sections.push({
        name: sectionDef.name,
        ...parsed
      });
    }
  }
  
  return {
    metadata,
    sections,
    sourceUrl: url
  };
}

/**
 * Generate markdown from transformed content
 */
export function generateMarkdown(content) {
  let md = '';
  
  // Front matter
  md += '---\n';
  for (const [key, value] of Object.entries(content.metadata)) {
    md += `${key}: ${value}\n`;
  }
  md += '---\n\n';
  
  // Page heading
  const heading = content.sections.find(s => s.name === 'page-heading');
  if (heading) {
    md += `# ${heading.text || 'My basket: Add-ons & more'}\n\n`;
  }
  
  // Form sections
  for (const section of content.sections) {
    if (section.blockName === 'form') {
      md += `## ${section.heading}\n\n`;
      md += '| Form |  |\n| --- | --- |\n';
      for (const field of section.fields || []) {
        md += `| ${field.label} | ${field.type}${field.required ? ', required' : ''} |\n`;
      }
      md += '\n';
      if (section.helperText) {
        md += `${section.helperText}\n\n`;
      }
      md += '---\n\n';
    }
    
    if (section.blockName === 'cards' && section.variant === 'selection') {
      md += `## ${section.heading}\n\n`;
      if (section.subheading) {
        md += `${section.subheading}\n\n`;
      }
      md += '| Cards (selection) |  |\n| --- | --- |\n';
      for (const card of section.cards || []) {
        md += `| ${card.text} | ${card.selected ? 'selected' : ''} |\n`;
      }
      md += '\n';
      if (section.infoMessage) {
        md += `${section.infoMessage}\n\n`;
      }
      md += '---\n\n';
    }
    
    if (section.blockName === 'cards' && section.variant === 'order-summary') {
      md += `## ${section.heading}\n\n`;
      md += '| Cards (order-summary) |  |\n| --- | --- |\n';
      if (section.pricing) {
        md += `| Monthly cost | |\n`;
        md += `| ~~${section.pricing.originalPrice}~~ **${section.pricing.currentPrice}** | |\n`;
        md += `| ${section.pricing.promoText} | |\n`;
      }
      md += '\n---\n\n';
    }
    
    if (section.planName) {
      md += `### ${section.planName}\n\n`;
      for (const feature of section.features || []) {
        md += `- ${feature}\n`;
      }
      md += '\n---\n\n';
    }
  }
  
  // Metadata block
  md += '| Metadata |  |\n| --- | --- |\n';
  for (const [key, value] of Object.entries(content.metadata)) {
    md += `| ${key} | ${value} |\n`;
  }
  
  return md;
}

export default { transform, generateMarkdown };
