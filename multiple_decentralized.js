const blockchainController = require('./src/controllers/blockchain_logic');
const express = require('express');
const bodyParser = require('body-parser');
const nodes = require('./nodes/network_nodes.json');

// Create an instance per node in the list to mimic distributed and decentralized nodes
nodes.forEach(node => {
    let idx = node.lastIndexOf('//');
    let idx2 = node.lastIndexOf(':');
    let url = node.substring(idx + 2, idx2);
    let port = node.substring(idx2 + 1);

    let app = express();
    app.use(bodyParser.json());

    let listener = app.listen(port, url, function () {
        console.log('Server started at ' + listener.address().address + ':' + listener.address().port);
    });

    // API endpoint
    let controller = new blockchainController(url, port);
    app.get('/resolve', controller.resolve.bind(controller));
    app.get('/nodes', controller.getNodes.bind(controller));
    app.post('/transaction', controller.postTransaction.bind(controller));
    app.get('/transactions', controller.getTransactions.bind(controller));
    app.get('/mine', controller.mine.bind(controller));
    app.get('/blockchain/last-index', controller.getBlockLastIndex.bind(controller));
    app.get('/blockchain/:idx', controller.getBlockByIndex.bind(controller));
    app.get('/blockchain', controller.getBlockchain.bind(controller));
});