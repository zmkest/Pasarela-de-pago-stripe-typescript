import type Stripe from "stripe";
import {stripeClient} from "./client.js";
import type { CreateCustomerDto } from "./Dtos/create-customer.js";

export class Customer {
    static create = async (createCustomerDto: CreateCustomerDto): Promise<Stripe.Customer> => {
        const customer = await stripeClient.customers.create(createCustomerDto);
        return customer;
    }

    static retrieve = async (id: string) => {
        const customer = await stripeClient.customers.retrieve(id);
        return customer;
    }
}