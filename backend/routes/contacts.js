const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middlewares/auth');

// Middleware para autenticação
router.use(protect);

/**
 * @GET /api/contacts
 * Listar todos os contatos da empresa
 */
router.get('/', async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'companyId é obrigatório'
      });
    }

    const {
      search = '',
      tag = 'todas',
      origin = 'todas',
      page = 1,
      limit = 20,
      sort = 'desc'
    } = req.query;

    const query = { companyId };

    // Busca por nome ou email
    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { telefone: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtro por tag
    if (tag && tag !== 'todas') {
      query.tags = tag;
    }

    // Filtro por origem
    if (origin && origin !== 'todas') {
      query.origem = origin;
    }

    const skip = (page - 1) * limit;
    const sortOrder = sort === 'asc' ? 1 : -1;

    const contacts = await Contact.find(query)
      .populate('atribuidoPara', 'nome email avatar')
      .populate('notas.autor', 'nome email avatar')
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erro ao listar contatos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar contatos',
      error: error.message
    });
  }
});

/**
 * @POST /api/contacts
 * Criar novo contato
 */
router.post('/', async (req, res) => {
  try {
    const { companyId, nome, email, telefone, documento, origem, tags } = req.body;

    if (!companyId || !nome) {
      return res.status(400).json({
        success: false,
        message: 'companyId e nome são obrigatórios'
      });
    }

    // Verificar duplicata
    const existente = await Contact.findOne({ companyId, email });
    if (existente) {
      return res.status(409).json({
        success: false,
        message: 'Contato com este email já existe nesta empresa'
      });
    }

    const contact = new Contact({
      companyId,
      nome,
      email,
      telefone,
      documento,
      origem: origem || 'Manual',
      tags: tags || []
    });

    await contact.save();
    await contact.populate('atribuidoPara', 'nome email avatar');

    res.status(201).json({
      success: true,
      message: 'Contato criado com sucesso',
      data: contact
    });
  } catch (error) {
    console.error('❌ Erro ao criar contato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar contato',
      error: error.message
    });
  }
});

/**
 * @GET /api/contacts/:id
 * Obter detalhes de um contato
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

    const contact = await Contact.findOne({
      _id: id,
      companyId
    }).populate('atribuidoPara', 'nome email avatar')
     .populate('notas.autor', 'nome email avatar');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('❌ Erro ao obter contato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter contato',
      error: error.message
    });
  }
});

/**
 * @PATCH /api/contacts/:id
 * Atualizar contato
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

    const contact = await Contact.findOneAndUpdate(
      { _id: id, companyId },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('atribuidoPara', 'nome email avatar')
     .populate('notas.autor', 'nome email avatar');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contato atualizado com sucesso',
      data: contact
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar contato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar contato',
      error: error.message
    });
  }
});

/**
 * @DELETE /api/contacts/:id
 * Deletar contato
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

    const contact = await Contact.findOneAndDelete({
      _id: id,
      companyId
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contato deletado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar contato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar contato',
      error: error.message
    });
  }
});

/**
 * @POST /api/contacts/:id/notas
 * Adicionar nota ao contato
 */
router.post('/:id/notas', async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, texto } = req.body;

    if (!companyId || !texto) {
      return res.status(400).json({
        success: false,
        message: 'companyId e texto são obrigatórios'
      });
    }

    const contact = await Contact.findOneAndUpdate(
      { _id: id, companyId },
      {
        $push: {
          notas: {
            texto,
            autor: req.user._id,
            data: new Date()
          }
        },
        updatedAt: new Date()
      },
      { new: true }
    ).populate('notas.autor', 'nome email avatar');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Nota adicionada com sucesso',
      data: contact.notas[contact.notas.length - 1]
    });
  } catch (error) {
    console.error('❌ Erro ao adicionar nota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar nota',
      error: error.message
    });
  }
});

module.exports = router;
