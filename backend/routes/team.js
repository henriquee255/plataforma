const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const User = require('../models/User');
const { protect } = require('../middlewares/auth');

// Middleware para autenticação
router.use(protect);

/**
 * @GET /api/team
 * Listar membros da empresa
 */
router.get('/', async (req, res) => {
  try {
    const { companyId, page = 1, limit = 20, status = 'todos', role = 'todos' } = req.query;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'companyId é obrigatório'
      });
    }

    const query = { companyId };

    if (status && status !== 'todos') {
      query.status = status;
    }

    if (role && role !== 'todos') {
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const members = await Member.find(query)
      .populate('userId', 'nome email avatar telefone')
      .sort({ dataAdesao: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Member.countDocuments(query);

    res.status(200).json({
      success: true,
      data: members,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erro ao listar membros:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar membros',
      error: error.message
    });
  }
});

/**
 * @POST /api/team
 * Adicionar membro à empresa
 */
router.post('/', async (req, res) => {
  try {
    const { companyId, userId, role, permissoes, horasSemanais } = req.body;

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'companyId e userId são obrigatórios'
      });
    }

    // Verificar se usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se já é membro
    const existente = await Member.findOne({ companyId, userId });
    if (existente) {
      return res.status(409).json({
        success: false,
        message: 'Usuário já é membro desta empresa'
      });
    }

    const member = new Member({
      companyId,
      userId,
      role: role || 'membro',
      permissoes: permissoes || {},
      horasSemanais: horasSemanais || 40
    });

    await member.save();
    await member.populate('userId', 'nome email avatar telefone');

    res.status(201).json({
      success: true,
      message: 'Membro adicionado com sucesso',
      data: member
    });
  } catch (error) {
    console.error('❌ Erro ao adicionar membro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar membro',
      error: error.message
    });
  }
});

/**
 * @GET /api/team/:id
 * Obter detalhes de um membro
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'companyId é obrigatório'
      });
    }

    const member = await Member.findOne({
      _id: id,
      companyId
    }).populate('userId', 'nome email avatar telefone empresa');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Membro não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('❌ Erro ao obter membro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter membro',
      error: error.message
    });
  }
});

/**
 * @PATCH /api/team/:id
 * Atualizar membro
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, ...updateData } = req.body;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'companyId é obrigatório'
      });
    }

    const member = await Member.findOneAndUpdate(
      { _id: id, companyId },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('userId', 'nome email avatar telefone');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Membro não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Membro atualizado com sucesso',
      data: member
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar membro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar membro',
      error: error.message
    });
  }
});

/**
 * @DELETE /api/team/:id
 * Remover membro da empresa
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'companyId é obrigatório'
      });
    }

    const member = await Member.findOneAndDelete({
      _id: id,
      companyId
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Membro não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Membro removido com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao remover membro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover membro',
      error: error.message
    });
  }
});

/**
 * @PATCH /api/team/:id/permissoes
 * Atualizar permissões do membro
 */
router.patch('/:id/permissoes', async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, permissoes } = req.body;

    if (!companyId || !permissoes) {
      return res.status(400).json({
        success: false,
        message: 'companyId e permissoes são obrigatórios'
      });
    }

    const member = await Member.findOneAndUpdate(
      { _id: id, companyId },
      {
        permissoes,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'nome email avatar');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Membro não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Permissões atualizadas com sucesso',
      data: member
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar permissões:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar permissões',
      error: error.message
    });
  }
});

module.exports = router;
