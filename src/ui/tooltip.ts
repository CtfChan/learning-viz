let tooltip: HTMLDivElement;

export function createTooltip(container: HTMLElement): HTMLDivElement {
  tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  container.appendChild(tooltip);
  return tooltip;
}

export function showTooltip(text: string, x: number, y: number): void {
  tooltip.textContent = text;
  tooltip.style.left = x + 15 + 'px';
  tooltip.style.top = y + 15 + 'px';
  tooltip.classList.add('visible');
}

export function hideTooltip(): void {
  tooltip.classList.remove('visible');
}

export function updateTooltipPosition(x: number, y: number): void {
  tooltip.style.left = x + 15 + 'px';
  tooltip.style.top = y + 15 + 'px';
}
