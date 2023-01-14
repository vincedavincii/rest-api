import * as dotenv from "dotenv";
const result = dotenv.config();

if (result.error) {
	console.log(`Error loading Env Variables, Terminating...`);
	process.exit(1);
}
import "reflect-metadata";
import * as express from "express";
import {root} from "./routes/root";
import {isInteger} from "./utils";
import {logger} from "./logger";
import {AppDataSource} from "./dataSource";
import {defaultErrorHandler} from "./middleware/defaultErrorHandler";
import {getCompany} from "./routes/getCompany";
import {FindProducts} from "./routes/findProducts";
import {findCompanyByUrl} from "./routes/findCompanyUrl";
import createCompany from "./routes/createCompany";
import {deleteCompany} from "./routes/deleteCompany";
import createUser from "./routes/createUser";
import checkIfAuthenticated from "./middleware/authentication";
import updateCompany from "./routes/updateCompany";
import {login} from "./routes/login";
import checkAdmin from "./middleware/checkAdmin";

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

function setupExpress() {
	app.use(cors({origin: true}));
	app.use(bodyParser.json());
	app.route("/").get(root);
	app.route("/api/company").get(checkIfAuthenticated, getCompany);
	app
		.route("/api/company/:companyUrl")
		.get(checkIfAuthenticated, findCompanyByUrl);
	app
		.route("/api/company/:companyId/products")
		.get(checkIfAuthenticated, FindProducts);
	app.route("/api/company").post(checkIfAuthenticated, createCompany);
	app
		.route("/api/company/:companyId")
		.delete(checkIfAuthenticated, deleteCompany);
	app
		.route("/api/company/:companyId")
		.patch(checkIfAuthenticated, updateCompany);
	app.route("/api/users").post(checkIfAuthenticated, checkAdmin, createUser);
	app.route("/api/login").post(login);
	app.use(defaultErrorHandler);
}

function startServer() {
	let port: number;
	const portEnv = process.env.PORT,
		portArg = process.argv[2];

	if (isInteger(portEnv)) {
		port = parseInt(portEnv);
	}

	if (!port && isInteger(portArg)) {
		port = parseInt(portArg);
	}

	if (!port) {
		port = 5000;
	}
	app.listen(port, () => {
		logger.info(`Server running at http://localhost:${port}`);
	});
}

AppDataSource.initialize()
	.then(() => {
		logger.info(` Datasource initialized successfully`);
		setupExpress();
		startServer();
	})
	.catch((err) => {
		logger.error(` Error Occured while initializing Datasource.`, err);
		process.exit(1);
	});
