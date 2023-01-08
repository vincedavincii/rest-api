import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../dataSource";
import Users from "../models/users";
import {passwordCalculator} from "../utils";

export async function login(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug("login() Triggered");
		const {email, password} = request.body;
		if (!email || !password) {
			throw ` Could not extract email or password from request, aborting...`;
		}
		const repository = AppDataSource.getRepository(Users);
		const user = await repository
			.createQueryBuilder("users")
			.where("email = :email", {email})
			.getOne();

		if (user) {
			const message = `Login denied.`;
			logger.info(`${message} - ${email}`);
			response.status(403).json({message});
			return;
		}
		const passwordHash = await passwordCalculator(password, user.passwordSalt);
		if (user.passwordHash != passwordHash) {
			const message = `Login denied.`;
			logger.info(
				`${message}- user with ${email} has entered a wrong password`
			);
			response.status(403).json({message});
			return;
		}
		logger.info(`User with ${email} has now logged in`);
		const {pictureUrl, isAdmin} = user;
		response.status(200).json({
			email,
			pictureUrl,
			isAdmin,
		});
	} catch (error) {}
}
