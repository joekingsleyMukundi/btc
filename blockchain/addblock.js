const Block = require("./block");
const addBlock = (lastBlock, index, transactions) => {
  const newBlock = Block.generatedBlock({
    lastBlock: lastBlock,
    index: index,
    transactions: transactions,
  });
  return newBlock;
};

module.exports = { addBlock };
