import Plasma from './Plasma';
import { useTheme } from '../context/ThemeContext';

/**
 * Theme-aware Plasma background wrapper.
 * Light mode: soft teal/mint (#13ecc8)
 * Dark mode: deep teal/cyan (#0d9488)
 */
export default function PlasmaBackground() {
    const { dark } = useTheme();

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            <Plasma
                color={dark ? '#0d9488' : '#13ecc8'}
                speed={0.3}
                direction="forward"
                scale={1.2}
                opacity={dark ? 0.4 : 0.25}
                mouseInteractive={false}
            />
        </div>
    );
}
