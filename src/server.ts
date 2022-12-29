import * as dotenv from "dotenv";
const result = dotenv.config();

if (result.error) {
	console.log(`Error loading Env Variables, Terminating...`);
	process.exit(1);
}

import * as express from "express";
import {root} from "./routes/root";
import {isInteger} from "./routes/utils";
import {logger} from "./logger";

const app = express();

function setupExpress() {
	app.route("/").get(root);
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

setupExpress();

startServer();
