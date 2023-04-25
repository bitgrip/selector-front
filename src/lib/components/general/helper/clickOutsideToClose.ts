export function clickOutsideToClose(node: HTMLElement) {
	function handleClick({ target }: MouseEvent) {
		if (!node.contains(target as Node)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	}

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
