import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { models } from "../database/index";
import Sequelize from "sequelize";

export default async function (req: Request, res: Response, next: NextFunction) {
    // Search product item
    const product = await models.Product.findOne({
        where: {
            slug: req.params.item
        }
    }).catch(console.trace);
    if (product) {
        if (product.nextExpiry <= Date.now() && product.totalItems >= 1) {
            // Get product items stats
            models.Item.findAll({
                attributes: [
                    "expiry",
                    [Sequelize.fn("SUM", Sequelize.col("quantity")), "total"],
                ],
                where: {
                    productId: product.id,
                    expiry: {
                        [Op.gt]: Date.now()
                    }
                },
                order: [["expiry", "ASC"]]
            })
                .then(async function (product_items: any) {
                    // Update the new product stats
                    product.update({
                        nextExpiry: product_items?.[0]?.expiry ?? null,
                        totalItems: product_items?.[0]?.total ?? 0
                    }).catch(console.trace);
                    
                    // Delete all the expired product items from table
                    models.Item.destroy({
                        where: {
                            productId: product.id,
                            expiry: {
                                [Op.lt]: Date.now()
                            }
                        }
                    }).catch(console.trace);

                    // Get up-to-date product data
                    await product.reload();

                    // Pass to the action midlleware
                    res.locals["product"] = product;
                    next();
                })
                .catch(function (error: any) {
                    console.trace(error);
                    res.json({ error: "Request failed. Please try again" });
                });
        } else {
            // Pass to the action midlleware
            res.locals["product"] = product;
            next();
        }
    } else {
        res.json({ error: "Product item not found or out of stock" });
    }
}