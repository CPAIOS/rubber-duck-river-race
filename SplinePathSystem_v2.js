import * as THREE from 'three';

/**
 * 🎢 SPLINE PATH SYSTEM v2 - With MEGA STEEP DROP!
 */

export class SplinePathSystem {
    constructor() {
        this.spline = null;
        this.totalLength = 0;
        this.sections = [];
        this.waypoints = [];

        this.createLogFlumeCoursePath();
    }

    createLogFlumeCoursePath() {
        console.log('🎢 Building EXTREME Log Flume Course...');

        // COURSE STARTS HIGH, DROPS AT THE END!
        this.waypoints = [
            // 🌲 ACT 1: PEACEFUL FOREST START (0-400m) - Start HIGH
            new THREE.Vector3(0, 460, 0),         // Start HIGH at 460
            new THREE.Vector3(-5, 458, -50),      // Gentle left, tiny drop
            new THREE.Vector3(8, 456, -100),      // S-curve right, slight dip
            new THREE.Vector3(-3, 454, -150),     // S-curve back
            new THREE.Vector3(5, 452, -200),      // Gentle slope
            new THREE.Vector3(0, 450, -250),      // Continue
            new THREE.Vector3(-8, 448, -300),     // Left turn
            new THREE.Vector3(0, 446, -400),      // First rapids zone

            // 🏔️ ACT 2: CANYON RAPIDS (400-900m) - Small drops
            new THREE.Vector3(12, 443, -450),     // Sharp right, drop
            new THREE.Vector3(15, 440, -500),     // Small 3ft drop
            new THREE.Vector3(10, 436, -550),     // Another drop
            new THREE.Vector3(-10, 432, -600),    // Sharp S-curve + DROP
            new THREE.Vector3(-15, 428, -650),    // 4ft drop
            new THREE.Vector3(-8, 424, -700),     // Continue down
            new THREE.Vector3(0, 420, -750),      // Drop continues
            new THREE.Vector3(10, 416, -800),     // Banked turn + drop
            new THREE.Vector3(5, 412, -850),      // Steeper now
            new THREE.Vector3(0, 408, -900),      // Canyon depths

            // 🌑 ACT 3: DARK CAVE (900-1200m) - Medium drops
            new THREE.Vector3(-5, 403, -950),     // Cave entrance, drop
            new THREE.Vector3(-8, 398, -1000),    // 5ft drop
            new THREE.Vector3(0, 392, -1050),     // 6ft drop
            new THREE.Vector3(8, 386, -1100),     // Getting steeper
            new THREE.Vector3(5, 380, -1150),     // Continue
            new THREE.Vector3(-5, 373, -1200),    // 7ft drop

            // 🌊 ACT 4: WINDING RIVER (1200-1700m) - Bigger drops
            new THREE.Vector3(0, 366, -1250),     // 7ft drop
            new THREE.Vector3(-5, 358, -1300),    // 8ft drop
            new THREE.Vector3(0, 350, -1350),     // Getting bigger
            new THREE.Vector3(5, 341, -1400),     // 9ft drop
            new THREE.Vector3(-5, 332, -1450),    // 9ft drop
            new THREE.Vector3(0, 323, -1500),     // Steeper
            new THREE.Vector3(5, 313, -1550),     // 10ft drop
            new THREE.Vector3(-5, 303, -1600),    // 10ft drop
            new THREE.Vector3(0, 293, -1650),     // Continue
            new THREE.Vector3(0, 283, -1700),     // Building tension

            // 🏔️ ACT 5: BUILD-UP TO MEGA DROPS (1700-2000m)
            new THREE.Vector3(5, 273, -1750),     // 10ft drop
            new THREE.Vector3(-5, 261, -1800),    // 12ft drop
            new THREE.Vector3(0, 248, -1850),     // 13ft drop
            new THREE.Vector3(5, 234, -1900),     // 14ft drop
            new THREE.Vector3(-5, 218, -1950),    // 16ft drop
            new THREE.Vector3(0, 200, -2000),     // 18ft drop

            // 💥 DROP #1 at ~2050m - Big 25ft drop
            new THREE.Vector3(0, 198, -2050),     // Edge
            new THREE.Vector3(0, 173, -2100),     // 25ft DROP!

            // 💥💥 DROP #2 at ~2150m - Huge 35ft drop
            new THREE.Vector3(0, 170, -2150),     // Brief recovery
            new THREE.Vector3(0, 135, -2200),     // 35ft DROP!

            // 💥💥💥 MEGA DROP at ~2250m - MASSIVE 100ft DROP!
            new THREE.Vector3(0, 128, -2250),     // Edge of MEGA DROP!!!
            new THREE.Vector3(0, 98, -2270),      // Falling!
            new THREE.Vector3(0, 58, -2285),      // FALLING FAST!
            new THREE.Vector3(0, 28, -2295),      // OMG SO STEEP!
            new THREE.Vector3(0, 0, -2300),       // MASSIVE 130-FOOT DROP!!!
            new THREE.Vector3(0, 0, -2350)        // FINISH LINE!
        ];

        // REVERSE the waypoints AND flip Y coordinates so the course flows DOWNHILL
        this.waypoints.reverse();
        // Flip Y coordinates: what was at y=-200 becomes y=200, what was at y=0 becomes y=0
        // This makes the START at y=200 (high) and END at y=0 (low) = downhill!
        this.waypoints.forEach(waypoint => {
            waypoint.y = -waypoint.y; // Flip Y coordinate
        });

        this.spline = new THREE.CatmullRomCurve3(this.waypoints);
        this.spline.curveType = 'catmullrom';
        this.spline.tension = 0.5;
        this.spline.closed = false;

        this.totalLength = this.spline.getLength();

        console.log(`✅ EXTREME Spline created: ${this.waypoints.length} waypoints, ${this.totalLength.toFixed(0)}m long`);

        this.createThemedSections();
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
