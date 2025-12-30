import type { TopicConfig } from '../types';

export function createHeader(container: HTMLElement, topic: TopicConfig): void {
  const header = document.createElement('div');
  header.className = 'header';
  header.innerHTML = `
    <h1>${topic.name} CRD Explorer</h1>
    <p>${topic.description}</p>
  `;
  container.appendChild(header);
}

export function createNavTabs(
  container: HTMLElement,
  topics: string[],
  activeTopic: string,
  onTopicChange: (topicId: string) => void
): void {
  const navTabs = document.createElement('div');
  navTabs.className = 'nav-tabs';
  navTabs.innerHTML = topics
    .map(
      topic => `
      <button class="nav-tab ${topic.toLowerCase() === activeTopic ? 'active' : ''}" data-topic="${topic.toLowerCase()}">
        ${topic}
      </button>
    `
    )
    .join('');
  container.appendChild(navTabs);

  navTabs.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const topicId = tab.getAttribute('data-topic');
      if (topicId) {
        onTopicChange(topicId);
      }
    });
  });
}

export function createLegend(
  container: HTMLElement,
  categoryColors: Record<string, number>,
  onCategoryClick: (category: string) => void
): void {
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = `
    <h4>Categories</h4>
    ${Object.entries(categoryColors)
      .map(
        ([name, color]) => `
      <div class="legend-item" data-category="${name}">
        <div class="legend-color" style="background: #${color.toString(16).padStart(6, '0')}"></div>
        <span>${name}</span>
      </div>
    `
      )
      .join('')}
  `;
  container.appendChild(legend);

  // Legend click handlers
  legend.querySelectorAll('.legend-item').forEach(item => {
    item.addEventListener('click', () => {
      const category = item.getAttribute('data-category');
      if (category) {
        onCategoryClick(category);
      }
    });
  });
}

export function createInstructions(container: HTMLElement): void {
  const instructions = document.createElement('div');
  instructions.className = 'instructions';
  instructions.innerHTML = `
    <p>Drag to rotate | Scroll to zoom</p>
    <p>Click a node for details</p>
  `;
  container.appendChild(instructions);
}
