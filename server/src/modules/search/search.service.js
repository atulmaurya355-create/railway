import { Question } from '../questions/question.model.js';
import { StudyMaterial } from '../studyMaterials/studyMaterial.model.js';
import { CurrentAffairs } from '../currentAffairs/currentAffairs.model.js';

/**
 * Standardize question items
 */
function mapQuestion(item) {
  return {
    id: item._id,
    type: 'question',
    title: item.question,
    subtitle: `${item.category} • ${item.topic}`,
    tags: [item.difficulty, item.category],
    createdAt: item.createdAt,
    meta: {
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      difficulty: item.difficulty,
      topic: item.topic,
      category: item.category,
    },
  };
}

/**
 * Standardize note items
 */
function mapNote(item) {
  return {
    id: item._id,
    type: 'note',
    title: item.title,
    subtitle: `${item.category} • ${item.topic}`,
    tags: ['Notes', item.topic],
    createdAt: item.createdAt,
    meta: {
      description: item.description,
      topic: item.topic,
      category: item.category,
      examName: item.examName,
      fileUrl: item.fileUrl,
      fileSize: item.fileSize,
    },
  };
}

/**
 * Standardize PDF items
 */
function mapPdf(item) {
  const sizeMb = item.fileSize ? (item.fileSize / (1024 * 1024)).toFixed(2) : '0.00';
  return {
    id: item._id,
    type: 'pdf',
    title: item.title,
    subtitle: `${item.category} • ${item.topic}`,
    tags: ['PDF', `${sizeMb} MB`, `Downloads: ${item.downloadCount || 0}`],
    createdAt: item.createdAt,
    meta: {
      description: item.description,
      topic: item.topic,
      category: item.category,
      examName: item.examName,
      fileUrl: item.fileUrl,
      fileSize: item.fileSize,
      downloadCount: item.downloadCount || 0,
    },
  };
}

/**
 * Standardize current affairs items
 */
function mapCurrentAffair(item) {
  return {
    id: item._id,
    type: 'current_affair',
    title: item.title,
    subtitle: item.description,
    tags: [item.category, `${item.importance || 'medium'} importance`],
    createdAt: item.date || item.createdAt,
    meta: {
      description: item.description,
      category: item.category,
      affairsType: item.affairsType,
      date: item.date,
      importance: item.importance,
      imageUrl: item.imageUrl,
      keyPoints: item.keyPoints || [],
      relatedTopics: item.relatedTopics || [],
    },
  };
}

export const searchService = {
  /**
   * Performs a global unified search across all requested content schemas
   * @param {Object} queryParams - Filters and pagination settings
   */
  async searchAll(queryParams) {
    const { q = '', type = 'all', difficulty, category, page = 1, limit = 10 } = queryParams;
    const skip = (page - 1) * limit;
    const regexQuery = q ? new RegExp(q.trim(), 'i') : null;

    // 1. Build Query Objects
    const questionQuery = { isActive: true };
    if (difficulty) questionQuery.difficulty = difficulty;
    if (category) questionQuery.category = new RegExp(category, 'i');
    if (regexQuery) {
      questionQuery.$or = [
        { question: regexQuery },
        { topic: regexQuery },
        { category: regexQuery },
      ];
    }

    const noteQuery = { isActive: true, materialType: 'notes' };
    if (category) noteQuery.category = new RegExp(category, 'i');
    if (regexQuery) {
      noteQuery.$or = [
        { title: regexQuery },
        { description: regexQuery },
        { topic: regexQuery },
        { category: regexQuery },
      ];
    }

    const pdfQuery = { isActive: true, materialType: { $in: ['pdf', 'formulaSheet'] } };
    if (category) pdfQuery.category = new RegExp(category, 'i');
    if (regexQuery) {
      pdfQuery.$or = [
        { title: regexQuery },
        { description: regexQuery },
        { topic: regexQuery },
        { category: regexQuery },
      ];
    }

    const currentAffairsQuery = { isPublished: true };
    if (category) currentAffairsQuery.category = category; // currentAffairs categories are strictly typed enums
    if (regexQuery) {
      currentAffairsQuery.$or = [
        { title: regexQuery },
        { description: regexQuery },
        { content: regexQuery },
        { category: regexQuery },
      ];
    }

    // 2. Perform Specialized / Single-Collection Searches
    if (type !== 'all') {
      let count = 0;
      let items = [];

      switch (type) {
        case 'question':
          [count, items] = await Promise.all([
            Question.countDocuments(questionQuery),
            Question.find(questionQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
          ]);
          return {
            results: items.map(mapQuestion),
            pagination: {
              total: count,
              page,
              limit,
              totalPages: Math.ceil(count / limit),
            },
          };

        case 'note':
          [count, items] = await Promise.all([
            StudyMaterial.countDocuments(noteQuery),
            StudyMaterial.find(noteQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
          ]);
          return {
            results: items.map(mapNote),
            pagination: {
              total: count,
              page,
              limit,
              totalPages: Math.ceil(count / limit),
            },
          };

        case 'pdf':
          [count, items] = await Promise.all([
            StudyMaterial.countDocuments(pdfQuery),
            StudyMaterial.find(pdfQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
          ]);
          return {
            results: items.map(mapPdf),
            pagination: {
              total: count,
              page,
              limit,
              totalPages: Math.ceil(count / limit),
            },
          };

        case 'current_affair':
          [count, items] = await Promise.all([
            CurrentAffairs.countDocuments(currentAffairsQuery),
            CurrentAffairs.find(currentAffairsQuery).sort({ date: -1 }).skip(skip).limit(limit),
          ]);
          return {
            results: items.map(mapCurrentAffair),
            pagination: {
              total: count,
              page,
              limit,
              totalPages: Math.ceil(count / limit),
            },
          };

        default:
          throw new Error(`Invalid search type: ${type}`);
      }
    }

    // 3. Perform Unified 'All' Collections Search
    // To prevent resource exhaustion, retrieve a sensible max match pool from each database, merge, and paginate
    const maxFetchPerCollection = 100;

    const [questions, notes, pdfs, currentAffairs] = await Promise.all([
      Question.find(questionQuery).sort({ createdAt: -1 }).limit(maxFetchPerCollection),
      StudyMaterial.find(noteQuery).sort({ createdAt: -1 }).limit(maxFetchPerCollection),
      StudyMaterial.find(pdfQuery).sort({ createdAt: -1 }).limit(maxFetchPerCollection),
      CurrentAffairs.find(currentAffairsQuery).sort({ date: -1 }).limit(maxFetchPerCollection),
    ]);

    const mappedQuestions = questions.map(mapQuestion);
    const mappedNotes = notes.map(mapNote);
    const mappedPdfs = pdfs.map(mapPdf);
    const mappedCurrentAffairs = currentAffairs.map(mapCurrentAffair);

    // Merge all results
    let mergedResults = [
      ...mappedQuestions,
      ...mappedNotes,
      ...mappedPdfs,
      ...mappedCurrentAffairs,
    ];

    // Sort by creation date descending
    mergedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Handle unified pagination in memory
    const totalResults = mergedResults.length;
    const paginatedResults = mergedResults.slice(skip, skip + limit);

    return {
      results: paginatedResults,
      pagination: {
        total: totalResults,
        page,
        limit,
        totalPages: Math.ceil(totalResults / limit),
      },
    };
  },
};
