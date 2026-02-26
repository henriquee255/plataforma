const Integration = require('../models/Integration');
const Customer = require('../models/Customer');
const Tag = require('../models/Tag');
const Sale = require('../models/Sale');
const kiwifyService = require('../services/kiwifyService');
const hotmartService = require('../services/hotmartService');
const stripeService = require('../services/stripeService');
const mongoose = require('mongoose');

class IntegrationsController {
  // ========== CRUD BÁSICO ==========

  /**
   * Lista todas as integrações do usuário
   */
  async list(req, res) {
    try {
      const integrations = await Integration.find({ userId: req.user.id });

      res.json({
        success: true,
        integrations
      });
    } catch (error) {
      console.error('Erro ao listar integrações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar integrações'
      });
    }
  }

  /**
   * Busca uma integração específica
   */
  async getById(req, res) {
    try {
      const integration = await Integration.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração não encontrada'
        });
      }

      res.json({
        success: true,
        integration
      });
    } catch (error) {
      console.error('Erro ao buscar integração:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar integração'
      });
    }
  }

  /**
   * Cria uma nova integração
   */
  async create(req, res) {
    try {
      const { platform, credentials } = req.body;

      const integration = new Integration({
        userId: req.user.id,
        platform,
        credentials,
        status: 'inactive'
      });

      await integration.save();

      res.status(201).json({
        success: true,
        integration
      });
    } catch (error) {
      console.error('Erro ao criar integração:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar integração'
      });
    }
  }

  /**
   * Atualiza uma integração
   */
  async update(req, res) {
    try {
      const integration = await Integration.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
      );

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração não encontrada'
        });
      }

      res.json({
        success: true,
        integration
      });
    } catch (error) {
      console.error('Erro ao atualizar integração:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar integração'
      });
    }
  }

  /**
   * Deleta uma integração
   */
  async delete(req, res) {
    try {
      const integration = await Integration.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração não encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Integração deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar integração:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar integração'
      });
    }
  }

  // ========== KIWIFY ==========

  /**
   * Conecta com Kiwify
   */
  async connectKiwify(req, res) {
    try {
      console.log('🔗 connectKiwify chamado');
      const { client_id, client_secret, account_id } = req.body;

      // Validação dos campos
      if (!client_id || !client_secret || !account_id) {
        return res.status(400).json({
          success: false,
          message: 'client_id, client_secret e account_id são obrigatórios'
        });
      }

      console.log('✅ Credenciais recebidas, autenticando com Kiwify...');

      // Autentica com a Kiwify
      const authResult = await kiwifyService.authenticate(client_id, client_secret, account_id);

      if (!authResult.success) {
        console.log('❌ Autenticação falhou:', authResult.error);
        return res.status(401).json({
          success: false,
          message: authResult.error || 'Credenciais inválidas'
        });
      }

      console.log('✅ Autenticação bem-sucedida!');

      // MODO TESTE: usar userId fixo (ObjectId válido) se não houver req.user
      const userId = req.user?.id || new mongoose.Types.ObjectId('000000000000000000000001');
      console.log('👤 UserId:', userId);

      // Busca ou cria a integração
      let integration = await Integration.findOne({
        userId,
        platform: 'kiwify'
      });

      if (integration) {
        console.log('📝 Atualizando integração existente');
        // Atualiza credenciais existentes
        integration.credentials = {
          client_id,
          client_secret,
          account_id,
          access_token: authResult.access_token,
          token_expires_at: authResult.expires_at
        };
        integration.status = 'active';
        integration.lastSync = new Date();
      } else {
        console.log('✨ Criando nova integração');
        // Cria nova integração
        integration = new Integration({
          userId,
          platform: 'kiwify',
          credentials: {
            client_id,
            client_secret,
            account_id,
            access_token: authResult.access_token,
            token_expires_at: authResult.expires_at
          },
          status: 'active',
          lastSync: new Date()
        });
      }

      await integration.save();
      console.log('💾 Integração salva no MongoDB');

      // Não retornar credenciais sensíveis
      const response = integration.toObject();
      delete response.credentials.client_secret;
      delete response.credentials.access_token;

      res.json({
        success: true,
        message: 'Conectado com Kiwify com sucesso!',
        integration: response
      });
    } catch (error) {
      console.error('Erro ao conectar com Kiwify:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao conectar com Kiwify'
      });
    }
  }

  /**
   * Desconecta da Kiwify
   */
  async disconnectKiwify(req, res) {
    try {
      const integration = await Integration.findOne({
        userId: req.user.id,
        platform: 'kiwify'
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração Kiwify não encontrada'
        });
      }

      integration.status = 'inactive';
      integration.credentials = {};
      await integration.save();

      res.json({
        success: true,
        message: 'Desconectado da Kiwify com sucesso'
      });
    } catch (error) {
      console.error('Erro ao desconectar da Kiwify:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao desconectar da Kiwify'
      });
    }
  }

  /**
   * Sincroniza dados da Kiwify
   */
  async syncKiwify(req, res) {
    try {
      const integration = await Integration.findOne({
        userId: req.user.id,
        platform: 'kiwify',
        status: 'active'
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração Kiwify não encontrada ou inativa'
        });
      }

      // Verifica se o token ainda é válido
      const isValid = await kiwifyService.verifyToken(integration.credentials.access_token);

      if (!isValid) {
        // Renova o token
        const authResult = await kiwifyService.authenticate(
          integration.credentials.client_id,
          integration.credentials.client_secret,
          integration.credentials.account_id
        );

        if (!authResult.success) {
          return res.status(401).json({
            success: false,
            message: 'Token expirado. Reconecte a integração.'
          });
        }

        integration.credentials.access_token = authResult.access_token;
        integration.credentials.token_expires_at = authResult.expires_at;
        await integration.save();
      }

      // Busca compras e produtos
      const [purchasesResult, productsResult] = await Promise.all([
        kiwifyService.getPurchases(integration.credentials.access_token),
        kiwifyService.getProducts(integration.credentials.access_token)
      ]);

      // Processar compras e criar clientes/tags automaticamente
      let processedCount = 0;
      let tagsCreated = [];
      const purchases = purchasesResult.purchases || [];

      for (const purchase of purchases) {
        try {
          // Extrair dados do cliente
          const customerData = {
            name: purchase.customer?.name || 'Cliente Kiwify',
            email: purchase.customer?.email || `kiwify_${purchase.id}@unknown.com`,
            phone: purchase.customer?.phone || '',
            document: purchase.customer?.cpf || '',
            source: 'kiwify',
            externalId: purchase.customer?.id || purchase.id
          };

          // Buscar ou criar cliente
          let customer = await Customer.findOne({
            userId: req.user.id,
            email: customerData.email
          });

          if (!customer) {
            customer = new Customer({
              userId: req.user.id,
              ...customerData
            });
          }

          // Criar tag automaticamente baseada no produto
          const productName = purchase.product?.name || purchase.productName || 'Produto Kiwify';
          const tagName = productName.split('-')[0].trim(); // "Super Links - Plano" -> "Super Links"

          const tag = await Tag.findOrCreate(req.user.id, tagName, 'kiwify', purchase.product?.id || '');

          // Adicionar tag ao cliente
          customer.addTag(tagName);
          if (!tagsCreated.includes(tagName)) {
            tagsCreated.push(tagName);
          }

          // Salvar metadata da última compra
          customer.metadata.set('lastProduct', productName);
          customer.metadata.set('lastPaymentType', purchase.sale?.payment_type || 'unknown');
          customer.metadata.set('lastStatus', purchase.sale?.status || 'approved');

          await customer.save();

          // Criar ou atualizar venda
          const existingSale = await Sale.findOne({
            platform: 'kiwify',
            externalId: purchase.sale?.id || purchase.id
          });

          if (!existingSale) {
            const sale = new Sale({
              userId: req.user.id,
              customerId: customer._id,
              platform: 'kiwify',
              externalId: purchase.sale?.id || purchase.id,
              productName: productName,
              productId: purchase.product?.id || '',
              amount: purchase.sale?.value || 0,
              currency: purchase.sale?.currency || 'BRL',
              status: purchase.sale?.status === 'refunded' ? 'refunded' : 'approved',
              paymentType: purchase.sale?.payment_type || '',
              saleDate: purchase.sale?.created_at || new Date(),
              refundedAt: purchase.sale?.status === 'refunded' ? new Date() : null,
              refundAmount: purchase.sale?.status === 'refunded' ? purchase.sale?.value || 0 : 0
            });

            await sale.save();
            processedCount++;
          }
        } catch (purchaseError) {
          console.error('Erro ao processar compra:', purchaseError);
          // Continuar processando outras compras
        }
      }

      integration.lastSync = new Date();
      integration.syncData = {
        totalPurchases: purchasesResult.total || 0,
        totalProducts: productsResult.products?.length || 0,
        processedPurchases: processedCount,
        tagsCreated: tagsCreated.length,
        lastSyncedAt: new Date()
      };
      await integration.save();

      console.log(`✅ Sincronização Kiwify completa: ${processedCount} compras processadas, ${tagsCreated.length} tags criadas`);

      res.json({
        success: true,
        message: `Sincronização completa! ${processedCount} compras processadas, ${tagsCreated.length} tags criadas`,
        data: {
          purchases: purchases,
          products: productsResult.products || [],
          total_purchases: purchasesResult.total || 0,
          total_products: productsResult.products?.length || 0,
          processed_purchases: processedCount,
          tags_created: tagsCreated
        }
      });
    } catch (error) {
      console.error('Erro ao sincronizar Kiwify:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao sincronizar dados'
      });
    }
  }

  // ========== HOTMART ==========

  /**
   * Conecta com Hotmart
   */
  async connectHotmart(req, res) {
    try {
      console.log('🔗 connectHotmart chamado');
      console.log('📦 Body recebido:', Object.keys(req.body));

      const { client_id, client_secret, basic_token } = req.body;

      console.log('🔑 client_id:', client_id ? 'Presente' : 'AUSENTE');
      console.log('🔑 client_secret:', client_secret ? 'Presente' : 'AUSENTE');
      console.log('🔑 basic_token:', basic_token ? `Presente (${basic_token.length} chars)` : 'AUSENTE');

      // Validação dos campos
      if (!client_id || !client_secret || !basic_token) {
        return res.status(400).json({
          success: false,
          message: 'client_id, client_secret e basic_token são obrigatórios'
        });
      }

      // Autentica com a Hotmart
      const authResult = await hotmartService.authenticate(
        client_id,
        client_secret,
        basic_token
      );

      if (!authResult.success) {
        return res.status(401).json({
          success: false,
          message: authResult.error || 'Credenciais inválidas'
        });
      }

      console.log('✅ Autenticação Hotmart bem-sucedida!');

      // MODO TESTE: usar userId fixo (ObjectId válido) se não houver req.user
      const userId = req.user?.id || new mongoose.Types.ObjectId('000000000000000000000001');
      console.log('👤 UserId:', userId);

      // Busca ou cria a integração
      let integration = await Integration.findOne({
        userId,
        platform: 'hotmart'
      });

      if (integration) {
        // Atualiza credenciais existentes
        integration.credentials = {
          client_id,
          client_secret,
          basic_token,
          access_token: authResult.access_token,
          token_expires_at: authResult.expires_at
        };
        integration.status = 'active';
        integration.lastSync = new Date();
      } else {
        console.log('✨ Criando nova integração Hotmart');
        // Cria nova integração
        integration = new Integration({
          userId,
          platform: 'hotmart',
          credentials: {
            client_id,
            client_secret,
            basic_token,
            access_token: authResult.access_token,
            token_expires_at: authResult.expires_at
          },
          status: 'active',
          lastSync: new Date()
        });
      }

      await integration.save();

      // Não retornar credenciais sensíveis
      const response = integration.toObject();
      delete response.credentials.client_secret;
      delete response.credentials.basic_token;
      delete response.credentials.access_token;

      res.json({
        success: true,
        message: 'Conectado com Hotmart com sucesso!',
        integration: response
      });
    } catch (error) {
      console.error('Erro ao conectar com Hotmart:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao conectar com Hotmart'
      });
    }
  }

  /**
   * Desconecta da Hotmart
   */
  async disconnectHotmart(req, res) {
    try {
      const integration = await Integration.findOne({
        userId: req.user.id,
        platform: 'hotmart'
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração Hotmart não encontrada'
        });
      }

      integration.status = 'inactive';
      integration.credentials = {};
      await integration.save();

      res.json({
        success: true,
        message: 'Desconectado da Hotmart com sucesso'
      });
    } catch (error) {
      console.error('Erro ao desconectar da Hotmart:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao desconectar da Hotmart'
      });
    }
  }

  /**
   * Sincroniza dados da Hotmart
   */
  async syncHotmart(req, res) {
    try {
      const integration = await Integration.findOne({
        userId: req.user.id,
        platform: 'hotmart',
        status: 'active'
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração Hotmart não encontrada ou inativa'
        });
      }

      // Verifica se o token ainda é válido
      const isValid = await hotmartService.verifyToken(integration.credentials.access_token);

      if (!isValid) {
        // Renova o token
        const authResult = await hotmartService.authenticate(
          integration.credentials.client_id,
          integration.credentials.client_secret,
          integration.credentials.basic_token
        );

        if (!authResult.success) {
          return res.status(401).json({
            success: false,
            message: 'Token expirado. Reconecte a integração.'
          });
        }

        integration.credentials.access_token = authResult.access_token;
        integration.credentials.token_expires_at = authResult.expires_at;
        await integration.save();
      }

      // Busca vendas e produtos
      const [salesResult, productsResult] = await Promise.all([
        hotmartService.getSales(integration.credentials.access_token),
        hotmartService.getProducts(integration.credentials.access_token)
      ]);

      // Processar vendas e criar clientes/tags automaticamente
      let processedCount = 0;
      let tagsCreated = [];
      const sales = salesResult.sales || [];

      for (const sale of sales) {
        try {
          // Extrair dados do cliente
          const customerData = {
            name: sale.buyer?.name || sale.customer?.name || 'Cliente Hotmart',
            email: sale.buyer?.email || sale.customer?.email || `hotmart_${sale.transaction}@unknown.com`,
            phone: sale.buyer?.phone || sale.customer?.phone || '',
            document: sale.buyer?.document || sale.customer?.cpf || '',
            source: 'hotmart',
            externalId: sale.buyer?.id || sale.customer?.id || sale.transaction
          };

          // Buscar ou criar cliente
          let customer = await Customer.findOne({
            userId: req.user.id,
            email: customerData.email
          });

          if (!customer) {
            customer = new Customer({
              userId: req.user.id,
              ...customerData
            });
          }

          // Criar tag automaticamente baseada no produto
          const productName = sale.product?.name || sale.productName || 'Produto Hotmart';
          const tagName = productName.split('-')[0].trim();

          const tag = await Tag.findOrCreate(req.user.id, tagName, 'hotmart', sale.product?.id || '');

          // Adicionar tag ao cliente
          customer.addTag(tagName);
          if (!tagsCreated.includes(tagName)) {
            tagsCreated.push(tagName);
          }

          // Identificar tipo de compra (vitalícia, mensal, anual)
          const subscriptionType = sale.subscription?.recurrence_type ||
                                   sale.recurrence_type ||
                                   sale.subscription?.plan?.name ||
                                   'vitalicia';

          let purchaseType = 'vitalicia';
          if (subscriptionType.toLowerCase().includes('month') || subscriptionType.toLowerCase().includes('mensal')) {
            purchaseType = 'mensal';
          } else if (subscriptionType.toLowerCase().includes('year') || subscriptionType.toLowerCase().includes('anual')) {
            purchaseType = 'anual';
          }

          // Salvar metadata
          customer.metadata.set('lastProduct', productName);
          customer.metadata.set('lastPaymentType', purchaseType);
          customer.metadata.set('lastStatus', sale.status || 'approved');

          await customer.save();

          // Criar ou atualizar venda
          const existingSale = await Sale.findOne({
            platform: 'hotmart',
            externalId: sale.transaction || sale.id
          });

          if (!existingSale) {
            const saleRecord = new Sale({
              userId: req.user.id,
              customerId: customer._id,
              platform: 'hotmart',
              externalId: sale.transaction || sale.id,
              productName: productName,
              productId: sale.product?.id || '',
              amount: sale.price?.value || sale.value || 0,
              currency: sale.price?.currency || sale.currency || 'BRL',
              status: sale.status === 'refunded' || sale.status === 'cancelled' ? 'refunded' : 'approved',
              paymentType: purchaseType,
              saleDate: sale.purchase?.approved_date || sale.approved_date || new Date(),
              refundedAt: sale.status === 'refunded' ? new Date() : null,
              refundAmount: sale.status === 'refunded' ? (sale.price?.value || 0) : 0
            });

            await saleRecord.save();
            processedCount++;
          }
        } catch (saleError) {
          console.error('Erro ao processar venda Hotmart:', saleError);
          // Continuar processando outras vendas
        }
      }

      integration.lastSync = new Date();
      integration.syncData = {
        totalSales: salesResult.total || 0,
        totalProducts: productsResult?.products?.length || 0,
        processedSales: processedCount,
        tagsCreated: tagsCreated.length,
        lastSyncedAt: new Date()
      };
      await integration.save();

      console.log(`✅ Sincronização Hotmart completa: ${processedCount} vendas processadas, ${tagsCreated.length} tags criadas`);

      res.json({
        success: true,
        message: `Sincronização completa! ${processedCount} vendas processadas, ${tagsCreated.length} tags criadas`,
        data: {
          sales: sales,
          products: productsResult?.products || [],
          total_sales: salesResult.total || 0,
          total_products: productsResult?.products?.length || 0,
          processed_sales: processedCount,
          tags_created: tagsCreated
        }
      });
    } catch (error) {
      console.error('Erro ao sincronizar Hotmart:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao sincronizar dados'
      });
    }
  }

  /**
   * Busca dados da integração Hotmart (para exibição)
   */
  async getHotmartData(req, res) {
    try {
      console.log('📊 getHotmartData chamado');

      // MODO TESTE: Se não tem req.user, buscar qualquer integração ativa
      const userId = req.user?.id || null;
      const query = userId
        ? { userId, platform: 'hotmart', status: 'active' }
        : { platform: 'hotmart', status: 'active' };

      console.log('🔍 Buscando integração Hotmart com query:', query);

      const integration = await Integration.findOne(query);

      if (!integration) {
        console.log('❌ Nenhuma integração Hotmart encontrada');
        return res.status(404).json({
          success: false,
          message: 'Integração Hotmart não encontrada ou inativa'
        });
      }

      console.log('✅ Integração Hotmart encontrada:', integration._id);

      // Buscar clientes da Hotmart
      const customerQuery = userId ? { userId, source: 'hotmart' } : { source: 'hotmart' };
      const customers = await Customer.find(customerQuery).lean();
      console.log(`👥 ${customers.length} clientes encontrados`);

      // Buscar vendas da Hotmart
      const salesQuery = userId ? { userId, platform: 'hotmart' } : { platform: 'hotmart' };
      const sales = await Sale.find(salesQuery).sort({ saleDate: -1 }).lean();
      console.log(`💰 ${sales.length} vendas encontradas`);

      // Buscar produtos (a partir das vendas únicas)
      const uniqueProducts = {};
      sales.forEach(sale => {
        if (sale.productName && !uniqueProducts[sale.productName]) {
          uniqueProducts[sale.productName] = {
            id: sale.productId || sale._id.toString(),
            name: sale.productName,
            price: sale.amount || 0,
            type: sale.paymentType || 'unknown',
            category: 'Digital',
            autoTag: sale.productName.split('-')[0].trim()
          };
        }
      });

      const products = Object.values(uniqueProducts);

      // Calcular métricas
      const totalClients = customers.length;
      const approvedSales = sales.filter(s => s.status === 'approved');
      const refundedSales = sales.filter(s => s.status === 'refunded');

      const totalRevenue = approvedSales.reduce((sum, s) => sum + (s.amount || 0), 0);
      const totalRefunds = refundedSales.reduce((sum, s) => sum + (s.amount || 0), 0);
      const refundCount = refundedSales.length;

      // Formatar clientes recentes
      const recentClients = customers.slice(0, 10).map(customer => ({
        id: customer._id.toString(),
        nome: customer.name,
        email: customer.email,
        cpf: customer.document || 'N/A',
        telefone: customer.phone || 'N/A',
        produto: customer.metadata?.get('lastProduct') || 'N/A',
        tipoPagamento: customer.metadata?.get('lastPaymentType') || 'unknown',
        valor: customer.totalSpent || 0,
        dataCompra: customer.lastPurchaseDate || customer.createdAt,
        horaCompra: customer.lastPurchaseDate ?
          new Date(customer.lastPurchaseDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) :
          'N/A',
        status: customer.metadata?.get('lastStatus') || 'approved',
        reembolsado: customer.metadata?.get('hasRefunds') === 'true'
      }));

      res.json({
        success: true,
        data: {
          totalClients,
          totalRevenue,
          totalRefunds,
          refundCount,
          products,
          recentClients,
          lastSync: integration.lastSync || new Date()
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dados Hotmart:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados'
      });
    }
  }

  // ========== STRIPE ==========

  /**
   * Conecta com Stripe
   */
  async connectStripe(req, res) {
    try {
      const { secret_key, webhook_secret, publishable_key } = req.body;

      // Validação dos campos
      if (!secret_key || !webhook_secret) {
        return res.status(400).json({
          success: false,
          message: 'secret_key e webhook_secret são obrigatórios'
        });
      }

      // Valida a secret key
      const authResult = await stripeService.authenticate(secret_key);

      if (!authResult.success) {
        return res.status(401).json({
          success: false,
          message: authResult.error || 'Secret key inválida'
        });
      }

      // Busca ou cria a integração
      let integration = await Integration.findOne({
        userId: req.user.id,
        platform: 'stripe'
      });

      if (integration) {
        // Atualiza credenciais existentes
        integration.credentials = {
          secret_key,
          webhook_secret,
          publishable_key: publishable_key || '',
          test_mode: authResult.test_mode
        };
        integration.status = 'active';
        integration.lastSync = new Date();
      } else {
        // Cria nova integração
        integration = new Integration({
          userId: req.user.id,
          platform: 'stripe',
          credentials: {
            secret_key,
            webhook_secret,
            publishable_key: publishable_key || '',
            test_mode: authResult.test_mode
          },
          status: 'active',
          lastSync: new Date()
        });
      }

      await integration.save();

      // Não retornar credenciais sensíveis
      const response = integration.toObject();
      delete response.credentials.secret_key;
      delete response.credentials.webhook_secret;

      res.json({
        success: true,
        message: `Conectado com Stripe com sucesso! (${authResult.test_mode ? 'Modo Teste' : 'Modo Produção'})`,
        integration: response
      });
    } catch (error) {
      console.error('Erro ao conectar com Stripe:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao conectar com Stripe'
      });
    }
  }

  /**
   * Desconecta do Stripe
   */
  async disconnectStripe(req, res) {
    try {
      const integration = await Integration.findOne({
        userId: req.user.id,
        platform: 'stripe'
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração Stripe não encontrada'
        });
      }

      // Limpa o cliente Stripe da memória
      stripeService.clearClient(integration.credentials.secret_key);

      integration.status = 'inactive';
      integration.credentials = {};
      await integration.save();

      res.json({
        success: true,
        message: 'Desconectado do Stripe com sucesso'
      });
    } catch (error) {
      console.error('Erro ao desconectar do Stripe:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao desconectar do Stripe'
      });
    }
  }

  /**
   * Sincroniza dados do Stripe
   */
  async syncStripe(req, res) {
    try {
      const integration = await Integration.findOne({
        userId: req.user.id,
        platform: 'stripe',
        status: 'active'
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração Stripe não encontrada ou inativa'
        });
      }

      // Busca charges, customers e products
      const [chargesResult, customersResult, productsResult] = await Promise.all([
        stripeService.getCharges(integration.credentials.secret_key),
        stripeService.getCustomers(integration.credentials.secret_key),
        stripeService.getProducts(integration.credentials.secret_key)
      ]);

      integration.lastSync = new Date();
      integration.syncData = {
        totalCharges: chargesResult.total || 0,
        totalCustomers: customersResult.total || 0,
        totalProducts: productsResult.total || 0,
        lastSyncedAt: new Date()
      };
      await integration.save();

      res.json({
        success: true,
        message: 'Dados sincronizados com sucesso',
        data: {
          charges: chargesResult.charges || [],
          customers: customersResult.customers || [],
          products: productsResult.products || [],
          total_charges: chargesResult.total || 0,
          total_customers: customersResult.total || 0,
          total_products: productsResult.total || 0
        }
      });
    } catch (error) {
      console.error('Erro ao sincronizar Stripe:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao sincronizar dados'
      });
    }
  }

  // ========== UTILIDADES ==========

  /**
   * Verifica status de uma integração
   */
  async checkStatus(req, res) {
    try {
      const integration = await Integration.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração não encontrada'
        });
      }

      let isValid = false;

      // Verifica status baseado na plataforma
      switch (integration.platform) {
        case 'kiwify':
          if (integration.credentials.access_token) {
            isValid = await kiwifyService.verifyToken(integration.credentials.access_token);
          }
          break;
        case 'hotmart':
          if (integration.credentials.access_token) {
            isValid = await hotmartService.verifyToken(integration.credentials.access_token);
          }
          break;
        case 'stripe':
          if (integration.credentials.secret_key) {
            isValid = await stripeService.verifyKey(integration.credentials.secret_key);
          }
          break;
      }

      res.json({
        success: true,
        status: integration.status,
        is_valid: isValid,
        last_sync: integration.lastSync
      });
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao verificar status'
      });
    }
  }

  /**
   * Busca dados sincronizados
   */
  async getData(req, res) {
    try {
      const integration = await Integration.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração não encontrada'
        });
      }

      res.json({
        success: true,
        data: integration.syncData || {},
        last_sync: integration.lastSync
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados'
      });
    }
  }

  // ========== KIWIFY - ENDPOINTS ADICIONAIS ==========

  /**
   * GET /api/integrations/kiwify/sync
   * Retorna dados já sincronizados do banco de dados
   */
  async getKiwifyData(req, res) {
    try {
      console.log('📊 getKiwifyData chamado');

      // MODO TESTE: Se não tem req.user, buscar qualquer integração ativa
      const userId = req.user?.id || null;
      const query = userId
        ? { userId, platform: 'kiwify', status: 'active' }
        : { platform: 'kiwify', status: 'active' };

      console.log('🔍 Buscando integração com query:', query);

      const integration = await Integration.findOne(query);

      if (!integration) {
        console.log('❌ Nenhuma integração Kiwify encontrada');
        return res.status(404).json({
          success: false,
          message: 'Integração Kiwify não encontrada ou inativa'
        });
      }

      console.log('✅ Integração encontrada:', integration._id);

      // Buscar clientes da Kiwify
      const customerQuery = userId ? { userId, source: 'kiwify' } : { source: 'kiwify' };
      const customers = await Customer.find(customerQuery).lean();
      console.log(`👥 ${customers.length} clientes encontrados`);

      // Buscar vendas da Kiwify
      const salesQuery = userId ? { userId, platform: 'kiwify' } : { platform: 'kiwify' };
      const sales = await Sale.find(salesQuery).sort({ saleDate: -1 }).lean();
      console.log(`💰 ${sales.length} vendas encontradas`);

      // Buscar produtos (a partir das vendas únicas)
      const uniqueProducts = {};
      sales.forEach(sale => {
        if (sale.productName && !uniqueProducts[sale.productName]) {
          uniqueProducts[sale.productName] = {
            id: sale.productId || sale._id.toString(),
            name: sale.productName,
            price: sale.amount || 0,
            type: sale.paymentType || 'unknown',
            category: 'Digital',
            autoTag: sale.productName.split('-')[0].trim() // Ex: "Super Links - Plano" -> "Super Links"
          };
        }
      });

      const products = Object.values(uniqueProducts);

      // Calcular métricas
      const totalClients = customers.length;
      const approvedSales = sales.filter(s => s.status === 'approved');
      const refundedSales = sales.filter(s => s.status === 'refunded');

      const totalRevenue = approvedSales.reduce((sum, s) => sum + (s.amount || 0), 0);
      const totalRefunds = refundedSales.reduce((sum, s) => sum + (s.amount || 0), 0);
      const refundCount = refundedSales.length;

      // Formatar clientes recentes
      const recentClients = customers.slice(0, 10).map(customer => ({
        id: customer._id.toString(),
        nome: customer.name,
        email: customer.email,
        cpf: customer.document || 'N/A',
        telefone: customer.phone || 'N/A',
        produto: customer.metadata?.get('lastProduct') || 'N/A',
        tipoPagamento: customer.metadata?.get('lastPaymentType') || 'unknown',
        valor: customer.totalSpent || 0,
        dataCompra: customer.lastPurchaseDate || customer.createdAt,
        horaCompra: customer.lastPurchaseDate ?
          new Date(customer.lastPurchaseDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) :
          'N/A',
        status: customer.metadata?.get('lastStatus') || 'approved',
        reembolsado: customer.metadata?.get('hasRefunds') === 'true'
      }));

      res.json({
        success: true,
        data: {
          totalClients,
          totalRevenue,
          totalRefunds,
          refundCount,
          products,
          recentClients,
          lastSync: integration.lastSync || new Date()
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dados Kiwify:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados sincronizados'
      });
    }
  }

  /**
   * GET /api/integrations/kiwify/stats
   * Retorna métricas formatadas
   */
  async getKiwifyStats(req, res) {
    try {
      const integration = await Integration.findOne({
        userId: req.user.id,
        platform: 'kiwify',
        status: 'active'
      });

      if (!integration) {
        return res.status(404).json({
          success: false,
          message: 'Integração Kiwify não encontrada ou inativa'
        });
      }

      // Buscar vendas aprovadas
      const approvedSales = await Sale.find({
        userId: req.user.id,
        platform: 'kiwify',
        status: 'approved'
      });

      // Buscar vendas reembolsadas
      const refundedSales = await Sale.find({
        userId: req.user.id,
        platform: 'kiwify',
        status: 'refunded'
      });

      // Buscar total de clientes
      const totalCustomers = await Customer.countDocuments({
        userId: req.user.id,
        source: 'kiwify'
      });

      // Calcular totais
      const totalRevenue = approvedSales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
      const totalRefunds = refundedSales.reduce((sum, sale) => sum + (sale.amount || 0), 0);

      res.json({
        success: true,
        stats: {
          totalClientes: totalCustomers,
          totalVendas: totalRevenue,
          totalReembolsos: totalRefunds,
          clientesReembolsados: refundedSales.length,
          vendasAprovadas: approvedSales.length,
          lastSync: integration.lastSync || new Date()
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas Kiwify:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas'
      });
    }
  }
}

module.exports = new IntegrationsController();
