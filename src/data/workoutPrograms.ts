
import { WorkoutProgram } from '@/types/workoutProgram';

export const workoutPrograms: WorkoutProgram[] = [
  {
    id: 'bodyweight-7day',
    name: 'Body Weight Mastery',
    description: '7-Day Progressive Bodyweight Training Program',
    type: 'bodyweight',
    level: 'Beginner-Intermediate',
    duration: '7 Days',
    equipment: ['No Equipment Needed'],
    days: [
      {
        dayNumber: 1,
        title: 'Core Foundation & Stability',
        theme: 'Building Your Foundation',
        introduction: [
          "Welcome to Day 1 of your Body Weight Mastery journey! Today we focus on establishing a rock-solid foundation through core stability and fundamental movement patterns.",
          "Remember, 'Master the small, master it all.' Every great journey begins with mastering the fundamentals, and today we're laying the groundwork for your transformation.",
          "By mastering the seemingly insignificant core stabilization exercises, you unlock the potential for significant mastery in all future movements."
        ],
        mindsetMoment: {
          theme: "Foundation and Stability",
          positioning: "Sit comfortably with your spine tall and shoulders relaxed",
          breathingPattern: "Take 5 deep breaths, focusing on expanding your ribcage and engaging your deep core muscles",
          affirmation: "*I am building a strong foundation for lasting transformation*",
          visualization: "Visualize your core as the central pillar of strength that supports every movement you make",
          closingAwareness: "Feel the connection between your breath and your core stability",
          drUQuote: "The foundation of a purposeful and passionate life, marked by healing and progression, is the mastery of its smallest, intentional actions."
        },
        movementPreparation: {
          title: "Movement Preparation",
          emoji: "🔥",
          duration: "10-15 minutes",
          exercises: [
            {
              id: "cat-cow",
              name: "Cat-Cow Stretch",
              description: "Dynamic spinal mobility exercise",
              instructions: [
                "Start on hands and knees in tabletop position",
                "Arch your back and lift your head (Cow)",
                "Round your spine and tuck your chin (Cat)",
                "Move slowly and controlled between positions"
              ],
              technicalCues: ["Keep wrists under shoulders", "Knees under hips"],
              somaticCues: ["Feel the gentle wave motion through your spine"],
              beginnerModification: "Perform smaller range of motion",
              advancedModification: "Add arm reaches during the movement",
              commonMistakes: ["Moving too quickly", "Not engaging core"],
              videoUrl: "https://youtube.com/placeholder-cat-cow",
              duration: "2 minutes",
              reps: "10 slow reps each direction"
            },
            {
              id: "dead-bug-prep",
              name: "Dead Bug Preparation",
              description: "Core stability preparation exercise",
              instructions: [
                "Lie on back with knees bent at 90 degrees",
                "Press lower back into floor",
                "Extend one arm overhead while lowering opposite leg",
                "Return to start and alternate sides"
              ],
              technicalCues: ["Maintain lower back contact with floor"],
              somaticCues: ["Feel your deep core muscles engaging"],
              beginnerModification: "Keep feet on ground, just move arms",
              advancedModification: "Hold weights in hands",
              commonMistakes: ["Arching lower back", "Moving too fast"],
              videoUrl: "https://youtube.com/placeholder-dead-bug-prep",
              duration: "2 minutes",
              reps: "8 reps each side"
            }
          ]
        },
        mainWorkout: {
          title: "Main Workout Section",
          emoji: "🏆",
          duration: "20 minutes",
          instructions: [
            "Perform 3 rounds of the following circuit",
            "30-45 seconds rest between exercises",
            "2 minutes rest between rounds"
          ],
          exercises: [
            {
              id: "plank-hold",
              name: "Plank Hold",
              description: "Fundamental core stability exercise",
              instructions: [
                "Start in push-up position",
                "Keep body in straight line from head to heels",
                "Engage core and breathe normally",
                "Hold for prescribed time"
              ],
              technicalCues: ["Neutral spine", "Active shoulders"],
              somaticCues: ["Feel your entire core working as one unit"],
              beginnerModification: "Drop to knees or use incline",
              advancedModification: "Add leg lifts or arm reaches",
              commonMistakes: ["Sagging hips", "Holding breath"],
              videoUrl: "https://youtube.com/placeholder-plank-hold",
              duration: "30-60 seconds"
            },
            {
              id: "glute-bridge",
              name: "Glute Bridge",
              description: "Hip and glute strengthening exercise",
              instructions: [
                "Lie on back with knees bent",
                "Squeeze glutes and lift hips up",
                "Create straight line from knees to shoulders",
                "Lower with control"
              ],
              technicalCues: ["Drive through heels", "Squeeze glutes at top"],
              somaticCues: ["Feel the power from your posterior chain"],
              beginnerModification: "Hold for shorter time",
              advancedModification: "Single leg or add pause at top",
              commonMistakes: ["Using back instead of glutes", "Not full hip extension"],
              videoUrl: "https://youtube.com/placeholder-glute-bridge",
              reps: "12-15 reps"
            }
          ]
        },
        coolDown: {
          title: "Cool Down & Reflect",
          emoji: "🧘",
          duration: "10 minutes",
          exercises: [
            {
              id: "child-pose",
              name: "Child's Pose",
              description: "Restorative spinal stretch",
              instructions: [
                "Kneel on floor with big toes touching",
                "Sit back on heels and fold forward",
                "Extend arms in front or by sides",
                "Breathe deeply and relax"
              ],
              technicalCues: ["Relax shoulders away from ears"],
              somaticCues: ["Feel the gentle stretch through your back"],
              beginnerModification: "Place pillow under knees",
              advancedModification: "Reach arms to one side for lateral stretch",
              commonMistakes: ["Forcing the position"],
              videoUrl: "https://youtube.com/placeholder-child-pose",
              duration: "45 seconds"
            }
          ]
        },
        keyTakeaways: [
          "Foundation building is the key to all future progress",
          "Quality of movement matters more than quantity",
          "Your core is the center of all strength",
          "Consistency in small actions creates massive results"
        ],
        tomorrowPreview: "Tomorrow we'll build upon your core foundation with dynamic lower body strength and power movements.",
        cta: {
          text: "Discover how your genetics affect your strength development with our DNA Kit",
          product: "DNA Kit",
          link: "#dna-kit"
        }
      },
      {
        dayNumber: 2,
        title: 'Lower Body Strength & Power',
        theme: 'Building Powerful Legs',
        introduction: [
          "Welcome to Day 2 of your Body Weight Mastery journey! Today we focus on developing lower body strength and explosive power through fundamental movement patterns.",
          "Your legs are your foundation for movement in life. By mastering the seemingly insignificant details of squat and lunge mechanics, you unlock the potential for significant mastery in all athletic endeavors.",
          "Remember, every powerful athlete started with perfect bodyweight squats. Today, we perfect yours."
        ],
        mindsetMoment: {
          theme: "Power and Stability",
          positioning: "Stand tall with feet hip-width apart, feeling your connection to the ground",
          breathingPattern: "Take 5 deep breaths, focusing on feeling strong and grounded through your legs",
          affirmation: "*I am building unstoppable lower body strength and power*",
          visualization: "Visualize your legs as powerful pillars that can support and propel you through any challenge",
          closingAwareness: "Feel the strength and stability radiating from your lower body",
          drUQuote: "True power comes not from force, but from the mastery of movement and the harmony between strength and control."
        },
        movementPreparation: {
          title: "Movement Preparation",
          emoji: "🔥",
          duration: "12 minutes",
          exercises: [
            {
              id: "leg-swings",
              name: "Dynamic Leg Swings",
              description: "Hip mobility and activation exercise",
              instructions: [
                "Hold wall or stable surface for support",
                "Swing leg forward and backward in controlled motion",
                "Keep torso upright and stable",
                "Switch to side-to-side swings"
              ],
              technicalCues: ["Control the movement", "Keep supporting leg stable"],
              somaticCues: ["Feel the hip joint opening and warming up"],
              beginnerModification: "Smaller range of motion",
              advancedModification: "No support, engage core more",
              commonMistakes: ["Using momentum instead of control"],
              videoUrl: "https://youtube.com/placeholder-leg-swings",
              duration: "2 minutes",
              reps: "10 each direction, each leg"
            }
          ]
        },
        mainWorkout: {
          title: "Main Workout Section",
          emoji: "🏆",
          duration: "25 minutes",
          exercises: [
            {
              id: "bodyweight-squat",
              name: "Bodyweight Squat",
              description: "Fundamental lower body strength exercise",
              instructions: [
                "Stand with feet slightly wider than hip-width",
                "Lower by pushing hips back and bending knees",
                "Descend until thighs parallel to floor",
                "Drive through heels to return to standing"
              ],
              technicalCues: ["Chest up", "Knees track over toes", "Full depth"],
              somaticCues: ["Feel the power building in your glutes and quads"],
              beginnerModification: "Use chair for support or reduce depth",
              advancedModification: "Add jump or single leg progression",
              commonMistakes: ["Knees caving in", "Forward lean"],
              videoUrl: "https://youtube.com/placeholder-bodyweight-squat",
              sets: "3",
              reps: "12-15"
            }
          ]
        },
        coolDown: {
          title: "Cool Down & Reflect",
          emoji: "🧘",
          duration: "12 minutes",
          exercises: [
            {
              id: "figure-four-stretch",
              name: "Figure-4 Hip Stretch",
              description: "Hip and glute mobility stretch",
              instructions: [
                "Lie on back with knees bent",
                "Cross right ankle over left knee",
                "Pull left thigh toward chest",
                "Feel stretch in right hip and glute"
              ],
              technicalCues: ["Keep head relaxed on ground"],
              somaticCues: ["Breathe into the stretch and feel the release"],
              beginnerModification: "Use towel around thigh for assistance",
              advancedModification: "Pull knee closer for deeper stretch",
              commonMistakes: ["Forcing the stretch"],
              videoUrl: "https://youtube.com/placeholder-figure-four",
              duration: "45 seconds each side"
            }
          ]
        },
        keyTakeaways: [
          "Strong legs create a strong foundation for life",
          "Perfect form builds lasting strength and prevents injury",
          "Power comes from the ground up through proper mechanics",
          "Consistency in movement quality creates exceptional results"
        ],
        tomorrowPreview: "Tomorrow we'll focus on upper body push and pull patterns to build balanced strength throughout your entire body.",
        cta: {
          text: "Optimize your bodyweight training recovery with our Gut Microbiome Kit",
          product: "Gut Microbiome Kit",
          link: "#gut-kit"
        }
      }
      // Note: For brevity, I'm showing 2 complete days. The actual implementation would include all 7 days
    ]
  },
  {
    id: 'trx-7day',
    name: 'TRX Bands Only Power',
    description: '7-Day Progressive TRX Band Training Program',
    type: 'trx',
    level: 'Beginner-Intermediate',
    duration: '7 Days',
    equipment: ['TRX Bands', 'Resistance Bands'],
    days: [
      {
        dayNumber: 1,
        title: 'Resistance Foundation',
        theme: 'Mastering Basic Band Movements',
        introduction: [
          "Welcome to Day 1 of your TRX Bands Only Power journey! Today we establish the fundamental relationship between your body and resistance band training.",
          "The beauty of band training lies in the variable resistance - it challenges you differently at every point in the movement. Master the small adjustments, master it all.",
          "By mastering the seemingly insignificant setup and tension control, you unlock the potential for significant mastery in all resistance-based movements."
        ],
        mindsetMoment: {
          theme: "Resistance and Adaptation",
          positioning: "Hold your TRX bands in both hands, feeling their potential energy",
          breathingPattern: "Take 5 deep breaths, focusing on the sensation of controlled tension",
          affirmation: "*I adapt and grow stronger with every resistance I face*",
          visualization: "Visualize the bands as extensions of your strength, amplifying your power",
          closingAwareness: "Feel the connection between resistance and growth",
          drUQuote: "Resistance is not your enemy - it is the sculptor of your strength."
        },
        movementPreparation: {
          title: "Movement Preparation",
          emoji: "🔥",
          duration: "10 minutes",
          exercises: [
            {
              id: "band-arm-circles",
              name: "Band Arm Circles",
              description: "Shoulder mobility with light resistance",
              instructions: [
                "Hold light resistance band at shoulder width",
                "Keep arms straight and make large circles",
                "Maintain constant tension in the band",
                "Reverse direction halfway through"
              ],
              technicalCues: ["Keep shoulders down and back"],
              somaticCues: ["Feel the gentle activation through your shoulders"],
              beginnerModification: "Use lighter resistance band",
              advancedModification: "Increase band tension",
              commonMistakes: ["Moving too fast", "Losing band tension"],
              videoUrl: "https://youtube.com/placeholder-band-arm-circles",
              duration: "2 minutes",
              reps: "10 each direction"
            }
          ]
        },
        mainWorkout: {
          title: "Strength & Movement Circuits",
          emoji: "🏆",
          duration: "40 minutes",
          instructions: [
            "Complete 3 circuits (A, B, C)",
            "Circuit A: 4 sets × 10 reps",
            "Circuit B: 3 sets × 12 reps", 
            "Circuit C: 3 sets × 8 reps",
            "Rest 60 seconds between exercises, 2 minutes between circuits"
          ],
          exercises: [
            {
              id: "trx-chest-press",
              name: "TRX Chest Press",
              description: "Upper body pushing exercise with suspension trainer",
              instructions: [
                "Face away from anchor point, arms extended",
                "Lean forward at an angle, hands at chest level",
                "Lower body by bending arms",
                "Press back to starting position"
              ],
              technicalCues: ["Keep body in straight line", "Control the descent"],
              somaticCues: ["Feel your chest and triceps working together"],
              beginnerModification: "Stand more upright for less resistance",
              advancedModification: "Increase forward lean or add single arm",
              commonMistakes: ["Sagging hips", "Partial range of motion"],
              videoUrl: "https://youtube.com/placeholder-trx-chest-press",
              sets: "4",
              reps: "10"
            }
          ]
        },
        coolDown: {
          title: "Cool Down & Reflect",
          emoji: "🧘",
          duration: "15 minutes",
          exercises: [
            {
              id: "band-chest-stretch",
              name: "Band-Assisted Chest Stretch",
              description: "Chest and shoulder mobility with band assistance",
              instructions: [
                "Hold band behind back with both hands",
                "Lift band up and away from body",
                "Feel stretch across chest and front of shoulders",
                "Breathe deeply and hold position"
              ],
              technicalCues: ["Keep shoulders relaxed"],
              somaticCues: ["Feel the opening across your chest"],
              beginnerModification: "Use lighter tension",
              advancedModification: "Wider grip on band",
              commonMistakes: ["Forcing the stretch"],
              videoUrl: "https://youtube.com/placeholder-band-chest-stretch",
              duration: "45 seconds"
            }
          ]
        },
        keyTakeaways: [
          "Variable resistance challenges your muscles differently than free weights",
          "Proper setup and anchor points are crucial for safety and effectiveness",
          "Band training builds functional strength and stability",
          "Tension control is as important as the movement itself"
        ],
        tomorrowPreview: "Tomorrow we'll focus on upper body strength with advanced push and pull patterns using your TRX system.",
        cta: {
          text: "Understand your unique response to resistance training with our DNA Kit",
          product: "DNA Kit",
          link: "#dna-kit"
        }
      }
      // Note: For brevity, showing 1 day. Full implementation would have all 7 days
    ]
  },
  {
    id: 'stretching-7day',
    name: 'Flexibility Mastery',
    description: '7-Day Progressive Stretching & Mobility Program',
    type: 'stretching',
    level: 'Beginner-Intermediate',
    duration: '7 Days',
    equipment: ['Yoga Mat', 'Optional: Blocks'],
    days: [
      {
        dayNumber: 1,
        title: 'Spinal Mobility & Posture',
        theme: 'Awakening Your Spine',
        introduction: [
          "Welcome to Day 1 of your Flexibility Mastery journey! Today we focus on the foundation of all movement - your spine and the posture that supports your daily life.",
          "Your spine is your central pillar of health. By mastering the seemingly insignificant micro-movements of spinal mobility, you unlock the potential for significant mastery in all aspects of physical wellness.",
          "Remember, every movement begins with the spine. Today, we awaken yours to its full potential."
        ],
        mindsetMoment: {
          theme: "Spinal Awareness and Alignment",
          positioning: "Sit tall with your spine naturally curved, hands resting on your knees",
          breathingPattern: "Take 5 deep breaths, focusing on the gentle lengthening of your spine with each inhale",
          affirmation: "*My spine is strong, flexible, and perfectly aligned*",
          visualization: "Visualize your spine as a graceful column of strength, each vertebra perfectly balanced",
          closingAwareness: "Feel the natural curves of your spine and the energy flowing through your central channel",
          drUQuote: "A flexible spine is a flexible mind - both bend without breaking, both adapt with grace."
        },
        movementPreparation: {
          title: "Movement Preparation",
          emoji: "🔥",
          duration: "12 minutes",
          exercises: [
            {
              id: "spinal-wave",
              name: "Spinal Wave Movement",
              description: "Gentle articulation of the entire spine",
              instructions: [
                "Sit with legs extended, hands on floor behind you",
                "Start by tucking chin to chest",
                "Roll down through spine one vertebra at a time",
                "Reverse the movement, rolling up vertebra by vertebra"
              ],
              technicalCues: ["Move slowly and with control"],
              somaticCues: ["Feel each individual vertebra moving"],
              beginnerModification: "Sit in chair and do smaller movements",
              advancedModification: "Add arm movements or close eyes",
              commonMistakes: ["Moving too quickly", "Forcing the movement"],
              videoUrl: "https://youtube.com/placeholder-spinal-wave",
              duration: "3 minutes",
              reps: "8 slow waves"
            }
          ]
        },
        mainWorkout: {
          title: "Main Workout Section",
          emoji: "🏆",
          duration: "30 minutes",
          exercises: [
            {
              id: "cat-cow-advanced",
              name: "Advanced Cat-Cow Flow",
              description: "Dynamic spinal mobility with breath coordination",
              instructions: [
                "Start in tabletop position",
                "Inhale, drop belly and lift chest (Cow)",
                "Exhale, round spine and tuck chin (Cat)",
                "Move with breath rhythm for full integration"
              ],
              technicalCues: ["Coordinate breath with movement"],
              somaticCues: ["Feel the wave of movement through your entire spine"],
              beginnerModification: "Move at your own pace, don't worry about breath sync",
              advancedModification: "Add lateral movements or weight shifts",
              commonMistakes: ["Breath holding", "Moving only upper back"],
              videoUrl: "https://youtube.com/placeholder-cat-cow-advanced",
              duration: "5 minutes"
            }
          ]
        },
        coolDown: {
          title: "Cool Down & Reflect",
          emoji: "🧘",
          duration: "18 minutes",
          exercises: [
            {
              id: "supported-twist",
              name: "Supported Spinal Twist",
              description: "Gentle detoxifying spinal rotation",
              instructions: [
                "Lie on back with knees bent",
                "Drop knees to one side",
                "Keep shoulders on ground",
                "Turn head opposite direction if comfortable"
              ],
              technicalCues: ["Keep both shoulders down"],
              somaticCues: ["Feel the gentle wringing out of tension"],
              beginnerModification: "Place pillow between knees",
              advancedModification: "Extend top leg for deeper stretch",
              commonMistakes: ["Forcing the twist"],
              videoUrl: "https://youtube.com/placeholder-supported-twist",
              duration: "2 minutes each side"
            }
          ]
        },
        keyTakeaways: [
          "Spinal health affects every aspect of physical wellness",
          "Small, mindful movements create profound changes",
          "Breath and movement work together for optimal results",
          "Consistency in mobility work prevents future problems"
        ],
        tomorrowPreview: "Tomorrow we'll focus on hip flexibility and lower body release to complement your spinal work.",
        cta: {
          text: "Learn how your genetics influence flexibility with our DNA Kit",
          product: "DNA Kit",
          link: "#dna-kit"
        }
      }
      // Note: For brevity, showing 1 day. Full implementation would have all 7 days
    ]
  }
];
