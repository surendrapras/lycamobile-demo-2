export default function decorate(block) {
  [...block.children].forEach((row) => {
    // Create details/summary structure for each FAQ item
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const content = document.createElement('div');
    content.className = 'accordion-faq-content';

    // First child is the question (summary)
    const question = row.children[0];
    if (question) {
      summary.innerHTML = question.innerHTML;
    }

    // Second child is the answer (content)
    const answer = row.children[1];
    if (answer) {
      content.innerHTML = answer.innerHTML;
    }

    details.append(summary);
    details.append(content);
    row.replaceChildren(details);
  });

  // Add click handlers for exclusive opening (optional)
  block.querySelectorAll('details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        block.querySelectorAll('details').forEach((other) => {
          if (other !== detail) other.open = false;
        });
      }
    });
  });
}
