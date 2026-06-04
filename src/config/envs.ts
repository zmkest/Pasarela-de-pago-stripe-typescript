import { z } from 'zod';

const schema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.string().default('development'),
    STRIPE_SECRET_KEY: z.string().nonempty(),
    STRIPE_CONFIRM_RETURN_URL: z.string().nonempty(),
    STRIPE_SECRET_WK: z.string().nonempty(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {{
    console.log('Error de variables de entorno');
    console.log(parsed.error.format());
    process.exit(1);
}}

export const env =  parsed.data;   