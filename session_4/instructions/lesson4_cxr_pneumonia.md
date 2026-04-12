---
layout: page
title: "Lesson 4: Clinical Vision — Chest X-Ray Pneumonia Detection"
permalink: /session-04/lesson-4-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-04/">&#8249; Back to Session 4</a>

# CCI Session 4 -- Lesson 4: Clinical Vision -- Chest X-Ray Pneumonia Detection

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

**Interactive (optional):** [BLEU & ROUGE interactive explainer]({{ site.baseurl }}/session_4/practices/bleu_rouge_interactive_explainer.html) — open in a new tab to see how overlap-based scores compare a generated sentence to a reference (same family of ideas as ROUGE in Lesson 3, in a hands-on UI).

---

## Instructor Introduction

Everything we have done so far in this course has focused on text -- clinical notes, pathology reports, radiology findings. But AI is not limited to language. Chest X-rays are the most commonly performed imaging examination in any hospital, and at KHCC they are a routine part of cancer patient monitoring, pre-operative assessment, and treatment follow-up. Today you will build a pneumonia detector that takes a chest X-ray image as input and classifies it as normal or pneumonia. You will see the same transfer learning principle from the last lesson -- but applied to images instead of text. You will also learn why evaluation metrics matter even more in clinical imaging, because the cost of a missed pneumonia (a false negative) is very different from the cost of a false alarm (a false positive).

---

## NotebookLM Summary

Computer vision for clinical AI follows the same transfer learning paradigm as clinical NLP but operates on images instead of text. Instead of tokenizing words, you preprocess images by resizing them to a standard dimension, normalizing pixel values to a consistent scale, and optionally applying data augmentation techniques such as random horizontal flips, slight rotations, or brightness adjustments that help the model generalize rather than memorize specific training images. The core idea remains identical: take a model that has already learned rich visual representations from a large dataset and adapt it to your specific clinical task.

The base architecture for this lesson is MobileNet, a lightweight and efficient convolutional neural network originally trained on ImageNet -- a massive dataset of over one million everyday photographs spanning a thousand categories like dogs, cars, and furniture. MobileNet was designed for deployment on mobile devices and edge hardware, which makes it an excellent choice for clinical settings where you may not have access to expensive GPU servers. Despite its small size, it learns powerful low-level visual features during ImageNet pre-training: edge detection, texture recognition, shape identification, and spatial pattern analysis. These fundamental visual capabilities transfer remarkably well to medical imaging tasks.

The dataset for this exercise is the Kaggle Chest X-Ray Pneumonia dataset, which contains 5,863 chest X-ray images organized into two categories: NORMAL and PNEUMONIA. The images come from pediatric patients at Guangzhou Women and Children's Medical Center. The dataset is pre-split into training, validation, and test sets, though the validation set is notably small, which is something to be aware of during evaluation. Loading the images involves reading them from disk, resizing to the input dimensions expected by MobileNet (typically 224 by 224 pixels), and normalizing the pixel values.

When you first test the base MobileNet model -- trained only on ImageNet -- on chest X-ray images, it performs poorly. This is expected and instructive: a model trained to recognize cats and cars has never seen a chest X-ray and has no concept of lung opacities or consolidation patterns. Fine-tuning addresses this gap through a two-step process. First, you replace the original classification head (which outputs probabilities for 1,000 ImageNet categories) with a new classification head that outputs probabilities for just two classes: normal and pneumonia. Second, you freeze the early layers of the network -- the ones that detect basic edges and textures, which are universally useful -- and only train the later layers and the new classification head. This approach requires far less data and compute than training an entire network from scratch, and it preserves the valuable low-level features the model learned from ImageNet.

