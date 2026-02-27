const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middlewares/auth');

// Middleware para autenticação
router.use(protect);

/**
 * @GET /api/inbox
 * Listar mensagens da empresa
 */
router.get('/', async (req, res) => {
  try {
    const {
      companyId,
      conversationId,
      canal = 'todos',
      page = 1,
      limit = 20,
      unreadOnly = false
    } = req.query;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'companyId é obrigatório'
      });
    }

    const query = { companyId };

    if (conversationId) {
      query.conversationId = conversationId;
    }

    if (canal && canal !== 'todos') {
      query.canal = canal;
    }

    if (unreadOnly === 'true') {
      query.lido = false;
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find(query)
      .populate('remetente.id', 'nome email avatar')
      .populate('destinatario.id', 'nome email')
      .populate('respostaA', 'texto remetente')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erro ao listar mensagens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar mensagens',
      error: error.message
    });
  }
});

/**
 * @POST /api/inbox
 * Criar nova mensagem
 */
router.post('/', async (req, res) => {
  try {
    const {
      companyId,
      conversationId,
      remetente,
      destinatario,
      texto,
      canal,
      anexos
    } = req.body;

    if (!companyId || !conversationId || !texto) {
      return res.status(400).json({
        success: false,
        message: 'companyId, conversationId e texto são obrigatórios'
      });
    }

    const message = new Message({
      companyId,
      conversationId,
      remetente: {
        ...remetente,
        id: req.user._id
      },
      destinatario,
      texto,
      canal: canal || 'chat',
      anexos: anexos || [],
      status: 'enviado'
    });

    await message.save();
    await message.populate('remetente.id', 'nome email avatar');
    await message.populate('destinatario.id', 'nome email');

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: message
    });
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem',
      error: error.message
    });
  }
});

/**
 * @GET /api/inbox/:id
 * Obter detalhes de uma mensagem
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

    const message = await Message.findOne({
      _id: id,
      companyId
    }).populate('remetente.id', 'nome email avatar')
     .populate('destinatario.id', 'nome email')
     .populate('respostaA', 'texto remetente');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('❌ Erro ao obter mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter mensagem',
      error: error.message
    });
  }
});

/**
 * @PATCH /api/inbox/:id
 * Atualizar mensagem
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

    const message = await Message.findOneAndUpdate(
      { _id: id, companyId },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('remetente.id', 'nome email avatar')
     .populate('destinatario.id', 'nome email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mensagem atualizada com sucesso',
      data: message
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar mensagem',
      error: error.message
    });
  }
});

/**
 * @DELETE /api/inbox/:id
 * Deletar mensagem
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

    const message = await Message.findOneAndDelete({
      _id: id,
      companyId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mensagem deletada com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar mensagem',
      error: error.message
    });
  }
});

/**
 * @PATCH /api/inbox/:id/read
 * Marcar mensagem como lida
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'companyId é obrigatório'
      });
    }

    const message = await Message.findOneAndUpdate(
      { _id: id, companyId },
      {
        lido: true,
        dataLeitura: new Date(),
        status: 'lido',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mensagem marcada como lida',
      data: message
    });
  } catch (error) {
    console.error('❌ Erro ao marcar como lida:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao marcar como lida',
      error: error.message
    });
  }
});

/**
 * @GET /api/inbox/conversas/grouped
 * Obter conversas agrupadas
 */
router.get('/conversas/grouped', async (req, res) => {
  try {
    const { companyId, limit = 20 } = req.query;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'companyId é obrigatório'
      });
    }

    const conversas = await Message.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId(companyId) } },
      {
        $group: {
          _id: '$conversationId',
          ultimaMensagem: { $last: '$$ROOT' },
          totalMensagens: { $sum: 1 },
          naoLidas: {
            $sum: { $cond: ['$lido', 0, 1] }
          }
        }
      },
      { $sort: { 'ultimaMensagem.createdAt': -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json({
      success: true,
      data: conversas
    });
  } catch (error) {
    console.error('❌ Erro ao agrupar conversas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao agrupar conversas',
      error: error.message
    });
  }
});

module.exports = router;
