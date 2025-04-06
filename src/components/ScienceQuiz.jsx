import React, { useState, useEffect, useRef } from 'react';
import styles from './ScienceQuiz.module.css';
import { Howl } from 'howler';
import { useGesture } from '@use-gesture/react';
import ReactPlayer from 'react-player';

const ScienceQuiz = () => {
  const [quizState, setQuizState] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [scientistMessage, setScientistMessage] = useState("Welcome to my lab!");
  const [showFunFact, setShowFunFact] = useState(false);
  const [labLights, setLabLights] = useState(true);
  const [particles, setParticles] = useState([]);
  const [reaction, setReaction] = useState(null);
  const [voice, setVoice] = useState(null);
  const animationFrame = useRef(null);

  const questions = [
    {
      questionText: '🧪 Which metal is liquid at room temperature?',
      answerOptions: [
        { answerText: 'Mercury', isCorrect: true },
        { answerText: 'Iron', isCorrect: false },
        { answerText: 'Gold', isCorrect: false },
        { answerText: 'Sodium', isCorrect: false },
      ],
      hint: "Think about the shiny liquid in thermometers!",
      funFact: '💡 Mercury is the only metal that stays liquid at room temperature!',
      molecule: 'Hg'
    },
    {
      questionText: '🔬 What is the powerhouse of the cell?',
      answerOptions: [
        { answerText: 'Nucleus', isCorrect: false },
        { answerText: 'Mitochondria', isCorrect: true },
        { answerText: 'Ribosome', isCorrect: false },
        { answerText: 'Cytoplasm', isCorrect: false },
      ],
      hint: "It's like the cell's battery!",
      funFact: '⚡ Mitochondria convert food energy into ATP - your body\'s fuel!',
      molecule: 'ATP'
    },
    {
      questionText: '🌡️ What is the coldest natural temperature ever recorded on Earth?',
      answerOptions: [
        { answerText: '-89°C (-128°F)', isCorrect: true },
        { answerText: '-50°C (-58°F)', isCorrect: false },
        { answerText: '-100°C (-148°F)', isCorrect: false },
        { answerText: '-75°C (-103°F)', isCorrect: false },
      ],
      hint: "Think about the coldest continent!",
      funFact: '❄️ Recorded in Antarctica in 1983 - colder than dry ice!'
    },
    {
      questionText: '🧫 What gas makes soda bubbles fizzy?',
      answerOptions: [
        { answerText: 'Oxygen', isCorrect: false },
        { answerText: 'Nitrogen', isCorrect: false },
        { answerText: 'Carbon Dioxide', isCorrect: true },
        { answerText: 'Helium', isCorrect: false },
      ],
      hint: "It's what we exhale when we breathe!",
      funFact: '🥤 CO2 dissolves in liquid under pressure - that\'s the pop you hear when opening a can!',
      molecule: 'CO2'
    },
    {
      questionText: '🔭 Which planet has the most moons?',
      answerOptions: [
        { answerText: 'Jupiter', isCorrect: false },
        { answerText: 'Saturn', isCorrect: true },
        { answerText: 'Neptune', isCorrect: false },
        { answerText: 'Mars', isCorrect: false },
      ],
      hint: "It's the planet with beautiful rings!",
      funFact: '🪐 Saturn has 146 moons - some as small as a sports stadium!'
    },
    {
      questionText: '🧬 What is the human body\'s largest organ?',
      answerOptions: [
        { answerText: 'Liver', isCorrect: false },
        { answerText: 'Skin', isCorrect: true },
        { answerText: 'Intestines', isCorrect: false },
        { answerText: 'Lungs', isCorrect: false },
      ],
      hint: "It covers your entire body!",
      funFact: '🛡️ Skin weighs about 8 pounds and renews itself every 28 days!'
    },
    {
      questionText: '⚡ What is the speed of light?',
      answerOptions: [
        { answerText: '300,000 km/s', isCorrect: true },
        { answerText: '150,000 km/s', isCorrect: false },
        { answerText: '1 million km/s', isCorrect: false },
        { answerText: '50,000 km/s', isCorrect: false },
      ],
      hint: "It's fast enough to circle Earth 7.5 times in one second!",
      funFact: '🌌 Light from the Sun takes 8 minutes to reach Earth!'
    },
    {
      questionText: '🌋 What type of rock forms from cooled lava?',
      answerOptions: [
        { answerText: 'Sedimentary', isCorrect: false },
        { answerText: 'Metamorphic', isCorrect: false },
        { answerText: 'Igneous', isCorrect: true },
        { answerText: 'Granite', isCorrect: false },
      ],
      hint: "Think about volcanoes!",
      funFact: '🔥 Obsidian (volcanic glass) cools so fast it has no crystals!'
    },
    {
      questionText: '🦠 What is the smallest unit of life?',
      answerOptions: [
        { answerText: 'Atom', isCorrect: false },
        { answerText: 'Cell', isCorrect: true },
        { answerText: 'Molecule', isCorrect: false },
        { answerText: 'Bacteria', isCorrect: false },
      ],
      hint: "Your body contains trillions of them!",
      funFact: '🔎 The human body contains about 30 trillion human cells!'
    },
    {
      questionText: '💨 How do plants get the nitrogen they need to grow?',
      answerOptions: [
        { answerText: 'By absorbing it directly from the air', isCorrect: false },
        { answerText: 'Through their roots from the soil', isCorrect: true },
        { answerText: 'By making it themselves', isCorrect: false },
        { answerText: 'By taking it from other plants', isCorrect: false },
      ],
      hint: "🌱 Plants can't take nitrogen directly from the air!",
      funFact: '⚡ Lightning helps convert nitrogen into forms plants can use!'
    }
  ];

  // Voice Synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const voices = speechSynthesis.getVoices();
      const scientistVoice = voices.find(v => v.name.includes('Google UK English Female')) || voices[0];
      setVoice(scientistVoice);
    }
  }, []);

  const speak = (text) => {
    if (voice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.pitch = 0.8;
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Gesture Controls
  const bindGestures = useGesture({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right')
  });

  const handleSwipe = (direction) => {
    if (quizState === 'quiz' && !selectedAnswer) {
      const newIndex = direction === 'right' 
        ? Math.min(currentQuestion + 1, questions.length - 1)
        : Math.max(currentQuestion - 1, 0);
      setCurrentQuestion(newIndex);
      speak(questions[newIndex].hint);
    }
  };

  // Particle Effects
  const createParticles = (isCorrect) => {
    const newParticles = Array(30).fill().map(() => ({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
      vx: (Math.random() - 0.5) * 10,
      vy: -Math.random() * 15 - 5,
      color: isCorrect ? '#00ff9d' : '#ff0062',
      size: Math.random() * 8 + 4
    }));
    setParticles(newParticles);
  };

  // Sound Effects
  const playSound = (effect) => {
    const sound = new Howl({
      src: [`/sounds/${effect}.mp3`],
      volume: effect === 'bubble' ? 0.3 : 0.7
    });
    sound.play();
  };

  const startQuiz = () => {
    setQuizState('quiz');
    setScientistMessage(questions[0].hint);
    speak(questions[0].hint);
    playSound('bubble');
  };

  const handleAnswer = (isCorrect, index) => {
    playSound(isCorrect ? 'correct' : 'wrong');
    createParticles(isCorrect);
    setSelectedAnswer(index);
    setShowFunFact(true);
    setLabLights(false);
    
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      setLabLights(true);
      setShowFunFact(false);
      setSelectedAnswer(null);
      
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setScientistMessage(questions[currentQuestion + 1].hint);
        speak(questions[currentQuestion + 1].hint);
      } else {
        setQuizState('results');
        playSound('complete');
      }
    }, 3000);
  };

  const restartQuiz = () => {
    setQuizState('welcome');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setScientistMessage("Welcome back! Try again?");
    speak("Welcome back! Ready to try again?");
  };

  // 3D Molecule Component
  const MoleculeViewer = ({ formula }) => (
    <div className={styles.moleculeViewer}>
      <ReactPlayer
        url={`/molecules/${formula}.mp4`}
        playing
        loop
        width={200}
        height={200}
        controls={false}
      />
    </div>
  );

  // Experiment Simulation
  const ExperimentSimulation = ({ question }) => {
    if (question.molecule) {
      return (
        <div className={styles.experimentSimulation}>
          <MoleculeViewer formula={question.molecule} />
          <button 
            className={styles.reactionButton}
            onClick={() => playSound('explosion')}
          >
            💥 Try Reaction
          </button>
        </div>
      );
    }
    return null;
  };

  // Clean up animation frame
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <div className={`${styles.container} ${!labLights ? styles.blackout : ''}`} {...bindGestures()}>
      {/* Particle Effects */}
      <div className={styles.particleContainer}>
        {particles.map((p, i) => (
          <div key={i} className={styles.particle} style={{
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            width: p.size,
            height: p.size
          }} />
        ))}
      </div>

      {/* Lab Background */}
      <div className={styles.labBackground}>
        <div className={styles.bubbles}></div>
        <div className={styles.equipment}></div>
        <div className={styles.floatingElements}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.floatingElement} style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDelay: `${i * 2}s`
            }}>
              {['🧪', '🔬', '⚗️', '🧫', '🧬'][i]}
            </div>
          ))}
        </div>
      </div>

      {/* Scientist */}
      <div className={styles.scientistContainer}>
        <div className={styles.scientist}>
          <div className={styles.head}>
            <div className={styles.eyes}>
              <div className={styles.eye}></div>
              <div className={styles.eye}></div>
            </div>
            <div className={styles.mouth}></div>
            <div className={styles.glasses}></div>
          </div>
          <div className={styles.body}>
            <div className={styles.labCoat}></div>
            <div className={styles.leftArm}></div>
            <div className={styles.rightArm}></div>
          </div>
        </div>
        <div className={styles.speechBubble}>
          {scientistMessage}
          {showFunFact && (
            <div className={styles.funFact}>
              {questions[currentQuestion].funFact}
            </div>
          )}
        </div>
      </div>

      {/* Quiz Content */}
      {quizState === 'welcome' && (
        <div className={styles.welcomeScreen}>
          <h1>MAD SCIENTIST LAB QUIZ</h1>
          <p>Test your science knowledge!</p>
          <button onClick={startQuiz} className={styles.startButton}>
            BEGIN EXPERIMENT
          </button>
        </div>
      )}

      {quizState === 'quiz' && (
        <div className={styles.quizContent}>
          <div className={styles.questionHeader}>
            <span>Question {currentQuestion + 1}/{questions.length}</span>
            <span>Score: {score}</span>
          </div>
          
          <div className={styles.question}>
            {questions[currentQuestion].questionText}
          </div>

          <ExperimentSimulation question={questions[currentQuestion]} />

          <div className={styles.answers}>
            {questions[currentQuestion].answerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.isCorrect, index)}
                className={`${styles.answerButton} ${
                  selectedAnswer === index 
                    ? option.isCorrect 
                      ? styles.correct 
                      : styles.incorrect 
                    : ''
                }`}
                disabled={selectedAnswer !== null}
              >
                {option.answerText}
              </button>
            ))}
          </div>
        </div>
      )}

      {quizState === 'results' && (
        <div className={styles.resultsScreen}>
          <div className={styles.celebration}>
            {[...Array(50)].map((_, i) => (
              <div key={i} className={styles.confetti} style={{
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }} />
            ))}
          </div>
          <h2>EXPERIMENT COMPLETE!</h2>
          <div className={styles.scoreDisplay}>
            Your score: {score}/{questions.length}
          </div>
          <div className={styles.scoreComment}>
            {score >= 8
              ? "Brilliant! You're a science genius!"
              : score >= 5
              ? "Good job! Keep experimenting!"
              : "Keep practicing, young scientist!"}
          </div>
          <button onClick={restartQuiz} className={styles.restartButton}>
            TRY AGAIN
          </button>
        </div>
      )}

      {/* Gesture Guide */}
      <div className={styles.gestureGuide}>
        ← Swipe to navigate →
      </div>
    </div>
  );
};

export default ScienceQuiz;