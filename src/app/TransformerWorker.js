import { pipeline, env } from "@xenova/transformers";

// This is the example from 
// https://huggingface.co/docs/transformers.js/tutorials/next

// Specify a custom location for models (defaults to '/models/').
// env.localModelPath = process.env.PUBLIC_URL + '/models/';

// Skip local model check
env.allowLocalModels = false;

// Set this flag to false to stop transformers from using browser cache:
// env.useBrowserCache = false;

// Array holding model-specific pipeline singletons.
const existingPipelines = [];

// Use the Singleton pattern to enable lazy construction of the pipeline.
const pipelineFactory = (modelName) => {
  class PipelineSingleton {
    static task = 'text-classification';
    static model = modelName;
    static instance = null;
  
    static async getInstance(progress_callback = null) {
      if (this.instance === null) {
        this.instance = pipeline(this.task, this.model, { progress_callback });
      }
      return this.instance;
    }
  }
  return PipelineSingleton;
};

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  const pIndex = event.data.pIndex;
  const cIndex = event.data.cIndex;
  const modelName = event.data?.modelName ||
    'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
  let totalSegments = event.data.totalSegments;
  let output = [];
  let pipelineSingleton;

  if (existingPipelines.length > 0) {
    for (let pipeline of existingPipelines) {
      if (pipeline.model === modelName) {
        pipelineSingleton = pipeline;
      }
    }
  }

  if (!pipelineSingleton) {
    console.log('making new pipeline instance');
    pipelineSingleton = pipelineFactory(modelName);
    existingPipelines.push(pipelineSingleton);
  }
  // Retrieve the classification pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  let classifier = await pipelineSingleton.getInstance(x => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    self.postMessage(x);
  });
  
  // Actually perform the classification
  if (event.data.t[cIndex]?.segment && /\S/.test(event.data.t[cIndex]?.segment)) {
    output = await classifier(event.data.t[cIndex].segment);
  }

  // Send the output back to the main thread
  self.postMessage({
    status: 'complete',
    output: output,
    t: event.data.t,
    pIndex: pIndex,
    cIndex: cIndex,
    modelName: modelName,
    totalSegments: totalSegments
  });
});