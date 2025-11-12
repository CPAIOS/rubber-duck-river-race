import * as THREE from 'three';

/**
 * 🎢 SPLINE PATH SYSTEM v2 - With MEGA STEEP DROP!
 */

export class SplinePathSystem {
    constructor(level = 1) {
        this.spline = null;
        this.totalLength = 0;
        this.sections = [];
        this.waypoints = [];
        this.level = level;

        if (level === 1) {
            this.createLogFlumeCoursePath();
        } else if (level === 2) {
            this.createCaveCoursePath();
        }
    }

    createLogFlumeCoursePath() {
        console.log('🎢 Building EXTREME Log Flume Course...');

        // Progressive drops with FLAT sections - drops lengthened to 40 z-units to prevent uphill curve
        this.waypoints = [
            // Start - FLAT
            new THREE.Vector3(0, 100, 0),
            new THREE.Vector3(-5, 100, -100),
            new THREE.Vector3(5, 100, -200),

            // DROP #1 - 10ft over 40 units (with intermediate waypoints for linear descent)
            new THREE.Vector3(0, 100, -210),    // Start of drop
            new THREE.Vector3(0, 95, -230),     // Mid drop
            new THREE.Vector3(0, 90, -250),     // End of drop

            // FLAT
            new THREE.Vector3(-5, 90, -300),
            new THREE.Vector3(5, 90, -400),

            // DROP #2 - 15ft over 40 units (with intermediate waypoints for linear descent)
            new THREE.Vector3(0, 90, -410),     // Start of drop
            new THREE.Vector3(0, 82.5, -430),   // Mid drop
            new THREE.Vector3(0, 75, -450),     // End of drop

            // FLAT
            new THREE.Vector3(-5, 75, -500),
            new THREE.Vector3(5, 75, -600),

            // DROP #3 - 20ft over 40 units (with intermediate waypoints for linear descent)
            new THREE.Vector3(0, 75, -610),     // Start of drop
            new THREE.Vector3(0, 65, -630),     // Mid drop
            new THREE.Vector3(0, 55, -650),     // End of drop

            // FLAT
            new THREE.Vector3(-5, 55, -700),
            new THREE.Vector3(5, 55, -800),

            // DROP #4 - 25ft over 40 units (with intermediate waypoints for linear descent)
            new THREE.Vector3(0, 55, -810),     // Start of drop
            new THREE.Vector3(0, 42.5, -830),   // Mid drop
            new THREE.Vector3(0, 30, -850),     // End of drop

            // FLAT
            new THREE.Vector3(-5, 30, -900),
            new THREE.Vector3(5, 30, -1000),

            // DROP #5 - 30ft over 40 units (with intermediate waypoints for linear descent)
            new THREE.Vector3(0, 30, -1010),    // Start of drop
            new THREE.Vector3(0, 15, -1030),    // Mid drop
            new THREE.Vector3(0, 0, -1050),     // End of drop

            // FLAT
            new THREE.Vector3(-5, 0, -1100),
            new THREE.Vector3(5, 0, -1200),

            // DROP #6 - 40ft over 40 units (with intermediate waypoints for linear descent)
            new THREE.Vector3(0, 0, -1210),     // Start of drop
            new THREE.Vector3(0, -20, -1230),   // Mid drop
            new THREE.Vector3(0, -40, -1250),   // End of drop

            // FLAT - anchor point right after drop
            new THREE.Vector3(0, -40, -1270),   // Anchor to prevent overshoot
            new THREE.Vector3(-5, -40, -1300),
            new THREE.Vector3(5, -40, -1400),

            // DROP #7 - MEGA 60ft over 50 units (with intermediate waypoints for linear descent)
            new THREE.Vector3(0, -40, -1410),   // Start of drop
            new THREE.Vector3(0, -60, -1430),   // 1/3 drop
            new THREE.Vector3(0, -80, -1445),   // 2/3 drop
            new THREE.Vector3(0, -100, -1460),  // End of drop

            // FLAT to finish - EXTRA waypoints right after drop to prevent overshoot
            new THREE.Vector3(0, -100, -1480),  // Anchor point
            new THREE.Vector3(-5, -100, -1550),
            new THREE.Vector3(0, -100, -1700),
            new THREE.Vector3(5, -100, -1850),
            new THREE.Vector3(0, -100, -2000),  // FINISH LINE!

            // COOL-DOWN ZONE - Continue river beyond finish for 500m
            new THREE.Vector3(-5, -100, -2100),
            new THREE.Vector3(5, -100, -2200),
            new THREE.Vector3(0, -100, -2300),
            new THREE.Vector3(-8, -100, -2400),  // Start gentle curve
            new THREE.Vector3(-12, -100, -2500)  // End - river curves behind canyon wall
        ];

        // NO transformations - waypoints used as-is

        // Create initial Catmull-Rom spline
        const rawSpline = new THREE.CatmullRomCurve3(this.waypoints);
        rawSpline.curveType = 'chordal';
        rawSpline.tension = 0;
        rawSpline.closed = false;

        // 🔥 CRITICAL FIX: Post-process spline to FORCE downhill-only flow
        // Sample the spline densely, then clamp Y values to eliminate uphill sections
        console.log('🔧 Post-processing spline to enforce downhill-only flow...');
        const rawPoints = rawSpline.getPoints(2000);
        const clampedPoints = [rawPoints[0]];
        let minYSoFar = rawPoints[0].y;
        let clampedCount = 0;

        for (let i = 1; i < rawPoints.length; i++) {
            const point = rawPoints[i].clone();
            if (point.y > minYSoFar) {
                point.y = minYSoFar;
                clampedCount++;
            } else {
                minYSoFar = point.y;
            }
            clampedPoints.push(point);
        }

        console.log(`🔧 Clamped ${clampedCount} uphill points out of ${rawPoints.length}`);

        // Create a NEW Catmull-Rom spline from the clamped points
        this.spline = new THREE.CatmullRomCurve3(clampedPoints);
        this.spline.curveType = 'chordal';
        this.spline.tension = 0;
        this.spline.closed = false;

        this.totalLength = this.spline.getLength();

        console.log(`✅ EXTREME Spline created: ${clampedPoints.length} clamped points, ${this.totalLength.toFixed(0)}m long`);

        this.createThemedSections();
    }

