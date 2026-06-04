import type { Request, Response } from "express";
import { PaymentIntentDto } from "../stripe/Dtos/payment-intent.js";
import { PaymentMethodDto } from "../stripe/Dtos/payment-method.js";
import { Payment } from "../stripe/payment.js";

export class PaymentController {
    
    static createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
        try {
            const [error, data] = PaymentIntentDto.create(req.body);
            if (error || !data) {
                res.status(400).json({ error: error });
                return
            }

            const paymentInt = await Payment.createPaymentIntent(data);
            res.status(201).json(paymentInt);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error '});
            }
        }
    }

    static confirmPaymentIntent = async (req: Request, res: Response): Promise<void> => {
        try {
            const id  = req.params.id;
            const { payment_method } = req.body;

            if (( !id || Array.isArray(id))|| !payment_method) {
                res.status(400).json({ error: 'Invalid data' });
                return
            }

            const paymentInt = await Payment.confirmPaymentIntent(id, payment_method);
            res.status(200).json(paymentInt);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error '});
            }
        }
    }
    
    static cancelPaymentIntent = async (req: Request, res: Response): Promise<void> => {
        try {
            const id  = req.params.id;

            if (( !id || Array.isArray(id))) {
                res.status(400).json({ error: 'Invalid payment intent id' });
                return
            }

            const paymentInt = await Payment.cancelPaymentIntent(id);
            res.status(200).json({ data: paymentInt});
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error '});
            }
        }
    }

    static createPaymentMethod = async (req: Request, res: Response): Promise<void> => {
        try {
            const { customerId } = req.params;
            const [error, data] = PaymentMethodDto.create(req.body);
            
            if (error || !data || (Array.isArray(customerId) || customerId === undefined)) {
                res.status(400).json({ error: error });
                return
            }

            const createdPM = await Payment.createPaymentMethod(data);

            const attachPM = await Payment.attachPaymentMethod(createdPM.id, customerId)
            res.status(201).json({
                data: {
                    payment_method: createdPM,
                    attach_payment_method: attachPM
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error '});
            }
        }
    }

    static listPaymentsByCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const { customerId } = req.params;
            
            if (Array.isArray(customerId) || customerId === undefined) {
                res.status(400).json({ error: 'customerId is required of type string' });
                return
            }

            const listPMC = await Payment.listPaymentsByCustomer(customerId);

            res.status(200).json({
                data: listPMC
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error '});
            }
        }
    }
    
    static retrivePaymentIntent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            
            if (Array.isArray(id) || id === undefined) {
                res.status(400).json({ error: 'id is required of type string' });
                return
            }

            const pi = await Payment.retrivePaymentIntent(id);

            res.status(200).json({
                data: pi
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error '});
            }
        }
    }

    static webhook = async (req: Request, res: Response): Promise<void> => {
        let event;
        console.log(typeof req.body, Buffer.isBuffer(req.body)) 
        const signature = req.headers['stripe-signature'];
        try {
            event = await Payment.webhook(req.body, signature);
                        
        } catch (error) {
            if (error instanceof Error) {
                console.log(`⚠️ Webhook signature verification failed.`, error.message);
                res.status(400).json({ error: error.message });
                return;
            } else {
                res.status(500).json({ error: 'Internal server error '});
                return;
            }
        }
        if (!event) return;

        switch (event.type) {
            case 'payment_intent.succeeded':
                const succeeded = event.data.object;
                console.log('Payment confirmed: ' + succeeded.id);
                break;
            case 'payment_intent.canceled':
                const canceled = event.data.object;
                console.log('Payment canceled: ' + canceled.id);
                break;
            case 'payment_intent.payment_failed':
                const failed = event.data.object;
                console.log('Payment failed: ' + failed.id);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).json({ recived: true });
    }
}