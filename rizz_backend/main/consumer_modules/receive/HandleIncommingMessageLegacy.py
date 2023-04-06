from . import Misc
from transformers import AutoTokenizer, pipeline, AutoModelForSeq2SeqLM, AutoModelForCausalLM, DataCollatorForSeq2Seq, Seq2SeqTrainer, Seq2SeqTrainingArguments
from huggingface_hub import HfFolder
from datasets import load_dataset, concatenate_datasets, Dataset
from random import randrange
from channels.layers import get_channel_layer
import torch
import json
import ast
import evaluate
import nltk
import numpy as np
import pandas as pd
from nltk.tokenize import sent_tokenize
nltk.download("punkt")

FILE_NAME = 'Receive'
DEBUG = True
FUNCTION_NAME = 'HANDLE INDIVIDUAL MESSAGE'
# Metric
metric = evaluate.load("rouge")
max_source_length = 0
max_target_length = 0
model_id="google/flan-t5-small"
model = AutoModelForSeq2SeqLM.from_pretrained(model_id)
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")

def run(self, data):
    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'STARTED', DEBUG)
    print(torch.cuda.is_available())
    # processedDataset = load_and_prepare_dataset("samsum")
    # fine_tune("google/flan-t5-base","samsum", processedDataset)
    run_model()
    # most_recent_message = data['message']
    # inputs = tokenizer(most_recent_message, return_tensors="pt")
    # outputs = model.generate(**inputs)
    # return_message = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
    # print(return_message)
    self.send(text_data=  "return_message")
    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'FINISHED', DEBUG)

def run_model():
    # pipe = pipeline("text-classification")
    # pipe.save_pretrained("rizz_backend/flan-t5-base-samsum")
    summarizer = pipeline("summarization", model="rizz_backend/flan-t5-base-samsum", device=0)
    # select a random test sample
    dataset = load_dataset("samsum")
    sample = dataset['test'][randrange(len(dataset["test"]))]
    print(f"dialogue: \n{sample['dialogue']}\n---------------")

    # summarize dialogue
    res = summarizer(sample["dialogue"])

    print(f"flan-t5-base summary:\n{res[0]['summary_text']}")

def  load_and_prepare_dataset(dataset_id):
    global max_source_length
    global max_target_length
    # Load dataset from the hub
    dataset = load_dataset(dataset_id)
    print("TYPE")
    print(dataset)
    print(f"Train dataset size: {len(dataset['train'])}")
    print(f"Test dataset size: {len(dataset['test'])}")
    # The maximum total input sequence length after tokenization.
    # Sequences longer than this will be truncated, sequences shorter will be padded.
    tokenized_inputs = concatenate_datasets([dataset["train"], dataset["test"]]).map(lambda x: tokenizer(x["dialogue"], truncation=True), batched=True, remove_columns=["dialogue", "summary"])
    max_source_length = max([len(x) for x in tokenized_inputs["input_ids"]])
    print(f"Max source length: {max_source_length}")

    # The maximum total sequence length for target text after tokenization.
    # Sequences longer than this will be truncated, sequences shorter will be padded."
    tokenized_targets = concatenate_datasets([dataset["train"], dataset["test"]]).map(lambda x: tokenizer(x["summary"], truncation=True), batched=True, remove_columns=["dialogue", "summary"])
    max_target_length = max([len(x) for x in tokenized_targets["input_ids"]])
    print(f"Max target length: {max_target_length}")
    tokenized_dataset = dataset.map(preprocess_function, batched=True, remove_columns=["dialogue", "summary", "id"])
    print(f"Keys of tokenized dataset: {list(tokenized_dataset['train'].features)}")
    return tokenized_dataset

