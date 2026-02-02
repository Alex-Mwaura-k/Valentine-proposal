import React, { useState, useMemo, useEffect } from "react";
import confetti from "canvas-confetti";
import { Heart, Stars } from "lucide-react";
import ReactGA from "react-ga4";

const App: React.FC = () => {
  // State to track position style
  const [noStyle, setNoStyle] = useState<{
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    position: "fixed" | "static";
  }>({
    top: "auto",
    left: "auto",
    right: "auto",
    bottom: "auto",
    position: "static",
  });

  const [yesScale, setYesScale] = useState(1);
  const [isAccepted, setIsAccepted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Track the last corner index to ensure it moves to a NEW spot
  const [lastCorner, setLastCorner] = useState(-1);

  useEffect(() => {
    // --- GOOGLE ANALYTICS INITIALIZATION ---
    const TRACKING_ID = import.meta.env.VITE_GA_ID;
    if (TRACKING_ID) {
      ReactGA.initialize(TRACKING_ID);
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }

    const handleInteraction = () => {
      const elem = document.documentElement;
      if (!document.fullscreenElement && elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          // Pass silently
        });
      }
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const messages = [
    "Will you be my Valentine?",
    "Are you sure? 🥺",
    "Think about it!",
    "Please? ❤️",
    "Don't do this to me! 😭",
    "I'll give you cookies! 🍪",
    "Now you're just being mean.",
    "Just click Yes already!",
    "Mzee Tutakosana!",
    "Ntakulipa Basi❤️",
    "Seriously...",
    "Okay, last chance!",
    "hehe... Just say Yes! ❤️",
  ];

  const images = [
    "https://media1.tenor.com/m/al4a1pG1f8YAAAAd/jump-bear.gif",
    "https://media1.tenor.com/m/JgJ9BQVFT8MAAAAC/shocked-cat.gif",
    "https://media1.tenor.com/m/sqJ5uy2Pet8AAAAC/jaggydohwhift.gif",
    "https://media1.tenor.com/m/msEscC7u-HwAAAAC/stan-twt-reaction-meme.gif",
    "https://media1.tenor.com/m/ppqVQB1PoBAAAAAC/tom-y-jerry-tom-and-jerry.gif",
    "https://media1.tenor.com/m/29TlJKipp4wAAAAC/lick.gif",
    "https://media1.tenor.com/m/6DRQNAOEavcAAAAd/cat-annoyed.gif",
    "https://media1.tenor.com/m/j1vwCdSMMP0AAAAC/michael-scott-michael-office.gif",
    "https://media.tenor.com/RiQyOcZtLoIAAAAi/tkthao219-bubududu.gif",
    "https://media1.tenor.com/m/r53R8b0im3kAAAAd/hasbulla.gif",
    "https://media1.tenor.com/m/JMzK66of9vEAAAAd/surprised-shocked.gif",
    "https://media1.tenor.com/m/0z2qWt7_xjAAAAAd/tom-and-jerry-sneaky.gif",
    "https://media1.tenor.com/m/ASiiCvgG3hwAAAAC/wink-james-franco.gif",
  ];

  const successImage =
    "https://media1.tenor.com/m/2ULvc-CCK9EAAAAd/dog-dog-dance.gif";

  const backgroundHearts = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      size: Math.random() * 30 + 10,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  const moveButton = () => {
    setHasMoved(true);
    setAttempts((prev) => prev + 1);

    let newCorner;
    do {
      newCorner = Math.floor(Math.random() * 4);
    } while (newCorner === lastCorner);

    setLastCorner(newCorner);

    const edge = "20px";
    const bottomEdge = "85px"; // Extra padding for footer

    let newStyle = {};

    switch (newCorner) {
      case 0:
        newStyle = {
          top: edge,
          left: edge,
          right: "auto",
          bottom: "auto",
          position: "fixed",
        };
        break;
      case 1:
        newStyle = {
          top: edge,
          right: edge,
          left: "auto",
          bottom: "auto",
          position: "fixed",
        };
        break;
      case 2:
        newStyle = {
          bottom: bottomEdge,
          left: edge,
          top: "auto",
          right: "auto",
          position: "fixed",
        };
        break;
      case 3:
        newStyle = {
          bottom: bottomEdge,
          right: edge,
          top: "auto",
          left: "auto",
          position: "fixed",
        };
        break;
    }

    setNoStyle(newStyle as any);
    setYesScale((prev) => Math.min(prev + 0.2, 2.2));
    setMessageIndex((prev) => (prev + 1) % messages.length);
  };

  const handleYes = () => {
    // --- TRACKING THE "YES" CLICK EVENT ---
    ReactGA.event({
      category: "Proposal",
      action: "Accepted",
      label: "Valentine",
    });

    setIsAccepted(true);
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <div className="container">
      <div className="background-hearts">
        {backgroundHearts.map((heart) => (
          <Heart
            key={heart.id}
            className="floating-heart"
            size={heart.size}
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              opacity: heart.opacity,
            }}
          />
        ))}
      </div>

      <div className="card glass">
        {!isAccepted ? (
          <>
            <div className="image-container">
              <img
                key={messageIndex}
                src={images[messageIndex]}
                alt="Reaction GIF"
                className="valentine-gif animate-pop"
              />
            </div>

            <div className="title-wrapper">
              <h1 key={messageIndex} className="title animate-pop">
                {messages[messageIndex]}
              </h1>
            </div>

            <div className="button-area">
              <button
                className="yes-btn"
                onClick={handleYes}
                style={{ transform: `scale(${yesScale})` }}
              >
                Yes!{" "}
                <Stars
                  size={18}
                  style={{ display: "inline", marginLeft: "5px" }}
                />
              </button>

              {attempts < 12 && (
                <button
                  className="no-btn"
                  style={
                    hasMoved
                      ? { ...noStyle, zIndex: 9999 }
                      : { position: "static" }
                  }
                  onMouseEnter={moveButton}
                  onTouchStart={moveButton}
                  onClick={moveButton}
                >
                  No
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="celebration animate-pop">
            <img
              src={successImage}
              alt="Celebration"
              className="valentine-gif success-gif"
            />
            <h1>💃</h1>
            <h1 className="celebration-text">Yeeh It's a Date!</h1>
            <p className="subtitle">Prepare for the best Valentine's ever ❤️</p>
          </div>
        )}
      </div>

      <footer className="footer">
        Powered by:{" "}
        <a
          href="https://instagram.com/lexcy.__"
          target="_blank"
          rel="noopener noreferrer"
        >
          LexcyKE
        </a>
      </footer>

      <style>{`
        .container {
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f8bbd0 0%, #f48fb1 50%, #f06292 100%);
          margin: 0;
          overflow: hidden;
          position: relative;
        }
        .background-hearts {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .floating-heart {
          position: absolute;
          bottom: -100px;
          color: rgba(255, 255, 255, 0.6);
          fill: rgba(255, 255, 255, 0.3);
          animation: float 10s linear infinite;
        }
        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }
        
        .card {
          padding: 3rem;
          border-radius: 40px;
          text-align: center;
          position: relative;
          z-index: 2;
          width: 90%;
          max-width: 800px; 
          min-height: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .image-container {
          height: 200px; 
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          width: 100%;
        }
        .valentine-gif {
          height: 180px;
          max-width: 100%;
          object-fit: contain;
          border-radius: 15px;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
          display: block; 
        }

        .celebration {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }
        
        .success-gif {
          height: 300px !important;
          max-height: 40vh; 
          width: auto;
          margin-bottom: 30px;
        }

        .title-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80px;
          width: 100%;
          margin-bottom: 20px;
          z-index: 20; 
          position: relative;
        }
        
        .title {
          color: #c2185b;
          font-weight: 900;
          font-size: clamp(1.5rem, 5vw, 2.5rem); 
          margin: 0;
          line-height: 1.2;
          padding: 0 10px;
        }
        
        .celebration-text {
          font-family: 'Dancing Script', cursive;
          color: #c2185b;
          font-size: clamp(2.5rem, 8vw, 4rem); 
          margin: 0;
          line-height: 1.2;
        }
        
        .subtitle {
          color: #ad1457;
          font-size: clamp(1rem, 3vw, 1.4rem);
          font-weight: 600;
          margin-top: 15px;
        }
        
        .button-area {
          position: relative;
          width: 100%;
          min-height: 160px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap; 
        }
        
        button {
          padding: 16px 36px;
          font-size: 1.2rem;
          font-weight: 800;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s ease; 
          min-width: 140px; 
        }
        
        .yes-btn {
          background: #ff4081;
          color: white;
          box-shadow: 0 8px 20px rgba(255, 64, 129, 0.4);
          z-index: 5;
          transform-origin: center;
        }
        
        .no-btn {
          background-color: #f1f3f5;
          color: #2d3436; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          z-index: 9999; 
        }

        .footer {
          position: absolute;
          bottom: 20px;
          width: 100%;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          font-weight: 500;
          z-index: 10;
        }
        .footer a {
          color: rgba(255, 255, 255, 1);
          font-weight: 400; 
          text-decoration: underline; 
          margin-left: 2px;
        }

        .animate-pop {
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }

        @media (max-width: 600px) {
          .button-area {
            flex-direction: column-reverse; /* STACKS VERTICALLY: NO ON TOP */
            justify-content: flex-end; /* ALIGNS CONTENT TO THE TOP REGION */
            min-height: 240px; /* CREATES DEDICATED VERTICAL SPACE */
            gap: 40px; /* FORCES LARGE GAP BETWEEN BUTTONS */
          }
          .no-btn {
            margin-bottom: auto; /* PUSHES NO AS HIGH AS POSSIBLE */
          }
          .yes-btn {
            margin-top: auto; /* PUSHES YES AS LOW AS POSSIBLE */
            margin-bottom: 20px;
          }
          .card {
            padding: 1.5rem;
            width: 92%;
            min-height: 480px;
          }
          .subtitle {
            font-size: 0.85rem; 
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
