export class UpdateProductDto {
    private constructor(
        public id: string,
        public name?: string,
        public price?: number
    ) {}

    static update(props: {[key: string]: any}): [string | undefined, UpdateProductDto?] {
        const { id, name, price } = props;
        if (!id) return ['Id is required'];
        return [undefined, new UpdateProductDto(id, name, price)];
    }
}