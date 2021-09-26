import { Sequelize, DataTypes } from "sequelize";
import glob from "glob";
import path from "path";
import config from "../config";

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: 'mysql',
    port: config.DB_PORT,
    dialectOptions: {
      multipleStatements: true
    },
    hooks: {
      beforeDefine: function (columns, model) {
        model.tableName = config.DB_PREFIX + model.tableName;
      },
    },
  }
);

const models: any = {};

async function loadDatabaseModels() {
  let model_paths = glob.sync("./src/database/models/*.ts");
  for (let i = 0; i < model_paths.length; i++) {
    let model_name = path.parse(model_paths[i])["name"];
    let model_path = `./models/${model_name}`;
    let model = await import(model_path);
    models[model_name] = model.default(sequelize, DataTypes);
  }

  return models;
}

loadDatabaseModels()
  .then(function (models) {
    Object.keys(models).forEach((model_name) => {
      if (models[model_name].associate) {
        models[model_name].associate(models);
      }
    });
    sequelize.sync({ alter: true }).catch(console.trace);
  })
  .catch(console.trace);


export { models, sequelize };
