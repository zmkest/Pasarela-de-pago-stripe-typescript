import express from "express";
import { env } from "./config/envs.js";
import { AppRouter as appRouter } from "./router.js";
import { errorHandler } from "./middlewares/middleware.js";
import { PaymentController } from "./controllers/payment.controller.js";

const App = () => {

    const app = express();

    // Stripe webhook
    app.post('/stripe/webhook', express.raw({ type: 'application/json'}), PaymentController.webhook);
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(appRouter.routes);

    app.use(errorHandler);

    app.listen(env.PORT, () => {
        console.log(`Server is running on mode ${env.NODE_ENV} on port ${env.PORT}`);
    });
}

App();