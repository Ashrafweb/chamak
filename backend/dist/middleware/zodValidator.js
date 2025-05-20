"use strict";
// import { Request, Response, NextFunction } from "express";
// import { z } from "zod";
// // Zod validation middleware
// export const zodValidator = (schema: z.ZodSchema) => {
// 	return (req: Request, res: Response, next: NextFunction) => {
// 		const parsed = schema.safeParse(req.body);
// 		if (!parsed.success) {
// 			return res.status(400).json({
// 				message: "Validation failed",
// 				errors: parsed.error.errors,
// 			});
// 		}
// 		req.body = parsed.data;
// 		next();
// 	};
// };
