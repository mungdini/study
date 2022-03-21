import * as THREE from '../common/three.module.js';
import { OrbitControls } from '../common/OrbitControls.js';
// RectAreaLight 광원 사용하기위해 import
import { RectAreaLightUniformsLib } from '../common/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from '../common/RectAreaLightHelper.js';
//

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
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupModel(){
        // ground
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: '#2c3e50',
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide
        })

        const ground = new THREE.Mesh(groundGeometry, groundMaterial); // (모양, 재질)
        ground.rotation.x = THREE.Math.degToRad(-90);
        this._scene.add(ground);

        //bigSphere
        const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
        const bigSphereMaterial = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            roughness: 0.1,
            metalness: 0.2,
        });
        const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
        bigSphere.rotation.x = THREE.Math.degToRad(-90);
        this._scene.add(bigSphere);

        // torusPivot, torus
        const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
        const torusMaterial = new THREE.MeshStandardMaterial({
            color: '#9b59b6',
            roughness: 0.5, 
            metalness: 0.9,
        });

        for(let i = 0; i < 8; i ++){
            const torusPivot = new THREE.Object3D();
            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            torusPivot.rotation.y = THREE.Math.degToRad(45 * i);
            torus.position.set(3, 0.5, 0);
            torusPivot.add(torus);
            this._scene.add(torusPivot);
        }
        
        // smallSpherePivot, smallSphere
        const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const smallSphereMaterial = new THREE.MeshStandardMaterial({
            color: '#e74c3c',
            roughness: 0.2,
            metalness: 0.5,
        });
        const smallSpherePivot = new THREE.Object3D();
        const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSpherePivot.add(smallSphere);
        smallSpherePivot.name = 'smallSpherePivot'; // 이름부여 : smallSpherePivot 객체를 Scene객체를 통해서 언제든 조회할 수 있음
        smallSphere.position.set(3, 0.5, 0);
        this._scene.add(smallSpherePivot);
    }

    _setupCamera(){
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        // camera.position.z = 2;
        camera.position.set(7, 7, 0);
        camera.lookAt(0, 0, 0);

        this._camera = camera;
    }

    _setupLight(){
        // const light = new THREE.AmbientLight(0xff0000, 2); // AmbientLight(빛의 색상, 빛의 세기) >> 단일 색상으로 렌더링
        // const light = new THREE.HemisphereLight('b0d8f5', '#bb7a1c', 1); // HemisphereLight(위에서 비치는 빛의 색상, 아래에서 비치는 빛의 색상, 빛의 세기)

        // DirectionalLight(빛의 색상, 빛의 세기)
        // const light = new THREE.DirectionalLight(0xffffff, 1);
        // light.position.set(0, 5, 0); // 광원의 위치
        // light.target.position.set(0, 0, 0); // 광원이 비추는 대상의 위치
        // this._scene.add(light.target);
        // // 광원을 화면상에 시각화 해주는 객체 추가
        // const helper = new THREE.DirectionalLightHelper(light);
        // this._scene.add(helper);
        // this._lightHelper = helper;

         // PointLight
        // const light = new THREE.PointLight(0xffffff, 2);
        // light.position.set(0, 5, 0);
        // light.distance = 10; // 지정된 거리까지만 광원의 영향 받도록 함 (0) >> 무한까지 설정가능
        // // 광원을 화면상에 시각화 해주는 객체 추가
        // const helper = new THREE.PointLightHelper(light);
        // this._scene.add(helper);

        // SpotLight
        // const light = new THREE.SpotLight(0xffffff, 1);
        // light.position.set(0, 5, 0);
        // light.target.position.set(0, 0, 0);
        // light.angle = THREE.Math.degToRad(30); // 광원이 만드는 깔대기 모양의 각도
        // light.penumbra = 1; // 빛의 감쇄율 (0) 0~1까지
        // this._scene.add(light.target);
        // // 광원을 화면상에 시각화 해주는 객체 추가
        // const helper = new THREE.SpotLightHelper(light);
        // this._scene.add(helper);
        // this._lightHelper = helper;

        // RectAreaLight
        RectAreaLightUniformsLib.init(); // RectAreaLight 광원 사용하기위해서는 초기화 코드 선행되어야 함
        const light = new THREE.RectAreaLight(0xffffff, 10, 10, 1); // (광원의 색상, 광원의 세기, 광원의 가로 크기, 광원의 세로 크기)
        light.position.set(0, 5, 0);
        light.rotation.x = THREE.Math.degToRad(-90);
        // // 광원을 화면상에 시각화 해주는 객체 추가
        const helper = new RectAreaLightHelper(light);
        light.add(helper);


        this._scene.add(light);
        this._light = light;
    }

    update(time){
        time *= 0.001;

        const smallSpherePivot = this._scene.getObjectByName('smallSpherePivot');
        if(smallSpherePivot){
            smallSpherePivot.rotation.y = THREE.Math.degToRad(time * 50);

            //광원에 대한 target의 위치가 회전하는 구의 위치를 추적하도록 하기위한 코드
            // // DirectionalLight
            // if(this._light.target){
            //     const smallSphere = smallSpherePivot.children[0]; // 여기서 첫번째자식은 smallSphere을 가리킴
            //     smallSphere.getWorldPosition(this._light.target.position); // 이 smallSphere의 world 좌표계의 위치를 구해서 광원의 target 위치에 지정

            //     if(this._lightHelper) this._lightHelper.update(); // 광원의 target 속성이 변경되었으므로 이 광원을 시각화 해주는 helper도 업데이트 해줘야함
            // }
            // // PointLight
            // if(this._light){
            //     const smallSphere = smallSpherePivot.children[0];
            //     smallSphere.getWorldPosition(this._light.position);

            //     if(this._lightHelper) this._lightHelper.update();
            // }

            //광원의 타겟 위치를 변경하도록 하기 위한 코드
            //SpotLight
            if(this._light.target){
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition(this._light.target.position);

                if(this._lightHelper) this._lightHelper.update();
            }
        }

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