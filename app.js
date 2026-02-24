const express = require("express");
const session = require('express-session');
const fs = require('fs');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { supabase } = require("./supabaseClient");
const ejs = require('ejs');
const { format } = require('date-fns');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    const imoveis = JSON.parse(
        fs.readFileSync('./data/imoveis.json', 'utf-8')
    );

    res.render("tela_inicial", { imoveis });
});

app.get("/imoveis", async (req, res) => {
    const { data, error } = await supabase
        .from('imoveis_vitrine')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Erro ao buscar imóveis:', error);
        return res.status(500).send('Erro ao buscar imóveis');
    }
    if (!data) {
        console.log(data)
        return res.status(404).send('Nenhum imóvel encontrado');
    }

    let imoveis = data;

    const { transacao, quartos, tipo, banheiros } = req.query;

    if (transacao && transacao !== 'todos') {
        imoveis = imoveis.filter(i => i.transacao.toLowerCase() === transacao.toLowerCase());
    }

    if (quartos && quartos !== 'todos') {
        imoveis = imoveis.filter(i => i.quarto === parseInt(quartos));
    }

    if (tipo && tipo !== 'todos') {
        imoveis = imoveis.filter(i => i.tipo.toLowerCase() === tipo.toLowerCase());
    }

    if (banheiros && banheiros !== 'todos') {
        imoveis = imoveis.filter(i => i.banheiro === parseInt(banheiros));
    }

    res.render("imoveis", { imoveis });
});

app.get('/imovel/:id', async (req, res) => {
    const id = req.params.id;
    const { data, error } = await supabase
        .from('imoveis_vitrine')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Erro ao buscar imóveis:', error);
        return res.status(500).send('Erro ao buscar imóveis');
    }
    if (!data) {
        console.log(data)
        return res.status(404).send('Nenhum imóvel encontrado');
    }

    let imoveis = data;

    const imovel = imoveis.find(i => i.public_id === id);

    if (!imovel) {
        return res.status(404).send('Imóvel não encontrado');
    }

    res.render('imovel', { imovel });
});

app.listen(5000, () => {
    console.log(`Servidor rodando em http://localhost:5000`);
});
