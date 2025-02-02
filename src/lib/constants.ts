import { CodeCategory } from './types';

export const CODE_CATEGORIES: Record<string, CodeCategory> = {
  game: {
    id: 'game',
    title: 'Fun Games',
    description: 'Interactive games to play and learn from',
    icon: 'Gamepad2',
    usedIndices: [],
    recipes: [
      { id: 'g1', text: 'Create a whack-a-mole game with colorful moles' },
      { id: 'g2', text: 'Make a memory card matching game with animals' },
      { id: 'g3', text: 'Build a simple snake game with fruits to collect' },
      { id: 'g4', text: 'Design a balloon popping game with different colors' },
      { id: 'g5', text: 'Create a catch the falling stars game' },
      { id: 'g6', text: 'Make a simple ping pong game' },
      { id: 'g7', text: 'Build a color matching puzzle game' },
      { id: 'g8', text: 'Design a bubble shooter game' },
      { id: 'g9', text: 'Create a simple maze game with a timer' },
      { id: 'g10', text: 'Make a word guessing game with hints' },
      { id: 'g11', text: 'Build a tic-tac-toe game with emojis' },
      { id: 'g12', text: 'Design a simple racing game with obstacles' },
      { id: 'g13', text: 'Create a math quiz game with animations' },
      { id: 'g14', text: 'Make a fruit slice game like Fruit Ninja' },
      { id: 'g15', text: 'Build a space shooter with friendly aliens' },
      { id: 'g16', text: 'Design a pattern matching game' },
      { id: 'g17', text: 'Create a simple platformer game' },
      { id: 'g18', text: 'Make a candy crush style matching game' },
      { id: 'g19', text: 'Build a typing practice game with animals' },
      { id: 'g20', text: 'Design a simon says memory game' },
      { id: 'g21', text: 'Create a puzzle sliding game with numbers' },
      { id: 'g22', text: 'Make a basketball shooting game' },
      { id: 'g23', text: 'Build a rock, paper, scissors game' },
      { id: 'g24', text: 'Design a card flipping memory game' },
      { id: 'g25', text: 'Create a dodge the obstacles game' }
    ]
  },
  animation: {
    id: 'animation',
    title: 'Cool Animations',
    description: 'Fun animated effects and transitions',
    icon: 'Sparkles',
    usedIndices: [],
    recipes: [
      { id: 'a1', text: 'Create a rainbow wave animation' },
      { id: 'a2', text: 'Make bouncing colorful shapes' },
      { id: 'a3', text: 'Build a particle effect system' },
      { id: 'a4', text: 'Design an animated loading spinner' },
      { id: 'a5', text: 'Create a fireworks animation' },
      { id: 'a6', text: 'Make a floating bubble animation' },
      { id: 'a7', text: 'Build a confetti explosion effect' },
      { id: 'a8', text: 'Design a morphing shapes animation' },
      { id: 'a9', text: 'Create a snow falling animation' },
      { id: 'a10', text: 'Make a color changing gradient' },
      { id: 'a11', text: 'Build a spinning galaxy animation' },
      { id: 'a12', text: 'Design a jumping character animation' },
      { id: 'a13', text: 'Create a rain effect animation' },
      { id: 'a14', text: 'Make animated emoji expressions' },
      { id: 'a15', text: 'Build a growing flower animation' },
      { id: 'a16', text: 'Design a day/night cycle animation' },
      { id: 'a17', text: 'Create a butterfly flying animation' },
      { id: 'a18', text: 'Make a pulsing heart animation' },
      { id: 'a19', text: 'Build a swimming fish animation' },
      { id: 'a20', text: 'Design a rocket launch animation' },
      { id: 'a21', text: 'Create a dancing robot animation' },
      { id: 'a22', text: 'Make a magic wand effect' },
      { id: 'a23', text: 'Build a rainbow trail effect' },
      { id: 'a24', text: 'Design a bouncing ball physics' },
      { id: 'a25', text: 'Create a spiral animation pattern' }
    ]
  },
  interactive: {
    id: 'interactive',
    title: 'Interactive Apps',
    description: 'Apps that respond to your input',
    icon: 'MousePointer2',
    usedIndices: [],
    recipes: [
      { id: 'i1', text: 'Create a color mixer with sliders' },
      { id: 'i2', text: 'Make a drawing canvas with brushes' },
      { id: 'i3', text: 'Build a music maker with buttons' },
      { id: 'i4', text: 'Design a pet customization tool' },
      { id: 'i5', text: 'Create a sticker maker app' },
      { id: 'i6', text: 'Make a simple paint program' },
      { id: 'i7', text: 'Build a character creator' },
      { id: 'i8', text: 'Design an emoji mood picker' },
      { id: 'i9', text: 'Create a virtual piano' },
      { id: 'i10', text: 'Make a weather dashboard' },
      { id: 'i11', text: 'Build a todo list with emojis' },
      { id: 'i12', text: 'Design a photo filter app' },
      { id: 'i13', text: 'Create a voice pitch changer' },
      { id: 'i14', text: 'Make a pattern generator' },
      { id: 'i15', text: 'Build a virtual pet simulator' },
      { id: 'i16', text: 'Design a story creator' },
      { id: 'i17', text: 'Create a simple calculator' },
      { id: 'i18', text: 'Make a digital clock designer' },
      { id: 'i19', text: 'Build an avatar creator' },
      { id: 'i20', text: 'Design a sound board' },
      { id: 'i21', text: 'Create a word cloud generator' },
      { id: 'i22', text: 'Make a comic strip creator' },
      { id: 'i23', text: 'Build a music visualizer' },
      { id: 'i24', text: 'Design a card maker' },
      { id: 'i25', text: 'Create a maze generator' }
    ]
  },
  art: {
    id: 'art',
    title: 'Creative Art',
    description: 'Make beautiful digital art',
    icon: 'Palette',
    usedIndices: [],
    recipes: [
      { id: 'r1', text: 'Create a kaleidoscope maker' },
      { id: 'r2', text: 'Make a mandala designer' },
      { id: 'r3', text: 'Build a pixel art editor' },
      { id: 'r4', text: 'Design a fractal tree generator' },
      { id: 'r5', text: 'Create a symmetry painter' },
      { id: 'r6', text: 'Make a rainbow pattern maker' },
      { id: 'r7', text: 'Build a geometric art creator' },
      { id: 'r8', text: 'Design a spirograph tool' },
      { id: 'r9', text: 'Create an abstract art generator' },
      { id: 'r10', text: 'Make a constellation drawer' },
      { id: 'r11', text: 'Build a flower pattern maker' },
      { id: 'r12', text: 'Design a crystal generator' },
      { id: 'r13', text: 'Create a mosaic maker' },
      { id: 'r14', text: 'Make a bubble art creator' },
      { id: 'r15', text: 'Build a string art simulator' },
      { id: 'r16', text: 'Design a wave pattern generator' },
      { id: 'r17', text: 'Create a spray paint simulator' },
      { id: 'r18', text: 'Make a zentangle designer' },
      { id: 'r19', text: 'Build a sacred geometry creator' },
      { id: 'r20', text: 'Design a tie-dye simulator' },
      { id: 'r21', text: 'Create a crystal growth simulator' },
      { id: 'r22', text: 'Make a watercolor effect painter' },
      { id: 'r23', text: 'Build a neon light designer' },
      { id: 'r24', text: 'Design a rainbow spiral maker' },
      { id: 'r25', text: 'Create a stained glass designer' }
    ]
  }
};