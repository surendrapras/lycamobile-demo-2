export default function decorate(block) {
  const steps = [];
  const rows = [...block.querySelectorAll(':scope > div')];

  // Parse steps from the block content
  rows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length >= 1) {
      const stepName = cols[0].textContent.trim();
      const status = cols[1]?.textContent.trim().toLowerCase() || '';
      const isActive = status === 'active';
      const isCompleted = status === 'completed';
      // Get URL from third column or from a link in first column
      const link = cols[0].querySelector('a') || cols[2]?.querySelector('a');
      const url = link?.href || cols[2]?.textContent.trim() || '';
      steps.push({
        name: stepName, active: isActive, completed: isCompleted, url,
      });
    }
  });

  // Calculate progress percentage
  const activeIndex = steps.findIndex((s) => s.active);
  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = activeIndex >= 0
    ? ((activeIndex + 0.5) / steps.length) * 100
    : (completedCount / steps.length) * 100;

  // Build the progress header HTML
  block.innerHTML = '';

  // Logo container
  const logoContainer = document.createElement('div');
  logoContainer.className = 'progress-logo';
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  const logoImg = document.createElement('img');
  logoImg.src = 'https://cms-assets-paym.globalldplatform.com/uk/s3fs-public/2024-07/home_logo_1.png';
  logoImg.alt = 'Lyca Mobile';
  logoImg.width = 92;
  logoImg.height = 37;
  logoLink.appendChild(logoImg);
  logoContainer.appendChild(logoLink);

  // Steps container
  const stepsContainer = document.createElement('div');
  stepsContainer.className = 'progress-steps';

  steps.forEach((step) => {
    const stepEl = document.createElement('div');
    stepEl.className = 'progress-step';
    if (step.active) stepEl.classList.add('active');
    if (step.completed) stepEl.classList.add('completed');

    // Make all steps with URLs clickable for navigation
    if (step.url) {
      const stepLink = document.createElement('a');
      stepLink.href = step.url;
      stepLink.textContent = step.name;
      stepEl.appendChild(stepLink);
    } else {
      const stepText = document.createElement('p');
      stepText.textContent = step.name;
      stepEl.appendChild(stepText);
    }

    stepsContainer.appendChild(stepEl);
  });

  // Progress bar container
  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'progress-bar-container';

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.style.width = `${progressPercent}%`;

  progressBarContainer.appendChild(progressBar);

  // Main content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'progress-content';
  contentWrapper.appendChild(logoContainer);

  const stepsWrapper = document.createElement('div');
  stepsWrapper.className = 'progress-steps-wrapper';
  stepsWrapper.appendChild(stepsContainer);
  stepsWrapper.appendChild(progressBarContainer);
  contentWrapper.appendChild(stepsWrapper);

  block.appendChild(contentWrapper);
}
