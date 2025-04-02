# BasicSlot

BasicSlot is a slot game project built with TypeScript and PixiJS. It features dynamic scenes, state management, and animated actions.

## Project Structure

- **src/**
  - **main.ts**: Initializes the game, sets up state machine, and creates scenes.
  - **Core/**
    - **Models/GameModel.ts**: Manages game state like balance and win amounts.
    - **Managers/ActionManager.ts**: Registers and executes game actions based on state transitions.
    - **Renderer/**, **Scenes/**, **States/**: Handle rendering, scene management, and state transitions.

## Key Features

- **State Machine**: Manages game flow with states such as `idle`, `spinning`, and `result`.
- **Dynamic Scenes**: Creates game scenes with game objects like buttons, labels, sprites, and reels.
- **Action Handling**: Executes registered actions during state changes.

## Getting Started

1. **Clone the Repository**

     ```bash
     git clone <repository-url>
     cd BasicSlot
     ```

2. **Install Dependencies**

     ```bash
     npm install
     ```

3. **Run**

     ```bash

     npm start

     open http://localhost:5143 in chrome


     ```

## Code Highlights

- **Scene Creation:**

    ```typescript
    SceneManager.getInstance().createScene({
        name: 'MainScene',
        objects: [
            { name: 'bg', class: 'Sprite', texture: 'bg', anchor: { x: 0.5, y: 0.5 }, land: { x: 960, y: 540, scale: 2 } },
            // ... Additional objects like spinButton, title, reel, etc.
        ],
    });
    ```
