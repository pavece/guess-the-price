export interface Product {
	name: string;
	image: string;
	price: number;
	priceDescription?: string | null;
	description?: string | null;
	source?: string | null;
}
