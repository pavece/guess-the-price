export interface Product {
	id: string;
	name: string;
	description: null;
	image: string;
	source: null;
	priceMessage: string;
	category: Category;
	price: number;
}

export interface Category {
	name: string;
}
