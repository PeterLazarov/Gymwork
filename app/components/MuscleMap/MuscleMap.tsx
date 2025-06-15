import { useMemo } from 'react'
import { XmlProps } from 'react-native-svg'
import { SvgCss } from 'react-native-svg/css'

export interface MuscleMapProps extends Partial<XmlProps> {
  back: boolean
  muscles: string[]
  muscleAreas: string[]
  baseColor?: string
  inactiveColor?: string
  activeColor?: string
}

function getMappedClasses(muscles: string[]) {
  return Array.from(
    new Set(muscles.flatMap(m => mappings[m as keyof typeof mappings] ?? []))
  )
}

export const MuscleMap = ({
  muscles,
  muscleAreas,
  back = false,
  activeColor = 'white',
  baseColor = 'black',
  inactiveColor = 'gray',
  ...rest
}: MuscleMapProps) => {
  const xmlWithCSS = useMemo(() => {
    const combined = muscles.concat(...muscleAreas)
    const activeClasses = getMappedClasses(combined)
    console.log({ combined, activeClasses })
    const styleTag = `
    <style>
    #Base {fill:${baseColor};}
      #Front {opacity:${back ? 0 : 1};}
      #Back {opacity:${back ? 1 : 0};}
      .muscle { fill: ${inactiveColor}; }
      ${activeClasses.map(cls => `.${cls} { fill: ${activeColor}; }`).join(' ')}
    </style>`

    return `
    ${svgStart}${styleTag}${svgRest}
    `
  }, [activeColor, back, baseColor, inactiveColor, muscles])

  return (
    <SvgCss
      xml={xmlWithCSS}
      {...rest}
    ></SvgCss>
  )
}
const mappings = {
  'Abductor Brevis': ['Hip-Abductors'],
  'Adductor Brevis': ['Hip-Adductors'],
  'Adductor Longus': ['Hip-Adductors'],
  'Adductor Magnus': ['Hip-Adductors'],
  'Anterior Deltoid': ['Anterior-Deltoid'],
  'Biceps Brachii': ['Biceps'],
  Brachialis: ['Upper-Arms'],
  Brachioradialis: ['Brachioradialis', 'Forearms'],
  'Clavicular Head': ['Pectoralis-Major-Clavicular'],
  'Erector Spinae': ['Erector-Spinae', 'Core'],
  Gastrocnemius: ['Gastrocnemius', 'Calves'],
  'Gluteus Maximus': ['Gluteus-Maximus'],
  'Gluteus Medius': ['Hip-Abductors'],
  Gracilis: ['Hip-Adductors'],
  Hamstring: ['Hamstrings'],
  'Hip Flexor': ['Hips'],
  Iliopsoas: ['Hip-External-Rotators', 'Hips'],
  Infraspinatus: ['Infraspinatus'],
  'Lateral Deltoid': ['Lateral-Deltoid'],
  'Latissimus Dorsi': ['Latissimus-Dorsi'],
  'Levator Scapulae': ['Levator-Scapulae'],
  Obliques: ['Obliques', 'Core'],
  Pectineous: ['Hip-Adductors'],
  'Pectoralis Major Clavicular Head': ['Pectoralis-Major-Clavicular'],
  'Pectoralis Major Sternal Head': ['Pectoralis-Major-Sternocostal'],
  Popliteus: ['Quadriceps'],
  'Posterior Deltoid': ['Posterior-Deltoid'],
  Quadriceps: ['Quadriceps'],
  'Rectus Abdominis': ['Rectus-Abdominis', 'Core'],
  Sartorius: ['Quadriceps'],
  'Serratus Anterior': ['Serratus-Anterior'],
  Soleus: ['Soleus', 'Calves'],
  Splenius: ['Upper-Trapezius'],
  Sternocleidomastoid: ['Upper-Trapezius'],
  'Tensor Fasciae Latae': ['Hip-Abductors'],
  'Teres Major': ['Back'],
  'Teres Minor': ['Teres-Minor'],
  'Tibialis Anterior': ['Tibialis-Anterior'],
  'Trapezius Lower Fibers': ['Lower-Trapezius'],
  'Trapezius Middle Fibers': ['Middle-Trapezius'],
  'Trapezius Upper Fibers': ['Upper-Trapezius'],
  'Triceps Brachii': ['Triceps'],
  'Wrist Extensors': ['Wrist-Extensors', 'Forearms'],
  'Wrist Flexors': ['Wrist-Flexors', 'Forearms'],
  // New entries
  Abdominals: ['Rectus-Abdominis', 'Obliques', 'Core'],
  Abductors: ['Hip-Abductors'],
  Adductors: ['Hip-Adductors'],
  Arms: ['Biceps', 'Triceps', 'Upper-Arms', 'Forearms'],
  Back: ['Latissimus-Dorsi', 'Erector-Spinae', 'Teres Major', 'Trapezius'],
  Biceps: ['Biceps'],
  Calves: ['Gastrocnemius', 'Soleus'],
  Cardio: ['Cardio'],
  'Cardio-Functional': ['Cardio', 'Full-Body'],
  Chest: ['Pectoralis-Major-Clavicular', 'Pectoralis-Major-Sternocostal'],
  Forearms: ['Brachioradialis', 'Wrist-Flexors', 'Wrist-Extensors'],
  'Full Body': ['Full-Body'],
  Glutes: ['Gluteus-Maximus', 'Hip-Abductors'],
  Hamstrings: ['Hamstrings'],
  'Hip Flexors': ['Hip-Flexors', 'Iliopsoas'],
  Legs: [
    'Quadriceps',
    'Hamstrings',
    'Calves',
    'Hip-Abductors',
    'Hip-Adductors',
  ],
  Neck: ['Sternocleidomastoid', 'Upper-Trapezius'],
  Quads: ['Quadriceps'],
  Shoulders: ['Anterior-Deltoid', 'Lateral-Deltoid', 'Posterior-Deltoid'],
  Stretching: ['Stretching'],
  Triceps: ['Triceps'],
}

