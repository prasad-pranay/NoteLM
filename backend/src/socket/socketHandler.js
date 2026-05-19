import LiveSession from '../models/LiveSession.js';
import Quiz from '../models/Quiz.js';

export default function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a live session room
    socket.on('join-session', async ({ joinCode, userName, userId }) => {
      try {
        const session = await LiveSession.findOne({ joinCode }).populate('quizId');
        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        if (session.status === 'finished') {
          socket.emit('error', { message: 'Session already finished' });
          return;
        }

        // Add participant if not already in
        const existingParticipant = session.participants.find(p => p.userId?.toString() === userId || p.name === userName);
        if (!existingParticipant) {
          session.participants.push({
            userId: userId || null,
            name: userName,
            score: 0,
            answers: []
          });
          await session.save();
        }

        socket.join(joinCode);
        console.log(`User ${userName} joined room ${joinCode}`);

        // Notify everyone in the room about the new participant
        io.to(joinCode).emit('participant-joined', {
          participants: session.participants.map(p => ({ name: p.name, score: p.score })),
          status: session.status,
          currentQuestionIndex: session.currentQuestionIndex
        });

        // Send current session state to the joining user
        socket.emit('session-state', {
          status: session.status,
          currentQuestionIndex: session.currentQuestionIndex,
          quiz: {
            title: session.quizId.title,
            numQuestions: session.quizId.questions.length
          },
          participants: session.participants.map(p => ({ name: p.name, score: p.score }))
        });

      } catch (err) {
        console.error('Join session error:', err);
        socket.emit('error', { message: 'Failed to join session' });
      }
    });

    // Host starts the quiz
    socket.on('start-quiz', async ({ joinCode }) => {
      try {
        const session = await LiveSession.findOne({ joinCode });
        if (!session) return;

        session.status = 'active';
        session.currentQuestionIndex = 0;
        await session.save();

        const quiz = await Quiz.findById(session.quizId);
        const firstQuestion = quiz.questions[0];

        io.to(joinCode).emit('quiz-started', {
          question: {
            questionText: firstQuestion.questionText,
            options: firstQuestion.options,
            type: firstQuestion.type,
            index: 0
          },
          totalQuestions: quiz.questions.length
        });
      } catch (err) {
        console.error('Start quiz error:', err);
      }
    });

    // Host moves to next question
    socket.on('next-question', async ({ joinCode }) => {
      try {
        const session = await LiveSession.findOne({ joinCode }).populate('quizId');
        if (!session) return;

        session.currentQuestionIndex += 1;
        
        if (session.currentQuestionIndex >= session.quizId.questions.length) {
          session.status = 'finished';
          await session.save();
          io.to(joinCode).emit('quiz-finished', {
            leaderboard: session.participants.sort((a, b) => b.score - a.score).map(p => ({ name: p.name, score: p.score }))
          });
        } else {
          await session.save();
          const nextQ = session.quizId.questions[session.currentQuestionIndex];
          io.to(joinCode).emit('new-question', {
            question: {
              questionText: nextQ.questionText,
              options: nextQ.options,
              type: nextQ.type,
              index: session.currentQuestionIndex
            }
          });
        }
      } catch (err) {
        console.error('Next question error:', err);
      }
    });

    // Participant submits answer
    socket.on('submit-answer', async ({ joinCode, userName, answer, timeTaken }) => {
      try {
        const session = await LiveSession.findOne({ joinCode }).populate('quizId');
        if (!session || session.status !== 'active') return;

        const quiz = session.quizId;
        const currentQ = quiz.questions[session.currentQuestionIndex];
        const isCorrect = currentQ.correctAnswer === answer;

        let points = 0;
        if (isCorrect) {
          // Reward speed: Max 1000 points, min 500 if correct.
          // Assuming 30s max per question
          const maxTime = 30;
          const timeBonus = Math.max(0, (maxTime - timeTaken) / maxTime) * 500;
          points = Math.round(500 + timeBonus);
        }

        const participant = session.participants.find(p => p.name === userName);
        if (participant) {
          // Check if already answered this question
          const alreadyAnswered = participant.answers.some(a => a.questionIndex === session.currentQuestionIndex);
          if (!alreadyAnswered) {
            participant.answers.push({
              questionIndex: session.currentQuestionIndex,
              answer,
              isCorrect,
              points,
              answeredAt: new Date()
            });
            participant.score += points;
            await session.save();

            // Emit updated leaderboard to everyone
            io.to(joinCode).emit('leaderboard-update', {
              leaderboard: session.participants.sort((a, b) => b.score - a.score).map(p => ({ name: p.name, score: p.score }))
            });
          }
        }
      } catch (err) {
        console.error('Submit answer error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
