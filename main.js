const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(data, previousHash = "") {
    this.timestamp = new Date();
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficult) {
    while (this.hash.substring(0, difficult) !== String("0").repeat(4)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  constructor(difficult = 2) {
    this.chain = [this.createGenesisBlock()];
    this.difficult = difficult;
  }

  createGenesisBlock() {
    return new Block("Test block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficult);
    this.chain.push(newBlock);
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let testBC = new Blockchain(3);
console.time("mining");
console.log("Mining block 1....");
testBC.addBlock(new Block({ name: "Truong", age: 25 }));
console.log("Mining block 2....");
testBC.addBlock(new Block({ name: "Truong", age: 26 }));
console.timeEnd("mining");
