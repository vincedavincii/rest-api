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
import {getCourses} from "./routes/getCourses";
import {defaultErrorHandler} from "./middleware/defaultErrorHandler";
import {findCourseUrl} from "./routes/findCourseUrl";
import {findLessons} from "./routes/findLessons";
import updateCourse from "./routes/updateCourse";
import createCourse from "./routes/createCourse";
import {deleteCourses} from "./routes/deleteCourse";
import createUser from "./routes/createUser";
import {login} from "./routes/login";
import checkIfAuthenticated from "./middleware/authentication";
import checkAdmin from "./middleware/checkAdmin";

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

function setupExpress() {
	app.use(cors({origin: true}));
	app.use(bodyParser.json());
	app.route("/").get(root);
	app.route("/api/course").get(checkIfAuthenticated, getCourses);
	app.route("/api/course/:courseUrl").get(checkIfAuthenticated, findCourseUrl);
	app
		.route("/api/course/:courseId/lessons")
		.get(checkIfAuthenticated, findLessons);
	app.route("/api/course/:courseId").patch(checkIfAuthenticated, updateCourse);
	app.route("/api/course").post(checkIfAuthenticated, createCourse);
	app
		.route("/api/course/:courseId")
		.delete(checkIfAuthenticated, deleteCourses);
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