    createCaveCoursePath() {
        console.log('🕳️ Building UNDERGROUND CAVE Course...');

        // Cave course starts where Level 1 ends (around z = -2500, y = -100)
        // MUCH tighter, more aggressive turns, steeper terrain
        this.waypoints = [
            // CAVE ENTRANCE - Transition from canyon
            new THREE.Vector3(0, -100, -2500),      // Start (where L1 ends)
            new THREE.Vector3(3, -105, -2550),      // Slight right, descending
            new THREE.Vector3(-3, -110, -2600),     // Tight left turn

            // TIGHT S-CURVES through narrow passage
            new THREE.Vector3(6, -115, -2650),      // Sharp right
            new THREE.Vector3(-6, -120, -2700),     // Sharp left
            new THREE.Vector3(6, -125, -2750),      // Sharp right again
            new THREE.Vector3(-4, -130, -2800),     // Left curve

            // STEEP DROP #1 into lower chamber
            new THREE.Vector3(0, -130, -2850),      // Drop start
            new THREE.Vector3(0, -145, -2880),      // Mid drop (15ft)
            new THREE.Vector3(0, -160, -2910),      // End drop

            // UNDERGROUND POOL - flat section
            new THREE.Vector3(3, -160, -2960),
            new THREE.Vector3(-3, -160, -3010),

            // SPIRAL DESCENT - circling down
            new THREE.Vector3(5, -165, -3060),      // Right
            new THREE.Vector3(0, -170, -3110),      // Forward
            new THREE.Vector3(-5, -175, -3160),     // Left
            new THREE.Vector3(0, -180, -3210),      // Forward down
            new THREE.Vector3(5, -185, -3260),      // Right again

            // NARROW SQUEEZE - tight passage
            new THREE.Vector3(0, -190, -3300),      // Straight through
            new THREE.Vector3(0, -195, -3340),      // Still narrow

            // STEEP DROP #2 - waterfall into deep cavern
            new THREE.Vector3(0, -195, -3380),      // Drop start
            new THREE.Vector3(0, -215, -3410),      // Mid drop (20ft)
            new THREE.Vector3(0, -235, -3440),      // End drop (big waterfall!)

            // DEEP CAVERN - low ceiling section
            new THREE.Vector3(-4, -235, -3490),     // Left
            new THREE.Vector3(4, -240, -3540),      // Right, still descending
            new THREE.Vector3(-3, -245, -3590),     // Left

            // ZIGZAG through stalagmites
            new THREE.Vector3(5, -250, -3640),      // Sharp right
            new THREE.Vector3(-5, -255, -3690),     // Sharp left
            new THREE.Vector3(5, -260, -3740),      // Sharp right
            new THREE.Vector3(-5, -265, -3790),     // Sharp left

            // FINAL DROP into underground lake
            new THREE.Vector3(0, -265, -3830),      // Drop start
            new THREE.Vector3(0, -285, -3860),      // Mid drop
            new THREE.Vector3(0, -305, -3890),      // End drop (40ft!)

            // UNDERGROUND LAKE - flat finish
            new THREE.Vector3(3, -305, -3940),
            new THREE.Vector3(-3, -305, -3990),
            new THREE.Vector3(0, -305, -4040),      // FINISH!

            // COOLDOWN
            new THREE.Vector3(4, -305, -4090),
            new THREE.Vector3(-4, -305, -4140),
            new THREE.Vector3(0, -305, -4200)       // End
        ];

        // Create initial Catmull-Rom spline
        const rawSpline = new THREE.CatmullRomCurve3(this.waypoints);
        rawSpline.curveType = 'chordal';
        rawSpline.tension = 0;
        rawSpline.closed = false;

        // Post-process to enforce downhill-only
        console.log('🔧 Post-processing cave spline...');
        const rawPoints = rawSpline.getPoints(2000);
        const clampedPoints = [rawPoints[0]];
        let minYSoFar = rawPoints[0].y;
        let clampedCount = 0;

        for (let i = 1; i < rawPoints.length; i++) {
            const point = rawPoints[i].clone();
            if (point.y > minYSoFar) {
                point.y = minYSoFar;
                clampedCount++;
            } else {
                minYSoFar = point.y;
            }
            clampedPoints.push(point);
        }

        console.log(`🔧 Clamped ${clampedCount} uphill points in cave course`);

        // Create final spline
        this.spline = new THREE.CatmullRomCurve3(clampedPoints);
        this.spline.curveType = 'chordal';
        this.spline.tension = 0;
        this.spline.closed = false;

        this.totalLength = this.spline.getLength();

        console.log(`✅ CAVE Spline created: ${clampedPoints.length} points, ${this.totalLength.toFixed(0)}m long`);

        this.createCaveThemedSections();
    }