def fine_tune(model_id, dataset_id, tokenized_dataset):
    print("TYPE")
    print(tokenized_dataset)
    tokenized_dataset_panda_train = pd.DataFrame(tokenized_dataset["train"])
    tokenized_dataset_panda_test = pd.DataFrame(tokenized_dataset["test"])
    tokenized_dataset_train = Dataset.from_pandas(tokenized_dataset_panda_train.iloc[:20])
    tokenized_dataset_test = Dataset.from_pandas(tokenized_dataset_panda_test.iloc[:10])
    print(tokenized_dataset_train)
    print(tokenized_dataset_test)
    # we want to ignore tokenizer pad token in the loss
    label_pad_token_id = -100
    # Data collator
    data_collator = DataCollatorForSeq2Seq(
        tokenizer,
        model=model,
        label_pad_token_id=label_pad_token_id,
        pad_to_multiple_of=8
    )
    # Hugging Face repository id
    repository_id = f"{model_id.split('/')[1]}-{dataset_id}"

    # Define training args
    training_args = Seq2SeqTrainingArguments(
        output_dir=repository_id,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        predict_with_generate=True,
        fp16=False, # Overflows with fp16
        learning_rate=5e-5,
        num_train_epochs=5,
        # logging & evaluation strategies
        logging_dir=f"{repository_id}/logs",
        logging_strategy="steps",
        logging_steps=500,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        save_total_limit=2,
        load_best_model_at_end=True,
        # metric_for_best_model="overall_f1",
        # push to hub parameters
        report_to="tensorboard",
        push_to_hub=False,
        hub_strategy="every_save",
        hub_model_id=repository_id,
        hub_token=HfFolder.get_token(),
    )

    # Create Trainer instance
    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset_train,
        eval_dataset=tokenized_dataset_test,
        compute_metrics=compute_metrics,
    )
    # Start training
    trainer.train()
    trainer.evaluate()
    # Save our tokenizer and create model card
    tokenizer.save_pretrained(repository_id)

def preprocess_function(sample,padding="max_length"):
    global max_source_length
    global max_target_length
    # add prefix to the input for t5
    inputs = ["summarize: " + item for item in sample["dialogue"]]

    # tokenize inputs
    model_inputs = tokenizer(inputs, max_length=max_source_length, padding=padding, truncation=True)

    # Tokenize targets with the `text_target` keyword argument
    labels = tokenizer(text_target=sample["summary"], max_length=max_target_length, padding=padding, truncation=True)

    # If we are padding here, replace all tokenizer.pad_token_id in the labels by -100 when we want to ignore
    # padding in the loss.
    if padding == "max_length":
        labels["input_ids"] = [
            [(l if l != tokenizer.pad_token_id else -100) for l in label] for label in labels["input_ids"]
        ]

    model_inputs["labels"] = labels["input_ids"]
    return model_inputs


# helper function to postprocess text
def postprocess_text(preds, labels):
    preds = [pred.strip() for pred in preds]
    labels = [label.strip() for label in labels]

    # rougeLSum expects newline after each sentence
    preds = ["\n".join(sent_tokenize(pred)) for pred in preds]
    labels = ["\n".join(sent_tokenize(label)) for label in labels]

    return preds, labels

def compute_metrics(eval_preds):
    preds, labels = eval_preds
    if isinstance(preds, tuple):
        preds = preds[0]
    decoded_preds = tokenizer.batch_decode(preds, skip_special_tokens=True)
    # Replace -100 in the labels as we can't decode them.
    labels = np.where(labels != -100, labels, tokenizer.pad_token_id)
    decoded_labels = tokenizer.batch_decode(labels, skip_special_tokens=True)

    # Some simple post-processing
    decoded_preds, decoded_labels = postprocess_text(decoded_preds, decoded_labels)

    result = metric.compute(predictions=decoded_preds, references=decoded_labels, use_stemmer=True)
    result = {k: round(v * 100, 4) for k, v in result.items()}
    prediction_lens = [np.count_nonzero(pred != tokenizer.pad_token_id) for pred in preds]
    result["gen_len"] = np.mean(prediction_lens)
    return result

# tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-large")
# model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-large")
# x = "empty"
# def run(self, data):
#     global x 
#     most_recent_message = data['message']

#     # Create a new user input
#     new_user_input_ids = tokenizer.encode(most_recent_message + tokenizer.eos_token, return_tensors='pt')

#     # append the new user input tokens to the chat history

#     if x == "empty":
#         # append the new user input tokens to the chat history
#         bot_input_ids = new_user_input_ids
#     else:
#         bot_input_ids = new_user_input_ids
#         # bot_input_ids = torch.cat([x, new_user_input_ids], dim=-1)

#     # generated a response while limiting the total chat history to 1000 tokens, 
#     chat_history_ids = model.generate(bot_input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)
#     x = chat_history_ids

#     # pretty print last ouput tokens from bot
#     respnseMessage = format(tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True))
#     print(most_recent_message)
#     print(respnseMessage)
#     self.send(text_data=  respnseMessage)

#     Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'FINISHED', DEBUG)

