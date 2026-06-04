import type { Request, Response } from "express";
import { Customer } from "../stripe/customer.js";
import { CreateCustomerDto } from "../stripe/Dtos/create-customer.js";

export class CustomerController {
    static createCustomer = async (req: Request, res: Response) => {
        try {
            const [error, data] = CreateCustomerDto.create(req.body);
            if (error || !data) {
                res.status(400).json({ error });
                return;
            }

            const customer = await Customer.create(data);
            res.status(201).json({ data: customer, message: 'Customer created successfully' }); 
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error '});
            }
        }
    }

    static retrieveCustomer = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (Array.isArray(id) || id === undefined) {
                res.status(400).json({ error: 'Invalid id'});
                return;
            }

            const customer = await Customer.retrieve(id);
            res.status(200).json({ data: customer, message: 'Customer created successfully' }); 
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error '});
            }
        }
    }
}