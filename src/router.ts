import { Router, type Request, type Response } from "express";
import { ProductController } from './controllers/products.controller.js';

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

        // Stripe

        return router;
    }

}