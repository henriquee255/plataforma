const express = require('express');
const router = express.Router();
const Pipeline = require('../models/Pipeline');
const Lead = require('../models/Lead');
const { protect } = require('../middlewares/auth');

// ===== PIPELINES =====

/**
 * GET /api/crm/pipelines
 * Listar pipelines da empresa
 */
router.get('/pipelines', protect, async (req, res) => {
  try {
    const pipelines = await Pipeline.find({
      companyId: req.body.companyId || req.user.companyId
    }).populate('leads');

    res.json({
      success: true,
      pipelines: pipelines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pipelines',
      error: error.message
    });
  }
});

/**
 * POST /api/crm/pipelines
 * Criar nova pipeline
 */
router.post('/pipelines', protect, async (req, res) => {
  try {
    const { nome, descricao, stages, companyId } = req.body;

    const pipeline = await Pipeline.create({
      nome,
      descricao,
      stages: stages || [
        { id: '1', nome: 'Prospeccão', order: 1 },
        { id: '2', nome: 'Qualificação', order: 2 },
        { id: '3', nome: 'Proposta', order: 3 },
        { id: '4', nome: 'Fechamento', order: 4 }
      ],
      companyId: companyId || req.user.companyId,
      owner: req.user._id
    });

    res.status(201).json({
      success: true,
      pipeline: pipeline
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar pipeline',
      error: error.message
    });
  }
});

/**
 * PATCH /api/crm/pipelines/:id
 * Atualizar pipeline
 */
router.patch('/pipelines/:id', protect, async (req, res) => {
  try {
    const { nome, descricao, stages, status } = req.body;

    const pipeline = await Pipeline.findByIdAndUpdate(
      req.params.id,
      { nome, descricao, stages, status, updatedAt: new Date() },
      { new: true }
    );

    res.json({
      success: true,
      pipeline: pipeline
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar pipeline',
      error: error.message
    });
  }
});

/**
 * DELETE /api/crm/pipelines/:id
 * Deletar pipeline
 */
router.delete('/pipelines/:id', protect, async (req, res) => {
  try {
    // Deletar leads associados
    await Lead.deleteMany({ pipelineId: req.params.id });

    // Deletar pipeline
    await Pipeline.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Pipeline deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar pipeline',
      error: error.message
    });
  }
});

// ===== LEADS =====

/**
 * GET /api/crm/leads
 * Listar leads da pipeline
 */
router.get('/leads', protect, async (req, res) => {
  try {
    const { pipelineId } = req.query;

    const query = pipelineId ? { pipelineId } : {};
    const leads = await Lead.find(query)
      .populate('atribuidoPara', 'nome email')
      .populate('notas.autor', 'nome email');

    res.json({
      success: true,
      leads: leads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar leads',
      error: error.message
    });
  }
});

/**
 * POST /api/crm/leads
 * Criar novo lead
 */
router.post('/leads', protect, async (req, res) => {
  try {
    const { nome, email, telefone, valor, estagio, atribuidoPara, origem, tags, pipelineId, companyId } = req.body;

    const lead = await Lead.create({
      nome,
      email,
      telefone,
      valor,
      estagio,
      atribuidoPara,
      origem,
      tags,
      pipelineId,
      companyId: companyId || req.user.companyId,
      notas: []
    });

    // Adicionar lead à pipeline
    await Pipeline.findByIdAndUpdate(
      pipelineId,
      { $push: { leads: lead._id } }
    );

    res.status(201).json({
      success: true,
      lead: lead
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar lead',
      error: error.message
    });
  }
});

/**
 * PATCH /api/crm/leads/:id
 * Atualizar lead
 */
router.patch('/leads/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('atribuidoPara', 'nome email');

    res.json({
      success: true,
      lead: lead
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar lead',
      error: error.message
    });
  }
});

/**
 * DELETE /api/crm/leads/:id
 * Deletar lead
 */
router.delete('/leads/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    // Remover lead da pipeline
    if (lead) {
      await Pipeline.findByIdAndUpdate(
        lead.pipelineId,
        { $pull: { leads: lead._id } }
      );
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lead deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar lead',
      error: error.message
    });
  }
});

/**
 * POST /api/crm/leads/:id/notas
 * Adicionar nota ao lead
 */
router.post('/leads/:id/notas', protect, async (req, res) => {
  try {
    const { texto } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          notas: {
            texto,
            autor: req.user._id,
            data: new Date()
          }
        }
      },
      { new: true }
    ).populate('notas.autor', 'nome email');

    res.json({
      success: true,
      lead: lead
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao adicionar nota',
      error: error.message
    });
  }
});

module.exports = router;
