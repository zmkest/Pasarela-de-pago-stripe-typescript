export class CreateProductDto {
    
    private constructor(public name: string, public price: number){}
    
    static create(props: {[key: string]: any}): [string | undefined, CreateProductDto?] {
        const { name, price } = props;

        if  ( !name ) return ['Name is required'];
        if  ( !price ) return ['Price is required'];
        if  ( Number(price) <= 0) return ['Price must be greater than zero'];
        return [undefined, new CreateProductDto(name, price)];
    }
}