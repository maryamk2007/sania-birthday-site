"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Music, VolumeX, Volume2, AlertCircle } from "lucide-react"
import confetti from "canvas-confetti"

export default function BirthdayCard() {
  const [stage, setStage] = useState<"gift" | "birthday" | "message">("gift")
  const [audioStarted, setAudioStarted] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [showAudioPrompt, setShowAudioPrompt] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Function to play audio with better error handling
  const playAudio = () => {
    if (!audioRef.current) {
      setAudioError("Audio element not found")
      return
    }

    // Log the audio element's properties for debugging
    console.log("Audio element:", audioRef.current)
    console.log("Audio source:", audioRef.current.currentSrc || "No source")
    console.log("Audio ready state:", audioRef.current.readyState)

    // Check if the audio file is loaded
    if (audioRef.current.readyState === 0) {
      setAudioError("Audio file not loaded. Please check the file path.")
      return
    }

    audioRef.current.volume = 1.0 // Ensure volume is at maximum

    audioRef.current
      .play()
      .then(() => {
        console.log("Audio playback started successfully")
        setAudioStarted(true)
        setAudioPlaying(true)
        setShowAudioPrompt(false)
        setAudioError(null)
      })
      .catch((error) => {
        console.error("Audio playback failed:", error)
        setAudioError(`Playback failed: ${error.message}`)
        setShowAudioPrompt(true)
      })
  }

  // Function to toggle audio
  const toggleAudio = () => {
    if (!audioRef.current) return

    if (audioPlaying) {
      audioRef.current.pause()
      setAudioPlaying(false)
    } else {
      playAudio() // Use the same play function with error handling
    }
  }

  // Function to handle gift click
  const handleGiftClick = () => {
    setStage("birthday")
    launchConfetti()

    // Try to play audio if not already playing
    if (!audioPlaying) {
      playAudio()
    }
  }

  // Function to handle message click
  const handleMessageClick = () => {
    setStage("message")
  }

  // Function to launch confetti
  const launchConfetti = () => {
    const duration = 2 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  // Try to autoplay audio when component mounts
  useEffect(() => {
    // Check if audio element exists
    if (!audioRef.current) {
      console.error("Audio element not found on mount")
      setAudioError("Audio element not found")
      return
    }

    // Log when the audio file is loaded
    const handleCanPlayThrough = () => {
      console.log("Audio file loaded and can play through")
    }

    // Log any errors loading the audio file
    const handleError = (e: Event) => {
      const error = (e.target as HTMLAudioElement).error
      console.error("Audio loading error:", error)
      setAudioError(`Error loading audio: ${error?.message || "Unknown error"}`)
    }

    audioRef.current.addEventListener("canplaythrough", handleCanPlayThrough)
    audioRef.current.addEventListener("error", handleError)

    // Attempt autoplay
    const attemptAutoplay = () => {
      console.log("Attempting autoplay...")
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            console.log("Autoplay successful")
            setAudioStarted(true)
            setAudioPlaying(true)
            setShowAudioPrompt(false)
            setAudioError(null)
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error)
            // Autoplay was prevented, show prompt
            setShowAudioPrompt(true)
          })
      }
    }

    // Try autoplay after a short delay to ensure the audio is loaded
    setTimeout(attemptAutoplay, 1000)

    // Also set up user interaction listeners
    const handleUserInteraction = () => {
      console.log("User interaction detected")
      if (!audioStarted) {
        playAudio()
      }
    }

    document.addEventListener("click", handleUserInteraction, { once: true })
    document.addEventListener("touchstart", handleUserInteraction, { once: true })

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("canplaythrough", handleCanPlayThrough)
        audioRef.current.removeEventListener("error", handleError)
      }
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [audioStarted])

  // Generate balloon components with different shades of purple
  const renderBalloons = () => {
    const balloonColors = [
      "bg-purple-300",
      "bg-purple-400",
      "bg-purple-500",
      "bg-purple-600",
      "bg-purple-700",
      "bg-indigo-400",
      "bg-indigo-500",
      "bg-violet-400",
      "bg-violet-500",
    ]

    return balloonColors.map((color, index) => (
      <div
        key={index}
        className={`balloon ${color}`}
        style={{
          left: `${index * 11}%`,
          animationDelay: `${index * 0.2}s`,
          animationDuration: `${3 + Math.random() * 2}s`,
        }}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-lavender flex flex-col items-center justify-center p-4">
      {/* Audio element with explicit controls as fallback */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        controls={!!audioError} // Show native controls if there's an error
        className={`${audioError ? "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20" : "hidden"}`}
      >
        <source src="/birds-of-a-feather.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* Audio control button - made larger and more visible */}
      <div className="fixed top-4 right-4 z-10">
        <Button
          variant="outline"
          onClick={toggleAudio}
          className="bg-white hover:bg-white border-purple-300 px-4 py-2 flex items-center gap-2"
        >
          {audioPlaying ? (
            <>
              <Volume2 className="h-5 w-5 text-purple-700" />
              <span className="text-purple-700">Music Playing</span>
            </>
          ) : (
            <>
              <VolumeX className="h-5 w-5 text-purple-700" />
              <span className="text-purple-700">Play Music</span>
            </>
          )}
        </Button>
      </div>

      {/* Audio prompt - made more prominent */}
      {showAudioPrompt && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-3 rounded-lg shadow-md border-2 border-purple-300 flex items-center gap-2">
          <Music className="h-5 w-5 text-purple-700" />
          <button onClick={playAudio} className="text-purple-800 font-medium">
            Click here to play "Birds of a Feather"
          </button>
        </div>
      )}

      {/* Audio error message */}
      {audioError && (
        <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-10 bg-red-50 px-4 py-3 rounded-lg shadow-md border-2 border-red-300 flex items-center gap-2 max-w-xs text-center">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">Music Error</p>
            <p className="text-red-600 text-sm">{audioError}</p>
            <p className="text-red-600 text-sm mt-1">Make sure "birds-of-a-feather.mp3" is in the public folder</p>
          </div>
        </div>
      )}

      <div className="max-w-md w-full mx-auto">
        <AnimatePresence mode="wait">
          {stage === "gift" && (
            <motion.div
              key="gift"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <motion.div
                className="cursor-pointer transform transition-transform hover:scale-105"
                onClick={handleGiftClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="w-64 h-64 flex flex-col items-center justify-center bg-white shadow-lg border-2 border-purple-300">
                  <Gift size={80} className="text-purple-500 mb-4" />
                  <p className="text-xl font-medium text-purple-600">Press me</p>
                </Card>
              </motion.div>

              {/* Extra music button below gift */}
              <Button
                onClick={playAudio}
                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Music className="h-4 w-4" />
                Start Music
              </Button>
            </motion.div>
          )}

          {stage === "birthday" && (
            <motion.div
              key="birthday"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Card className="bg-white border-purple-300 border-2 shadow-lg p-8 rounded-xl">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center"
                >
                  <h1 className="text-3xl font-bold text-purple-800 mb-6">Happy Birthday Sania!</h1>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <p className="text-xl text-purple-700">10 years of friendship, your bsf forever</p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex justify-center"
                >
                  <Button onClick={handleMessageClick} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Click to see Maryam be cute
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          )}

          {stage === "message" && (
            <motion.div
              key="message"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Card className="bg-white border-purple-300 border-2 shadow-lg p-8 rounded-xl">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center"
                >
                  <h2 className="text-2xl font-bold text-purple-800 mb-6">To My Forever Person ♡</h2>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <div className="text-lg text-purple-900 leading-relaxed text-left max-h-[60vh] overflow-y-auto px-4 py-2 border border-purple-200 rounded-lg bg-purple-50">
                    <p className="mb-4 italic font-medium">"I want you to stay 'til I'm in the grave."</p>
                    <p className="mb-4">
                      Every time I hear that line, I think of you. I think of the sweet girl who's stayed by my side for
                      as long as I can remember. Ten whole years. Since grade 2. And somehow, even through growing up,
                      drifting apart for some time, moving, and all the messy cringey parts of life we stayed together.
                      We've had that one fight, a bunch of misunderstandings, and so much distance. There were moments
                      where things felt weird or confusing, but somehow we always found our way back to each other.
                      That's something I don't take lightly because you're the only person in my life I've ever had that
                      kind of bond with and the only person who cared enough to have it with me.
                    </p>

                    <p className="mb-4 font-medium">You're my safe space. You always have been.</p>

                    <p className="mb-4">
                      When I was going through stuff in grade 11, you never judged me. You never made me feel broken or
                      weak. You just stayed. That kind of loyalty? That kind of love? Wallahi it's rare in a world full
                      of fake friends. And I'll never ever forget it. Even now with you so far away in Qatar, I still
                      wait up till 2 a.m. just hoping for a message from you even if its a school night and you know me
                      I love to sleep more than anything. And even if we don't talk every day, or call every week, the
                      connection between us never fades. It's like our hearts are tied with something way stronger than
                      distance. I think it's our genuine love for each other.
                    </p>

                    <p className="mb-4">
                      You're still my first thought when something funny happens.
                      <br />
                      You're still the first person I wanna rant to when life is overwhelming or school is being
                      annoying.
                      <br />
                      You're still the first person I text if I see some fine guy or some discombobulated weirdo.
                      <br />
                      You're still my person.
                    </p>

                    <p className="mb-4">
                      I see best friends together laughing, hugging, making memories, and all I can think is, That's me
                      and Sania. That's us. Even when we're apart. You're so beautiful, inside and out (i wanna be
                      inside u again baby). Your heart, your loyalty, your softness reminds me of Jannah. Pure.
                    </p>

                    <p className="mb-4">
                      You're everything a best friend should be and more.
                      <br />
                      You've taught me what real love is. Real friendship. It's not about being perfect. It's about
                      choosing each other, even when it's hard and no amount of distance can get in between that.
                    </p>

                    <p className="mb-4">
                      So on your 18th birthday, I want you to know no matter where we are in the world, no matter how
                      busy or distant life gets. I'll always be right here. Cheering for you. Praying for you. Loving
                      you forever and ever. I make dua every night that Allah (SWT) brings us back together in this
                      dunya. That we get to grow old together, hand in hand, still laughing at retarded jokes and
                      hugging like nothing ever changed. I pray that you always feel seen, loved, and protected even if
                      I'm not there to show you it. Sania you have such a beautiful soul and face wallahi if only you
                      could see yourself through my eyes. I pray Allah gives you the best of this life and the next.
                      That he grants you a fine nerdy protective obsessed husband who sees your worth, your beauty, your
                      heart the same way I do and even more. I pray that we get to be sisters not just here, but forever
                      in the akhira.
                    </p>

                    <p className="mb-4">
                      I want you in every stage of my life.
                      <br />
                      When I get into university, you're the first one I'll tell.
                      <br />
                      When I'm stressed or lost, you're the first one I'll turn to for help.
                      <br />
                      When life is good, you're the one I want to celebrate with.
                    </p>

                    <p className="mb-4">
                      Wherever you go, I'll go. I don't care if it's an hour away or across the world. I'll always find
                      my way back to you. Like I don't know what I'd do without you and when days are bad I just wanna
                      text you nobody else. It's always been like that, your notification is the one I never ignore
                      unless its TikTok then im sorry but everyone gets ignored because im too lazy so suck it. But
                      anyways like I miss you so so so much and I know I can't get you anything for your birthday trust
                      me I've tried and I wish I could give you something because you deserve the world for everything
                      you've done for me whether you've realized it or not. And if we ever somehow drift apart again I
                      will run back to you no matter what and I know you'd do the same. My soul yearns for you day and
                      night. I miss you a lot. And I'll say it every single day so you know how much you mean to me.
                      Happy Birthday Sania. You finally made it through being 17 now you just gotta wait for me.
                    </p>

                    <p className="mb-4 italic font-medium">"I'll love you 'til the day that I die."</p>

                    <p className="mb-4">And after that, InshAllah, I'll love you in Jannah too.</p>

                    <p className="text-right font-medium">
                      Forever your best friend in this life and the hereafter,
                      <br />
                      Maryam.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex justify-center"
                >
                  <Button onClick={launchConfetti} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Celebrate Again!
                  </Button>
                </motion.div>

                {/* Balloon container */}
                <div className="relative h-32 mt-8 overflow-hidden">{renderBalloons()}</div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

