import { stripeClient } from './client.js';
import Stripe from 'stripe';
import { CreateProductDto } from './Dtos/create-product.js';
import { UpdateProductDto } from './Dtos/update-product.js';

export class Product {
    static createProduct = async (createProduct: CreateProductDto): Promise<Stripe.Product> => {
        const { name, price } = createProduct;
        const product = await stripeClient.products.create({
            name,
            default_price_data: {
                currency: 'usd',
                unit_amount: price * 100,
            }
        });
        return product;
    }

    static updateProduct = async (product: UpdateProductDto): Promise<Stripe.Product> => {
        const { id, ...updateData } = product;

        const data = await this.retrieveProduct(id);

        const objUpdateStripe: Stripe.ProductUpdateParams = {};

        if (updateData.name) objUpdateStripe.name = updateData.name;
        if (updateData.price) {
            const price = await stripeClient.prices.create({
                unit_amount: updateData.price * 100,
                currency: 'usd',
                product: id,
            });
            objUpdateStripe.default_price = price.id;
        }

        const updatedProduct = await stripeClient.products.update(id, objUpdateStripe);

        return updatedProduct;
    }

    static retrieveProduct = async (id: string): Promise<Stripe.Product> => {
        const product = await stripeClient.products.retrieve(id);
        return product;
    }

    static listProducts = async (): Promise<Stripe.ApiList<Stripe.Product>> => {
        const product = await stripeClient.products.list();
        return product;
    }

    static deleteProduct = async (id: string): Promise<Stripe.Product> => {
        await this.retrieveProduct(id);

        const product = await stripeClient.products.update(id, {
            active: false
        });

        return product;
    }

    static listPrices = async (id: string) => {
        const prices = await stripeClient.prices.list({product: id});
        return prices;
    }
}