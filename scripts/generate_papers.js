import { writeFileSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// REAL TITLES scraped from reference website per domain
// Each array = [title, [keywords...]]
// ============================================================
const realPapers = [
  // ---- Deep Learning ----
  ["AlphaFold: Protein Structure Prediction with Deep Learning", ["Deep Learning", "Machine Learning", "AI", "Bioinformatics"]],
  ["Attention Mechanisms in Deep Learning: A Survey", ["Deep Learning", "Transformers", "Machine Learning", "Attention"]],
  ["Deep Metric Learning: A Survey", ["Deep Learning", "Computer Vision", "Machine Learning", "AI"]],
  ["A Survey on Contrastive Self-Supervised Learning", ["Deep Learning", "Computer Vision", "Self-Supervised", "Machine Learning"]],
  ["ShuffleNet: An Extremely Efficient CNN for Mobile Devices", ["Deep Learning", "Computer Vision", "Efficient AI", "Mobile"]],
  ["Whisper: Robust Speech Recognition via Large-Scale Weak Supervision", ["Deep Learning", "NLP", "Speech", "Machine Learning"]],
  ["Convolutional Neural Networks for Text Classification", ["Deep Learning", "NLP", "Text Classification", "Machine Learning"]],
  ["Deep Learning for Autonomous Driving: A Survey", ["Deep Learning", "Computer Vision", "AI", "Autonomous Driving"]],
  ["Xception: Deep Learning with Depthwise Separable Convolutions", ["Deep Learning", "Computer Vision", "CNN", "Machine Learning"]],
  ["Gradient Descent Converges to Minimizers", ["Deep Learning", "Optimization", "Machine Learning", "AI"]],
  ["EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks", ["Deep Learning", "Computer Vision", "Efficient AI", "CNN"]],
  ["Ensemble Methods for Machine Learning: A Review", ["Deep Learning", "Machine Learning", "AI", "Ensemble"]],
  ["Anomaly Detection with Machine Learning: A Survey", ["Deep Learning", "Machine Learning", "AI", "Anomaly Detection"]],
  ["DenseNet: Densely Connected Convolutional Networks", ["Deep Learning", "Computer Vision", "CNN", "Machine Learning"]],
  ["Cross-Modal Learning: A Survey on Visual-Textual Representations", ["Deep Learning", "Computer Vision", "NLP", "Multimodal AI"]],
  ["Deep Residual Learning for Image Recognition", ["Deep Learning", "Computer Vision", "ResNet", "Machine Learning"]],
  ["GCN: Semi-Supervised Classification with Graph Convolutional Networks", ["Deep Learning", "Graph Neural Networks", "Machine Learning", "AI"]],
  ["Graph Attention Networks", ["Deep Learning", "Graph Neural Networks", "AI", "Attention"]],
  ["Long Short-Term Memory Networks", ["Deep Learning", "NLP", "Time Series", "Machine Learning"]],
  ["Sequence to Sequence Learning with Neural Networks", ["Deep Learning", "NLP", "Machine Translation", "Machine Learning"]],
  ["SimCLR: A Simple Framework for Contrastive Learning of Visual Representations", ["Deep Learning", "Computer Vision", "Self-Supervised", "Machine Learning"]],
  ["Masked Autoencoders Are Scalable Vision Learners", ["Deep Learning", "Computer Vision", "Self-Supervised", "Machine Learning"]],
  ["XGBoost: A Scalable Tree Boosting System", ["Deep Learning", "Machine Learning", "AI", "Boosting"]],
  ["LightGBM: A Highly Efficient Gradient Boosting Decision Tree", ["Deep Learning", "Machine Learning", "AI", "Boosting"]],
  ["MAML: Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks", ["Deep Learning", "Meta-Learning", "Few-Shot Learning", "AI"]],
  ["Knowledge Distillation: Distilling the Knowledge in a Neural Network", ["Deep Learning", "Model Compression", "AI", "Machine Learning"]],
  ["Neural Architecture Search: A Survey", ["Deep Learning", "AutoML", "AI", "Machine Learning"]],
  ["Batch Normalization: Accelerating Deep Network Training", ["Deep Learning", "Optimization", "Machine Learning", "AI"]],
  ["Dropout: A Simple Way to Prevent Neural Networks from Overfitting", ["Deep Learning", "Regularization", "Machine Learning", "AI"]],
  ["Adam: A Method for Stochastic Optimization", ["Deep Learning", "Optimization", "Machine Learning", "AI"]],
  ["Deep Learning on Graphs: A Survey", ["Deep Learning", "Graph Neural Networks", "AI", "Machine Learning"]],
  ["Multi-Task Learning as Multi-Objective Optimization", ["Deep Learning", "Machine Learning", "Optimization", "AI"]],
  ["Scaling Laws for Neural Language Models", ["Deep Learning", "NLP", "Large Language Models", "AI"]],
  ["Neural ODE: Neural Ordinary Differential Equations", ["Deep Learning", "Machine Learning", "AI", "Physics"]],
  ["WaveNet: A Generative Model for Raw Audio", ["Deep Learning", "Generative AI", "Audio", "Machine Learning"]],
  ["AlphaFold2: Highly Accurate Protein Structure Prediction with AlphaFold", ["Deep Learning", "Bioinformatics", "Transformers", "AI"]],
  ["MobileNet: Efficient Convolutional Neural Networks for Mobile Vision Applications", ["Deep Learning", "Computer Vision", "Mobile AI", "Machine Learning"]],
  ["ConvNeXt: A ConvNet for the 2020s", ["Deep Learning", "Computer Vision", "CNN", "Machine Learning"]],
  ["DINO: Self-Supervised Vision Transformers", ["Deep Learning", "Computer Vision", "Self-Supervised", "Transformers"]],

  // ---- NLP ----
  ["Deep Learning for Natural Language Processing: A Review", ["NLP", "Deep Learning", "Machine Learning", "Language Models"]],
  ["RoBERTa: A Robustly Optimized BERT Pretraining Approach", ["NLP", "Transformers", "BERT", "Language Models"]],
  ["BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", ["NLP", "Transformers", "Language Models", "Machine Learning"]],
  ["Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks", ["NLP", "Transformers", "Semantic Similarity", "Machine Learning"]],
  ["T5: Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer", ["NLP", "Transformers", "Transfer Learning", "Machine Learning"]],
  ["Transfer Learning in Natural Language Processing", ["NLP", "Transformers", "Machine Learning", "Deep Learning"]],
  ["Mistral 7B: Efficient Open-Source Language Model", ["NLP", "Transformers", "Large Language Models", "Generative AI"]],
  ["Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", ["NLP", "Generative AI", "Information Retrieval", "Machine Learning"]],
  ["Transformer-XL: Attentive Language Models Beyond a Fixed-Length Context", ["NLP", "Transformers", "Language Models", "Machine Learning"]],
  ["Prompt Engineering for Large Language Models: A Survey", ["NLP", "Large Language Models", "Generative AI", "AI"]],
  ["Efficient Estimation of Word Representations in Vector Space (Word2Vec)", ["NLP", "Word Embeddings", "Machine Learning", "AI"]],
  ["GloVe: Global Vectors for Word Representation", ["NLP", "Word Embeddings", "Machine Learning", "AI"]],
  ["BART: Denoising Sequence-to-Sequence Pre-training for Natural Language", ["NLP", "Transformers", "Text Generation", "Machine Learning"]],
  ["XLNet: Generalized Autoregressive Pretraining for Language Understanding", ["NLP", "Transformers", "Language Models", "Machine Learning"]],
  ["SciBERT: A Pretrained Language Model for Scientific Text", ["NLP", "Transformers", "Scientific AI", "Machine Learning"]],
  ["GPT-2: Language Models are Unsupervised Multitask Learners", ["NLP", "Generative AI", "Language Models", "Transformers"]],
  ["GPT-3: Language Models are Few-Shot Learners", ["NLP", "Generative AI", "Large Language Models", "Transformers"]],
  ["GPT-4 Technical Report", ["NLP", "Generative AI", "Large Language Models", "Transformers"]],
  ["InstructGPT: Training Language Models to Follow Instructions with Human Feedback", ["NLP", "Reinforcement Learning", "AI Alignment", "Generative AI"]],
  ["LLaMA: Open and Efficient Foundation Language Models", ["NLP", "Large Language Models", "Transformers", "AI"]],
  ["LLaMA 2: Open Foundation and Fine-Tuned Chat Models", ["NLP", "Large Language Models", "Transformers", "Generative AI"]],
  ["DistilBERT: A Distilled Version of BERT", ["NLP", "Transformers", "Model Compression", "Machine Learning"]],
  ["LoRA: Low-Rank Adaptation of Large Language Models", ["NLP", "Transformers", "Parameter-Efficient Fine-Tuning", "Machine Learning"]],
  ["Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", ["NLP", "Explainable AI", "Reasoning", "Transformers"]],
  ["Mamba: Linear-Time Sequence Modeling with Selective State Spaces", ["NLP", "Deep Learning", "Efficient AI", "Machine Learning"]],
  ["Toolformer: Language Models Can Teach Themselves to Use Tools", ["NLP", "Transformers", "Agentic AI", "Machine Learning"]],
  ["DPR: Dense Passage Retrieval for Open-Domain Question Answering", ["NLP", "Information Retrieval", "Question Answering", "Machine Learning"]],
  ["Flamingo: A Visual Language Model for Few-Shot Learning", ["NLP", "Computer Vision", "Multimodal AI", "Machine Learning"]],
  ["PaLM: Scaling Language Modeling with Pathways", ["NLP", "Large Language Models", "Transformers", "AI"]],
  ["Mixture of Experts Language Modeling with Mixtral", ["NLP", "Transformers", "Large Language Models", "AI"]],
  ["Natural Language Processing with Transformers: A Survey", ["NLP", "Transformers", "Machine Learning", "Deep Learning"]],
  ["FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness", ["NLP", "Transformers", "Efficient AI", "Machine Learning"]],
  ["Named Entity Recognition with BERT", ["NLP", "Machine Learning", "Information Extraction", "Transformers"]],
  ["Text Summarization with Pretrained Encoders", ["NLP", "Deep Learning", "Sequence to Sequence", "Machine Learning"]],
  ["Machine Translation with Neural Networks: A Survey", ["NLP", "Machine Translation", "Deep Learning", "AI"]],
  ["Sentiment Analysis using Deep Learning", ["NLP", "Deep Learning", "Text Classification", "Machine Learning"]],
  ["Question Answering with Long Short-Term Memory", ["NLP", "Deep Learning", "Machine Learning", "Reading Comprehension"]],

  // ---- Computer Vision ----
  ["Temporal Convolutional Networks for Action Segmentation and Detection", ["Computer Vision", "Deep Learning", "Video Understanding", "Machine Learning"]],
  ["Object Detection in 20 Years: A Survey", ["Computer Vision", "Deep Learning", "Object Detection", "Machine Learning"]],
  ["Deep Learning for Medical Image Analysis: A Survey", ["Computer Vision", "Deep Learning", "Medical AI", "Machine Learning"]],
  ["Pixel-wise Prediction with CNNs for Scene Understanding", ["Computer Vision", "Deep Learning", "Semantic Segmentation", "Machine Learning"]],
  ["PointNet: Deep Learning on Point Sets for 3D Classification", ["Computer Vision", "Deep Learning", "3D Vision", "Machine Learning"]],
  ["YOLO: You Only Look Once – Real-Time Object Detection", ["Computer Vision", "Deep Learning", "Object Detection", "Machine Learning"]],
  ["NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis", ["Computer Vision", "Deep Learning", "3D Vision", "Generative AI"]],
  ["Swin Transformer: Hierarchical Vision Transformer using Shifted Windows", ["Computer Vision", "Transformers", "Deep Learning", "Machine Learning"]],
  ["CLIP: Learning Transferable Visual Models From Natural Language Supervision", ["Computer Vision", "NLP", "Multimodal AI", "Machine Learning"]],
  ["Feature Pyramid Networks for Object Detection", ["Computer Vision", "Deep Learning", "Object Detection", "Machine Learning"]],
  ["Mask R-CNN for Instance Segmentation", ["Computer Vision", "Deep Learning", "Image Segmentation", "Machine Learning"]],
  ["An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale", ["Computer Vision", "Transformers", "Image Classification", "Machine Learning"]],
  ["Image Style Transfer Using Convolutional Neural Networks", ["Computer Vision", "Deep Learning", "Generative AI", "Machine Learning"]],
  ["ImageNet Classification with Deep Convolutional Neural Networks", ["Computer Vision", "Deep Learning", "Image Classification", "Machine Learning"]],
  ["Semantic Segmentation Using Fully Convolutional Networks", ["Computer Vision", "Deep Learning", "Image Segmentation", "Machine Learning"]],
  ["Vision-Language Models: A Survey", ["Computer Vision", "NLP", "Multimodal AI", "Machine Learning"]],
  ["YOLOv4: Optimal Speed and Accuracy of Object Detection", ["Computer Vision", "Deep Learning", "Object Detection", "AI"]],
  ["Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks", ["Computer Vision", "Deep Learning", "Object Detection", "Machine Learning"]],
  ["Grad-CAM: Visual Explanations from Deep Networks via Gradient-based Localization", ["Computer Vision", "Explainable AI", "Deep Learning", "Machine Learning"]],
  ["DeepLab: Semantic Image Segmentation with Deep CNNs", ["Computer Vision", "Deep Learning", "Image Segmentation", "Machine Learning"]],
  ["SAM: Segment Anything Model", ["Computer Vision", "Deep Learning", "Image Segmentation", "Foundation Models"]],
  ["EfficientNet: Rethinking Model Scaling for CNNs", ["Computer Vision", "Deep Learning", "Efficient AI", "Machine Learning"]],
  ["U-Net: Convolutional Networks for Biomedical Image Segmentation", ["Computer Vision", "Deep Learning", "Medical AI", "Machine Learning"]],
  ["Stereo Matching by Training a CNN to Compare Image Patches", ["Computer Vision", "Deep Learning", "3D Vision", "Machine Learning"]],
  ["Face Recognition Using Deep Neural Networks: A Survey", ["Computer Vision", "Deep Learning", "Biometrics", "Machine Learning"]],
  ["Video Object Segmentation with Long Short-Term Memory", ["Computer Vision", "Deep Learning", "Video Understanding", "Machine Learning"]],
  ["Zero-Shot Learning in Computer Vision: A Survey", ["Computer Vision", "Machine Learning", "Transfer Learning", "AI"]],
  ["Human Pose Estimation with Deep Learning", ["Computer Vision", "Deep Learning", "Human Analysis", "Machine Learning"]],
  ["Optical Flow Estimation with Convolutional Networks", ["Computer Vision", "Deep Learning", "Video Analysis", "Machine Learning"]],
  ["3D Object Detection Using Point Clouds and LiDAR", ["Computer Vision", "Deep Learning", "3D Vision", "Autonomous Driving"]],

  // ---- Reinforcement Learning ----
  ["Reinforcement Learning: An Introduction", ["Reinforcement Learning", "Machine Learning", "AI", "Control Theory"]],
  ["Decision Transformer: Reinforcement Learning via Sequence Modeling", ["Reinforcement Learning", "Transformers", "Deep Learning", "Machine Learning"]],
  ["Hindsight Experience Replay for Goal-Conditioned RL", ["Reinforcement Learning", "Deep Learning", "Robotics", "Machine Learning"]],
  ["Reward Shaping in Reinforcement Learning: A Survey", ["Reinforcement Learning", "Machine Learning", "AI", "Control Theory"]],
  ["Deep Q-Networks for Continuous Control", ["Reinforcement Learning", "Deep Learning", "Machine Learning", "Control Theory"]],
  ["World Models: Learning a Model of the Environment", ["Reinforcement Learning", "Generative AI", "Deep Learning", "Machine Learning"]],
  ["Deep Reinforcement Learning with Double Q-learning", ["Reinforcement Learning", "Deep Learning", "Machine Learning", "AI"]],
  ["Asynchronous Methods for Deep Reinforcement Learning", ["Reinforcement Learning", "Deep Learning", "Machine Learning", "AI"]],
  ["Monte Carlo Tree Search: A Review of Recent Modifications", ["Reinforcement Learning", "Machine Learning", "AI", "Planning"]],
  ["Playing Atari with Deep Reinforcement Learning", ["Reinforcement Learning", "Deep Learning", "Machine Learning", "AI"]],
  ["Proximal Policy Optimization Algorithms", ["Reinforcement Learning", "Deep Learning", "Machine Learning", "AI"]],
  ["Multi-Agent Reinforcement Learning: A Selective Overview", ["Reinforcement Learning", "Machine Learning", "Multi-Agent Systems", "AI"]],
  ["AlphaGo: Mastering the Game of Go with Deep Neural Networks", ["Reinforcement Learning", "Deep Learning", "AI", "Game Playing"]],
  ["Trust Region Policy Optimization (TRPO)", ["Reinforcement Learning", "Machine Learning", "AI", "Optimization"]],
  ["SAC: Soft Actor-Critic for Off-Policy Reinforcement Learning", ["Reinforcement Learning", "Deep Learning", "Machine Learning", "Control"]],
  ["TD3: Addressing Function Approximation Error in Actor-Critic Methods", ["Reinforcement Learning", "Deep Learning", "Machine Learning", "AI"]],
  ["Model-Based Reinforcement Learning: A Survey", ["Reinforcement Learning", "Machine Learning", "AI", "Planning"]],
  ["Curiosity-Driven Exploration by Self-Supervised Prediction", ["Reinforcement Learning", "Deep Learning", "Machine Learning", "Exploration"]],
  ["RLHF: Learning to Summarize with Human Feedback", ["Reinforcement Learning", "NLP", "AI Alignment", "Machine Learning"]],
  ["DPO: Direct Preference Optimization", ["Reinforcement Learning", "NLP", "AI Alignment", "Machine Learning"]],
  ["Offline Reinforcement Learning: Tutorial and Review", ["Reinforcement Learning", "Machine Learning", "AI", "Data-Driven"]],
  ["R2D2: Recurrent Experience Replay in Distributed RL", ["Reinforcement Learning", "Deep Learning", "Machine Learning", "AI"]],
  ["IMPALA: Scalable Distributed Deep-RL", ["Reinforcement Learning", "Deep Learning", "Machine Learning", "Distributed Systems"]],
  ["Safe Reinforcement Learning: A Survey", ["Reinforcement Learning", "AI Safety", "Machine Learning", "Control"]],
  ["Hierarchical Reinforcement Learning: A Survey", ["Reinforcement Learning", "Machine Learning", "AI", "Planning"]],

  // ---- Generative AI ----
  ["GPT-4 Technical Report", ["Generative AI", "NLP", "Large Language Models", "Transformers"]],
  ["Generative Adversarial Networks (GANs)", ["Generative AI", "Deep Learning", "Image Synthesis", "Machine Learning"]],
  ["Stable Diffusion: High-Resolution Image Synthesis with Latent Diffusion Models", ["Generative AI", "Computer Vision", "Image Synthesis", "Deep Learning"]],
  ["DALL-E 2: Hierarchical Text-Conditional Image Generation with CLIP Latents", ["Generative AI", "Computer Vision", "Text-to-Image", "Machine Learning"]],
  ["StyleGAN: A Style-Based Generator Architecture for GANs", ["Generative AI", "Computer Vision", "Image Synthesis", "Deep Learning"]],
  ["Variational Autoencoders (VAE)", ["Generative AI", "Deep Learning", "Latent Space", "Machine Learning"]],
  ["DreamBooth: Fine Tuning Text-to-Image Diffusion Models for Subject-Driven Generation", ["Generative AI", "Computer Vision", "Text-to-Image", "Machine Learning"]],
  ["CycleGAN: Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks", ["Generative AI", "Computer Vision", "Image-to-Image Translation", "Machine Learning"]],
  ["Pix2Pix: Image-to-Image Translation with Conditional Adversarial Networks", ["Generative AI", "Computer Vision", "Image Synthesis", "Machine Learning"]],
  ["Wasserstein GAN: Improved Training of Wasserstein GANs", ["Generative AI", "Deep Learning", "Image Synthesis", "Machine Learning"]],
  ["DDPM: Denoising Diffusion Probabilistic Models", ["Generative AI", "Deep Learning", "Image Synthesis", "Machine Learning"]],
  ["Score-Based Generative Modeling through Stochastic Differential Equations", ["Generative AI", "Deep Learning", "Machine Learning", "Diffusion Models"]],
  ["ControlNet: Adding Conditional Control to Text-to-Image Diffusion Models", ["Generative AI", "Computer Vision", "Text-to-Image", "Machine Learning"]],
  ["Imagen: Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding", ["Generative AI", "Computer Vision", "Text-to-Image", "NLP"]],
  ["Make-A-Video: Text-to-Video Generation without Text-Video Data", ["Generative AI", "Computer Vision", "Video Synthesis", "Machine Learning"]],
  ["AudioLM: A Language Modeling Approach to Audio Generation", ["Generative AI", "NLP", "Audio Generation", "Machine Learning"]],
  ["MusicLM: Generating Music From Text", ["Generative AI", "Audio Generation", "Machine Learning", "NLP"]],
  ["MidJourney: An Overview of Prompt-Based Image Generation", ["Generative AI", "Computer Vision", "Text-to-Image", "AI"]],
  ["Consistency Models for Fast Text-to-Image Generation", ["Generative AI", "Deep Learning", "Diffusion Models", "Machine Learning"]],
  ["Prompt-to-Prompt Image Editing with Cross Attention Control", ["Generative AI", "Computer Vision", "Text-to-Image", "Attention"]],
  ["Neural Text Generation: A Practical Guide", ["Generative AI", "NLP", "Language Models", "Machine Learning"]],
  ["CodeGen: A Conversational Paradigm for Program Synthesis", ["Generative AI", "NLP", "Code Generation", "Machine Learning"]],
  ["Copilot: AI Pair Programming with Large Language Models", ["Generative AI", "NLP", "Code Generation", "Machine Learning"]],

  // ---- Transformers ----
  ["Attention Is All You Need", ["Transformers", "NLP", "Deep Learning", "Machine Learning"]],
  ["Natural Language Processing with Transformers: A Survey", ["Transformers", "NLP", "Deep Learning", "Machine Learning"]],
  ["Transformer-XL: Attentive Language Models Beyond a Fixed-Length Context", ["Transformers", "NLP", "Language Models", "Machine Learning"]],
  ["An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale", ["Transformers", "Computer Vision", "Image Classification", "Machine Learning"]],
  ["BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", ["Transformers", "NLP", "Language Models", "Machine Learning"]],
  ["FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness", ["Transformers", "NLP", "Efficient AI", "Deep Learning"]],
  ["Whisper: Robust Speech Recognition via Large-Scale Weak Supervision", ["Transformers", "NLP", "Speech", "Deep Learning"]],
  ["Prompt Engineering for Large Language Models: A Survey", ["Transformers", "NLP", "Generative AI", "Machine Learning"]],
  ["Mistral 7B: Efficient Open-Source Language Model", ["Transformers", "NLP", "Large Language Models", "Generative AI"]],
  ["Swin Transformer: Hierarchical Vision Transformer using Shifted Windows", ["Transformers", "Computer Vision", "Image Recognition", "Deep Learning"]],
  ["DINO: Emerging Properties in Self-Supervised Vision Transformers", ["Transformers", "Computer Vision", "Self-Supervised", "Deep Learning"]],
  ["ViT: An Image is Worth 16x16 Words", ["Transformers", "Computer Vision", "Image Classification", "Machine Learning"]],
  ["DeiT: Training Data-Efficient Image Transformers and Distillation", ["Transformers", "Computer Vision", "Efficient AI", "Machine Learning"]],
  ["Longformer: The Long-Document Transformer", ["Transformers", "NLP", "Efficient AI", "Machine Learning"]],
  ["Linformer: Self-Attention with Linear Complexity", ["Transformers", "NLP", "Efficient AI", "Machine Learning"]],
  ["Performer: Rethinking Attention with Performers", ["Transformers", "NLP", "Efficient AI", "Machine Learning"]],
  ["BigBird: Transformers for Longer Sequences", ["Transformers", "NLP", "Long Context", "Machine Learning"]],
  ["Reformer: The Efficient Transformer", ["Transformers", "NLP", "Efficient AI", "Machine Learning"]],
  ["Switch Transformer: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity", ["Transformers", "NLP", "Large Language Models", "Efficient AI"]],
  ["Routing Transformers: Content-Based Sparse Attention", ["Transformers", "NLP", "Efficient AI", "Machine Learning"]],
  ["Cross-Attention in Encoder-Decoder Architectures for NLP", ["Transformers", "NLP", "Machine Translation", "Deep Learning"]],
  ["T5: Exploring the Limits of Transfer Learning with Transformers", ["Transformers", "NLP", "Transfer Learning", "Machine Learning"]],
  ["mBERT: Multilingual BERT and Cross-Lingual Language Models", ["Transformers", "NLP", "Multilingual AI", "Machine Learning"]],

  // ---- Recommendation Systems ----
  ["Deep Learning for Recommendation Systems: A Survey", ["Recommendation Systems", "Deep Learning", "Machine Learning", "AI"]],
  ["Neural Collaborative Filtering", ["Recommendation Systems", "Deep Learning", "Machine Learning", "AI"]],
  ["Wide & Deep Learning for Recommender Systems", ["Recommendation Systems", "Deep Learning", "Machine Learning", "AI"]],
  ["FAISS: A Library for Efficient Similarity Search and Clustering of Dense Vectors", ["Recommendation Systems", "Information Retrieval", "Machine Learning", "AI"]],
  ["DPR: Dense Passage Retrieval for Open-Domain Question Answering", ["Recommendation Systems", "NLP", "Information Retrieval", "Machine Learning"]],
  ["Retrieval-Augmented Generation for Knowledge-Intensive Tasks", ["Recommendation Systems", "NLP", "Generative AI", "Machine Learning"]],
  ["Session-Based Recommendation with Graph Neural Networks", ["Recommendation Systems", "Deep Learning", "Graph Neural Networks", "Machine Learning"]],
  ["Collaborative Filtering with Recurrent Neural Networks", ["Recommendation Systems", "Deep Learning", "Machine Learning", "AI"]],
  ["DeepFM: A Factorization-Machine Based Neural Network for CTR Prediction", ["Recommendation Systems", "Deep Learning", "Machine Learning", "AI"]],
  ["Click-Through Rate Prediction with Deep Learning", ["Recommendation Systems", "Machine Learning", "Deep Learning", "AI"]],
  ["AutoRec: Autoencoders Meet Collaborative Filtering", ["Recommendation Systems", "Deep Learning", "Machine Learning", "AI"]],
  ["BERT4Rec: Sequential Recommendation with BERT", ["Recommendation Systems", "Transformers", "Deep Learning", "Machine Learning"]],
  ["SASRec: Self-Attentive Sequential Recommendation", ["Recommendation Systems", "Transformers", "Deep Learning", "Machine Learning"]],
  ["Factorization Machines for Item Recommendation", ["Recommendation Systems", "Machine Learning", "AI", "Collaborative Filtering"]],
  ["Knowledge Graph-Enhanced Recommendation Systems", ["Recommendation Systems", "Deep Learning", "Knowledge Graphs", "Machine Learning"]],
  ["Cross-Platform Recommendation with Transfer Learning", ["Recommendation Systems", "Machine Learning", "Transfer Learning", "AI"]],
  ["Cold-Start Problem in Recommendation Systems: A Survey", ["Recommendation Systems", "Machine Learning", "AI", "Transfer Learning"]],
  ["Matrix Factorization Techniques for Recommender Systems", ["Recommendation Systems", "Machine Learning", "AI", "Collaborative Filtering"]],
  ["Graph Neural Networks for Social Recommendation", ["Recommendation Systems", "Deep Learning", "Graph Neural Networks", "Machine Learning"]],
  ["YouTube's Deep Neural Network Recommendation System", ["Recommendation Systems", "Deep Learning", "Machine Learning", "AI"]],
  ["EASE: Embarrassingly Shallow Autoencoders for Sparse Data", ["Recommendation Systems", "Machine Learning", "AI", "Collaborative Filtering"]],
  ["LightGCN: Simplifying and Powering Graph Convolution Network for Recommendation", ["Recommendation Systems", "Graph Neural Networks", "Deep Learning", "Machine Learning"]],

  // ---- Explainable AI ----
  ["Explainable Artificial Intelligence: A Survey", ["Explainable AI", "Machine Learning", "AI", "Interpretability"]],
  ["SHAP: SHapley Additive exPlanations for Model Interpretability", ["Explainable AI", "Machine Learning", "AI", "Feature Importance"]],
  ["TabNet: Attentive Interpretable Tabular Learning", ["Explainable AI", "Deep Learning", "Machine Learning", "Interpretability"]],
  ["LIME: Local Interpretable Model-Agnostic Explanations", ["Explainable AI", "Machine Learning", "AI", "Interpretability"]],
  ["Grad-CAM: Visual Explanations from Deep Networks", ["Explainable AI", "Computer Vision", "Deep Learning", "Machine Learning"]],
  ["Saliency Maps: Visualizing Deep Neural Networks", ["Explainable AI", "Computer Vision", "Deep Learning", "Machine Learning"]],
  ["Counterfactual Explanations for Machine Learning Models", ["Explainable AI", "Machine Learning", "AI", "Fairness"]],
  ["Fairness and Accountability in Machine Learning: A Survey", ["Explainable AI", "Machine Learning", "AI Ethics", "Fairness"]],
  ["Trustworthy AI: A Practical Perspective", ["Explainable AI", "Machine Learning", "AI Ethics", "AI Safety"]],
  ["Anchors: High Precision Model-Agnostic Explanations", ["Explainable AI", "Machine Learning", "AI", "Interpretability"]],
  ["Neural Network Interpretability: A Survey", ["Explainable AI", "Deep Learning", "Machine Learning", "AI"]],
  ["Integrated Gradients: Axiomatic Attribution for Deep Networks", ["Explainable AI", "Deep Learning", "Machine Learning", "Feature Importance"]],
  ["DeepLIFT: Learning Important Features Through Propagating Activation Differences", ["Explainable AI", "Deep Learning", "Machine Learning", "Feature Importance"]],
  ["Concept-Based Explanations for Neural Networks", ["Explainable AI", "Deep Learning", "Machine Learning", "AI"]],
  ["Model Cards for Model Reporting", ["Explainable AI", "AI Ethics", "Machine Learning", "Responsible AI"]],
  ["Algorithmic Recourse: Under-Constrained Algorithmic Counterfactuals", ["Explainable AI", "Machine Learning", "Fairness", "AI"]],
  ["Robustness of Explanations in XAI: A Survey", ["Explainable AI", "Machine Learning", "AI", "Robustness"]],
  ["Post-Hoc Interpretability for Neural NLP", ["Explainable AI", "NLP", "Deep Learning", "Machine Learning"]],
  ["Human-Centered Explainable AI: Towards a Reflective Sociotechnical Approach", ["Explainable AI", "AI Ethics", "Human-AI Interaction", "Machine Learning"]],
  ["XAI Methods for Time Series Data", ["Explainable AI", "Deep Learning", "Machine Learning", "Time Series"]],
];

// ===================================================
// Build paper objects from real titles
// ===================================================
const papers = realPapers.map(([title, keywords]) => {
  const domain = keywords[0]; // primary domain
  const short_abstract = `This paper presents "${title}" — a significant contribution to ${domain}. It proposes novel methodologies that advance the state of the art, with rigorous evaluation across standard benchmarks.`;
  const full_abstract = `This paper presents "${title}", a major contribution to ${domain} and related fields. The work introduces innovative techniques that substantially advance current state-of-the-art results across multiple benchmarks. The authors rigorously evaluate their methods on standard datasets and demonstrate both quantitative improvements and qualitative superiority. The approach is grounded in sound theoretical foundations and extends naturally to adjacent problem domains including ${keywords[1] || domain}. This work opens new research directions and provides a strong foundation for future investigations.`;
  
  const year = 2019 + Math.floor(Math.random() * 6);
  const venues = ["NeurIPS", "ICLR", "ICML", "CVPR", "ACL", "EMNLP", "AAAI", "IJCAI", "ECCV", "ICRA"];

  return {
    id: randomUUID(),
    title,
    authors: ["Vaswani et al.", "Brown et al.", "Dosovitskiy et al.", "LeCun et al.", "Goodfellow et al.", "Sutton et al."][Math.floor(Math.random() * 6)],
    year,
    venue: venues[Math.floor(Math.random() * venues.length)],
    topic: domain,
    keywords,
    abstract_short: short_abstract,
    abstract_full: full_abstract,
    arxiv_id: `${year - 2000}${String(Math.floor(Math.random() * 12) + 1).padStart(2,'0')}.${Math.floor(10000 + Math.random() * 90000)}`,
    download_url: `https://arxiv.org/search/?searchtype=all&query=${encodeURIComponent(title)}`,
    score_boost: Math.floor(Math.random() * 3)
  };
});

// ===================================================
// Write and finish
// ===================================================
const dataDirPath = path.join(__dirname, '..', 'src', 'data');
mkdirSync(dataDirPath, { recursive: true });
writeFileSync(path.join(dataDirPath, 'papers.json'), JSON.stringify(papers, null, 2));

console.log(`✅ Generated ${papers.length} papers in src/data/papers.json`);
const domainCounts = {};
papers.forEach(p => { domainCounts[p.topic] = (domainCounts[p.topic] || 0) + 1; });
console.log('Domain breakdown:', domainCounts);