const svgStart = `<svg id="target-muscle" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 600 960" xml:space="preserve">`
const svgRest = `<path id="Base" d="M300 24.6c17.6.4 26.3 4.5 36.2 20 10.2 16 5.4 45.5 5.4 45.5 7.8-3.5 4.4 7.7 2.5 20.4-1.8 12.7-9.3 11.8-9.3 11.8-1.2 9.3-7.1 19-7.1 19s-1 15.1 0 19.5c.9 4.4 9.5 2.3 31.8 16.1 8.2 5.1 12.6 3.6 29.2 9.3 23.6 8.1 29.8 18.7 30.8 50.6 0 0 .1 9.9 3.5 16.7 1.9 3.8 17 20.6 19.5 59 0 0-.6 7.8 5.7 13.1 6.3 5.2 20.9 15.6 33 48 11.4 30.5 35.5 53.7 42.4 59.8 0 0 2.1 2.1 6.9 1.1 4.2-.8 14.1-1.2 21.3 1.8 7.2 2.9 14.9 3.8 19.3 3.6 4.5-.1 5.7 2.3 5.8 3.6.1 1.4-.8 3.4-4.7 4.5s-12 .1-15.7-.8-5.8-1.3-3.8 1.8c0 0 5.2 8 7.7 11.2s8.3 10.5 11.4 14.7c3.1 4.2 7 11 7.7 13.1.8 2.1.4 3.9-.6 4.7-1 .9-2.4 1.2-3.6.6 0 0 3.7 4.5 1.2 6.7s-5.6-.6-6.5-1.2c0 0-.3 1.5-.9 2.3-1 1-3.4 1.8-5.4.3-2-1.4-7.7-5.7-7.7-5.7s.2 1.3-.8 2.3-3.6.8-5.5-.1c-1.8-.9-12.6-9.3-14-10.5s-5.6-5-8-6.6c-2.5-1.5-9.5-7.2-12.6-12.2s-3.6-9.2-8.5-13.7c-4.8-4.5-53.2-46.8-61.7-53.4s-29.8-30.3-36.1-49c-6.3-18.7-6.5-23-11.5-29.2-3.9-4.9-8.8-12.7-12.3-21.1 0 0-4.1 10.6-11.5 20.6 0 0-5.6 8.4-5.7 19.5-.1 10.8-4.3 39.4-3.2 54.4.8 11.5 3.9 23.6 7.2 37.8 3.1 13.5 16.1 93.7 14.7 141.7-1.7 57.1-16.3 79.4-16.6 90-.4 10.7-1.6 19.4.4 27.9s9.8 25.3.2 65.7-11.4 99.8-10.8 110c.1 1.5.6 2.4.6 2.4 1.6 2.9 3 5.4 2.2 11.4-1 7.4 8.5 14.8 11.2 25s15 10.1 13.1 20.5c0 0-1.5 3.2-6.2 4.2-13.7 2.8-27.6 0-31.8 1.1-4.2 1.1-16.2 2.7-17-7.8-.8-10.4 2.3-23.1 2.5-30.6.2-6.5-2.2-13.8-1.5-20.6.1-.7.3-2 .3-2s3.8-24.8-1.6-48.1c0 0-17.7-55.2-16.6-83.8s9.8-43.8 4.7-59.7c-5.1-15.9-10.8-68.6-10.1-104.4.7-35.8-8.3-51.7-8-79.5 0 0 .3-1.6-1.6-1.6s-1.6 1.6-1.6 1.6c.4 27.9-8.7 43.7-8 79.5s-5 88.5-10.1 104.4 3.6 31.1 4.7 59.7-16.6 83.8-16.6 83.8c-5.4 23.3-1.6 48.1-1.6 48.1s.3 1.3.3 2c.6 6.8-1.7 14.1-1.5 20.6.2 7.5 3.3 20.2 2.5 30.6-.8 10.4-12.7 8.9-17 7.8-4.2-1.1-18.1 1.7-31.8-1.1-4.7-1-6.2-4.2-6.2-4.2-1.9-10.4 10.4-10.2 13.1-20.5 2.7-10.2 12.2-17.6 11.2-25-.8-6.1.6-8.5 2.2-11.4 0 0 .5-.9.6-2.4.6-10.2-1.2-69.6-10.8-110-9.6-40.3-1.8-57.2.2-65.7s.7-17.2.4-27.9c-.4-10.7-14.9-32.9-16.6-90-1.5-48 11.5-128.2 14.7-141.7 3.3-14.2 6.3-26.4 7.2-37.8 1.1-15-3.1-43.6-3.2-54.4-.1-11.1-5.7-19.5-5.7-19.5-7.3-10-11.5-20.6-11.5-20.6-3.5 8.4-8.4 16.2-12.3 21.1-5 6.2-5.2 10.6-11.5 29.2-6.3 18.7-27.5 42.4-36.1 49-8.5 6.6-56.9 48.9-61.7 53.4-4.8 4.5-5.4 8.7-8.5 13.7s-10.2 10.7-12.6 12.2c-2.5 1.5-6.7 5.3-8 6.6-1.4 1.2-12.2 9.6-14 10.5s-4.5 1.1-5.5.1-.8-2.3-.8-2.3-5.7 4.3-7.7 5.7c-2 1.4-4.4.7-5.4-.3-.7-.7-.9-2.3-.9-2.3-.8.7-4 3.4-6.5 1.2s1.2-6.7 1.2-6.7c-1.2.5-2.6.2-3.6-.6-.9-.8-1.3-2.6-.6-4.7.8-2.1 4.6-8.8 7.7-13.1 3.1-4.2 8.9-11.5 11.4-14.7s7.7-11.2 7.7-11.2c2-3-.1-2.6-3.8-1.8-3.7.8-11.8 1.9-15.7.8s-4.8-3.1-4.7-4.5c.1-1.3 1.4-3.7 5.8-3.6s12.2-.7 19.3-3.6c7.2-2.9 17.1-2.6 21.3-1.8 4.8 1 6.9-1.1 6.9-1.1 6.9-6.1 31.1-29.3 42.4-59.8 12.1-32.4 26.7-42.8 33-48s5.7-13.1 5.7-13.1c2.5-38.4 17.6-55.2 19.5-59 3.4-6.8 3.5-16.7 3.5-16.7 1-31.9 7.2-42.5 30.8-50.6 16.6-5.7 21-4.3 29.2-9.3 22.3-13.8 30.8-11.6 31.8-16.1.9-4.4 0-21.1 0-21.1s-5.9-8.2-7.1-17.4c0 0-7.4.9-9.3-11.8-1.8-12.7-5.2-23.8 2.5-20.4 0 0-4.9-29.5 5.4-45.5 9.9-15.5 18.5-19.6 36.1-20h.3z"></path><g id="Back"><path class="muscle Calves Soleus" d="M273.4 786.7s-2.8 2.8-6.1 4.5c-3.3 1.7-9.1 5-9.3 71 0 0 4.3-53.4 15.4-75.5z"></path><path class="muscle Calves Soleus" d="M248.6 886.5c-2.8-70.5-13.2-116.3-13.2-116.3s5.4 5.4 6.6 9.3c1.2 3.9 9.7 22.3 7.5 105l-.9 2z"></path><path class="muscle Calves Soleus" d="M326.7 786.7s2.8 2.8 6.1 4.5c3.3 1.7 9.1 5 9.3 71 0 0-4.3-53.4-15.4-75.5z"></path><path class="muscle Calves Soleus" d="M351.5 886.5c2.8-70.5 13.2-116.3 13.2-116.3s-5.4 5.4-6.6 9.3c-1.2 3.9-9.7 22.3-7.5 105l.9 2z"></path><path class="muscle Calves Gastrocnemius" d="M275.9 714.5c2.5 10.1 4.4 19.8 4.1 27.7-1.1 31.2-5.3 43.9-12.4 44.5s-11.4-4.8-10.5-38.1c.3-9.6.1-19-.3-28.2 0 0-1.3-32.8 1-55.5 0 0 7.9 16.8 12.3 21.6 0 .1 3.9 20.2 5.8 28z"></path><path class="muscle Calves Gastrocnemius" d="M251.3 763.7c-.4 18-9.9 7.6-13.8 3-3.9-4.6-9.2-22.4-7.8-43.9.6-8.5 3.3-19 6.4-28.6 0 0 4.9-11.7 3.2-26.6 0 0 6.1-6.7 7-19.2.1-.1 6.8 39.4 5 115.3z"></path><path class="muscle Calves Gastrocnemius" d="M324.2 714.5c-2.5 10.1-4.4 19.8-4.1 27.7 1.1 31.2 5.3 43.9 12.4 44.5s11.4-4.8 10.5-38.1c-.3-9.6-.1-19 .3-28.2 0 0 1.3-32.8-1-55.5 0 0-7.9 16.8-12.3 21.6 0 .1-3.9 20.2-5.8 28z"></path><path class="muscle Calves Gastrocnemius" d="M348.7 763.7c.4 18 9.9 7.6 13.8 3s9.2-22.4 7.8-43.9c-.6-8.5-3.3-19-6.4-28.6 0 0-4.9-11.7-3.2-26.6 0 0-6.1-6.7-7-19.2 0-.1-6.7 39.4-5 115.3z"></path><path class="muscle Thighs Hamstrings" d="M254.7 518.4s37.2 94 16.9 162.2c0 0-14.8-20.3-15.8-43.5-4.2-95.2-2.6-95.2-1.1-118.7z"></path><path class="muscle Thighs Hamstrings" d="M249.6 519.4s-3 39.8-2.7 49.2c.2 9.4 2.3 70.5-9.3 92.8 0-.1-33.3-121.5 12-142z"></path><path class="muscle Thighs Hamstrings" d="M345.4 518.4s-37.2 94-16.9 162.2c0 0 14.8-20.3 15.8-43.5 4.2-95.2 2.6-95.2 1.1-118.7z"></path><path class="muscle Thighs Hamstrings" d="M350.5 519.4s3 39.8 2.7 49.2c-.2 9.4-2.3 70.5 9.3 92.8 0-.1 33.2-121.5-12-142z"></path><path class="muscle Thighs Hip-Abductors" d="M224.1 497.6s4.8 22.5 1.4 34.6c-3.4 12.1-6.6 54.6-4.4 67.3.1 0-8.8-50.5 3-101.9z"></path><path class="muscle Thighs Hip-Abductors" d="M375.9 497.6s-4.8 22.5-1.4 34.6c3.4 12.1 6.6 54.6 4.4 67.3 0 0 8.9-50.5-3-101.9z"></path><path class="muscle Hips Hip-Adductors" d="M283.9 630.2c2.7-10.6 0-54.9.2-66.5s5.9-56.9 5.9-56.9-12.7 11.7-29.7 11.2c0 0 22.1 41.1 23.6 112v.2z"></path><path class="muscle Hips Hip-Adductors" d="M316.1 630.2c-2.7-10.6 0-54.9-.2-66.5s-5.9-56.9-5.9-56.9 12.7 11.7 29.7 11.2c0 0-22.1 41.1-23.6 112v.2z"></path><path class="muscle Hips Gluteus-Maximus Hip-External-Rotators Hip-Abductors" d="M232.8 523.6s9.6-11.9 33.4-12.8c27.4-1.1 34.7-31.5 25.3-51.3-7.7-16.1-18.1-15.8-37.2-55.9 0 0-36 35.4-21.5 120z"></path><path class="muscle Hips Gluteus-Maximus Hip-External-Rotators Hip-Abductors" d="M369.2 521s-12.3-9.3-36.1-10.2c-27.4-1.1-34.7-31.5-25.3-51.3 7.7-16.1 18.1-15.8 37.2-55.9 0 0 38.6 32.8 24.2 117.4z"></path><path class="muscle Core Quadratus-Lumborum Erector-Spinae" d="M294.9 327.8s-3.7 27.7-36.3 64.8c0 0 14.2 35.4 35.7 55.3.1.1 2-108.5.6-120.1z"></path><path class="muscle Core Quadratus-Lumborum Erector-Spinae" d="M304.3 327.8s3.7 27.7 36.3 64.8c0 0-14.2 35.4-35.7 55.3 0 .1-1.9-108.5-.6-120.1z"></path><path class="muscle Core Obliques" d="M245.4 403.6c-2.4 3.1-5.4 6.7-7.4 9.7 0 0 4.8-17.2-2.3-78.6 0 0 10 11.8 14.3 38.1.1 0 1.6 22.8-4.6 30.8z"></path><path class="muscle Core Obliques" d="M352.7 393.9c2.4 3.1 5.4 6.7 7.4 9.7 0 0-3.6-7.5 3.5-68.9 0 0-10 11.8-14.3 38.1-.1 0-2.9 13.1 3.4 21.1z"></path><path class="muscle Back Latissimus-Dorsi" d="M277.5 267.7c3.1 8 8.4 18.3 16.9 24.9v9.4c0 33.6-39.6 86.7-39.6 86.7s5.7-38.3-19.5-62.3c-12.3-11.7-17.1-31.2-17.1-31.2-9.2-24.6-9.1-55.2-9.1-55.2s29.1 9.6 49.4 10.9c13.7.8 19 16.8 19 16.8-.1-.2-.1-.4-.2-.6l.2.6z"></path><path class="muscle Back Latissimus-Dorsi" d="M321.8 267.7c-3.1 8-8.4 18.3-16.9 24.9v9.4c0 33.6 39.6 86.7 39.6 86.7s-5.7-38.3 19.5-62.3c12.3-11.7 17.1-31.2 17.1-31.2 9.2-24.6 9.1-55.2 9.1-55.2s-29.1 9.6-49.4 10.9c-13.8.8-19 16.8-19 16.8.1-.2.1-.4.2-.6l-.2.6z"></path><path class="muscle Back Rhomboid Subscapularis Infraspinatus Teres-Minor" d="M236.8 193.7c29.5 19.8 33.2 51.5 33.2 51.5-34.9.1-54.5-9.8-54.5-9.8s22.7-12.7 21.3-41.7z"></path><path class="muscle Back Rhomboid Subscapularis Infraspinatus Teres-Minor" d="M362.5 193.7c-29.5 19.8-33.2 51.5-33.2 51.5 34.9.1 54.5-9.8 54.5-9.8s-22.7-12.7-21.3-41.7z"></path><path class="muscle Back Middle-Trapezius Lower-Trapezius" d="M234.9 186.7c8.1-1.9 45.1-1.9 61.3-.6-.4 43.4-1 98.1-1 98.1-9.8-8.8-19.2-43.1-21.2-51.8 0 0-10.3-34.9-39.2-45.2-.3-.1-.2-.5.1-.5z"></path><path class="muscle Back Middle-Trapezius Lower-Trapezius" d="M364.4 186.7c-8.1-1.9-45.1-1.9-61.3-.6.4 43.4 1 98.1 1 98.1 9.8-8.8 19.2-43.1 21.2-51.8 0 0 10.3-34.9 39.2-45.2.2-.1.2-.5-.1-.5z"></path><path class="muscle Back Upper-Trapezius" d="M242.9 180.6c1.1-2.9 16-8.4 27-11.4 0 0 23-4 23.1-37 0 0 0-3.1 1.9-3 2 0 1.6 1.6 1.8 3.6 0 .7.8 46.5-.4 47.8-10.3.1-25.3-.9-53.4 0z"></path><path class="muscle Back Upper-Trapezius" d="M356.3 180.6c-1.1-2.9-16-8.4-27-11.4 0 0-23-4-23.1-37 0 0 0-3.1-1.9-3-2 0-1.6 1.6-1.8 3.6 0 .7-.8 46.5.4 47.8 10.3.1 25.3-.9 53.4 0z"></path><path class="muscle Back Levator-Scapulae" d="M323.2 159.3s-12.8-5.4-12.8-29.5c0 0 11.3 5.5 12.2 13s0 11.1.6 16.5z"></path><path class="muscle Back Levator-Scapulae" d="M276.1 159.3s12.8-5.4 12.8-29.5c0 0-11.3 5.5-12.2 13-.8 7.6 0 11.1-.6 16.5z"></path><path class="muscle Forearms Brachioradialis" d="M160.3 324.8s-18.2 14.6-24.9 26.9c-5.9 10.7-17 39.1-28.6 53.9-2.9 3.7-12.2 14.9-12.2 14.9s25.3-22.1 36.7-36.8c11.4-15 21-21.5 29-58.9z"></path><path class="muscle Forearms Brachioradialis" d="M438.9 324.8s18.2 14.6 24.9 26.9c5.9 10.7 17 39.1 28.6 53.9 2.9 3.7 12.2 14.9 12.2 14.9s-25.3-22.1-36.7-36.8c-11.4-15-20.9-21.5-29-58.9z"></path><path class="muscle Forearms Forearm-Supinators" d="M188 331.7c.8-3.3-23.4 4.6-26.7 13.4-3.3 8.7-11.4 28.2-32.2 47.4 0 0 13-7.1 19.1-9.6 6.1-2.6 30.6-14.8 39.8-51.2z"></path><path class="muscle Forearms Forearm-Supinators" d="M411.3 331.7c-.8-3.3 23.4 4.6 26.7 13.4 3.3 8.7 11.4 28.2 32.2 47.4 0 0-13-7.1-19.1-9.6-6.2-2.6-30.7-14.8-39.8-51.2z"></path><path class="muscle Forearms Wrist-Extensors" d="M186.1 346.6s-9.3 28-39.9 43.4c-28.9 14.5-62.7 49.8-62.7 49.8s37.9-27.5 58.6-37.9c21.9-10.9 39.4-30.8 44-55.3z"></path><path class="muscle Forearms Wrist-Extensors" d="M413.1 346.6s9.3 28 39.9 43.4c28.9 14.5 62.7 49.8 62.7 49.8s-37.9-27.5-58.6-37.9c-21.8-10.9-39.3-30.8-44-55.3z"></path><path class="muscle Forearms Wrist-Flexors" d="M132.6 413.4s-29.1 18.9-37.6 25.1-4.8 7.4-2.2 7.5c2.5.1 7.2-3.5 13-8.8 6.7-6.1 26.8-23.8 26.8-23.8z"></path><path class="muscle Forearms Wrist-Flexors" d="M466.6 413.4s29.1 18.9 37.6 25.1 4.8 7.4 2.2 7.5c-2.5.1-7.2-3.5-13-8.8-6.6-6.1-26.8-23.8-26.8-23.8z"></path><path class="muscle Upper-Arms Biceps" d="M183.1 254s-20.2 22.4-21.4 60.3c-.1.1 15.4-27.9 21.4-60.3z"></path><path class="muscle Upper-Arms Biceps" d="M416.2 254s20.2 22.4 21.4 60.3c0 .1-15.5-27.9-21.4-60.3z"></path><path class="muscle Upper-Arms Triceps" d="M204.2 240s-21.9 14.7-19.7 38c2.2 23.4 9.1 34.1 1.6 46.7 0 0 19.4-3.3 23-21.4 3.7-18-4.3-33.4-4.9-63.3z"></path><path class="muscle Upper-Arms Triceps" d="M180.9 282.4s4.4 27.4 1.6 36.3c-2.8 8.9-9 12.8-13.5 12.4s-4.3-11.5 1.9-23c6.1-11.5 9-18.5 10-25.7z"></path><path class="muscle Upper-Arms Triceps" d="M418.4 282.4s-4.4 27.4-1.6 36.3 9 12.8 13.5 12.4 4.3-11.5-1.9-23c-6.1-11.5-9-18.5-10-25.7z"></path><path class="muscle Upper-Arms Triceps" d="M395 240s21.9 14.7 19.7 38c-2.2 23.4-9.1 34.1-1.6 46.7 0 0-19.4-3.3-23-21.4-3.6-18 4.4-33.4 4.9-63.3z"></path><path class="muscle Shoulders Posterior-Deltoid" d="M230.2 187.8s-27 18.3-40.1 55.6c0 0 17.1-7.4 30.6-21.6 13.3-13.9 15.2-25.3 9.5-34z"></path><path class="muscle Shoulders Posterior-Deltoid" d="M369.8 187.8s27 18.3 40.1 55.6c0 0-17.1-7.4-30.6-21.6-13.3-13.9-15.2-25.3-9.5-34z"></path><path class="muscle Shoulders Lateral-Deltoid" d="M186.1 241.5s-1.8-24.7 6.2-36 21-16.1 33.9-19.5c0 0-26.3 17.5-40.1 55.5z"></path><path class="muscle Shoulders Lateral-Deltoid" d="M413.9 241.5s1.8-24.7-6.2-36-21-16.1-33.9-19.5c0 0 26.3 17.5 40.1 55.5z"></path></g><g id="Front"><path class="muscle Calves Soleus" d="M273.3 695.8s10.5 29.2 7.2 58c-2.5 22.4-24.1 100.3-24.1 100.3s6-69.3 16.9-158.3z"></path><path class="muscle Calves Soleus" d="M327.1 695.8s-10.5 29.2-7.2 58c2.5 22.4 24.1 100.3 24.1 100.3s-6-69.3-16.9-158.3z"></path><path class="muscle Calves Tibialis-Anterior" d="M238.8 682.6s-13.7 35.1-7.2 61.3 16 64.3 16.2 113.8c0 0 6.8-33.6 2.9-92.9-2.2-33-3.7-61.2-11.9-82.2z"></path><path class="muscle Calves Tibialis-Anterior" d="M361.6 682.6s13.7 35.1 7.2 61.3-16 64.3-16.2 113.8c0 0-6.8-33.6-2.9-92.9 2.2-33 3.7-61.2 11.9-82.2z"></path><path class="muscle Thighs Quadriceps" d="M240.3 435.7s-12.5 71.1 14.5 190.7c0 0 26.7-44.8 21.5-96.9-2.7-27.1-36-93.8-36-93.8z"></path><path class="muscle Thighs Quadriceps" d="M228.8 488.6s4.2 93.8 21.1 148.2c0 0 4.4 8.1-7.4 25.3-5.3 7.7-15-13.1-19.9-47.8-5-34.7 6.2-125.7 6.2-125.7z"></path><path class="muscle Thighs Quadriceps" d="M283.7 553.7S275 609 263 628.3c-10.2 16.3-2.7 32.3 4 36.5 6.3 4.1 22.8-15.4 16.7-111.1z"></path><path class="muscle Thighs Quadriceps" d="M360.1 435.7s12.5 71.1-14.5 190.7c0 0-26.7-44.8-21.5-96.9 2.7-27.1 36-93.8 36-93.8z"></path><path class="muscle Thighs Quadriceps" d="M371.6 488.6s-4.2 93.8-21.1 148.2c0 0-4.4 8.1 7.4 25.3 5.3 7.7 15-13.1 19.9-47.8 5-34.7-6.2-125.7-6.2-125.7z"></path><path class="muscle Thighs Quadriceps" d="M316.7 553.7s8.7 55.3 20.7 74.6c10.2 16.3 2.7 32.3-4 36.5-6.3 4.1-22.8-15.4-16.7-111.1z"></path><path class="muscle Hips Hip-Adductors" d="M244.4 431.4s49.8 40 49.8 48.6c0 30.5-9.5 66.5-9.5 66.5s3.6-49.5-40.3-115.1z"></path><path class="muscle Hips Hip-Adductors" d="M356 431.4s-49.8 40-49.8 48.6c0 30.5 9.5 66.5 9.5 66.5S312.1 497 356 431.4z"></path><path class="muscle Core Rectus-Abdominis" d="M293.5 299.5s1.7-7.3 0-14.1c-1.8-6.8-9.6-5.7-19.9-2.3-10.2 3.4-14.8 16.3-16.2 27.3 0-.1 19.8-14.6 36.1-10.9z"></path><path class="muscle Core Rectus-Abdominis" d="M282.4 307.5c-7.1.7-13.7 4.8-19.4 8.4 0 0-5.7 2.9-5.1 10 .5 5.3.8 12.1.8 12.1s19.1-6.6 35.2-5.3c0 0 .8-13.3 0-19.1-.9-5.9-6.8-6.6-11.5-6.1z"></path><path class="muscle Core Rectus-Abdominis" d="M260.2 349.3s-.3-4.7 4-5.6c5.7-1.3 18.2-3.9 26.7-3.4 0 0 3 .1 3.3 4.1.4 5.3.9 25.7.9 25.7s-34.5 4.7-34.9-20.8z"></path><path class="muscle Core Rectus-Abdominis" d="M263 370.4s7.8 8.3 28.3 8.1c0 0 4.3-.1 4.6 5 .4 6.7 0 71.2 0 71.2s-29-6.5-32.9-84.3z"></path><path class="muscle Core Rectus-Abdominis" d="M306.2 299.5s-1.7-7.3 0-14.1c1.8-6.8 9.6-5.7 19.9-2.3 10.2 3.4 14.8 16.3 16.2 27.3-.1-.1-19.9-14.6-36.1-10.9z"></path><path class="muscle Core Rectus-Abdominis" d="M317.3 307.5c7.1.7 13.7 4.8 19.4 8.4 0 0 5.7 2.9 5.1 10-.5 5.3-.8 12.1-.8 12.1s-19.1-6.6-35.2-5.3c0 0-.8-13.3 0-19.1.9-5.9 6.7-6.6 11.5-6.1z"></path><path class="muscle Core Rectus-Abdominis" d="M339.4 349.3s.3-4.7-4-5.6c-5.7-1.3-18.2-3.9-26.7-3.4 0 0-3 .1-3.3 4.1-.4 5.3-.9 25.7-.9 25.7s34.5 4.7 34.9-20.8z"></path><path class="muscle Core Rectus-Abdominis" d="M336.6 370.4s-7.8 8.3-28.3 8.1c0 0-4.3-.1-4.6 5-.4 6.7 0 71.2 0 71.2s29-6.5 32.9-84.3z"></path><path class="muscle Core Obliques" d="M238.5 345.4s12 5.8 13.8 17.3 4.3 55.8 11.4 73.1c0 0-18.9-8.4-21.7-22.8-2.8-14.5 1.9-26.8-3.5-67.6z"></path><path class="muscle Core Obliques" d="M361.5 345.4s-12 5.8-13.8 17.3-4.3 55.8-11.4 73.1c0 0 18.9-8.4 21.7-22.8 2.8-14.5-1.9-26.8 3.5-67.6z"></path><path class="muscle Chest Serratus-Anterior" d="M233.3 310.3s5.9 3.9 12.2 4.5c6.2.7 6.4 8.4 1.8 8.5-4.7.2-11.3-2.2-14-13z"></path><path class="muscle Chest Serratus-Anterior" d="M232.7 293.6s6.5 3.8 13.2 4.2c6.7.5 7.1 8.5 2.1 8.8-4.9.3-12.1-1.8-15.3-13z"></path><path class="muscle Chest Serratus-Anterior" d="M233.6 277s6.9 4 14.3 4.6c7.4.7 7.2 8.7 1.6 8.8-5.6.2-13.3-2.2-15.9-13.4z"></path><path class="muscle Chest Serratus-Anterior" d="M235.5 327.8s4.3 3.8 11.3 4.4c0 0 1.9-.2 2.6 3 .7 3.3-3.1 4.5-6 4-3-.4-7-3.5-7.9-11.4z"></path><path class="muscle Chest Serratus-Anterior" d="M366.7 310.3s-5.9 3.9-12.2 4.5c-6.2.7-6.4 8.4-1.8 8.5 4.7.2 11.3-2.2 14-13z"></path><path class="muscle Chest Serratus-Anterior" d="M367.3 293.6s-6.5 3.8-13.2 4.2c-6.7.5-7.1 8.5-2.1 8.8 4.9.3 12.1-1.8 15.3-13z"></path><path class="muscle Chest Serratus-Anterior" d="M366.4 277s-6.9 4-14.3 4.6c-7.4.7-7.2 8.7-1.6 8.8 5.6.2 13.3-2.2 15.9-13.4z"></path><path class="muscle Chest Serratus-Anterior" d="M364.5 327.8s-4.3 3.8-11.3 4.4c0 0-1.9-.2-2.6 3-.7 3.3 3.1 4.5 6 4 3-.4 7-3.5 7.9-11.4z"></path><path class="muscle Chest Pectoralis-Major-Sternocostal" d="M295.4 216.2c.6 11.6 1.7 27-.6 36.6-2.6 10.9-3.8 26.5-37.3 21.4-35-5.3-49-33.6-49-33.6s9.3-6 17-15.2c7.5-2.7 56.5-12.7 69.9-9.2z"></path><path class="muscle Chest Pectoralis-Major-Sternocostal" d="M304.7 216.2c-.6 11.6-1.7 27 .6 36.6 2.6 10.9 3.8 26.5 37.3 21.4 35-5.3 49-33.6 49-33.6s-9.3-6-17-15.2c-7.6-2.7-56.6-12.7-69.9-9.2z"></path><path class="muscle Chest Pectoralis-Major-Clavicular" d="M252.2 193.2c11.8-.3 25.7.6 32.9 1.7 0 0 9.6 1.2 10 15.1-21.1-.3-35.1.7-64.6 9 8-12.3 7.5-25.5 21.7-25.8z"></path><path class="muscle Chest Pectoralis-Major-Clavicular" d="M347.8 193.2c-11.8-.3-25.7.6-32.9 1.7 0 0-9.6 1.2-10 15.1 21.1-.3 35.1.7 64.6 9-7.9-12.3-7.5-25.5-21.7-25.8z"></path><path class="muscle Back Latissimus-Dorsi" d="M210.3 252.3s8.4 49.9 19.9 63.6c0 0-5-20.3-2.6-32.9 2.4-12.6.3-9.5-17.3-30.7z"></path><path class="muscle Back Latissimus-Dorsi" d="M389.7 252.3s-8.4 49.9-19.9 63.6c0 0 5-20.3 2.6-32.9-2.4-12.6-.3-9.5 17.3-30.7z"></path><path class="muscle Back Upper-Trapezius" d="M240.1 187.9c26-1.8 46.9 3.2 45.1.2-7.8-12.7-13.3-21.1-13.3-21.1-11.2 2.9-23.4 10.5-30.9 15.8 0 0-8.5 5.7-.9 5.1z"></path><path class="muscle Back Upper-Trapezius" d="M359.9 187.9c-26-1.8-46.9 3.2-45.1.2 7.8-12.7 13.3-21.1 13.3-21.1 11.2 2.9 23.4 10.5 30.9 15.8 0 0 8.5 5.7.9 5.1z"></path><path class="muscle Forearms Brachioradialis" d="M160.1 328.5s4.9 19.6-3 31.5-22.5 38-73.8 75.8c0 0 21.1-18 32.3-43.2 6.9-15.7 11.1-30.7 21.8-43.3 10.6-12.6 22.7-20.8 22.7-20.8z"></path><path class="muscle Forearms Brachioradialis" d="M439.9 328.5s-4.9 19.6 3 31.5 22.5 38 73.8 75.8c0 0-21.1-18-32.3-43.2-6.9-15.7-11.1-30.7-21.8-43.3-10.6-12.6-22.7-20.8-22.7-20.8z"></path><path class="muscle Forearms Wrist-Flexors" d="M95 442.5s63.9-45.7 81.7-71c17.8-25.2 12.9-40.3 12.9-40.3s-14.8 6.9-20.8 15.1c-5.9 8.2-10.1 21.5-24.2 40.6-16 21.5-49.6 55.6-49.6 55.6z"></path><path class="muscle Forearms Wrist-Flexors" d="M505 442.5s-63.9-45.7-81.7-71c-17.8-25.2-12.9-40.3-12.9-40.3s14.8 6.9 20.8 15.1c5.9 8.2 10.1 21.5 24.2 40.6 16 21.5 49.6 55.6 49.6 55.6z"></path><path class="muscle Upper-Arms Biceps" d="M201.4 244.7s-26.8 13.8-32.7 34.8c-10.4 36.7-1.9 57.7-2.7 63.4 0 0 17.4-17.7 24.5-30.7 12.1-22 20.6-44 10.9-67.5z"></path><path class="muscle Upper-Arms Biceps" d="M398.6 244.7s26.8 13.8 32.7 34.8c10.4 36.7 1.9 57.7 2.7 63.4 0 0-17.4-17.7-24.5-30.7-12.1-22-20.6-44-10.9-67.5z"></path><path class="muscle Upper-Arms Triceps" d="M209.1 271.8s0 26.8-24.7 56.7c0 0 12.4-2.7 21.6-17.5 9.3-14.9 3.1-39.2 3.1-39.2z"></path><path class="muscle Upper-Arms Triceps" d="M390.9 271.8s0 26.8 24.7 56.7c0 0-12.4-2.7-21.6-17.5-9.3-14.9-3.1-39.2-3.1-39.2z"></path><path class="muscle Shoulders Lateral-Deltoid" d="M413.9 241.5s1.8-24.7-6.2-36-21-16.1-33.9-19.5c0 0 26.3 17.5 40.1 55.5z"></path><path class="muscle Shoulders Lateral-Deltoid" d="M186.1 241.5s-1.8-24.7 6.2-36 21-16.1 33.9-19.5c0 0-26.3 17.5-40.1 55.5z"></path><path class="muscle Shoulders Anterior-Deltoid" d="M369.8 187.8s31 25.3 44.1 62.6c0 0-21.1-14.4-34.6-28.6-13.3-13.9-15.2-25.3-9.5-34z"></path><path class="muscle Shoulders Anterior-Deltoid" d="M230.2 187.8s-31 25.3-44.1 62.6c0 0 21.1-14.4 34.6-28.6 13.3-13.9 15.2-25.3 9.5-34z"></path></g></svg>`
