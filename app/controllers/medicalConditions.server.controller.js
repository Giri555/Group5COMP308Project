// convert csv file to json file
const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const csvFile = path.join(__dirname, '../data/prognosis_data.csv');
const jsonFile = path.join(__dirname, '../data/prognosis_data.json');
const tf = require('@tensorflow/tfjs');
const prognosisData = require('../data/prognosis_data.json');


// convert csv file to json (only done once)
/*

exports.getData = function (req, res, next) {
    csv()
        .fromFile(csvFile)
        .then((jsonObj) => {
            fs.writeFile(jsonFile, JSON.stringify(jsonObj), function (err) {
                if (err) return console.log(err);
            });
        });
    console.log(`CSV ---> JSON complete`);
    return next();
};

*/

// predict a prognosis
exports.predictPrognosis = function (req, res) {
    
    console.log(`predict prognosis`);
    // # of symptoms we are considering: 15
    // # of unique prognosis we have in our data set: 9

    // set learning rate and epochs
    const learningRate = 0.06;
    const epochs = 1500;

    // best to keep lossValue minimal; 
    // the lower the loss value, the better the model is
    var lossValue;

    // process user input data (symptoms) from react front end
    // data should be numeric, hence we parse the string from req.body to floats
    const symptoms = [
        {
            'Pain in lower abdomen': parseFloat(req.body['Pain in lower abdomen']),
            'Pain in middle abdomen': parseFloat(req.body['Pain in middle abdomen']),
            'Pain in upper abdomen': parseFloat(req.body['Pain in upper abdomen']),
            'Dry cough': parseFloat(req.body['Dry cough']),
            'Wet cough': parseFloat(req.body['Wet cough']),
            'Headache on one side of head': parseFloat(req.body['Headache on one side of head']),
            'Headache on both sides of head': parseFloat(req.body['Headache on both sides of head']),
            'Problem with one eye': parseFloat(req.body['Problem with one eye']),
            'Problem with both eyes': parseFloat(req.body['Problem with both eyes']),
            'Severe chest pain': parseFloat(req.body['Severe chest pain']),
            'Squeezing chest pain': parseFloat(req.body['Squeezing chest pain']),
            'Burning chest pain': parseFloat(req.body['Burning chest pain']),
            'Sharp chest pain': parseFloat(req.body['Sharp chest pain']),
            'Nasal congestion': parseFloat(req.body['Nasal congestion']),
            'Sore throat': parseFloat(req.body['Sore throat']),
        },
    ];
    console.log(`these are the symptoms`);
    console.log(symptoms);


    // convert/setup our data for tensorflow.js
    // setup the features tensor for training data
    // includes only features, NOT the output
    const trainingData = tf.tensor2d(
        prognosisData.map((item) => [
            item['Pain in lower abdomen'],
            item['Pain in middle abdomen'],
            item['Pain in upper abdomen'],
            item['Dry cough'],
            item['Wet cough'],
            item['Headache on one side of head'],
            item['Headache on both sides of head'],
            item['Problem with one eye'],
            item['Problem with both eyes'],
            item['Severe chest pain'],
            item['Squeezing chest pain'],
            item['Burning chest pain'],
            item['Sharp chest pain'],
            item['Nasal congestion'],
            item['Sore throat'],
        ])
    );

    // setup the output tensor for training data
    //
    // Common cold:  1, 0, 0, 0, 0, 0, 0, 0, 0
    // Pneumonia:      0, 1, 0, 0, 0, 0, 0, 0, 0
    // Bronchitis:        0, 0, 1, 0, 0, 0, 0, 0, 0
    // Influenza (flu): 0, 0, 0, 1, 0, 0, 0, 0, 0
    // Migraine:           0, 0, 0, 0, 1, 0, 0, 0, 0
    // Stroke:               0, 0, 0, 0, 0, 1, 0, 0, 0
    // Heart attack:     0, 0, 0, 0, 0, 0, 1, 0, 0
    // Heartburn:         0, 0, 0, 0, 0, 0, 0, 1, 0
    // Strep throat:      0, 0, 0, 0, 0, 0, 0, 0, 1
    const outputData = tf.tensor2d(
        prognosisData.map((item) => [
            item.Prognosis === 'Common cold' ? 1 : 0,
            item.Prognosis === 'Pneumonia' ? 1 : 0,
            item.Prognosis === 'Bronchitis' ? 1 : 0,
            item.Prognosis === 'Influenza (flu)' ? 1 : 0,
            item.Prognosis === 'Migraine' ? 1 : 0,
            item.Prognosis === 'Stroke' ? 1 : 0,
            item.Prognosis === 'Heart attack' ? 1 : 0,
            item.Prognosis === 'Heartburn' ? 1 : 0,
            item.Prognosis === 'Strep throat' ? 1 : 0,
        ])
    );

    // setup the features tensor for testing data (user input symptoms)
    const testingData = tf.tensor2d(
        symptoms.map((item) => [
            item['Pain in lower abdomen'],
            item['Pain in middle abdomen'],
            item['Pain in upper abdomen'],
            item['Dry cough'],
            item['Wet cough'],
            item['Headache on one side of head'],
            item['Headache on both sides of head'],
            item['Problem with one eye'],
            item['Problem with both eyes'],
            item['Severe chest pain'],
            item['Squeezing chest pain'],
            item['Burning chest pain'],
            item['Sharp chest pain'],
            item['Nasal congestion'],
            item['Sore throat'],
        ])
    );

    // build neural network using a sequential model
    const model = tf.sequential();
    //add the first layer
    model.add(
        tf.layers.dense({
            inputShape: [15], // 15 input neurons
            activation: 'sigmoid',
            units: 16, //dimension of output space (first hidden layer)
        })
    );
    //add the hidden layer
    model.add(
        tf.layers.dense({
            inputShape: [16], //dimension of hidden layer
            activation: 'sigmoid',
            units: 9, //dimension of final output (prognosis)
        })
    );
    //add output layer
    model.add(
        tf.layers.dense({
            activation: 'sigmoid',
            units: 9, //dimension of final output (prognosis)
        })
    );
    //compile the model with an MSE loss function and Adam algorithm
    model.compile({
        loss: 'meanSquaredError',
        optimizer: tf.train.adam(learningRate),
    });
    // console.log(model.summary());
    //
    // Train the model and predict the results for testing data
    //
    // train/fit the model for the number of epochs
    async function trainModelAndPredict() {
        const startTime = Date.now();
        // train the model
        await model.fit(trainingData, outputData, {
            epochs: epochs,
            callbacks: {
                //list of callbacks to be called during training
                onEpochEnd: async (epoch, log) => {
                    lossValue = log.loss;
                    // console.log(`Epoch ${epoch}: lossValue = ${log.loss}`);
                    elapsedTime = Date.now() - startTime;
                    // console.log('elapsed time: ' + elapsedTime);
                },
            },
        });

        const results = model.predict(testingData);

        // get the values from the tf.Tensor
        results.array().then((array) => {

            var prediction = [];

            console.log(`loss value`, lossValue);
            console.log(`elapsed time`, elapsedTime / 1000);

            for(var i = 0; i < array[0].length; i++){
                prediction.push(Math.round(array[0][i]));
            }

            console.log(`prediction`, prediction);

            // determine the prognosis:
            var prognosis = 'INVALID';

            if(prediction[0] === 1 && prediction[1] === 0 && prediction[2] === 0 && prediction[3] === 0 && prediction[4] === 0 && prediction[5] === 0 && prediction[6] === 0 && prediction[7] === 0 && prediction[8] === 0){
                prognosis = 'Common cold';
            }
            else if(prediction[0] === 0 && prediction[1] === 1 && prediction[2] === 0 && prediction[3] === 0 && prediction[4] === 0 && prediction[5] === 0 && prediction[6] === 0 && prediction[7] === 0 && prediction[8] === 0){
                prognosis = 'Pneumonia';
            }
            else if(prediction[0] === 0 && prediction[1] === 0 && prediction[2] === 1 && prediction[3] === 0 && prediction[4] === 0 && prediction[5] === 0 && prediction[6] === 0 && prediction[7] === 0 && prediction[8] === 0){
                prognosis = 'Bronchitis';
            }
            else if(prediction[0] === 0 && prediction[1] === 0 && prediction[2] === 0 && prediction[3] === 1 && prediction[4] === 0 && prediction[5] === 0 && prediction[6] === 0 && prediction[7] === 0 && prediction[8] === 0){
                prognosis = 'Influenza (flu)';
            }
            else if(prediction[0] === 0 && prediction[1] === 0 && prediction[2] === 0 && prediction[3] === 0 && prediction[4] === 1 && prediction[5] === 0 && prediction[6] === 0 && prediction[7] === 0 && prediction[8] === 0){
                prognosis = 'Migraine';
            }
            else if(prediction[0] === 0 && prediction[1] === 0 && prediction[2] === 0 && prediction[3] === 0 && prediction[4] === 0 && prediction[5] === 1 && prediction[6] === 0 && prediction[7] === 0 && prediction[8] === 0){
                prognosis = 'Stroke';
            }
            else if(prediction[0] === 0 && prediction[1] === 0 && prediction[2] === 0 && prediction[3] === 0 && prediction[4] === 0 && prediction[5] === 0 && prediction[6] === 1 && prediction[7] === 0 && prediction[8] === 0){
                prognosis = 'Heart attack';
            }
            else if(prediction[0] === 0 && prediction[1] === 0 && prediction[2] === 0 && prediction[3] === 0 && prediction[4] === 0 && prediction[5] === 0 && prediction[6] === 0 && prediction[7] === 1 && prediction[8] === 0){
                prognosis = 'Heartburn';
            }
            else if(prediction[0] === 0 && prediction[1] === 0 && prediction[2] === 0 && prediction[3] === 0 && prediction[4] === 0 && prediction[5] === 0 && prediction[6] === 0 && prediction[7] === 0 && prediction[8] === 1){
                prognosis = 'Strep throat';
            }

            // send a response
            res.status(200).json({
                prognosis: prognosis
                // raw_data: array[0],
                // rounded_data: prediction,
            });

        });

    } //end of trainModelAndPredict function
    trainModelAndPredict();
};
