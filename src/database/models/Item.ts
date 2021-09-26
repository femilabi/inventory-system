export default function (sequelize: any, DataTypes: any) {
  const Item = sequelize.define(
    "Item",
    {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0
      },
      quantity: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0
      },
      expiry: {
        type: DataTypes.STRING(30),
        allowNull: false
      }
    },
    {
      tableName: "items",
    }
  );
  return Item;
};
