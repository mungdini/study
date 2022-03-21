import * as THREE from '../common/three.module.js';
import { OrbitControls } from '../common/OrbitControls.js';

class App{
    constructor () {
        const divContainer = document.querySelector('#webgl-container');
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true }); // 3차원 장면 렌더링될 때 부드럽게 표현
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement); // renderer.domElement >> canvas 타입의 DOM 객체
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this); 
        this.resize();
        
        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls(){
        new OrbitControls(this._camera, this._divContainer)
    }

    _setupCamera(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 7;
        this._camera = camera;
    }

    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity); //광원 생성
        light.position.set(-1, 2, 4); // 광원 위치
        this._scene.add(light); // scene 객체 구성요소로 생성
    }

    _setupModel(){
        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load(
            '../examples/textures/uv_grid_opengl.jpg',
            texture => { // 텍스처 객체 생성 완료된 직후 호출됨(콜백함수)
                texture.repeat.x = 1;
                texture.repeat.y = 1;

                // texture.wrapS = THREE.RepeatWrapping;
                // texture.wrapT = THREE.RepeatWrapping;

                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;

                // texture.wrapS = THREE.MirroredRepeatWrapping;
                // texture.wrapT = THREE.MirroredRepeatWrapping;

                texture.offset.x = 0; // offset 속성 (0) > uv좌표의 시작위치를 조정함
                texture.offset.y = 0; // offset 속성 (0) > uv좌표의 시작위치를 조정함

                texture.rotation = THREE.MathUtils.degToRad(0);
                texture.center.x = 0.5;
                texture.center.y = 0.5;

                texture.magFilter = THREE.NearestFilter; //크게 렌더
                texture.minFilter = THREE.NearestMipMapLinearFilter; //작게 렌더
                // ↑ THREE.~~~ (기본값 > LinearFilter)
            }
        );

        const material = new THREE.MeshStandardMaterial({
            map: map,
        });

        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        box.position.set(-1, 0, 0);
        this._scene.add(box);

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), material);
        sphere.position.set(1, 0, 0);
        this._scene.add(sphere);
    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time){
        this._renderer.render(this._scene, this._camera); // 카메라의 시점에서 렌더링
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time){
        time *= 0.001; // second unit
    }
}

window.onload = function(){
    new App();
}