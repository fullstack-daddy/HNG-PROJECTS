import bycrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { create, findOne } from "../models/User.js";
import { create as _create } from "../models/Organisation.js";

const register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const hashedPassword = await bycrypt.hash(password, 8);
    const userId = uuidv4();

    const user = await create({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const orgId = uuidv4();
    const organisation = await _create({
      orgId,
      name: `${firstName}'s Organisation`,
      description: "",
    });

    const token = sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).send({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (e) {
    res.status(400).send({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findOne({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
      return res.status(401).send({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    const token = sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).send({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (e) {
    res.status(400).send({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }
};

export default { register, login };
