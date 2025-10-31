import { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import bcrypt from "bcryptjs";
import {
  RegisterTouristInput,
  registerTouristSchema,
} from "../../zod/authSchema";
import userInputError from "../../utils/errorHandlers/userInputError";
import httpStatusCode from "../../utils/httpCode";
import internalServerError from "../../utils/errorHandlers/error";
import { tourists } from "../../db/schema";
import { v4 } from "uuid";
export default async function registerTouristController(c: Context) {
  try {
    const db = drizzle(c.env.DB);
    const body: RegisterTouristInput = await c.req.json();
    const parsed = registerTouristSchema.safeParse(body);
    if (!parsed.success) {
      return userInputError(parsed.error, c.json.bind(c));
    }
    const hashedPassword = bcrypt.hashSync(body.password, 10);
    if (!body.name || !body.email || !body.country || !body.phone) {
      return c.json(
        {
          success: false,
          error: "All fields are required",
          statusCode: httpStatusCode.BadRequest,
        },
        httpStatusCode.BadRequest
      );
    }

    const id = v4();
    const dbResponse = await db
      .insert(tourists)
      .values([{
        id,
        name: body.name,
        email: body.email,
        country: body.country,
        password: hashedPassword,
        phone: body.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }])
      .returning();

    return c.json(
      {
        success: true,
        message: "Tourist registered successfully",
        data: {
          id: dbResponse[0].id,
          name: dbResponse[0].name,
          email: dbResponse[0].email,
          phone: dbResponse[0].phone,
          country: dbResponse[0].country,
          createdAt: dbResponse[0].createdAt,
          updatedAt: dbResponse[0].updatedAt,
        },
        statusCode: httpStatusCode.OK,
      },
      httpStatusCode.OK
    );
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      return c.json(
        {
          success: false,
          error: "Email already registered",
          statusCode: httpStatusCode.BadRequest,
        },
        httpStatusCode.BadRequest
      );
    }

    // Generic internal server error
    return internalServerError(c.json.bind(c));
  }
}
