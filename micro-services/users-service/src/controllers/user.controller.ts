import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password, role } = req.body;

    console.log("[UserController] Creating user:", { name, email, role });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });

      console.log("[UserController] User created:", user);

      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("[UserController] Create error:", error);
      return res.status(500).json({ error: "Error creating user" });
    }
  }

  async list(req: Request, res: Response) {
    const { role } = req.query;

    try {
      console.log("[UserController] Listando usuários por role:", role);

      const users = await prisma.user.findMany({
        where: {
          ...(role && { role: role as Role }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      console.log("[UserController] Usuários encontrados:", users);
      return res.json(users);
    } catch (error) {
      console.error("[UserController] Erro ao listar usuários:", error);
      return res.status(500).json({ error: "Error listing users" });
    }
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error("[UserController] FindById error:", error);
      return res.status(500).json({ error: "Error finding user" });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.json(user);
    } catch (error) {
      console.error("[UserController] Update error:", error);
      return res.status(500).json({ error: "Error updating user" });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.user.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error("[UserController] Delete error:", error);
      return res.status(500).json({ error: "Error deleting user" });
    }
  }

  async signin(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      console.log("[UserController] Signin attempt for:", email);
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log("[UserController] User not found:", email);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        console.log("[UserController] Invalid password for:", email);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1d" }
      );

      const { password: _, ...userWithoutPassword } = user;
      const response = {
        user: userWithoutPassword,
        token,
      };

      console.log("[UserController] Login successful:", response);
      return res.json(response);
    } catch (error) {
      console.error("[UserController] Signin error:", error);
      return res.status(500).json({ error: "Error during signin" });
    }
  }
}
