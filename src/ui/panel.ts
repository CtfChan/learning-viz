import type { NodeData } from '../types';

let infoPanel: HTMLDivElement;

export function createInfoPanel(container: HTMLElement): HTMLDivElement {
  infoPanel = document.createElement('div');
  infoPanel.className = 'info-panel';
  container.appendChild(infoPanel);
  return infoPanel;
}

export function showInfoPanel(data: NodeData, onClose: () => void): void {
  infoPanel.innerHTML = `
    <button class="info-panel-close">&times;</button>
    <h2>${data.name}</h2>
    <span class="category-badge">${data.category}</span>
    <p class="description">${data.description}</p>

    <h3>Example YAML</h3>
    <pre><code>${escapeHtml(data.example)}</code></pre>

    <h3>Key Fields</h3>
    <ul>
      ${data.keyFields.map(field => `<li><code>${field}</code></li>`).join('')}
    </ul>

    <h3>Common Use Cases</h3>
    <ul>
      ${data.useCases.map(useCase => `<li>${useCase}</li>`).join('')}
    </ul>

    <div class="links">
      <a href="${data.docsUrl}" target="_blank" class="link-btn">Official Docs</a>
    </div>
  `;

  infoPanel.classList.add('visible');

  // Close button handler
  infoPanel.querySelector('.info-panel-close')?.addEventListener('click', () => {
    hideInfoPanel();
    onClose();
  });
}

export function hideInfoPanel(): void {
  infoPanel.classList.remove('visible');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
