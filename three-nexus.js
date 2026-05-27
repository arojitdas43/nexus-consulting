/* Nexus - Three.js WebGL Interactive 3D Canvas */

(() => {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // --- 1. Scene, Camera, and Renderer Setup ---
  const scene = new THREE.Scene();
  
  // Fog to create depth fade matching space aesthetics
  scene.fog = new THREE.FogExp2(0x000000, 0.0015);

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
  
  // Initial camera position (focused on hero)
  camera.position.z = 280;
  camera.position.y = 30;
  camera.position.x = 20;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,      // Allows CSS background gradients to show behind 3D
    antialias: true   // Smooths edges of nodes and lines
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- 2. Generate Glowing Particle Texture ---
  // Create a soft glowing green dot in canvas rather than using a sharp square particle
  const createCircleTexture = () => {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const ctx = pCanvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 1)');      // Vibrant core
    gradient.addColorStop(0.2, 'rgba(0, 255, 135, 0.8)');
    gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.25)'); // Mid glow
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Fade out
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    return new THREE.CanvasTexture(pCanvas);
  };
  const particleTexture = createCircleTexture();

  // --- 3. Node Construction ---
  const nodeCount = 90;
  const areaRange = 350; // Spatial bounds for particles
  const particles = [];
  
  const particlePositions = new Float32Array(nodeCount * 3);
  const particleGeometry = new THREE.BufferGeometry();
  
  // Initialize particles with randomized coordinates and velocities
  for (let i = 0; i < nodeCount; i++) {
    const x = (Math.random() - 0.5) * areaRange;
    const y = (Math.random() - 0.5) * areaRange;
    const z = (Math.random() - 0.5) * areaRange;
    
    particles.push({
      x: x, y: y, z: z,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      vz: (Math.random() - 0.5) * 0.25,
      ox: x, oy: y, oz: z // Original positions to return to
    });
    
    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 10,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const pointCloud = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(pointCloud);

  // --- 4. Interconnecting Lines Construction ---
  // We use a dynamic LineSegments geometry that will be updated per frame
  const maxConnections = 240;
  const linePositions = new Float32Array(maxConnections * 2 * 3);
  const lineColors = new Float32Array(maxConnections * 2 * 3);
  
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  
  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.25,
    linewidth: 1 // Browser limited, mostly renders at 1px
  });
  
  const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineSegments);

  // --- 5. Mouse and Scroll Interactions ---
  let mouse = { x: 9999, y: 9999, targetX: 0, targetY: 0 };
  let scrollProgress = 0;
  let targetScrollProgress = 0;

  window.addEventListener('mousemove', (e) => {
    // Standardize mouse coordinates between -1 and 1
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('mouseleave', () => {
    mouse.targetX = 9999;
    mouse.targetY = 9999;
  });

  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  });

  // --- 6. Window Resize Handler ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // --- 7. Interactive Physics & Animation Loop ---
  const tempRaycaster = new THREE.Raycaster();
  const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const intersectionPoint = new THREE.Vector3();

  const animate = () => {
    requestAnimationFrame(animate);

    // Easing interpolation for mouse coords
    if (mouse.targetX !== 9999) {
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;
    } else {
      mouse.x = 9999;
      mouse.y = 9999;
    }

    // Easing interpolation for scroll progress (adds weight/inertia like oryzo)
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;

    // --- A. Position Camera based on Scroll Journey ---
    // At scroll=0: Camera is slightly close, panned down
    // At scroll=0.3 (Expertise): Camera orbits to the right, pulls back
    // At scroll=0.6 (Services): Camera zooms in, flying *through* the node mesh
    // At scroll=1.0 (Contact): Camera orbits to top-left wide view
    const angle = scrollProgress * Math.PI * 1.25;
    
    // Smooth orbit variables
    const baseRadius = 260 + Math.sin(scrollProgress * Math.PI) * 60;
    camera.position.x = Math.sin(angle) * baseRadius + (20 * (1 - scrollProgress));
    camera.position.z = Math.cos(angle) * baseRadius + (100 * (1 - scrollProgress));
    camera.position.y = 40 + Math.cos(scrollProgress * Math.PI) * 50 - (scrollProgress * 20);

    // Focus camera slightly offset from center to leave room for text cards
    camera.lookAt(new THREE.Vector3(camera.position.x * 0.1, -10, 0));

    // --- B. Update Raycast for Mouse Displacement ---
    let projectMouse = false;
    if (mouse.x !== 9999) {
      tempRaycaster.setFromCamera(new THREE.Vector2(mouse.x, mouse.y), camera);
      if (tempRaycaster.ray.intersectPlane(mousePlane, intersectionPoint)) {
        projectMouse = true;
      }
    }

    // --- C. Update Node Positions ---
    const posAttr = particleGeometry.getAttribute('position');
    const positions = posAttr.array;
    
    for (let i = 0; i < nodeCount; i++) {
      const p = particles[i];
      
      // Idle float animation
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      
      // Bounding box constraints (bounce check)
      const lim = areaRange / 2;
      if (Math.abs(p.x) > lim) p.vx *= -1;
      if (Math.abs(p.y) > lim) p.vy *= -1;
      if (Math.abs(p.z) > lim) p.vz *= -1;
      
      // Mouse push magnet logic
      if (projectMouse) {
        // Find distance to mouse project point on Z=0 plane
        const dx = p.x - intersectionPoint.x;
        const dy = p.y - intersectionPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const pushRadius = 90;
        if (dist < pushRadius) {
          const force = (pushRadius - dist) / pushRadius * 1.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Spring-back return to bounds
      p.x += (p.ox - p.x) * 0.01;
      p.y += (p.oy - p.y) * 0.01;
      p.z += (p.oz - p.z) * 0.01;
      
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    }
    posAttr.needsUpdate = true;

    // --- D. Rebuild Connection Lines ---
    const linePosAttr = lineGeometry.getAttribute('position');
    const lineColAttr = lineGeometry.getAttribute('color');
    const lPositions = linePosAttr.array;
    const lColors = lineColAttr.array;
    
    let lineIndex = 0;
    
    for (let i = 0; i < nodeCount; i++) {
      const pA = particles[i];
      for (let j = i + 1; j < nodeCount; j++) {
        const pB = particles[j];
        
        const dx = pA.x - pB.x;
        const dy = pA.y - pB.y;
        const dz = pA.z - pB.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        const threshold = 110;
        if (dist < threshold && lineIndex < maxConnections) {
          // Add segment points
          const idx = lineIndex * 6;
          
          lPositions[idx] = pA.x;
          lPositions[idx + 1] = pA.y;
          lPositions[idx + 2] = pA.z;
          
          lPositions[idx + 3] = pB.x;
          lPositions[idx + 4] = pB.y;
          lPositions[idx + 5] = pB.z;
          
          // Calculate opacity mapping to distance (closer = brighter green)
          const opacity = 1 - (dist / threshold);
          const r = 0.06; // Match green color values
          const g = 0.72 * opacity;
          const b = 0.5 * opacity;
          
          lColors[idx] = r; lColors[idx + 1] = g; lColors[idx + 2] = b;
          lColors[idx + 3] = r; lColors[idx + 4] = g; lColors[idx + 5] = b;
          
          lineIndex++;
        }
      }
    }
    
    // Clear rest of line buffer if connections are fewer than max
    for (let i = lineIndex; i < maxConnections; i++) {
      const idx = i * 6;
      lPositions[idx] = 0; lPositions[idx + 1] = 0; lPositions[idx + 2] = 0;
      lPositions[idx + 3] = 0; lPositions[idx + 4] = 0; lPositions[idx + 5] = 0;
    }
    
    linePosAttr.needsUpdate = true;
    lineColAttr.needsUpdate = true;

    renderer.render(scene, camera);
  };

  animate();
})();
