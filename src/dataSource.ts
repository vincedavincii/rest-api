import {DataSource} from "typeorm";
import {Company} from "./models/company";
import {Products} from "./models/products";
import Users from "./models/users";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT),
	database: process.env.DB_NAME,
	ssl: true,
	extra: {
		ssl: {
			rejectUnauthorized: false,
		},
	},
	entities: [Company, Products, Users],
	synchronize: true,
	logging: true,
});
