import * as THREE from '../common/three.module.js';
import { OrbitControls } from '../common/OrbitControls.js';
import { FontLoader } from "../common/FontLoader.js"
import { TextGeometry } from "../common/TextGeometry.js"

class App{
    constructor () {
        const divContainer = document.querySelector('#webgl-container');
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        
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

    _setupModel(){
        const solarSystem = new THREE.Object3D(); //우주공간
        this._scene.add(solarSystem);

        // 구 모양의 지오메트리 생성
        const radius = 1;
        const widthSegments = 12;
        const heightSegments = 12;
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

        // 태양의 재질 생성
        const sunMaterial = new THREE.MeshPhongMaterial({
            emissive: 0xffff00, // 색상
            flatShading: true,
        });

        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
        sunMesh.scale.set(3, 3, 3);
        solarSystem.add(sunMesh);

        /************************************************************************************** */

        const earthOrbit = new THREE.Object3D(); //지구공간
        solarSystem.add(earthOrbit);

        // 지구 재질
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            emissive: 0x112244,
            flatShading: true,
        });

        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        earthOrbit.position.x = 10;
        earthOrbit.add(earthMesh);

        /************************************************************************************** */

        const moonOrbit = new THREE.Object3D(); //달공간
        moonOrbit.position.x = 2;
        earthOrbit.add(moonOrbit);

        // 달 재질
        const moonMaterial = new THREE.MeshPhongMaterial({
            color: 0x888888,
            emissive: 0x222222,
            flatShading: true,
        });

        const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
        moonOrbit.scale.set(0.5, 0.5, 0.5);
        moonOrbit.add(moonMesh);

        this._solarSystem = solarSystem;
        this._earthOrbit = earthOrbit;
        this._moonOrbit = moonOrbit;
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
        
        camera.position.z = 25;
        this._camera = camera;
    }

    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity); //광원 생성
        light.position.set(-1, 2, 4); // 광원 위치
        this._scene.add(light); // scene 객체 구성요소로 생성
    }

    update(time){
        time *= 0.001; // second unit

        this._solarSystem.rotation.y = time / 2;
        this._earthOrbit.rotation.y = time * 2;
        this._moonOrbit.rotation.y = time * 5;
        
        /* 오브젝트가 자동으로 돌아가게 하는 코드 */
        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;
        /**/
    }

    render(time){
        this._renderer.render(this._scene, this._camera); // 카메라의 시점에서 렌더링
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }
}

window.onload = function(){
    new App();
}