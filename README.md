# Inventory-system
A simple perishable inventory management system

# Installation guide
The process of installation is in four simple stages
Note that the guide assumes you are familiar with **node.js** environment and its framework **express.js** and have installed **MySQL** Workkbench on your machine.
1. Clone the repository to your local machine.
2. Create a database on your **MySQL** workbench and change the database parameters in the configuration file (**_/src/config.ts_**) to your newly created database.
3. Manually add the perishable products to the **is_products** table in the database.
   **Note:** The required fields are _name_ and _slug_. _slug_ is best with value small letters,underscore, hyphen and numbers. The _:item_ parameter in the URI represent the _slug_.
4. (Optional) The Application Port is defaulted to **3000** and can be changed in **_/index.ts_** directly inside of the project root directory.
5. Navigate to project root directory on your CLI and run any of the commands, **_npm run start_** or **_npm run start:dev_** or **_npm run start:build_**
6. Then you should have your app run successfully.

# Endpoints
1. **POST** /:item/add
    - a. Add a lot of :item to the system
    - b. **IN**: {quantity: Number, expiry: Number}
      - i. quantity - quantity of item in the lot to be added
      - ii. expiry - milliseconds-since-epoch representing the expiry time of this lot
    - c. **OUT**: {}
2. **POST** /:item/sell
    - a. sell a quantity of an item and reduce its inventory from the database.
    - b. **IN**: {quantity: Number}
      - i. quantity - quantity to be sold.
    - c. **OUT**: {}
3. **GET** /:item/quantity
    - a. get non-expired quantity of the item from the system
    - b. **IN**: {}
    - c. **OUT**: {quantity: Number, validTill: Number | null}
      - i. quantity - non-expired quantity of item
      - ii. validTill - milliseconds-since-epoch representing the maximum time till which the returned quantity is valid. should be null if returned 
  quantity is 0
