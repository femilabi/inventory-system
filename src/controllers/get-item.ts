import { Request, Response } from "express";
import { models } from "../database/index";
import Sequelize from "sequelize";

export default async function (req: Request, res: Response) {
    // Search product item
    const product = res.locals["product"];
    if (product.totalItems >= 1) {
        // Get the maximum expiry
        models.Item.findAll({
            attributes: [
                [Sequelize.fn("MAX", Sequelize.col("expiry")), "validTill"]
            ],
            raw: true
        }).then(function (data: any) {
            // Response
            res.status(200).json({
                qauntity: Number(product.totalItems),
                validTill: Number(data[0].validTill)
            });
        }).catch(function (error: any) {
            console.trace(error);
            res.json({ error: "Unknown error occured. Please try again" });
        });
    } else {
        // Response
        res.status(200).json({ 
            qauntity: 0,
            validTill: null
        });
    }
}