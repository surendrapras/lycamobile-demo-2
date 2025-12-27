import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  // Only optimize non-SVG images - SVGs should be kept as-is
  ul.querySelectorAll('picture > img').forEach((img) => {
    const isSvg = img.src.toLowerCase().includes('.svg');
    if (!isSvg) {
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
    }
  });
  block.replaceChildren(ul);

  // Add click handling for selection-radio and sim-type variants
  if (block.classList.contains('selection-radio') || block.classList.contains('sim-type')) {
    const items = ul.querySelectorAll('li');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        // Find all items and deselect them
        items.forEach((otherItem) => {
          const checkImg = otherItem.querySelector('img[alt="check"]');

          if (checkImg) {
            // Change check to uncheck - update both img src and source srcset
            checkImg.alt = 'uncheck';
            const newSrc = checkImg.src.replace('blue-check', 'circle-uncheck').split('&t=')[0];
            checkImg.src = `${newSrc}&t=${Date.now()}`;

            // Also update the source element in the picture
            const picture = checkImg.closest('picture');
            if (picture) {
              const source = picture.querySelector('source');
              if (source) {
                source.srcset = source.srcset.replace('blue-check', 'circle-uncheck');
              }
            }
          }

          // Remove "selected" text for sim-type
          if (block.classList.contains('sim-type')) {
            const statusDiv = otherItem.querySelector(':scope > div:nth-child(2)');
            if (statusDiv) {
              const statusP = statusDiv.querySelector('p');
              if (statusP && statusP.textContent.trim() === 'selected') {
                statusP.textContent = '';
              }
            }
          }
        });

        // Select the clicked item
        const itemUncheckImg = item.querySelector('img[alt="uncheck"]');
        if (itemUncheckImg) {
          itemUncheckImg.alt = 'check';
          const newSrc = itemUncheckImg.src.replace('circle-uncheck', 'blue-check').split('&t=')[0];
          itemUncheckImg.src = `${newSrc}&t=${Date.now()}`;

          // Also update the source element in the picture
          const picture = itemUncheckImg.closest('picture');
          if (picture) {
            const source = picture.querySelector('source');
            if (source) {
              source.srcset = source.srcset.replace('circle-uncheck', 'blue-check');
            }
          }
        }

        // Add "selected" text for sim-type
        if (block.classList.contains('sim-type')) {
          const statusDiv = item.querySelector(':scope > div:nth-child(2)');
          if (statusDiv) {
            let statusP = statusDiv.querySelector('p');
            if (!statusP) {
              statusP = document.createElement('p');
              statusDiv.appendChild(statusP);
            }
            statusP.textContent = 'selected';
          }
        }
      });
    });
  }
}
