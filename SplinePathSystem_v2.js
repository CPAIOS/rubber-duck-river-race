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

        // IMPROVED WAYPOINTS with steeper slopes and better variety
        this.waypoints = [
            // 🌲 ACT 1: PEACEFUL FOREST START (0-400m)
            new THREE.Vector3(0, 0, 0),           // Start
            new THREE.Vector3(-5, 0, -50),        // Gentle left
            new THREE.Vector3(8, -1, -100),       // S-curve right, slight dip
            new THREE.Vector3(-3, -2, -150),      // S-curve back, drop
            new THREE.Vector3(5, -4, -200),       // Small dip
            new THREE.Vector3(0, -5, -250),       // Straighten
            new THREE.Vector3(-8, -7, -300),      // Left turn with small drop
            new THREE.Vector3(0, -10, -400),      // First rapids zone

            // 🏔️ ACT 2: CANYON RAPIDS (400-900m)
            new THREE.Vector3(12, -12, -450),     // Sharp right into canyon
            new THREE.Vector3(15, -16, -500),     // Drop 1 (4 units / ~12 feet)
            new THREE.Vector3(10, -16, -550),     // Curve left
            new THREE.Vector3(-10, -20, -600),    // Sharp S-curve + DROP
            new THREE.Vector3(-15, -24, -650),    // Drop 2 (4 units / ~12 feet)
            new THREE.Vector3(-8, -24, -700),     // Straighten
            new THREE.Vector3(0, -28, -750),      // Drop 3 (4 units / ~12 feet)
            new THREE.Vector3(10, -28, -800),     // Banked right turn
            new THREE.Vector3(5, -32, -850),      // Gentle drop
            new THREE.Vector3(0, -35, -900),      // Canyon depths

            // 🌑 ACT 3: DARK CAVE - gentle descent (900-1200m)
            new THREE.Vector3(-5, -35, -950),     // Cave entrance
            new THREE.Vector3(-8, -37, -1000),    // Winding
            new THREE.Vector3(0, -39, -1050),     // Tight section
            new THREE.Vector3(8, -41, -1100),     // Keep winding
            new THREE.Vector3(5, -43, -1150),     // Gentle slope
            new THREE.Vector3(-5, -45, -1200),    // Continue

            // 💥 DROP #1 at ~1250m - Small warmup drop (AFTER REVERSE = EARLY)
            new THREE.Vector3(0, -45, -1250),     // Approach DROP #1
            new THREE.Vector3(0, -45, -1280),     // Edge!
            new THREE.Vector3(0, -55, -1300),     // Small 10-foot drop
            new THREE.Vector3(0, -57, -1350),     // Recovery

            // 🌊 ACT 4: WINDING RIVER - long gentle section (1350-1700m)
            new THREE.Vector3(-5, -59, -1400),    // S-curve
            new THREE.Vector3(0, -61, -1450),     // Straighten
            new THREE.Vector3(5, -63, -1500),     // Curve right
            new THREE.Vector3(-5, -65, -1550),    // Curve left
            new THREE.Vector3(0, -67, -1600),     // Straighten
            new THREE.Vector3(0, -69, -1650),     // Continue
            new THREE.Vector3(0, -71, -1700),     // Keep going

            // 💥💥 DROP #2 at ~1750m - Medium drop (AFTER REVERSE = MID COURSE)
            new THREE.Vector3(0, -71, -1750),     // Approach DROP #2
            new THREE.Vector3(0, -71, -1780),     // Edge!
            new THREE.Vector3(0, -92, -1800),     // 20-foot drop!
            new THREE.Vector3(0, -97, -1850),     // Recovery

            // 🏔️ ACT 5: BUILD-UP TO MEGA DROP (1850-2050m)
            new THREE.Vector3(5, -99, -1900),     // Gentle curve
            new THREE.Vector3(-5, -101, -1950),   // S-curve
            new THREE.Vector3(0, -103, -2000),    // Straighten
            new THREE.Vector3(0, -105, -2030),    // Approaching...

            // 💥💥💥 MEGA DROP at ~2050m - BIGGEST DROP AT THE VERY END!
            new THREE.Vector3(0, -105, -2050),    // Edge of MEGA DROP!!!
            new THREE.Vector3(0, -120, -2060),    // Start falling!
            new THREE.Vector3(0, -155, -2073),    // FALLING FAST!
            new THREE.Vector3(0, -200, -2087),    // OMG SO STEEP!
            new THREE.Vector3(0, -240, -2097),    // MASSIVE 135-FOOT DROP!!!
            new THREE.Vector3(0, -245, -2100)     // FINISH LINE!
        ];

        // REVERSE the waypoints AND flip Y coordinates so the course flows DOWNHILL
        this.waypoints.reverse();
        // Flip Y coordinates: what was at y=-75 becomes y=75, what was at y=0 becomes y=0
        // This makes the START at y=75 (high) and END at y=0 (low) = downhill!
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
