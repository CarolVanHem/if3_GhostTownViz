let renderer, meshes, scene, camera, plane;
let previousDate, currentDate;

let analyserNode;
let audio;

/* controls
let controls = new function () {
    this.cameraX = 0;
    this.cameraY = 0;
    this.cameraZ = 0;
    };
*/

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
    //render();
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
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -58, 15);

    //lights 
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);

    let hemiLight = new THREE.HemisphereLight(0xffB100, 0xffffff);
    hemiLight.position.set(0, 500, 0);

    let ambiColor = "#0c0c0c";
    let ambientLight = new THREE.AmbientLight(ambiColor);

    // show axes in the screen
    const axes = new THREE.AxesHelper(20);
    
    scene = new THREE.Scene();

    meshes = new Array(500);

    for (let i = 0; i < meshes.length; i++){
        meshes[i] = new THREE.Mesh(geometry, material);
        meshes[i].position.x = Math.floor(i /15 * 5 - 80) + (10*Math.random(1, 8)) / 2; ;
        meshes[i].position.y = ((i%15) * 5 - 45) + (10*Math.random(1, 8)) / 2;
        
        scene.add(meshes[i]);
    }

    scene.add(camera);
    scene.add(hemiLight);
    //scene.add(spotLight);
    //scene.add(ambientLight);
    scene.add(plane)
    
    //scene.add(axes);

    camera.lookAt(scene.position);

    /* controls
    let gui = new dat.GUI();
    gui.add(controls, 'cameraX', -100, 100);
    gui.add(controls, 'cameraY', -100, 100);
    gui.add(controls, 'cameraZ', -100, 100);
    */

    scene.fog=new THREE.Fog( 0xffffff, 5, 50);

    renderer = new THREE.WebGLRenderer({canvas: document.querySelector('canvas.webgl')});
    renderer.setSize(width, height);
    renderer.render(scene, camera);
}


function render() 
{
    /*controls
    
    camera.position.x = controls.cameraX;
    camera.position.y = controls.cameraY;
    camera.position.z = controls.cameraZ;
    */
    
    analyserNode.getByteFrequencyData(dataArray);
    
    for (let i = 0; i < analyserNode.frequencyBinCount; i++) 
    {
        meshes[i].scale.z = dataArray[i]/50;
        //meshes[i].position.y = dataArray[i]/10;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}