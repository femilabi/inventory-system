import { Request, Response } from "express";
import { models, sequelize } from "../database/index";

export default async function (req: Request, res: Response) {
    // Validate post data
    const quantity = Math.floor(req.body.quantity);
    const expiry = Math.floor(req.body.expiry);
    if (!(quantity >= 1)) {
        return res.json({ error: "Quantity field must be one or more" });
    } else if (!(expiry >= Date.now())) {
        return res.json({ error: "Expiry field must be greater than current time" });
    }

    // Search product item
    const product = res.locals["product"];

    // Create new item here
    models.Item
        .create({ quantity, expiry, productId: product.id })
        .then((item: any) => {
            if (item) {
                // Send response
                res.status(200).json({});

                // Update product total items and expiry date of the product
                sequelize.query(`
                    UPDATE is_products 
                    SET
                        totalItems = totalItems + ${quantity},
                        nextExpiry = IF (nextExpiry, LEAST(nextExpiry, ${expiry}), ${expiry})
                    WHERE id = ${product.id}
                `).catch(console.trace);
            } else {
                res.json({ error: "Request failed. Please try again" });
            }
        }).catch(function (error: any) {
            console.trace(error);
            res.status(500).json({ error: "Unknown error occured. Please try again" });
        });
}