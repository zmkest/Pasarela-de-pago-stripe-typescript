import type { ETypeMP } from "../const/enums.js";

export class PaymentMethodDto {
    private constructor(
        public type: ETypeMP, //us_bank_account
        public token: string
    ) {}

    static create(props: {[key: string]: any}): [string | undefined, PaymentMethodDto?] {
        const { type, token } = props;
        
        if (!type) return ['Type is required'];
        if (!token) return ['Token is required'];
        return [undefined, new PaymentMethodDto(type, token)]
    }
}