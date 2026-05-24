"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export function AnimatedHeroForm() {
  const [step, setStep] = useState(0)
  const [responses, setResponses] = useState(327)
  
  // Animation sequence loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const runSequence = async () => {
      // Step 0: Initial state (cursor offscreen)
      setStep(0)
      setResponses(327)
      
      // Step 1: Cursor moves in
      timeoutId = setTimeout(() => {
        setStep(1)
        
        // Step 2: Cursor presses button
        timeoutId = setTimeout(() => {
          setStep(2)
          
          // Step 3: Button clicked, numbers update
          timeoutId = setTimeout(() => {
            setStep(3)
            setResponses(328)
            
            // Step 4: Cursor moves away
            timeoutId = setTimeout(() => {
              setStep(4)
              
              // Reset after a delay
              timeoutId = setTimeout(() => {
                runSequence()
              }, 4000)
              
            }, 600)
          }, 300)
        }, 1200)
      }, 1000)
    }
    
    runSequence()
    
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="relative w-full rounded-xl border border-[#EAEAEA] bg-white overflow-hidden">
      {/* Fake Cursor */}
      <motion.div
        initial={{ x: 100, y: 150, opacity: 0 }}
        animate={{
          x: step >= 1 && step < 4 ? 60 : step >= 4 ? 150 : 100,
          y: step >= 1 && step < 4 ? 50 : step >= 4 ? 150 : 150,
          opacity: step >= 1 ? 1 : 0,
          scale: step === 2 ? 0.9 : 1
        }}
        transition={{ 
          duration: step === 1 ? 1.2 : step === 4 ? 0.8 : 0.2, 
          ease: "easeInOut" 
        }}
        className="absolute z-50 pointer-events-none"
        style={{ left: "30%", top: "40%" }}
      >
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
          <path d="M5.65376 2.15376L22.6538 19.1538C23.5135 20.0135 22.9056 21.4828 21.6896 21.4828H14.1724L11.5517 29.3448C11.1611 30.5165 9.47565 30.5165 9.08507 29.3448L0.653763 4.04825C0.32043 3.04825 1.04825 2.15376 2.04825 2.48709L5.65376 2.15376Z" fill="#111111"/>
          <path d="M5.65376 2.15376L22.6538 19.1538C23.5135 20.0135 22.9056 21.4828 21.6896 21.4828H14.1724L11.5517 29.3448C11.1611 30.5165 9.47565 30.5165 9.08507 29.3448L0.653763 4.04825C0.32043 3.04825 1.04825 2.15376 2.04825 2.48709L5.65376 2.15376Z" stroke="white" strokeWidth="2"/>
        </svg>
      </motion.div>

      <div className="flex h-11 items-center gap-2 border-b border-[#EAEAEA] px-4">
        <span className="size-2.5 rounded-full bg-[#EAEAEA]" />
        <span className="size-2.5 rounded-full bg-[#EAEAEA]" />
        <span className="size-2.5 rounded-full bg-[#EAEAEA]" />
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#787774]">
              Live form
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              Customer feedback
            </h2>
          </div>
          <span className="rounded-full bg-[#EDF3EC] px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] text-[#346538]">
            Public
          </span>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-3 block text-sm font-medium">
              How was your experience?
            </label>
            <div className="grid grid-cols-2 gap-2 relative z-10">
              {["Excellent", "Good", "Okay", "Poor"].map((item, i) => {
                const isSelected = item === "Excellent" && step >= 3;
                const isHovered = item === "Excellent" && step === 2;
                
                return (
                  <motion.button
                    key={item}
                    animate={{
                      backgroundColor: isSelected ? "#111111" : isHovered ? "#F7F6F3" : "#FBFBFA",
                      color: isSelected ? "#FFFFFF" : "#111111",
                      borderColor: isSelected ? "#111111" : "#EAEAEA",
                      scale: isHovered ? 0.98 : 1
                    }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border px-4 py-3 text-left text-sm"
                  >
                    {item}
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[#EAEAEA] pt-5 relative">
            {/* Flash highlight when numbers change */}
            <AnimatePresence>
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: 0, scale: 1.1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-[#EDF3EC] -z-10 rounded-lg"
                />
              )}
            </AnimatePresence>
            
            <div>
              <motion.p 
                key={responses}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="[font-family:'Geist_Mono','SF_Mono',monospace] text-3xl font-semibold"
              >
                {responses}
              </motion.p>
              <p className="mt-1 text-sm text-[#787774]">responses</p>
            </div>
            <div>
              <p className="[font-family:'Geist_Mono','SF_Mono',monospace] text-3xl font-semibold">
                82%
              </p>
              <p className="mt-1 text-sm text-[#787774]">completion</p>
            </div>
          </div>
          </div>
        </div>
      </div>
  )
}
