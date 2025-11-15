import { Router, Request, Response } from "express";
import { models } from "../db";
import { generateToken } from "../auth/jwt";

const router = Router();
const { User } = models;

export default () => {
  router.post(
    "/register",
    async (req: Request, res: Response): Promise<any> => {
      try {
        const { name, surname, nickName, email, age, password, role } =
          req.body;

        // Validation - add later proper validation from bonus task
        if (!name || !surname || !nickName || !email || !age || !password) {
          return res.status(400).json({
            error:
              "Missing required fields: name, surname, nickName, email, age, password",
          });
        }

        const user = await User.create({
          name,
          surname,
          nickName,
          email,
          age: parseInt(age),
          password,
          role,
        });

        const token = generateToken({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        const { password: _, ...userWithoutPassword } = user.toJSON();

        return res.status(201).json({
          message: "User registered successfully",
          data: {
            user: userWithoutPassword,
            token,
          },
        });
      } catch (error: any) {
        // TODO: proper error handling
        console.error("Registration error:", error);
        return res
          .status(500)
          .json({ error: "Registration failed", details: error.message });
      }
    },
  );

  router.post("/login", async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;

      // Validation - add later proper validation from bonus task
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const { password: _, ...userWithoutPassword } = user.toJSON();

      return res.json({
        message: "Login successful",
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json({ error: "Login failed", details: error.message });
    }
  });

  return router;
};
