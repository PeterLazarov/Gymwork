export const muscleSvgMappings = {
  "Abductor Brevis": ["Hip-Abductors"],
  "Adductor Brevis": ["Hip-Adductors"],
  "Adductor Longus": ["Hip-Adductors"],
  "Adductor Magnus": ["Hip-Adductors"],
  "Anterior Deltoid": ["Anterior-Deltoid"],
  "Biceps Brachii": ["Biceps"],
  "Brachialis": ["Upper-Arms"],
  "Brachioradialis": ["Brachioradialis", "Forearms"],
  "Clavicular Head": ["Pectoralis-Major-Clavicular"],
  "Erector Spinae": ["Erector-Spinae", "Core"],
  "Gastrocnemius": ["Gastrocnemius", "Calves"],
  "Gluteus Maximus": ["Gluteus-Maximus"],
  "Gluteus Medius": ["Hip-Abductors"],
  "Gracilis": ["Hip-Adductors"],
  "Hamstring": ["Hamstrings"],
  "Hip Flexor": ["Hips"],
  "Iliopsoas": ["Hip-External-Rotators", "Hips"],
  "Infraspinatus": ["Infraspinatus"],
  "Lateral Deltoid": ["Lateral-Deltoid"],
  "Latissimus Dorsi": ["Latissimus-Dorsi"],
  "Levator Scapulae": ["Levator-Scapulae"],
  "Obliques": ["Obliques", "Core"],
  "Pectineous": ["Hip-Adductors"],
  "Pectoralis Major Clavicular Head": ["Pectoralis-Major-Clavicular"],
  "Pectoralis Major Sternal Head": ["Pectoralis-Major-Sternocostal"],
  "Popliteus": ["Quadriceps"],
  "Posterior Deltoid": ["Posterior-Deltoid"],
  "Quadriceps": ["Quadriceps"],
  "Rectus Abdominis": ["Rectus-Abdominis", "Core"],
  "Sartorius": ["Quadriceps"],
  "Serratus Anterior": ["Serratus-Anterior"],
  "Soleus": ["Soleus", "Calves"],
  "Splenius": ["Upper-Trapezius"],
  "Sternocleidomastoid": ["Upper-Trapezius"],
  "Tensor Fasciae Latae": ["Hip-Abductors"],
  "Teres Major": ["Back"],
  "Teres Minor": ["Teres-Minor"],
  "Tibialis Anterior": ["Tibialis-Anterior"],
  "Trapezius Lower Fibers": ["Lower-Trapezius"],
  "Trapezius Middle Fibers": ["Middle-Trapezius"],
  "Trapezius Upper Fibers": ["Upper-Trapezius"],
  "Triceps Brachii": ["Triceps"],
  "Wrist Extensors": ["Wrist-Extensors", "Forearms"],
  "Wrist Flexors": ["Wrist-Flexors", "Forearms"],
}

export const muscleAreaToMusclesMapping = {
  "Abdominals": ["Rectus Abdominis", "Obliques"],
  "Abductors": ["Abductor Brevis", "Gluteus Medius", "Tensor Fasciae Latae"],
  "Adductors": ["Adductor Brevis", "Adductor Longus", "Adductor Magnus", "Gracilis", "Pectineous"],
  "Arms": [
    "Biceps Brachii",
    "Triceps Brachii",
    "Brachialis",
    "Brachioradialis",
    "Wrist Extensors",
    "Wrist Flexors",
  ],
  "Back": [
    "Latissimus Dorsi",
    "Erector Spinae",
    "Teres Major",
    "Trapezius Lower Fibers",
    "Trapezius Middle Fibers",
    "Trapezius Upper Fibers",
    "Levator Scapulae",
  ],
  "Biceps": ["Biceps Brachii"],
  "Calves": ["Gastrocnemius", "Soleus"],
  "Cardio": [], // No specific muscles for cardio
  "Cardio-Functional": [], // No specific muscles for cardio-functional
  "Chest": [
    "Pectoralis Major Clavicular Head",
    "Pectoralis Major Sternal Head",
    "Clavicular Head",
    "Serratus Anterior",
  ],
  "Forearms": ["Brachioradialis", "Wrist Flexors", "Wrist Extensors"],
  "Full Body": [], // No specific muscles for full body
  "Glutes": ["Gluteus Maximus", "Gluteus Medius"],
  "Hamstrings": ["Hamstring"],
  "Hip Flexors": ["Hip Flexor", "Iliopsoas"],
  "Legs": [
    "Quadriceps",
    "Hamstring",
    "Gastrocnemius",
    "Soleus",
    "Abductor Brevis",
    "Gluteus Medius",
    "Tensor Fasciae Latae",
    "Adductor Brevis",
    "Adductor Longus",
    "Adductor Magnus",
    "Gracilis",
    "Pectineous",
    "Tibialis Anterior",
    "Sartorius",
    "Popliteus",
  ],
  "Neck": ["Sternocleidomastoid", "Splenius"],
  "Quads": ["Quadriceps", "Sartorius", "Popliteus"],
  "Shoulders": [
    "Anterior Deltoid",
    "Lateral Deltoid",
    "Posterior Deltoid",
    "Infraspinatus",
    "Teres Minor",
  ],
  "Stretching": [], // No specific muscles for stretching
  "Triceps": ["Triceps Brachii"],
}

export const muscleToMuscleAreasMapping: Record<string, string[]> = {}
Object.entries(muscleAreaToMusclesMapping).forEach(([muscleArea, musclesList]) => {
  musclesList.forEach((muscle) => {
    if (!muscleToMuscleAreasMapping[muscle]) {
      muscleToMuscleAreasMapping[muscle] = []
    }
    muscleToMuscleAreasMapping[muscle].push(muscleArea)
  })
})
