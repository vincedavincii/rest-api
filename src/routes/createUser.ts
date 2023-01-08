import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {Repository} from "typeorm";
import {AppDataSource} from "../dataSource";
import Users from "../models/users";
import {passwordCalculator} from "../utils";

const crypto = require("crypto");

export default async function createUser(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug("CreatUser()called");
		const {email, password, pictureUrl, isAdmin} = request.body;
		if (!email || !password) {
			throw ` Could not extract email or password from request, aborting...`;
		}
		const repository = AppDataSource.getRepository(Users);
		const user = await repository
			.createQueryBuilder("users")
			.where("email = :email", {email})
			.getOne();

		if (user) {
			const message = `User with email ${email} already exists, use another email..`;
			response.status(500).json({message});
			return;
		}
		const passwordSalt = crypto.randomBytes(64).toString("hex");
		const passwordHash = await passwordCalculator(password, passwordSalt);

		const newUser = repository.create({
			email,
			pictureUrl,
			isAdmin,
			passwordHash,
			passwordSalt,
		});

		await AppDataSource.manager.save(newUser);
		logger.info(`User with email ${email} has been created successfully`);
		response.status(200).json({
			email,
			pictureUrl,
			isAdmin,
		});
	} catch (error) {
		logger.error(`Errror executing createUser()`);
		return next(error);
	}
}
