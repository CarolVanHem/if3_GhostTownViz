let renderer, meshes, scene, camera, plane;
let previousDate, currentDate;

let analyserNode;
let audio;

function play() 
{   
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    audio = new Audio();
    audio.preload = "auto";
    audio.src = "./assets/music/miles_away.mp3";
    audio.play();

    let audioSourceNode = audioContext.createMediaElementSource(audio);

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 256;
    dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    audioSourceNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    init();  
    render();
}

function pause()
{
    audio.pause();   
}

function init()
{
    const width = 1200;
    const height = 600;

    // plane (ground)
    const planeGeometry = new THREE.PlaneGeometry(200, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({color: 0x15100ff});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // cubes (buildings)
    const geometry = new THREE.BoxGeometry(1, 1, 10);
    const material = new THREE.MeshLambertMaterial({ color: 0x007AFF });

    //camera
    camera = new THREE.PerspectiveCamera(55, width / height, 45, 30000);
    camera.position.set(-100, -10, 15);

    //lights 
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);

    let hemiLight = new THREE.HemisphereLight(0xffB100, 0xffffff);
    hemiLight.position.set(0, 500, 0);

    let ambiColor = "#0c0c0c";
    let ambientLight = new THREE.AmbientLight(ambiColor);

    // show axes in the screen
    const axes = new THREE.AxesHelper(20);
    
    //scene
    scene = new THREE.Scene();
    
    //mesh
    meshes = new Array(128);
    
    for (let i = 0; i < meshes.length; i++){
        meshes[i] = new THREE.Mesh(geometry, material);
        meshes[i].position.x = Math.floor(i /8 * 5 - 50) + (10*Math.random(1, 8)) / 2; ;
        meshes[i].position.y = ((i%8) * 5 - 35) + (10*Math.random(1, 8)) / 2;
        
        scene.add(meshes[i]);
    }
    
    //skybox
    const materialArraySkybox = [];
    const texture_ft = new THREE.TextureLoader().load('./assets/skybox/blizzard_ft.jpg');
    const texture_bk = new THREE.TextureLoader().load('./assets/skybox/blizzard_bk.jpg');
    const texture_up = new THREE.TextureLoader().load('./assets/skybox/blizzard_up.jpg');
    const texture_dn = new THREE.TextureLoader().load('./assets/skybox/blizzard_dn.jpg');
    const texture_rt = new THREE.TextureLoader().load('./assets/skybox/blizzard_rt.jpg');
    const texture_lf = new THREE.TextureLoader().load('./assets/skybox/blizzard_lf.jpg');
    
    materialArraySkybox.push(new THREE.MeshBasicMaterial({map : texture_ft}));
    materialArraySkybox.push(new THREE.MeshBasicMaterial({map : texture_bk}));
    materialArraySkybox.push(new THREE.MeshBasicMaterial({map : texture_up}));
    materialArraySkybox.push(new THREE.MeshBasicMaterial({map : texture_dn}));
    materialArraySkybox.push(new THREE.MeshBasicMaterial({map : texture_rt}));
    materialArraySkybox.push(new THREE.MeshBasicMaterial({map : texture_lf}));
    
    for (let i = 0; i<6; i++)
    {
        materialArraySkybox[i].side = THREE.BackSide;
    }
    
    const skyboxGeo =new THREE.BoxGeometry(10000, 10000, 10000);
    const skybox = new THREE.Mesh(skyboxGeo, materialArraySkybox);
    
    scene.add(camera);
    scene.add(hemiLight);
    //scene.add(spotLight);
    //scene.add(ambientLight);
    scene.add(plane)
    scene.add(skybox);    
    //scene.add(axes);
    
    camera.lookAt(scene.position);
    
    //scene.fog=new THREE.Fog( 0xffffff, 5, 50);
    
    renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.setSize(width, height);
    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement);
    
    //controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', renderer);
    controls.minDistance = 10;
    controls.maxDistance = 1500;
}


function render() 
{   
    analyserNode.getByteFrequencyData(dataArray);
    
    for (let i = 0; i < analyserNode.frequencyBinCount; i++) 
    {
        meshes[i].scale.z = dataArray[i]/100+0.01;
        //meshes[i].position.y = dataArray[i]/10;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}