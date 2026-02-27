"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function LiveBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) {
        return null; // Wait for engine to load
    }

    return (
        <div className="fixed inset-0 -z-50 pointer-events-none">
            <Particles
                id="tsparticles"
                options={{
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },
                    fpsLimit: 60,
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "grab",
                            },
                            onClick: {
                                enable: true,
                                mode: "push",
                            },
                        },
                        modes: {
                            grab: {
                                distance: 140,
                                links: {
                                    opacity: 0.8,
                                },
                            },
                            push: {
                                quantity: 4,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: "#3b82f6", // Primary blue color
                        },
                        links: {
                            color: "#3b82f6",
                            distance: 150,
                            enable: true,
                            opacity: 0.3,
                            width: 1,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 1,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                width: 800,
                                height: 800,
                            },
                            value: 60,
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 3 },
                        },
                    },
                    detectRetina: true,
                }}
            />
        </div>
    );
}
