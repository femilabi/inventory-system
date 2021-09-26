export default function (sequelize: any, DataTypes: any) {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      totalItems: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0,
      },
      nextExpiry: {
        type: DataTypes.STRING(30),
        allowNull: true,
      }
    },
    {
      tableName: "products",
      indexes: [
        { fields: ["slug"], unique: true },
      ],
    }
  );
  return Product;
};