    createThemedSections() {
        this.sections = [
            {
                name: "Peaceful Forest",
                startDistance: 0,
                endDistance: 400,
                fogColor: 0x87CEEB,
                fogDensity: 0.0001,
                ambientColor: 0xffffbb,
                directionalIntensity: 0.8,
                backgroundColor: 0x87CEEB,
                description: "Gentle waters, birdsong, tutorial zone"
            },
            {
                name: "Canyon Rapids",
                startDistance: 400,
                endDistance: 900,
                fogColor: 0xff8844,
                fogDensity: 0.001,
                ambientColor: 0xff9955,
                directionalIntensity: 1.0,
                backgroundColor: 0xcc7744,
                description: "Fast drops, tight turns, orange sunset canyon"
            },
            {
                name: "Dark Cave",
                startDistance: 900,
                endDistance: 1400,
                fogColor: 0x000011,
                fogDensity: 0.05,
                ambientColor: 0x2244ff,
                directionalIntensity: 0.2,
                backgroundColor: 0x000000,
                description: "Mysterious darkness, glowing crystals, suspense"
            },
            {
                name: "Lift Hill",
                startDistance: 1400,
                endDistance: 1750,
                fogColor: 0x87CEEB,
                fogDensity: 0.0005,
                ambientColor: 0xffffdd,
                directionalIntensity: 1.2,
                backgroundColor: 0x87CEEB,
                description: "Ascending to the heavens, epic vista, anticipation"
            },
            {
                name: "The MEGA Drop",
                startDistance: 1750,
                endDistance: 1860,
                fogColor: 0xffffff,
                fogDensity: 0.002,
                ambientColor: 0xffffff,
                directionalIntensity: 1.5,
                backgroundColor: 0x87CEEB,
                description: "75-FOOT FREE FALL! The ultimate thrill!"
            },
            {
                name: "Victory Lap",
                startDistance: 1860,
                endDistance: 2100,
                fogColor: 0xffdd88,
                fogDensity: 0.0003,
                ambientColor: 0xffffcc,
                directionalIntensity: 0.9,
                backgroundColor: 0x87CEEB,
                description: "Celebration, final score, gentle float"
            }
        ];

        console.log(`✅ Created ${this.sections.length} themed sections`);
    }

