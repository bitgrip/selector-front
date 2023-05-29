export const camelize = (str) => {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
};

// capitalize first letter of the string
export const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
// all lower case
export const lowerCase = (str: string) => {
	return str.toLowerCase();
};
