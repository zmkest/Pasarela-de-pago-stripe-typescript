import { Product } from '../stripe/products.js';
import type { Request, Response } from 'express';
import { CreateProductDto } from '../stripe/Dtos/create-product.js';
import { UpdateProductDto } from '../stripe/Dtos/update-product.js';

const createProduct = async (req: Request, res: Response) => {
    try {
        const [error, data] = CreateProductDto.create(req.body);

        if (error) return res.status(400).json({ error: 'Invalid product data', details: error });

        const product = await Product.createProduct(data!);
        res.status(201).json(product);
    } catch(error) {
        if (error instanceof Error) {
            res.status(400).json({ error: 'Invalid product data', details: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }    
    }
}

const updateProduct = async (req: Request, res: Response) => {
    try {
        const [error, data] = UpdateProductDto.update(req.body);

        if (error) return res.status(400).json({ error: 'Invalid product data', details: error });

        const product = await Product.updateProduct(data!);
        res.status(200).json(product);
    } catch(error) {
        if (error instanceof Error) {
            res.status(400).json({ error: 'Error updating product', details: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

const retrieveProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'Product ID is required' });

        const product = await Product.retrieveProduct(String(id));
        res.status(200).json(product);
    } catch(error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

const listProduct = async (req: Request, res: Response) => {
    try {
        const products = await Product.listProducts();
        res.status(200).json(products);
    } catch(error) {
        if (error instanceof Error) {
            res.status(400).json({ error: 'Error listing products', details: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'Product ID is required' });
        const product = await Product.deleteProduct(id.toString());
        res.status(200).json(product);
    } catch(error) {
        if (error instanceof Error) {
            res.status(400).json({ error: 'Error deleting product', details: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export const ProductController = {
    createProduct,
    updateProduct,
    retrieveProduct,
    listProduct,
    deleteProduct
}
