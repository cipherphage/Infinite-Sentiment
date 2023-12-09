import { pipeline, env } from "@xenova/transformers";

// This is the example from 
// https://huggingface.co/docs/transformers.js/tutorials/next

// Specify a custom location for models (defaults to '/models/').
// env.localModelPath = process.env.PUBLIC_URL + '/models/';

// Skip local model check and cache
env.allowLocalModels = false;
// env.useBrowserCache = false;



// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
    static task = 'text-classification';
    static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const i = event.data.i;
    // Retrieve the classification pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    let classifier = await PipelineSingleton.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });
    
    // Actually perform the classification
    let output = await classifier(event.data.t);

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output,
        index: i
    });
});