import { Request, Response } from 'express';
import { User } from '../models/User';

export class UserController {
  // GET /api/users - Listar todos os usuarios
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll({
        attributes: ['id', 'nome', 'email', 'createdAt']
      });
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao listar usuarios.', detalhe: error.message });
    }
  }

  // GET /api/users/:id - Buscar um usuario por ID
  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: 'O ID informado deve ser um numero valido e maior que zero.' });
      }

      const user = await User.findByPk(id, {
        attributes: ['id', 'nome', 'email', 'createdAt']
      });

      if (!user) {
        return res.status(404).json({ erro: 'Usuario nao encontrado.' });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao buscar usuario.', detalhe: error.message });
    }
  }

  // POST /api/users - Cadastrar um novo usuario
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, email, senha_hash } = req.body;

      if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ erro: 'O campo nome e obrigatorio.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.trim())) {
        return res.status(400).json({ erro: 'Informe um e-mail valido.' });
      }

      if (!senha_hash || typeof senha_hash !== 'string' || senha_hash.length < 6) {
        return res.status(400).json({ erro: 'A senha deve conter no minimo 6 caracteres.' });
      }

      const usuarioExistente = await User.findOne({ where: { email: email.trim() } });
      if (usuarioExistente) {
        return res.status(409).json({ erro: 'Ja existe um usuario cadastrado com este e-mail.' });
      }

      const novoUser = await User.create({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha_hash
      });

      return res.status(201).json({
        id: novoUser.id,
        nome: novoUser.nome,
        email: novoUser.email,
        createdAt: novoUser.createdAt
      });
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao cadastrar usuario.', detalhe: error.message });
    }
  }

  // PUT /api/users/:id - Atualizar um usuario existente
  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: 'O ID informado deve ser um numero valido e maior que zero.' });
      }

      const { nome, email } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ erro: 'Usuario nao encontrado para atualizacao.' });
      }

      if (nome !== undefined) {
        if (typeof nome !== 'string' || nome.trim() === '') {
          return res.status(400).json({ erro: 'O campo nome deve ser um texto valido.' });
        }
        user.nome = nome.trim();
      }

      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          return res.status(400).json({ erro: 'O e-mail informado e invalido.' });
        }

        const emailEmUso = await User.findOne({ where: { email: email.trim().toLowerCase() } });
        if (emailEmUso && emailEmUso.id !== id) {
          return res.status(409).json({ erro: 'Este e-mail ja esta em uso por outro usuario.' });
        }
        user.email = email.trim().toLowerCase();
      }

      await user.save();

      return res.status(200).json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        updatedAt: user.updatedAt
      });
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao atualizar usuario.', detalhe: error.message });
    }
  }

  // DELETE /api/users/:id - Remover um usuario
  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: 'O ID informado deve ser um numero valido e maior que zero.' });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ erro: 'Usuario nao encontrado para exclusao.' });
      }

      await user.destroy();

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao excluir usuario.', detalhe: error.message });
    }
  }
}