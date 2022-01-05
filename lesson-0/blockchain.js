const url = require('url');
const axios = require("axios");
const express = require('express');
const App = new express();

const PORT = 3000;

const { createHash } = require('crypto');
const { v4: uuidv4 } = require('uuid');

class Blockchain {

    constructor(){
        this.difficulty_target = "0000";
        this.nodes = new Set();
        this.chain = [];
        this.current_transactions = [];
        this.hash_of_current_block = "";
        this.genesis_hash = this.hash_block("genesis_block");
        this.append_block (
            this.genesis_hash,
            this.proof_of_work(0, this.genesis_hash, [])
        )
    }

    add_node(address){
        const parse_url = url.parse(address)
        this.nodes.add(parse_url.hostname)
    }

    valid_chain(chain){
        let last_block = chain[0];
        let current_index = 1;

        while (current_index < chain.length){
            let block = chain[current_index];

            if(block['hash_of_previous_block'] !== this.hash_block(last_block)){
                return false;
            }

            const isValidProof = this.valid_proof(block['hash_of_previous_block'], block['transaction'], block['nonce'])
            if(isValidProof === false){
                return false;
            }

            last_block = block
            current_index += 1
        }
        return true;
    }

    async update_blockchain(){
        let neighbours = this.nodes;
        let new_chain = null;

        let max_length = this.chain.length;

        for(let node in neighbours){
            let response = await axios.get(`http://${node}/blockchain`);

            if(response.status_code === 200){
                let length = response.data[0].length;
                let chain = response.data[0].chain;

                if(length > max_length && this.valid_chain(chain)){
                    max_length = length;
                    new_chain = chain;
                }

                if(new_chain){
                    this.chain = new_chain;
                    return true;
                }
            }
        }
        return false;
    }

    hash_block(block){
        let sortBlock = () => {
            return Object.keys(block).sort().reduce((accumulator, currentValue) => {
                accumulator[currentValue] = block[currentValue];
                return accumulator;
            }, {})
        }
        let block_encoded = encodeURI(JSON.stringify(sortBlock()));
        return createHash('sha256').update(block_encoded).digest('hex');
    }

    proof_of_work(index, hash_of_previous_block, transactions){
        let nonce = 0;

        while (this.valid_proof(index, hash_of_previous_block, transactions, nonce) === false){
            nonce += 1;
        }

        return nonce
    }

    valid_proof(index, hash_of_previous_block, transactions, nonce){
        let content = encodeURI(`${index}${hash_of_previous_block}${transactions}${nonce}`);
        let contentHash = createHash('sha256').update(content).digest('hex');


        if((String(contentHash.substring(0, 4)) === this.difficulty_target)){
            this.hash_of_current_block = contentHash;
            return true;
        }
        return false;
    }

    append_block( hash_of_previous_block, nonce ) {
        let block = {
            'index' : this.chain.length,
            'timestamp': new Date().getTime(),
            'transaction': this.current_transactions,
            'nonce': nonce,
            'hash_of_previous_block': hash_of_previous_block,
            'hash_of_current_block' : this.hash_of_current_block
        }

        this.current_transactions = [];
        this.hash_of_current_block = "";
        this.chain.push(block);
        return block;
    }

    add_transaction(sender, recipient, amount){
        this.current_transactions.push({
            'amount': amount,
            'recipient': recipient,
            'sender': sender
        })

        return this.last_block['index'] + 1
    }

    last_block(){
        return this.chain[this.chain.length - 1]
    }


}

let node_identifier = String(uuidv4()).replace(/-/g, "")
let blockchain = new Blockchain();

App.use(express.json())

App.listen(PORT, async (err) => {
    if(err){
        console.error("Failed to listen")
    }
    console.log("API started at http://localhost:" + PORT)
})

App.get('/blockchain', (req, res) => {
    const response = {
        'chain': blockchain.chain,
        'length': blockchain.chain.length
    }

    return res.status(200)
        .send(response)
});

App.get('/mine', async(req, res) => {
    blockchain.add_transaction("0", node_identifier, 1);
    let last_block_hash = blockchain.last_block().hash_of_current_block;
    let index = blockchain.chain.length;

    let nonce = blockchain.proof_of_work(index, last_block_hash, blockchain.current_transactions);
    let block = blockchain.append_block(last_block_hash, nonce);

    const response = {
        'message': "Block baru telah ditambahkan (mined)",
        'index': block['index'],
        'hash_of_previous_block' : block['hash_of_previous_block'],
        'nonce': block['nonce'],
        'transaction': block['transaction']
    };

    res.status(200)
        .send(response)
})

App.post('/transactions/new', async (req, res) => {
    const {sender, recipient, amount} = req.body;

    let isEmpty = false;
    for(const key in [sender, recipient, amount]){
        if(key === "" || key === undefined || key === null){
            isEmpty = true;
            return res.status(400)
                .send({
                    success:false,
                    message: `Please add field ${key}`,
                    code: 400
                })
        }
    }

    let index = blockchain.add_transaction(sender, recipient, amount);
    const response = {
        success: true,
        message: `Transaksi akan ditambahkan ke blok ${index}`,
        code: 200
    };

    return res.status(200)
                .send(response)
})

App.post('/nodes/add_nodes', async (req, res) => {
    const {nodes} = req.body;

    if(!nodes){
        return res.status(400)
            .send({
                success: false,
                message: "Please add field nodes",
                code: 400
            })
    }

    for(let node in nodes){
        blockchain.add_node(node)
    }

    const response = {
        'message': 'Node baru telah di tambahkan',
        'nodes': blockchain.nodes
    }

    return res.status(200)
        .send(response);
});

App.get('/nodes/sync', async (req, res) => {
    const updated = blockchain.update_blockchain();
    let response;
    if(updated){
        response = {
            'message': 'Blockchain telah diupdate dengan data terbaru',
            'blockchain': blockchain.chain
        }
    } else {
        response = {
            'message': 'Blockchain sudah menggunakan data paling baru',
            'blockchain': blockchain.chain
        }
    }

    return res.status(200)
        .send(response);
});
