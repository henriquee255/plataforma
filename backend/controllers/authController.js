const User = require('../models/User');

// @desc    Registrar usuário
// @route   POST /api/auth/register  
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { nome, email, password, role } = req.body;

    // Verificar se usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuário já existe com este email' 
      });
    }

    // Criar usuário
    const user = await User.create({
      nome,
      email,
      password,
      role: role || 'user'
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar email e password
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor, forneça email e senha' 
      });
    }

    // Buscar usuário (incluir password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar senha
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar se usuário está ativo
    if (!user.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Conta desativada. Entre em contato com o suporte.' 
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Obter usuário atual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar dados do usuário
// @route   PUT /api/auth/me
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
      empresa: req.body.empresa
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

// Helper para enviar token na resposta
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    });
};
