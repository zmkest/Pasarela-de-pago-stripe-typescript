import { stripeClient } from './client.js';
import Stripe from 'stripe';
import { PaymentIntentDto } from './Dtos/payment-intent.js';
import { PaymentMethodDto } from './Dtos/payment-method.js';
import { env } from '../config/envs.js';

export class Payment {
    static createPaymentIntent = async (paymentIntentDto: PaymentIntentDto): Promise<Stripe.PaymentIntent> => {
        const { amount, currency, enabled, customerId } = paymentIntentDto;
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled
            },
            customer: customerId
        });

        return paymentIntent;
    }

    static createPaymentMethod = async (paymentMethodDto: PaymentMethodDto): Promise<Stripe.PaymentMethod> => {
        const { type, token } = paymentMethodDto;
        const paymentMethod = await stripeClient.paymentMethods.create({
            type,
            card: {
                token,
            }
        });

        return paymentMethod;
    }

    static attachPaymentMethod = async (paymentMethodId: string, customerId: string): Promise<Stripe.PaymentMethod> => {
        const paymentMethod = await stripeClient.paymentMethods.attach(
            paymentMethodId,
            { customer: customerId }
        );
        return paymentMethod;
    }

    static listPaymentsByCustomer = async (customerId: string): Promise<Stripe.PaymentMethod[]> => {
        const paymentMethods = await stripeClient.customers.listPaymentMethods(
            customerId,
            { limit: 3 }
        );
        return paymentMethods.data;
    }

    static confirmPaymentIntent = async (piId: string, pm: string) => {
        const paymentIntent = await stripeClient.paymentIntents.confirm(
            piId,
            {
                payment_method: pm,
                return_url: env.STRIPE_CONFIRM_RETURN_URL
            }
        );
        return paymentIntent;
    }

    static cancelPaymentIntent = async (piId: string) => {
        const paymentIntent = await stripeClient.paymentIntents.cancel(
            piId
        );

        return paymentIntent;

    }

    static retrivePaymentIntent = async (id: string) => {
        const pi = await stripeClient.paymentIntents.retrieve(id);
        return pi;
    }

    static webhook = async (body: any, signature: any) => {
        const event = stripeClient.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_SECRET_WK
        );
        return event;
    }
}