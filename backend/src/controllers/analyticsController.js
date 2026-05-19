import QuizAttempt from '../models/QuizAttempt.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import Quiz from '../models/Quiz.js';

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('name points badges stats');
    const docCount = await Document.countDocuments({ userId });
    const quizCount = await Quiz.countDocuments({ createdBy: userId });
    const attemptCount = await QuizAttempt.countDocuments({ userId });

    const recentAttempts = await QuizAttempt.find({ userId })
      .sort('-createdAt').limit(10)
      .populate('quizId', 'title topic');

    // Get activity for the current week (Mon-Sun)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyActivity = await QuizAttempt.find({
      userId,
      createdAt: { $gte: startOfWeek }
    }).select('createdAt');

    const activityDays = weeklyActivity.map(a => new Date(a.createdAt).getDay());

    res.json({
      success: true,
      data: {
        user: { name: user.name, points: user.points, badges: user.badges },
        stats: { ...user.stats.toObject(), documentsCount: docCount, quizzesCreated: quizCount, quizzesAttempted: attemptCount },
        recentAttempts,
        weeklyActivity: activityDays
      },
    });
  } catch (error) { next(error); }
};

export const getPerformanceTrends = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const attempts = await QuizAttempt.find({ userId })
      .sort('createdAt').limit(50)
      .populate('quizId', 'title topic');

    const trends = attempts.map((a) => ({
      date: a.createdAt, score: a.score,
      quiz: a.quizId?.title || 'Unknown', topic: a.quizId?.topic || 'General',
    }));

    // Weak topics: topics where avg score < 60%
    const topicScores = {};
    attempts.forEach((a) => {
      const topic = a.quizId?.topic || 'General';
      if (!topicScores[topic]) topicScores[topic] = { total: 0, count: 0 };
      topicScores[topic].total += a.score;
      topicScores[topic].count++;
    });

    const weakTopics = Object.entries(topicScores)
      .map(([topic, data]) => ({ topic, averageScore: Math.round(data.total / data.count), attempts: data.count }))
      .filter((t) => t.averageScore < 60)
      .sort((a, b) => a.averageScore - b.averageScore);

    res.json({ success: true, data: { trends, weakTopics } });
  } catch (error) { next(error); }
};

export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Core Stats
    const user = await User.findById(userId).select('name points badges stats');
    const docCount = await Document.countDocuments({ userId });
    const quizCount = await Quiz.countDocuments({ createdBy: userId });
    const attemptCount = await QuizAttempt.countDocuments({ userId });
    const averageScore = user.stats?.averageScore || 0;

    // 2. Sparkline Data (last 7 days counts)
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const docSparkline = await Promise.all(last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      const count = await Document.countDocuments({ userId, createdAt: { $gte: date, $lt: nextDay } });
      return { value: count };
    }));

    const quizSparkline = await Promise.all(last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      const count = await Quiz.countDocuments({ createdBy: userId, createdAt: { $gte: date, $lt: nextDay } });
      return { value: count };
    }));

    const attemptSparkline = await Promise.all(last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      const count = await QuizAttempt.countDocuments({ userId, createdAt: { $gte: date, $lt: nextDay } });
      return { value: count };
    }));

    // 3. Streak Information
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diffToMonday);
    startOfWeek.setHours(0,0,0,0);

    const weekDays = Array.from({length: 7}, (_, i) => {
       const d = new Date(startOfWeek);
       d.setDate(startOfWeek.getDate() + i);
       return d;
    });

    // Check activity for each day of the week
    const weeklyActivity = await Promise.all(weekDays.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const docActivity = await Document.exists({ userId, createdAt: { $gte: date, $lt: nextDay } });
      const quizActivity = await Quiz.exists({ createdBy: userId, createdAt: { $gte: date, $lt: nextDay } });
      const attemptActivity = await QuizAttempt.exists({ userId, createdAt: { $gte: date, $lt: nextDay } });
      
      return !!(docActivity || quizActivity || attemptActivity);
    }));

    // Simple current streak (just for demo, a real one would check backward until no activity)
    let currentStreak = 0;
    for (let i = today.getDay() === 0 ? 6 : today.getDay() - 1; i >= 0; i--) {
      if (weeklyActivity[i]) currentStreak++;
      else break;
    }

    // 4. Continue Learning (recent docs & incomplete quizzes)
    const recentDocs = await Document.find({ userId }).sort('-createdAt').limit(2);
    const continueLearning = recentDocs.map(doc => ({
       type: 'document',
       title: doc.originalName,
       id: doc._id,
       progress: 0, // Placeholder
    }));

    // 5. Recent Activity
    const docs = await Document.find({ userId }).sort('-createdAt').limit(5);
    const quizzes = await Quiz.find({ createdBy: userId }).sort('-createdAt').limit(5);
    const attempts = await QuizAttempt.find({ userId }).populate('quizId', 'title').sort('-createdAt').limit(5);

    const recentActivity = [
      ...docs.map(d => ({ type: 'document', title: 'Uploaded a document', desc: d.title, createdAt: d.createdAt, id: d._id })),
      ...quizzes.map(q => ({ type: 'quiz', title: 'Created a new quiz', desc: q.title, createdAt: q.createdAt, id: q._id })),
      ...attempts.map(a => ({ type: 'attempt', title: 'Completed a quiz', desc: `${a.quizId?.title || 'Unknown'} • Score: ${a.score}%`, createdAt: a.createdAt, id: a._id }))
    ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

    // 6. Upcoming Goal (mock calculation)
    const goal = {
       title: 'Complete 5 quizzes this week',
       target: 5,
       current: await QuizAttempt.countDocuments({ userId, createdAt: { $gte: startOfWeek } })
    };

    // 7. Recommended
    const recommended = await Quiz.find({ isPublic: true }).sort('-likes').limit(3).select('title questions.length averageScore');
    const recommendedData = recommended.map(q => ({
       id: q._id,
       title: q.title,
       questions: q.questions?.length || 0,
       rating: Math.round((q.averageScore / 20) * 10) / 10 || 4.5 // Fake rating based on score
    }));

    res.json({
      success: true,
      data: {
        stats: {
           documentsCount: docCount,
           quizzesCreated: quizCount,
           quizzesAttempted: attemptCount,
           averageScore
        },
        sparklines: {
           documents: docSparkline,
           quizzes: quizSparkline,
           attempts: attemptSparkline
        },
        streak: {
           current: currentStreak,
           longest: 7, // Mocked
           weekly: weeklyActivity // [Mon, Tue, Wed, Thu, Fri, Sat, Sun] booleans
        },
        continueLearning,
        recentActivity,
        goal,
        recommended: recommendedData,
        user: {
           points: user.points,
           badges: user.badges
        }
      }
    });
  } catch (error) { next(error); }
};
