const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { protect } = require('../middlewares/auth');

// ===== COMPANY ROUTES =====

/**
 * @route   GET /api/companies/my-companies
 * @desc    Obter empresas do usuário (owner + member)
 * @access  Private
 */
router.get('/my-companies', protect, companyController.getMyCompanies);

/**
 * @route   POST /api/companies
 * @desc    Criar nova empresa
 * @access  Private
 */
router.post('/', protect, companyController.createCompany);

/**
 * @route   GET /api/companies/:id
 * @desc    Obter detalhes de empresa
 * @access  Private (apenas membros)
 */
router.get('/:id', protect, companyController.getCompanyById);

/**
 * @route   PATCH /api/companies/:id
 * @desc    Atualizar empresa
 * @access  Private (apenas owner/admin)
 */
router.patch('/:id', protect, companyController.updateCompany);

/**
 * @route   DELETE /api/companies/:id
 * @desc    Deletar empresa
 * @access  Private (apenas owner)
 */
router.delete('/:id', protect, companyController.deleteCompany);

// ===== MEMBERS ROUTES =====

/**
 * @route   GET /api/companies/:id/members
 * @desc    Listar membros da empresa
 * @access  Private (apenas membros)
 */
router.get('/:id/members', protect, companyController.getMembers);

/**
 * @route   POST /api/companies/:id/members
 * @desc    Adicionar membro
 * @access  Private (apenas owner/admin)
 */
router.post('/:id/members', protect, companyController.addMember);

/**
 * @route   PATCH /api/companies/:id/members/:userId
 * @desc    Atualizar role/permissões de membro
 * @access  Private (apenas owner/admin)
 */
router.patch('/:id/members/:userId', protect, companyController.updateMember);

/**
 * @route   DELETE /api/companies/:id/members/:userId
 * @desc    Remover membro
 * @access  Private (apenas owner/admin)
 */
router.delete('/:id/members/:userId', protect, companyController.removeMember);

module.exports = router;
