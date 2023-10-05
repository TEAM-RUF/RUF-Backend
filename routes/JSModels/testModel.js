const tf = require('@tensorflow/tfjs');

// Create the model
const model = tf.sequential();

// Add an LSTM layer
model.add(tf.layers.lstm({
    units: 8,
    inputShape: [8],
    returnSequences: true
}));

// Add a second LSTM layer
model.add(tf.layers.lstm({
    units: 8,
    returnSequences: true
}));

// Add a dense layer
model.add(tf.layers.dense({
    units: 8,
    activation: 'softmax'
}));

// Compile the model
model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: 'rmsprop'
});

// Export the model
module.exports = model;