Evaluation in clinical imaging demands careful attention to the right metrics. Accuracy alone can be misleading, especially with imbalanced datasets where pneumonia cases outnumber normal cases. Precision tells you what fraction of the images the model flagged as pneumonia actually are pneumonia -- a low precision means many false alarms. Recall (also called sensitivity) tells you what fraction of actual pneumonia cases the model successfully detected -- a low recall means missed diagnoses. For a screening application at KHCC, where the goal is to flag suspicious X-rays for radiologist review, recall is typically more important than precision. A false positive simply means an extra review by a radiologist, while a false negative means a pneumonia case goes undetected. The confusion matrix provides a complete picture by showing the counts of true positives, true negatives, false positives, and false negatives, making it easy to see exactly where the model succeeds and where it fails. Comparing the base model's confusion matrix to the fine-tuned model's confusion matrix demonstrates the concrete impact of transfer learning on a clinically meaningful task.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** A brief overview of transfer learning in deep learning -- the HuggingFace conceptual guide is accessible: <https://huggingface.co/docs/transformers/training>
- **Skim:** The Kaggle Chest X-Ray Pneumonia dataset description to understand what the images look like and how they are organized: <https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia>
- **Warm-up question:** At KHCC, a thoracic oncologist orders a chest X-ray for a lung cancer patient to check for post-treatment pneumonia. If an AI screening tool misclassifies this X-ray as "normal" when pneumonia is present, what is the clinical consequence? Would you rather the tool err on the side of too many false positives or too many false negatives?

### During Class -- What to Focus On

1. **Transfer learning for images** -- understand the analogy to text fine-tuning from Lesson 3. The concept is identical: pre-trained general knowledge plus task-specific adaptation.
2. **Image preprocessing** -- know what resizing, normalization, and augmentation do and why each step is necessary.
3. **Freezing layers** -- understand why you freeze early layers (they detect universal visual features like edges) and only train later layers (which learn task-specific patterns like lung opacities).
4. **Evaluation metrics and clinical context** -- this is the most important takeaway. Know the difference between precision and recall, and understand why recall matters more for clinical screening tools.

**Common traps:**

- Reporting only accuracy without checking the confusion matrix. A model that predicts "pneumonia" for every image would have high accuracy on this imbalanced dataset but would be clinically useless.
- Forgetting to set the Colab runtime to GPU (Runtime > Change runtime type > T4 GPU), which causes training to run orders of magnitude slower on CPU.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Load the Chest X-Ray Pneumonia dataset and visualize a few sample images from each class (normal and pneumonia).
2. Load a pre-trained MobileNet model and test it on chest X-ray images without any fine-tuning. Record the accuracy and note that it performs near chance level.
3. Replace the classification head with a new two-class output layer and freeze all layers except the last few.
4. Fine-tune the model for 5 epochs on the training set, monitoring the training and validation loss.
5. Evaluate the fine-tuned model on the test set, generating a confusion matrix and calculating accuracy, precision, and recall. Compare all metrics to the base model.

**Extra practice (optional):**

- Experiment with unfreezing more layers -- instead of only the last block, unfreeze the last two blocks and retrain. Does this improve or hurt performance? Why might unfreezing too many layers be risky with a small dataset?
- Add data augmentation (random flips, rotations, brightness changes) to the training pipeline and observe whether it improves the model's generalization on the test set.

**Self-check questions:**

1. Why does a MobileNet model trained on ImageNet perform poorly on chest X-rays, even though both involve image classification?
2. Explain the difference between precision and recall in the context of pneumonia detection. Which metric should KHCC prioritize for a screening tool, and why?
3. What does it mean to "freeze" a layer in a neural network, and why is this strategy useful when fine-tuning on a small medical imaging dataset?

### Resources

| Resource | Link |
|----------|------|
| Kaggle Chest X-Ray Pneumonia Dataset | <https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia> |
| HuggingFace Image Classification Guide | <https://huggingface.co/docs/transformers/tasks/image_classification> |
| Transfer Learning -- CS231n Stanford Notes | <https://cs231n.github.io/transfer-learning/> |
| MobileNet Paper (Howard et al., 2017) | <https://arxiv.org/abs/1704.04861> |
| Scikit-learn Confusion Matrix Documentation | <https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html> |
| Google Colab GPU Runtime Setup | <https://colab.research.google.com/> |
