import { Request, Response } from 'express';
import { Tarefa } from '../models/Tarefa';

export class TarefasController {

    // GET /api/tarefas - Listar todas as Tarefas
    public static async index(req: Request, res: Response): Promise<Response> {
        try {
            const tarefas = await Tarefa.findAll({
                attributes: ['id', 'titulo', 'etiqueta', 'prioridade', 'status_conclusao', 'updatedAt']
            });

            return res.status(200).json(tarefas);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao listar todas as Tarefas!', detalhe: error.message });
        }
    }

    // GET /api/tarefas/:id - Listar uma Tarefa por ID
    public static async show(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id as string, 10);

            if (isNaN(id) || id <= 0) {
                return res.status(400).json({
                    erro: 'O ID informado deve ser um numero valido.'
                });
            }

            const tarefa = await Tarefa.findByPk(id, {
                attributes: ['id', 'titulo', 'etiqueta', 'prioridade', 'status_conclusao', 'updatedAt']
            });

            if (!tarefa) {
                return res.status(404).json({ erro: 'Tarefa não encontrada!' });
            }

            return res.status(200).json(tarefa);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao listar a Tarefa!', detalhe: error.message });
        }
    }

    // POST /api/tarefas - Cadastrar Nova Tarefa
    public static async create(req: Request, res: Response): Promise<Response> {
        try {
            const { titulo, etiqueta, prioridade } = req.body;

            if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
                return res.status(400).json({ erro: 'O campo titulo é obrigatório' });
            }

            const tarefaExistente = await Tarefa.findOne({ where: { titulo: titulo.trim() } });

            if (tarefaExistente) {
                return res.status(409).json({ erro: 'Ja existe uma Tarefa cadastrada com este titulo.' });
            }

            const novaTarefa = await Tarefa.create({
                titulo: titulo.trim(),
                etiqueta: etiqueta ? etiqueta.trim() : undefined,
                prioridade: prioridade ? prioridade.trim() : 'Baixa',
                status_conclusao: false
            });

            return res.status(201).json({
                id: novaTarefa.id,
                titulo: novaTarefa.titulo,
                etiqueta: novaTarefa.etiqueta,
                prioridade: novaTarefa.prioridade,
                status_conclusao: novaTarefa.status_conclusao,
                createdAt: novaTarefa.createdAt
            });
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao cadastrar a Tarefa', detalhe: error.message });
        }
    }

    // PUT /api/tarefas/:id - Atualizar uma Tarefa existente
    public static async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id as string, 10);

            if (isNaN(id) || id <= 0) {
                return res.status(400).json({
                    erro: 'O ID informado deve ser um numero valido.'
                });
            }

            const { titulo, etiqueta, prioridade, status_conclusao } = req.body;

            const tarefa = await Tarefa.findByPk(id);

            if (!tarefa) {
                return res.status(404).json({ erro: 'Tarefa não encontrada para atualização!' });
            }

            if (titulo !== undefined) {
                if (typeof titulo !== 'string' || titulo.trim() === '') {
                    return res.status(400).json({ erro: 'O campo titulo deve ser um texto valido.' });
                }
                tarefa.titulo = titulo.trim();
            }

            if (etiqueta !== undefined) {
                if (typeof etiqueta !== 'string') {
                    return res.status(400).json({ erro: 'O campo etiqueta deve ser um texto valido.' });
                }
                tarefa.etiqueta = etiqueta.trim();
            }

            if (prioridade !== undefined) {
                if (typeof prioridade !== 'string') {
                    return res.status(400).json({ erro: 'O campo prioridade deve ser um texto valido.' });
                }
                tarefa.prioridade = prioridade.trim();
            }

            if (status_conclusao !== undefined) {
                if (typeof status_conclusao !== 'boolean') {
                    return res.status(400).json({ erro: 'O campo status_conclusao deve ser um booleano (true ou false).' });
                }
                tarefa.status_conclusao = status_conclusao;
            }

            const tarefaExistente = await Tarefa.findOne({ where: { titulo: tarefa.titulo } });

            if (tarefaExistente && tarefaExistente.id !== id) {
                return res.status(409).json({ erro: 'Ja existe uma Tarefa cadastrada com este titulo.' });
            }

            await tarefa.save();

            return res.status(200).json({
                id: tarefa.id,
                titulo: tarefa.titulo,
                etiqueta: tarefa.etiqueta,
                prioridade: tarefa.prioridade,
                status_conclusao: tarefa.status_conclusao,
                updatedAt: tarefa.updatedAt
            });
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao atualizar a Tarefa', detalhe: error.message });
        }
    }

    // DELETE /api/tarefas/:id - Remover uma Tarefa
    public static async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id as string, 10);
            
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ erro: 'O ID informado deve ser um numero valido.' });
            }

            const tarefa = await Tarefa.findByPk(id);

            if (!tarefa) {
                return res.status(404).json({ erro: 'Tarefa não encontrada para exclusão.' });
            }

            await tarefa.destroy();

            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao excluir Tarefa.', detalhe: error.message });
        }
    }

}