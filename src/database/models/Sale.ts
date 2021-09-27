export default function (sequelize: any, DataTypes: any) {
    const Sale = sequelize.define(
        "Sale",
        {
            id: {
                type: DataTypes.INTEGER(11),
                autoIncrement: true,
                primaryKey: true,
            },
            productId: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
            }
        },
        {
            tableName: "sales"
        }
    );
    return Sale;
};
