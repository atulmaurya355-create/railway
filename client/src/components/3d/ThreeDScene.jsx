import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeDScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060b19, 0.015);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const redLight = new THREE.PointLight(0xff0055, 3, 50);
    redLight.position.set(-15, 5, -10);
    scene.add(redLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 50);
    cyanLight.position.set(15, 5, -10);
    scene.add(cyanLight);

    // Dynamic Group for mouse tilt
    const tiltGroup = new THREE.Group();
    scene.add(tiltGroup);

    // Procedural Tracks
    const tracksGroup = new THREE.Group();
    tiltGroup.add(tracksGroup);

    const trackLength = 200;
    const gaugeWidth = 3.6;

    // Rail 1 & 2 (Steel bars)
    const railGeom = new THREE.BoxGeometry(0.15, 0.1, trackLength);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.9,
      roughness: 0.1,
    });

    const railLeft = new THREE.Mesh(railGeom, railMat);
    railLeft.position.set(-gaugeWidth / 2, 0.05, 0);
    tracksGroup.add(railLeft);

    const railRight = new THREE.Mesh(railGeom, railMat);
    railRight.position.set(gaugeWidth / 2, 0.05, 0);
    tracksGroup.add(railRight);

    // Glowing Neon Rails (Cylinder wires underneath)
    const glowRailLeftGeom = new THREE.CylinderGeometry(0.04, 0.04, trackLength, 8);
    const glowRailLeftMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    
    const glowLeft = new THREE.Mesh(glowRailLeftGeom, glowRailLeftMat);
    glowLeft.rotation.x = Math.PI / 2;
    glowLeft.position.set(-gaugeWidth / 2, 0, 0);
    tracksGroup.add(glowLeft);

    const glowRight = new THREE.Mesh(glowRailLeftGeom, glowRailLeftMat);
    glowRight.rotation.x = Math.PI / 2;
    glowRight.position.set(gaugeWidth / 2, 0, 0);
    tracksGroup.add(glowRight);

    // Wood ties (sleepers)
    const tieGeom = new THREE.BoxGeometry(gaugeWidth * 1.4, 0.08, 0.4);
    const tieMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.9,
      metalness: 0.1,
    });

    const tiesCount = 120;
    for (let i = 0; i < tiesCount; i++) {
      const tie = new THREE.Mesh(tieGeom, tieMat);
      // Evenly space ties along z axis
      const zPos = (i - tiesCount / 2) * 2;
      tie.position.set(0, -0.04, zPos);
      tracksGroup.add(tie);
    }

    // Procedural Low-Poly Modern Train (Silhouette of Vande Bharat)
    const trainGroup = new THREE.Group();
    tiltGroup.add(trainGroup);

    // Train Body (White/Blue sleek capsule)
    const bodyGeom = new THREE.BoxGeometry(2.4, 1.8, 14);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      metalness: 0.6,
      roughness: 0.2,
    });
    const trainBody = new THREE.Mesh(bodyGeom, bodyMat);
    trainBody.position.set(0, 1.2, 0);
    trainGroup.add(trainBody);

    // Sleek Train Nose Curve
    const noseGeom = new THREE.CylinderGeometry(1.2, 1.2, 3, 16);
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      metalness: 0.6,
      roughness: 0.2,
    });
    const trainNose = new THREE.Mesh(noseGeom, noseMat);
    trainNose.rotation.x = Math.PI / 2;
    trainNose.scale.set(1, 1, 0.5); // Flattened cylinder
    trainNose.position.set(0, 1.2, 7.8);
    trainGroup.add(trainNose);

    // Windshield (Black reflective glass)
    const glassGeom = new THREE.BoxGeometry(2.0, 0.6, 1);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      metalness: 0.9,
      roughness: 0.05,
    });
    const windshield = new THREE.Mesh(glassGeom, glassMat);
    windshield.rotation.x = -Math.PI / 8;
    windshield.position.set(0, 1.6, 7.9);
    trainGroup.add(windshield);

    // Accent Blue Stripe along side
    const stripeGeom = new THREE.BoxGeometry(2.45, 0.2, 13.8);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0x005BAC,
      metalness: 0.4,
      roughness: 0.3,
    });
    const stripeLeft = new THREE.Mesh(stripeGeom, stripeMat);
    stripeLeft.position.set(0.02, 0.6, -0.1);
    trainGroup.add(stripeLeft);

    // Neon Headlights
    const lightGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
    const lightMatLeft = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    
    const headlightL = new THREE.Mesh(lightGeom, lightMatLeft);
    headlightL.rotation.x = Math.PI / 2;
    headlightL.position.set(-0.8, 0.7, 8.5);
    trainGroup.add(headlightL);

    const headlightR = new THREE.Mesh(lightGeom, lightMatLeft);
    headlightR.rotation.x = Math.PI / 2;
    headlightR.position.set(0.8, 0.7, 8.5);
    trainGroup.add(headlightR);

    // Floating Particles (Digital spark dust smoke)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorChoices = [
      new THREE.Color(0x00f0ff), // Cyan
      new THREE.Color(0xffc107), // Gold
      new THREE.Color(0xff0055), // Red
    ];

    for (let i = 0; i < particleCount; i++) {
      // Space out particles around tracks and in the air
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = Math.random() * 25 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

      const randomColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = randomColor.r;
      colors[i * 3 + 1] = randomColor.g;
      colors[i * 3 + 2] = randomColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Texture/Material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const starParticles = new THREE.Points(particleGeometry, particleMaterial);
    tiltGroup.add(starParticles);

    // Mouse Parallax movement setup
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      // Normalize mouse coordinates to [-0.5, 0.5]
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mousey = (event.clientY / window.innerHeight) - 0.5; // wait, note standard JavaScript coordinate tracking is case-sensitive!
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // 1. Move train back and forth slowly to simulate progression
      const trainSpeedFactor = 0.5;
      // Procedurally animate z position
      const zOffset = (elapsedTime * 6) % 150 - 75;
      // We orient the train moving from back to front
      trainGroup.position.z = zOffset;

      // 2. Animate tracks texture/ties backward to emphasize train speed
      tracksGroup.position.z = -(elapsedTime * 24) % 40;

      // 3. Float particles upward and recycle them
      const positionsArray = starParticles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        // Shift particle position on Z axis to simulate speed flow
        positionsArray[i * 3 + 2] += 0.8;
        // If particle goes beyond far view, recycle it
        if (positionsArray[i * 3 + 2] > 60) {
          positionsArray[i * 3 + 2] = -60;
        }

        // Slight hover on Y axis
        positionsArray[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.005;
      }
      starParticles.geometry.attributes.position.needsUpdate = true;

      // 4. Implement mouse parallax tilt
      // Ease the group orientation to create smooth cinematic lag
      tiltGroup.rotation.y += (mouseX * 0.45 - tiltGroup.rotation.y) * 0.08;
      tiltGroup.rotation.x += (mouseY * 0.25 - tiltGroup.rotation.x) * 0.08;

      // Render
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full min-h-[300px] z-0 overflow-hidden pointer-events-none"
      style={{ touchAction: 'none' }}
    />
  );
}
