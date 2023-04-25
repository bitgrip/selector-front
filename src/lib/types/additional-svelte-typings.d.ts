declare namespace svelteHTML {
	// enhance attributes
	interface HTMLAttributes<T> {
		'on:outclick'?: (event: any) => any;
		// If you want to use myCustomAttribute={..} (note: all lowercase)
		// mycustomattribute?: any;
		// You can replace any with something more specific if you like
	}
}
