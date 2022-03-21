import * as THREE from '../common/three.module.js';

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

        window.onresize = this.resize.bind(this); 
        // ↑ bind하는 이유 > resize 메서드 안에서 this가 가리키는 객체가 이벤트 객체가 아닌 App 클래스 객체가 되도록 하기위함
        this.resize();
        
        requestAnimationFrame(this.render.bind(this));
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
        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity); //광원 생성
        light.position.set(-1, 2, 4); // 광원 위치
        this._scene.add(light); // scene 객체 구성요소로 생성
    }

    _setupModel(){ // 정육면체 메쉬 생성하는 코드
        const geometry = new THREE.BoxGeometry(1, 1, 1); // 정육면체 형상 정의 (가로, 세로, 깊이)
        const material = new THREE.MeshPhongMaterial({color: 0x44a88}); //정육면체 색

        const cube = new THREE.Mesh(geometry, material); // mash 생성

        this._scene.add(cube); // scene 객체의 구성요소로 추가됨
        this._cube = cube;
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
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;
    }
}

window.onload = function(){
    new App();
}