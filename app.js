// ============================================
// إعداد المشهد والكاميرا والمعرج
// ============================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0a0a);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowShadowMap;
document.body.appendChild(renderer.domElement);

camera.position.z = 8;

// ============================================
// متغيرات التحكم
// ============================================
let isAnimating = true;
let currentScene = 0;
let mouseX = 0;
let mouseY = 0;
let meshes = [];
let particles = [];

// ============================================
// إنشاء الجزيئات (Particles)
// ============================================
function createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positionArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positionArray[i] = (Math.random() - 0.5) * 20;
        positionArray[i + 1] = (Math.random() - 0.5) * 20;
        positionArray[i + 2] = (Math.random() - 0.5) * 20;

        // ألوان عشوائية
        colorArray[i] = Math.random();
        colorArray[i + 1] = Math.random();
        colorArray[i + 2] = Math.random();
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    return particleSystem;
}

// ============================================
// المشهد 1: الكائنات الأساسية بألوان متدرجة
// ============================================
function createScene1() {
    // مسح المشهد
    meshes.forEach(mesh => scene.remove(mesh));
    meshes = [];

    // 1. مكعب بتدرج لوني
    const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff006e,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0xff006e,
        emissiveIntensity: 0.5
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -3;
    cube.castShadow = true;
    scene.add(cube);
    meshes.push(cube);

    // 2. كرة بألوان زاهية
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x00f5ff,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0x00f5ff,
        emissiveIntensity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 0;
    sphere.castShadow = true;
    scene.add(sphere);
    meshes.push(sphere);

    // 3. أسطوانة برتقالية
    const cylinderGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 64);
    const cylinderMaterial = new THREE.MeshStandardMaterial({
        color: 0xffb703,
        metalness: 0.6,
        roughness: 0.25,
        emissive: 0xffb703,
        emissiveIntensity: 0.4
    });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.x = 3;
    cylinder.castShadow = true;
    scene.add(cylinder);
    meshes.push(cylinder);
}

// ============================================
// المشهد 2: الأشكال المعقدة
// ============================================
function createScene2() {
    meshes.forEach(mesh => scene.remove(mesh));
    meshes = [];

    // 1. توروس (Torus) - حلقة
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x8338ec,
        metalness: 0.8,
        roughness: 0.1,
        emissive: 0x8338ec,
        emissiveIntensity: 0.6
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.x = -3;
    torus.castShadow = true;
    scene.add(torus);
    meshes.push(torus);

    // 2. مخروط (Cone)
    const coneGeometry = new THREE.ConeGeometry(0.8, 2.5, 32);
    const coneMaterial = new THREE.MeshStandardMaterial({
        color: 0xfb5607,
        metalness: 0.5,
        roughness: 0.4,
        emissive: 0xfb5607,
        emissiveIntensity: 0.5
    });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.x = 0;
    cone.castShadow = true;
    scene.add(cone);
    meshes.push(cone);

    // 3. رباعي الأضلاع (Tetrahedron)
    const tetraGeometry = new THREE.TetrahedronGeometry(1.2, 0);
    const tetraMaterial = new THREE.MeshStandardMaterial({
        color: 0x06ffa5,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x06ffa5,
        emissiveIntensity: 0.5
    });
    const tetra = new THREE.Mesh(tetraGeometry, tetraMaterial);
    tetra.position.x = 3;
    tetra.castShadow = true;
    scene.add(tetra);
    meshes.push(tetra);
}

// ============================================
// المشهد 3: ألوان قوس قزح
// ============================================
function createScene3() {
    meshes.forEach(mesh => scene.remove(mesh));
    meshes = [];

    const colors = [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x9400d3];
    const positions = [-4, -2, 0, 2, 4, 6, 8];
    const geometries = [
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.SphereGeometry(0.6, 32, 32),
        new THREE.ConeGeometry(0.6, 1.2, 32),
        new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
        new THREE.OctahedronGeometry(0.7),
        new THREE.DodecahedronGeometry(0.6),
        new THREE.IcosahedronGeometry(0.6)
    ];

    for (let i = 0; i < 7; i++) {
        const material = new THREE.MeshStandardMaterial({
            color: colors[i],
            metalness: 0.6 + Math.random() * 0.3,
            roughness: 0.2,
            emissive: colors[i],
            emissiveIntensity: 0.4
        });
        const mesh = new THREE.Mesh(geometries[i], material);
        mesh.position.x = positions[i] - 4;
        mesh.castShadow = true;
        scene.add(mesh);
        meshes.push(mesh);
    }
}

// ============================================
// الإضاءة (Lighting)
// ============================================
function setupLights() {
    // إزالة الأضواء القديمة
    scene.children = scene.children.filter(obj => !(obj instanceof THREE.Light));

    // ضوء محيط
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // ضوء موجه رئيسي
    const directionalLight1 = new THREE.DirectionalLight(0xff006e, 1);
    directionalLight1.position.set(10, 10, 10);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 2048;
    directionalLight1.shadow.mapSize.height = 2048;
    scene.add(directionalLight1);

    // ضوء موجه ثانوي
    const directionalLight2 = new THREE.DirectionalLight(0x00f5ff, 0.7);
    directionalLight2.position.set(-10, -10, 10);
    scene.add(directionalLight2);

    // ضوء نقطة متحرك
    const pointLight = new THREE.PointLight(0xffb703, 1.5, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);
}

// ============================================
// معالجات الأحداث (Event Handlers)
// ============================================
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// ============================================
// دوال التحكم
// ============================================
function toggleAnimation() {
    isAnimating = !isAnimating;
}

function changeScene() {
    currentScene = (currentScene + 1) % 3;
    createScenes[currentScene]();
    setupLights();
}

function resetCamera() {
    camera.position.set(0, 0, 8);
    camera.lookAt(scene.position);
}

const createScenes = [createScene1, createScene2, createScene3];

// ============================================
// حلقة الرسم الرئيسية (Animation Loop)
// ============================================
let frameCount = 0;
let lastTime = Date.now();

function animate() {
    requestAnimationFrame(animate);

    if (isAnimating) {
        // تدوير الكائنات بسرعات مختلفة مع تأثيرات ديناميكية
        meshes.forEach((mesh, index) => {
            mesh.rotation.x += 0.005 + Math.sin(Date.now() * 0.0005) * 0.01;
            mesh.rotation.y += 0.008 + Math.cos(Date.now() * 0.0008) * 0.01;
            mesh.rotation.z += 0.003;

            // حركة موجية
            mesh.position.y = Math.sin(Date.now() * 0.001 + index) * 0.5;
            
            // تأثير القرب والبعد
            mesh.scale.x = 1 + Math.sin(Date.now() * 0.001 + index * 0.5) * 0.1;
            mesh.scale.y = 1 + Math.cos(Date.now() * 0.001 + index * 0.5) * 0.1;
            mesh.scale.z = 1 + Math.sin(Date.now() * 0.001 + index * 0.7) * 0.1;
        });
    }

    // تحديث موضع الكاميرا بناءً على الماوس
    camera.position.x = mouseX * 3;
    camera.position.y = mouseY * 3;
    camera.lookAt(scene.position);

    // عرض FPS
    frameCount++;
    const currentTime = Date.now();
    if (currentTime - lastTime >= 1000) {
        document.getElementById('fps').textContent = `FPS: ${frameCount}`;
        frameCount = 0;
        lastTime = currentTime;
    }

    renderer.render(scene, camera);
}

// ============================================
// البدء
// ============================================
createScene1();
createParticles();
setupLights();
animate();