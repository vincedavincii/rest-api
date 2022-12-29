import {Request, Response} from "express";

export function root(request: Request, response: Response) {
	response.status(200).send("<h1>My hot Server is Running</h1>");
}
