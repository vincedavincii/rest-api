import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";

export function defaultErrorHandler(
	err,
	request: Request,
	response: Response,
	next: NextFunction
) {
	logger.error(`Default error handler triggered: `, err);
	if (response.headersSent) {
		logger.error(
			`Response already written, delegating to built-in error handler`
		);
		return next(err);
	}
	response.status(500).json({
		status: "error",
		message: "Default error handler triggered, check the logs for more details",
	});
}
