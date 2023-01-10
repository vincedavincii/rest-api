import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";

export default function checkAdmin(
	request: Request,
	response: Response,
	next: NextFunction
) {
	const user = request["user"];
	if (!user.isAdmin) {
		logger.error(`User not an Admin, Access denied!`);
		response.sendStatus(403);
		return;
	}
	logger.debug(`User is an Admin, Access Granted!`);
	next();
}
