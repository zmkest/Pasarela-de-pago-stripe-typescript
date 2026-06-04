import { Router, type Request, type Response } from "express";
import { ProductController } from './controllers/products.controller.js';
import { PaymentController } from "./controllers/payment.controller.js";
import { CustomerController } from "./controllers/customer.controller.js";
import express from 'express';

export class AppRouter {

    static get routes(): Router {
        
        const router: Router = Router();
        router.get('/', (req: Request, res: Response) => 
            { res.status(200).send('Server is running') });

        // Crud de productos stripe
        router.post('/product', ProductController.createProduct);
        router.put('/product', ProductController.updateProduct);
        router.get('/product/:id', ProductController.retrieveProduct);
        router.get('/products', ProductController.listProduct);
        router.delete('/product/:id', ProductController.deleteProduct);

        // Customer
        router.post('/customer', CustomerController.createCustomer);
        router.get('/customer/:id', CustomerController.retrieveCustomer);

        // Payment method
        router.post('/payment-method/:customerId', PaymentController.createPaymentMethod);
        router.get('/payment-method/:customerId', PaymentController.listPaymentsByCustomer);
        // router.delete('/payment-method/:paymentMethodId', PaymentController.deletePaymentMethod);

        // Payment Intent
        router.post('/payment-intent', PaymentController.createPaymentIntent);
        router.post('/payment-intent/:id/confirm', PaymentController.confirmPaymentIntent);
        router.post('/payment-intent/:id/cancel', PaymentController.cancelPaymentIntent);
        router.get('/payment-intent/:id', PaymentController.retrivePaymentIntent);

        return router;
    }

}