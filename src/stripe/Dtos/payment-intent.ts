export class PaymentIntentDto {
    private constructor(
        public amount: number,
        public currency: string,
        public enabled: boolean,
        public customerId: string,
    ) {}

    static create(props: {[key: string]: any}): [string | undefined, PaymentIntentDto?] {
        const { amount, currency = 'usd', enabled = true, customerId } = props;
        
        if (!amount) return ['Amount is required'];
        if (isNaN(amount)) return ['Amount is not a number'];
        return [undefined, new PaymentIntentDto(amount, currency, enabled, customerId)]
    }
}
