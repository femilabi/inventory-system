import { Request, Response } from "express";
import { models, sequelize } from "../database/index";
import Sequelize, { Op } from "sequelize";

export default async function (req: Request, res: Response) {
    // Validate input
    let sell_quantity = Math.floor(req.body.quantity);
    if (!(sell_quantity >= 1)) {
        return res.json({
            error: "Minimum sell quantity must be greater than one"
        });
    }

    const product = res.locals["product"];
    if (product?.totalItems >= sell_quantity) {
        // Decrement product total items
        // The where clause helps to prevent over selling of product items
        product.update(
            { totalItems: Sequelize.literal(`totalItems - ${sell_quantity}`) },
            {
                where: {
                    totalItems: {
                        [Op.gte]: sell_quantity,
                    }
                }
            }
        ).then(async function (data: any) {
            if (data) {
                // Create new sales record
                let sale = await models.Sale.create({ 
                    quantity: sell_quantity, 
                    productId: product.id 
                }).catch(console.trace);
                if (sale) {
                    // Remove already sold items in respect to their expiry date
                    do {
                        let update: any = await sequelize.query(`
                        SET @quantity_sold = 0;

                        UPDATE is_items
                        SET quantity=quantity-(@quantity_sold:=LEAST(${sell_quantity}, quantity))
                        WHERE quantity > 0 AND productId = ${data.id}
                        ORDER BY expiry DESC LIMIT 1;

                        SELECT @quantity_sold AS quantity_sold
                    `).catch(console.trace);
                        let result = update[0];
                        let quantity_sold = result[result.length - 1][0]["quantity_sold"];
                        sell_quantity -= quantity_sold;
                        if (!(quantity_sold > 0 && sell_quantity > 0)) {
                            break;
                        }
                    } while (sell_quantity > 0);

                    // Clean items and remove the ones with zero quantity
                    models.Item.destroy({
                        where: {
                            productId: product.id,
                            quantity: {
                                [Op.lt]: 1
                            }
                        }
                    }).catch(console.trace);

                    // Send response
                    res.json({});
                } else {
                    res.json({ error: "Request failed. Please try again later." });
                }
            } else {
                res.json({
                    error: "Request failed. Please try again"
                });
            }
        }).catch(function (error: any) {
            console.trace(error);
            res.json({
                error: "Unknown error occured. Please try again"
            });
        });
    } else if (product?.totalItems > 0) {
        res.json({
            error: `Product item not up to ${sell_quantity}. Total quantity available is ${product?.totalItems}`
        });
    } else {
        res.json({
            error: "Product item is out of stock"
        });
    }
}

// CREATE PROCEDURE removeSoldItems ()
// BEGIN
//     SET @sell_quantity:=100;
//     WHILE @sell_quantity > 0 DO
//         UPDATE is_items SET quantity= quantity -(@quantity_sold:=LEAST(@sell_quantity, quantity)) ORDER BY expiry ASC LIMIT 1;
//         SET @sell_quantity = @sell_quantity - @quantity_sold;
//         SELECT * FROM is_items;
//     END WHILE;
// END;
// CALL removeSoldItems();