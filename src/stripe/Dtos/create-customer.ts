import { Regex } from "../const/regex.js";

export class CreateCustomerDto {
    private constructor(
        public name: string,
        public email: string,
    ) {}

    static create( props: {[key: string]: any}): [string | undefined, CreateCustomerDto?] {
        const { name, email } = props;
        if (!name) return ["name is required"];
        if (!email) return ["name is required"];
        if (!Regex.email.test(email)) return ['Invalid email'];
        return [undefined, new CreateCustomerDto(name, email)];
    }
}