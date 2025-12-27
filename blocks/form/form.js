export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Determine variant from block classes
  const tableVariants = ['checkout-details', 'email-verify', 'personal-info', 'address-details', 'address-fields'];
  let variant = 'default';

  for (const v of tableVariants) {
    if (block.classList.contains(v)) {
      variant = v;
      break;
    }
  }
  if (block.classList.contains('consent')) {
    variant = 'consent';
  }

  // Create form element
  const form = document.createElement('form');
  form.className = `form-${variant}`;

  if (tableVariants.includes(variant)) {
    // Parse table structure: Label row, Field row, Type row
    // Each row has cells where first cell is header (Label/Field/Type)
    let labelData = [];
    let fieldData = [];
    let typeData = [];

    rows.forEach((row) => {
      const cells = [...row.querySelectorAll(':scope > div')];
      if (cells.length > 0) {
        const firstCell = cells[0]?.textContent.trim().toLowerCase();
        if (firstCell.includes('label')) {
          labelData = cells.slice(1);
        } else if (firstCell.includes('field')) {
          fieldData = cells.slice(1);
        } else if (firstCell.includes('type')) {
          typeData = cells.slice(1);
        }
      }
    });

    if (labelData.length > 0 && typeData.length > 0) {
      const fieldGroup = document.createElement('div');
      fieldGroup.className = 'form-field-group';

      labelData.forEach((labelCell, index) => {
        const fieldCell = fieldData[index];
        const typeCell = typeData[index];

        if (!labelCell || !typeCell) return;

        const labelText = labelCell.textContent.trim();
        const fieldType = typeCell.textContent.trim().toLowerCase();

        // Skip empty cells
        if (!labelText && fieldType !== 'button') return;

        const isRequired = labelText.includes('*');
        const cleanLabel = labelText.replace('*', '').trim();

        const fieldWrapper = document.createElement('div');
        fieldWrapper.className = 'form-field';

        // Only add label if it's not a button
        if (fieldType !== 'button') {
          const label = document.createElement('label');
          label.textContent = cleanLabel;
          if (isRequired) {
            const asterisk = document.createElement('span');
            asterisk.className = 'required';
            asterisk.textContent = '*';
            label.appendChild(asterisk);
          }
          fieldWrapper.appendChild(label);
        }

        let input;
        if (fieldType === 'select') {
          input = document.createElement('select');
          input.innerHTML = `
            <option value="">Select ${cleanLabel.toLowerCase()}</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
          `;
        } else if (fieldType === 'button') {
          input = document.createElement('button');
          input.type = 'button';
          input.className = 'form-button';
          const linkText = fieldCell?.querySelector('a')?.textContent || 'Submit';
          input.textContent = linkText;
        } else if (fieldType === 'date') {
          input = document.createElement('input');
          input.type = 'date';
          input.placeholder = fieldCell?.querySelector('a')?.textContent || 'DD/MM/YYYY';
        } else {
          input = document.createElement('input');
          input.type = fieldType === 'email' ? 'email' : 'text';
          input.placeholder = fieldCell?.querySelector('a')?.textContent || `Enter ${cleanLabel.toLowerCase()}`;
        }

        if (isRequired && input.tagName !== 'BUTTON') {
          input.required = true;
        }

        fieldWrapper.appendChild(input);
        fieldGroup.appendChild(fieldWrapper);
      });

      form.appendChild(fieldGroup);
    }
  } else if (variant === 'consent') {
    // Consent toggle with text
    rows.forEach((row) => {
      const cells = [...row.querySelectorAll(':scope > div')];
      if (cells.length >= 2) {
        const toggleType = cells[0]?.textContent.trim().toLowerCase();
        const consentText = cells[1]?.innerHTML;

        if (toggleType === 'toggle') {
          const consentWrapper = document.createElement('div');
          consentWrapper.className = 'consent-wrapper';

          const toggle = document.createElement('label');
          toggle.className = 'toggle-switch';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.required = true;

          const slider = document.createElement('span');
          slider.className = 'toggle-slider';

          toggle.appendChild(checkbox);
          toggle.appendChild(slider);

          const textSpan = document.createElement('span');
          textSpan.className = 'consent-text';
          textSpan.innerHTML = consentText;

          consentWrapper.appendChild(toggle);
          consentWrapper.appendChild(textSpan);
          form.appendChild(consentWrapper);
        }
      }
    });
  } else {
    // Default: try to create fields from any table structure
    rows.forEach((row) => {
      const cells = [...row.querySelectorAll(':scope > div')];
      if (cells.length >= 2) {
        const labelText = cells[0]?.textContent.trim();
        const fieldType = cells[1]?.textContent.trim().toLowerCase();

        const fieldWrapper = document.createElement('div');
        fieldWrapper.className = 'form-field';

        const label = document.createElement('label');
        label.textContent = labelText;

        let input;
        if (fieldType === 'select') {
          input = document.createElement('select');
        } else if (fieldType === 'button') {
          input = document.createElement('button');
          input.type = 'button';
          input.textContent = labelText;
        } else {
          input = document.createElement('input');
          input.type = fieldType || 'text';
          input.placeholder = labelText;
        }

        fieldWrapper.appendChild(label);
        fieldWrapper.appendChild(input);
        form.appendChild(fieldWrapper);
      }
    });
  }

  // Clear block and add form
  block.textContent = '';
  block.appendChild(form);
}
