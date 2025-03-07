
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
app.use(cors()); // Autoriser les requêtes cross-origin
app.use(bodyParser.json()); // Supporte JSON

// Route principale pour traiter les paiements
app.post('/pay', async (req, res) => {
    try {
        const { email, cardNumber, expMonth, expYear, cvv, amount, walletAddress } = req.body;

        if (!email || !cardNumber || !expMonth || !expYear || !cvv || !amount || !walletAddress) {
            return res.status(400).json({ error: 'Paramètres manquants' });
        }

        // Préparer la requête Simplex
        const simplexData = {
            account_details: { email },
            payment_details: {
                card_number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvv,
                fiat_total_amount: { currency: "USD", amount },
                digital_currency: "USDC",
                destination_wallet: { currency: "USDC", address: walletAddress }
            }
        };

        // Envoyer la requête à Simplex
        const response = await axios.post('https://api.simplex.com/payments/new', simplexData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_SIMPLEX_API_KEY` // Remplace avec ta clé API Simplex
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Erreur Simplex:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erreur lors du paiement' });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur Simplex en ligne sur http://localhost:${PORT}`);
});
