import { Reel } from './ReelComponnet';
import { SpinButton } from './SpinButton';

import { SceneManager } from 'Core/Scenes/SceneFactory';

SceneManager.getInstance().registerClass('Reel', () => new Reel());
SceneManager.getInstance().registerClass('SpinButton', () => new SpinButton());