    createCaveThemedSections() {
        this.sections = [
            {
                name: "Cave Entrance",
                startDistance: 0,
                endDistance: 200,
                fogColor: 0x4a3a2a,
                fogDensity: 0.003,
                ambientColor: 0x6a5a4a,
                directionalIntensity: 0.5,
                backgroundColor: 0x1a1a1a,
                description: "Entering the underground - transition from daylight"
            },
            {
                name: "Tight Passage",
                startDistance: 200,
                endDistance: 500,
                fogColor: 0x2a2a3a,
                fogDensity: 0.008,
                ambientColor: 0x3a3a5a,
                directionalIntensity: 0.3,
                backgroundColor: 0x0a0a0a,
                description: "Narrow S-curves through cramped cave tunnels"
            },
            {
                name: "Deep Cavern",
                startDistance: 500,
                endDistance: 900,
                fogColor: 0x1a1a2a,
                fogDensity: 0.012,
                ambientColor: 0x2a2a4a,
                directionalIntensity: 0.2,
                backgroundColor: 0x000000,
                description: "Far underground, glowing crystals the only light"
            },
            {
                name: "Stalagmite Forest",
                startDistance: 900,
                endDistance: 1300,
                fogColor: 0x2a3a2a,
                fogDensity: 0.010,
                ambientColor: 0x3a4a3a,
                directionalIntensity: 0.25,
                backgroundColor: 0x050505,
                description: "Zigzagging through towering rock formations"
            },
            {
                name: "Underground Lake",
                startDistance: 1300,
                endDistance: 1700,
                fogColor: 0x1a2a3a,
                fogDensity: 0.005,
                ambientColor: 0x2a3a5a,
                directionalIntensity: 0.4,
                backgroundColor: 0x0a0a1a,
                description: "Massive cavern with subterranean waters - finish!"
            }
        ];

        console.log(`✅ Created ${this.sections.length} cave themed sections`);
    }

    getPointAt(t) {
        return this.spline.getPointAt(Math.max(0, Math.min(1, t)));
    }

    getTangentAt(t) {
        return this.spline.getTangentAt(Math.max(0, Math.min(1, t)));
    }

    distanceToT(distance) {
        return Math.max(0, Math.min(1, distance / this.totalLength));
    }

    tToDistance(t) {
        return t * this.totalLength;
    }

    getSectionAtDistance(distance) {
        for (let section of this.sections) {
            if (distance >= section.startDistance && distance < section.endDistance) {
                return section;
            }
        }
        return this.sections[this.sections.length - 1];
    }

    getSlopeAt(t, delta = 0.001) {
        const t1 = Math.max(0, t - delta);
        const t2 = Math.min(1, t + delta);

        const p1 = this.spline.getPointAt(t1);
        const p2 = this.spline.getPointAt(t2);

        const rise = p2.y - p1.y;
        const run = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) +
            Math.pow(p2.z - p1.z, 2)
        );

        return rise / run;
    }

    getSpeedMultiplierAt(t) {
        const slope = this.getSlopeAt(t);

        if (slope > 0.15) {
            return 0.3; // Steep uphill (lift hill)
        } else if (slope > 0.05) {
            return 0.6; // Gentle uphill
        } else if (slope < -0.5) {
            return 4.0; // MEGA STEEP DROP!!!
        } else if (slope < -0.3) {
            return 3.0; // Steep downhill
        } else if (slope < -0.1) {
            return 1.8; // Medium downhill
        } else {
            return 1.0; // Flat water
        }
    }

    getBankingAt(t, delta = 0.001) {
        const t1 = Math.max(0, t - delta);
        const t2 = Math.min(1, t + delta);

        const p1 = this.spline.getPointAt(t1);
        const p2 = this.spline.getPointAt(t2);

        const dx = p2.x - p1.x;
        return dx * 2.0;
    }

    createDebugVisualization(scene) {
        const points = this.spline.getPoints(500);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xff00ff,
            linewidth: 2
        });
        const line = new THREE.Line(geometry, material);
        scene.add(line);

        const markerGeometry = new THREE.SphereGeometry(2, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        this.waypoints.forEach((waypoint, i) => {
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.copy(waypoint);
            scene.add(marker);
        });

        console.log('✅ Spline debug visualization added');
    }

    getCurvatureAt(t) {
        const tangent1 = this.getTangentAt(Math.max(0, t - 0.001));
        const tangent2 = this.getTangentAt(Math.min(1, t + 0.001));

        const angle = tangent1.angleTo(tangent2);
        return angle * 500;
    }
}
