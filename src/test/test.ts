import type Stripe from "stripe";
import { ETypeMP } from "../stripe/const/enums.js";
import { Customer } from "../stripe/customer.js";
import { Payment } from "../stripe/payment.js";
import { Product } from "../stripe/products.js";

class TestPayment {

    static execute = async () => {
        const idCustomer = 'cus_Udz7kHkZ12oyGb';
        const idProduct = 'prod_UdhgDMRq3gIQ03';
        let customer: Stripe.Customer;
        let paymentMethodId: string;
        try {

            // buscamos el cliente por id
            const customerData = await Customer.retrieve(idCustomer);
    
            // creo un cliente
            // const email = "kevin@gmail.com";
            // const name = "Kevin";
            // customer = await Customer.create(email, name);
            // console.log('created customer: ', customer.id);

            if (customerData.deleted) return;
            customer = customerData;

            // metodo de pago
            // buscar metodos de pagos del cliente
            console.log('searching for payment methods of customer: ', customer.id);
            const paymentMethodsByCustomer = await Payment.listPaymentsByCustomer(customer.id);
            if (paymentMethodsByCustomer.length <= 0) {
                console.log('no payment methods found for customer, creating one...');
                // creo un metodo de pago y lo adjunto al cliente
                const data = {
                    type: ETypeMP.card,
                    token: 'tok_visa'
                }
                const newPaymentMethod = await Payment.createPaymentMethod(data);
                // attach payment method to customer
                const paymentMethod = await Payment.attachPaymentMethod(newPaymentMethod.id, customer.id);
                paymentMethodId = paymentMethod.id;
                console.log('payment method attached to customer: ', paymentMethodId);
            } else {
                // asignar el primer methodo de pago
                paymentMethodId = paymentMethodsByCustomer[0]!.id;
            }

            // seleccion del producto
            // const product = await ProductService.retrieveProduct(idProduct);
            const prices = await Product.listPrices(idProduct);
            console.log('Get product and prices');

            // creacion de la intencion de pago
            const amount = prices.data.find( prod => prod.active);

            if (!amount || amount.unit_amount == null) return;

            const paymentIntent = await Payment.createPaymentIntent({
                amount: amount.unit_amount,
                currency: 'usd',
                enabled: true,
                customerId: customer.id
            });
            console.log('Payment intent created');
            
            // Confirmar pago
            const piConfirm = await Payment.confirmPaymentIntent(
                paymentIntent.id, 
                paymentMethodId,
            );

            console.log('Confirmed payment: ');
            console.log(piConfirm);
            // cancelar pago
            // const piCancel = await cancelPaymentIntent(
                //     paymentIntent.id
                // );
                
            // ver estado del pago
            console.log('Status payment: ' + piConfirm.status);
        } catch(error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(error);
            }
        }

    }
}
console.log('Execute test');
TestPayment.execute();