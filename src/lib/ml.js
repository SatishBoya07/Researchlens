const STOP_WORDS = new Set([
  "a","about","above","after","again","against","all","am","an","and","any","are","aren't","as","at","be","because",
  "been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do",
  "does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't",
  "have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his",
  "how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me",
  "more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our",
  "ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so",
  "some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these",
  "they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very",
  "was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where",
  "where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd",
  "you'll","you're","you've","your","yours","yourself","yourselves"
]);

let vocabulary = {};
let idf = {};
let documentVectors = []; // Array of { paperId, vector: { termIndex: tfidfWeight } }
let isInitialized = false;
let paperLookup = [];

export function tokenize(text) {
  if (!text) return [];
  // Lowercase, remove non-alphanumeric, split by whitespace
  const tokens = text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t));
  return tokens;
}

export function initSearchEngine(papers) {
  if (isInitialized) return;
  paperLookup = papers;
  
  // 1. Build Document Frequencies
  const df = {};
  const N = papers.length;
  const docsTokens = [];

  papers.forEach((paper, i) => {
    // Combine title, abstract, keywords, topic for vectorizing
    const textToVectorize = `${paper.title} ${paper.abstract_full} ${paper.keywords?.join(' ')} ${paper.topic}`;
    const tokens = tokenize(textToVectorize);
    docsTokens.push({ paper, tokens });
    
    // Count unique terms in this doc for DF
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach(token => {
      df[token] = (df[token] || 0) + 1;
    });
  });

  // 2. Build Vocabulary and IDF
  let vocabIndex = 0;
  for (const [term, count] of Object.entries(df)) {
    // Include terms that appear in at least 1 document (all of them) but ideally you'd filter out very rare ones
    vocabulary[term] = vocabIndex++;
    // IDF = log(N / DF)
    idf[term] = Math.log(N / count);
  }

  // 3. Transform documents to TF-IDF vectors
  documentVectors = docsTokens.map(({ paper, tokens }) => {
    const vector = {};
    const tf = {};
    
    // Term Frequency (raw count)
    tokens.forEach(t => {
      tf[t] = (tf[t] || 0) + 1;
    });
    
    // TF-IDF
    for (const [term, count] of Object.entries(tf)) {
      if (vocabulary[term] !== undefined) {
        // TF: term count inside doc. 
        // weight = tf * idf
        vector[vocabulary[term]] = count * idf[term];
      }
    }
    
    // Normalize vector (L2 normalization)
    let sumSquares = 0;
    for (const weight of Object.values(vector)) {
      sumSquares += weight * weight;
    }
    const magnitude = Math.sqrt(sumSquares);
    if (magnitude > 0) {
      for (const key of Object.keys(vector)) {
        vector[key] /= magnitude;
      }
    }

    return { id: paper.id, vector };
  });

  isInitialized = true;
  console.log(`ML Engine initialized with vocabulary size: ${Object.keys(vocabulary).length}`);
}

// Vectorize a query string using the fitted vocabulary and IDF
export function vectorizeQuery(query) {
  const tokens = tokenize(query);
  const vector = {};
  const tf = {};
  
  tokens.forEach(t => {
    tf[t] = (tf[t] || 0) + 1;
  });
  
  for (const [term, count] of Object.entries(tf)) {
    if (vocabulary[term] !== undefined) {
      vector[vocabulary[term]] = count * idf[term];
    }
  }
  
  let sumSquares = 0;
  for (const weight of Object.values(vector)) {
    sumSquares += weight * weight;
  }
  const magnitude = Math.sqrt(sumSquares);
  if (magnitude > 0) {
    for (const key of Object.keys(vector)) {
      vector[key] /= magnitude;
    }
  }
  
  return { vector, tokens };
}

export function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  // vecA and vecB are normalized, so cosine similarity is just dot product
  for (const [key, valA] of Object.entries(vecA)) {
    if (vecB[key] !== undefined) {
      dotProduct += valA * vecB[key];
    }
  }
  return dotProduct;
}

/**
 * Searches and returns ranked papers
 */
export function searchPapers(query, topN = 10) {
  if (!query.trim()) {
    // If empty query, return random high score papers
    return [...paperLookup]
      .sort(() => 0.5 - Math.random())
      .slice(0, topN)
      .map(p => ({ paper: p, score: 75 + Math.random() * 20 }));
  }

  const { vector: queryVector, tokens: queryTokens } = vectorizeQuery(query);
  const isQueryVectorEmpty = Object.keys(queryVector).length === 0;

  let results = documentVectors.map(({ id, vector }) => {
    const paper = paperLookup.find(p => p.id === id);
    let sim = 0;

    if (!isQueryVectorEmpty) {
      sim = cosineSimilarity(queryVector, vector);
    } else {
      // Fallback: simple keyword matching if all words were unknown OOV
      const text = `${paper.title} ${paper.abstract_short} ${paper.topic}`.toLowerCase();
      const rawTokens = query.toLowerCase().split(' ');
      let matches = 0;
      for (const t of rawTokens) {
        if (text.includes(t)) matches++;
      }
      sim = matches > 0 ? (matches / rawTokens.length) * 0.3 : 0;
    }

    // Keyword & topic boost
    const titleLower = paper.title.toLowerCase();
    const topicLower = paper.topic.toLowerCase();
    
    queryTokens.forEach(t => {
      if (titleLower.includes(t)) sim += 0.15;
      if (topicLower.includes(t)) sim += 0.20;
    });

    return { paper, sim };
  });

  // Sort descending by sim score
  results.sort((a, b) => b.sim - a.sim);
  
  // Normalize the top results dynamically into the 52% - 97% range requested
  // Get topN results
  const topResults = results.slice(0, topN);
  
  if (topResults.length === 0) return [];

  const maxSim = Math.max(0.1, topResults[0].sim); // avoid div by 0
  const minSim = Math.max(0, topResults[topResults.length - 1].sim);
  
  const minPercent = 52.0;
  const maxPercent = 97.0;

  // Apply interpolation mapping [minSim, maxSim] => [52, 97]
  const mappedResults = topResults.map((r, index) => {
    let normalized = 0;
    if (maxSim === minSim) {
      normalized = maxPercent - (index * 2); 
    } else {
      normalized = minPercent + ((r.sim - minSim) / (maxSim - minSim)) * (maxPercent - minPercent);
    }
    
    // Add randomness/variety for ties
    normalized += (Math.random() * 2 - 1);
    
    // Clamp
    normalized = Math.max(52, Math.min(99.9, normalized));
    
    return {
      paper: r.paper,
      score: normalized.toFixed(1)
    };
  });

  // Sort one more time to ensure they are strictly descending after clamping and noise
  return mappedResults.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
}
