"use client"

import { ReactNode } from "react"
import styles from "./gradient-background.module.css"

interface GradientBackgroundProps {
  children: ReactNode
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <div className={`bg-gradient-to-tr from-brand-main to-brand-light ${styles.container}`}>
      {/* Subtle Animated Blur in Center */}
      <div className={styles.centerContainer}>
        <div className={styles.subtleBlurOrb}></div>
      </div>
      
      {/* Three Big Interacting Blue Circles */}
      <div className={styles.circlesContainer}>
        <div className={`${styles.blueCircle} ${styles.blueCircle1}`}></div>
        <div className={`${styles.blueCircle} ${styles.blueCircle2}`}></div>
        <div className={`${styles.blueCircle} ${styles.blueCircle3}`}></div>
      </div>
      
      {/* Wave Animation Layers */}
      <div className={styles.wavesContainer}>
        {/* Layer 1 - Slow moving background wave */}
        <svg
          className={styles.waveSvg}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 V120 H0 V60 Z"
            fill="rgba(255, 255, 255, 0.1)"
            className={styles.animateWaveSlow}
          />
        </svg>
        
        {/* Layer 2 - Medium wave */}
        <svg
          className={styles.waveSvg}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C200,120 400,40 600,80 C800,120 1000,40 1200,80 V120 H0 V80 Z"
            fill="rgba(255, 255, 255, 0.08)"
            className={styles.animateWaveMedium}
          />
        </svg>
        
        {/* Layer 3 - Fast subtle wave */}
        <svg
          className={styles.waveSvg}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C300,140 600,60 900,100 C1050,120 1150,90 1200,100 V120 H0 V100 Z"
            fill="rgba(255, 255, 255, 0.06)"
            className={styles.animateWaveFast}
          />
        </svg>
      </div>
      
      {children}
    </div>
  )
}